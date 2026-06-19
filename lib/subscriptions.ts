// lib/subscriptions.ts
// ─────────────────────────────────────────────────────────────────────────────
// All subscription DB operations.
// Server-only — never import in client components.
// Uses supabaseAdmin to bypass RLS (webhook runs server-side).
// ─────────────────────────────────────────────────────────────────────────────

import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "past_due"
  | "cancelled"
  | "expired";

export interface Subscription {
  id:                   string;
  clerk_id:             string;
  plan:                 string;
  status:               SubscriptionStatus;
  payment_provider:     string;
  customer_id:          string | null;
  subscription_id:      string | null;
  payment_id:           string | null;
  billing_cycle:        string | null;
  current_period_end:   string | null;
  payment_verified:     boolean;        // ← only TRUE after webhook confirms
  webhook_verified_at:  string | null;  // ← timestamp of webhook confirmation
  last_payment_id:      string | null;
  cancel_at_period_end: boolean;
  created_at:           string;
  updated_at:           string;
}

export interface UpsertSubscriptionParams {
  clerkId:             string;
  plan:                string;
  status:              SubscriptionStatus;
  customerId?:         string;
  subscriptionId?:     string;
  paymentId?:          string;
  billingCycle?:       string;
  currentPeriodEnd?:   string;
  // Only pass true from the webhook handler — never from frontend
  paymentVerified?:    boolean;
  cancelAtPeriodEnd?:  boolean;
}

// ─── upsertSubscription ───────────────────────────────────────────────────────
// Called by the webhook handler only.
// Sets payment_verified=true when status=active so the success page can verify.

export async function upsertSubscription(params: UpsertSubscriptionParams) {
  const {
    clerkId,
    plan,
    status,
    customerId,
    subscriptionId,
    paymentId,
    billingCycle,
    currentPeriodEnd,
    paymentVerified  = false,
    cancelAtPeriodEnd = false,
  } = params;

  const now = new Date().toISOString();

  // payment_verified is ONLY set to true when status is active AND
  // the caller explicitly passes paymentVerified:true (webhook only)
  const isVerified = status === "active" && paymentVerified === true;

  const payload: Record<string, unknown> = {
    clerk_id:             clerkId,
    plan,
    status,
    payment_provider:     "dodo",
    updated_at:           now,
    cancel_at_period_end: cancelAtPeriodEnd,
    // Only flip to true when webhook confirms — never reset to false on active
    ...(isVerified && {
      payment_verified:    true,
      webhook_verified_at: now,
    }),
    // Non-verified active (e.g. payment.succeeded before subscription.active)
    // leaves payment_verified as-is
  };

  if (customerId)       payload.customer_id       = customerId;
  if (subscriptionId)   payload.subscription_id   = subscriptionId;
  if (paymentId)        payload.last_payment_id    = paymentId;
  if (billingCycle)     payload.billing_cycle      = billingCycle;
  if (currentPeriodEnd) payload.current_period_end = currentPeriodEnd;

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert(payload, { onConflict: "clerk_id" });

  if (error) {
    console.error("[subscriptions] upsertSubscription error:", error);
    throw new Error(`Failed to upsert subscription: ${error.message}`);
  }
}

// ─── setSubscriptionCancelled ─────────────────────────────────────────────────
// Called when subscription.cancelled or subscription.expired fires.
// Strips payment_verified and premium access immediately.

export async function setSubscriptionCancelled(clerkId: string) {
  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      plan:                 "free",
      status:               "cancelled",
      payment_verified:     false,   // ← revoke access
      webhook_verified_at:  null,
      cancel_at_period_end: false,
      updated_at:           new Date().toISOString(),
    })
    .eq("clerk_id", clerkId);

  if (error) {
    console.error("[subscriptions] setSubscriptionCancelled error:", error);
    throw new Error(`Failed to cancel subscription: ${error.message}`);
  }
}

// ─── setSubscriptionPastDue ───────────────────────────────────────────────────
// Called when payment.failed fires (e.g. card declined on renewal).
// Keeps subscription row but marks it past_due — frontend should warn user.

export async function setSubscriptionPastDue(clerkId: string) {
  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      status:           "past_due",
      payment_verified: false,   // ← revoke access until payment resolves
      updated_at:       new Date().toISOString(),
    })
    .eq("clerk_id", clerkId);

  if (error) {
    console.error("[subscriptions] setSubscriptionPastDue error:", error);
    throw new Error(`Failed to mark past_due: ${error.message}`);
  }
}

// ─── getSubscription ──────────────────────────────────────────────────────────
// Server-side read used by middleware and verify-payment API.

export async function getSubscription(clerkId: string): Promise<Subscription | null> {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("clerk_id", clerkId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // row not found
    console.error("[subscriptions] getSubscription error:", error);
    throw new Error(`Failed to fetch subscription: ${error.message}`);
  }

  return data as Subscription;
}

// ─── isPro ────────────────────────────────────────────────────────────────────
// Single source of truth for "does this user have premium access?"
// Used by middleware, API routes, and server components.
// Rules:
//   1. status must be "active"
//   2. payment_verified must be true (webhook confirmed)
//   3. plan must not be "free"
//   4. current_period_end must be in the future (not expired)

export function isPro(sub: Subscription | null): boolean {
  if (!sub) return false;
  if (sub.plan === "free") return false;
  if (sub.status !== "active") return false;
  if (!sub.payment_verified) return false;

  // If period end is set, verify it's not expired
  if (sub.current_period_end) {
    const periodEnd = new Date(sub.current_period_end).getTime();
    if (Date.now() > periodEnd) return false;
  }

  return true;
}