// app/api/webhooks/dodo/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Dodo Payments webhook handler.
// Uses Standard Webhooks spec (HMAC-SHA256) for signature verification.
//
// KEY CHANGE vs old version:
//   subscription.active now passes paymentVerified:true — this is the ONLY
//   place that flag is set to true. The success page checks this flag.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import {
  upsertSubscription,
  setSubscriptionCancelled,
  setSubscriptionPastDue,
} from "@/lib/subscriptions";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // ── 1. Read raw body ───────────────────────────────────────────────────────
  const rawBody = await req.text();

  // ── 2. Verify signature ────────────────────────────────────────────────────
  const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] DODO_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  let event: Record<string, any>;
  try {
    const wh = new Webhook(webhookSecret);
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => { headers[key] = value; });
    event = wh.verify(rawBody, headers) as Record<string, any>;
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;
  console.log(`[webhook] received: ${type}`);

  // ── 3. Handle events ───────────────────────────────────────────────────────
  try {
    switch (type) {

      // ── subscription.active ───────────────────────────────────────────────
      // THE most important event. This is when we set payment_verified=true.
      // Subscription is confirmed live and billing started.
      case "subscription.active": {
        const clerkId = data?.metadata?.clerk_id;
        if (!clerkId) {
          console.warn("[webhook] subscription.active: no clerk_id in metadata");
          break;
        }

        await upsertSubscription({
          clerkId,
          plan:             data?.metadata?.plan ?? "pro",
          status:           "active",
          customerId:       data?.customer?.customer_id,
          subscriptionId:   data?.subscription_id,
          billingCycle:     data?.metadata?.plan?.includes("yearly") ? "yearly" : "monthly",
          currentPeriodEnd: data?.current_period_end,
          paymentVerified:  true,  // ← ONLY set here, after Dodo confirms
        });

        console.log(`[webhook] ✅ subscription VERIFIED for clerk_id=${clerkId}`);
        break;
      }

      // ── payment.succeeded ─────────────────────────────────────────────────
      // Fires for every successful payment (including first invoice).
      // Also sets paymentVerified:true — covers one-time payment products.
      case "payment.succeeded": {
        const clerkId = data?.metadata?.clerk_id;
        if (!clerkId) {
          console.warn("[webhook] payment.succeeded: no clerk_id in metadata");
          break;
        }

        await upsertSubscription({
          clerkId,
          plan:            data?.metadata?.plan ?? "pro",
          status:          "active",
          customerId:      data?.customer?.customer_id,
          subscriptionId:  data?.subscription_id,
          paymentId:       data?.payment_id,
          paymentVerified: true,  // ← payment confirmed by Dodo
        });

        console.log(`[webhook] ✅ payment succeeded for clerk_id=${clerkId}`);
        break;
      }

      // ── subscription.cancelled / expired ──────────────────────────────────
      // Immediately revoke access — sets payment_verified=false
      case "subscription.cancelled":
      case "subscription.expired": {
        const clerkId = data?.metadata?.clerk_id;
        if (!clerkId) {
          console.warn(`[webhook] ${type}: no clerk_id in metadata`);
          break;
        }

        await setSubscriptionCancelled(clerkId);
        console.log(`[webhook] ⚠️  ${type} — access revoked for clerk_id=${clerkId}`);
        break;
      }

      // ── payment.failed ────────────────────────────────────────────────────
      // Card declined, insufficient funds, etc.
      // Sets status=past_due and payment_verified=false — no premium access.
      case "payment.failed": {
        const clerkId = data?.metadata?.clerk_id;
        if (!clerkId) break;

        await setSubscriptionPastDue(clerkId);
        console.log(`[webhook] ❌ payment failed for clerk_id=${clerkId}`);
        break;
      }

      // ── subscription.updated ──────────────────────────────────────────────
      // Plan change, period renewal, cancel_at_period_end set, etc.
      case "subscription.updated": {
        const clerkId = data?.metadata?.clerk_id;
        if (!clerkId) break;

        const isCancelScheduled = data?.cancel_at_period_end === true;

        await upsertSubscription({
          clerkId,
          plan:             data?.metadata?.plan ?? "pro",
          status:           "active",
          subscriptionId:   data?.subscription_id,
          currentPeriodEnd: data?.current_period_end,
          cancelAtPeriodEnd: isCancelScheduled,
          paymentVerified:  true,
        });

        console.log(`[webhook] subscription updated for clerk_id=${clerkId}`);
        break;
      }

      default:
        console.log(`[webhook] unhandled event: ${type}`);
    }
  } catch (err) {
    console.error(`[webhook] handler error for ${type}:`, err);
    // Return 500 → Dodo will retry
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}