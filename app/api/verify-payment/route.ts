// app/api/verify-payment/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// FIX for "failed payment shows success page":
//
// OLD PATH 1: getSubscription(userId) → isPro? → return verified:true
//   Problem: checks "is this USER Pro?" — ignores WHICH subscription is being
//   verified. A user who was already Pro would pass PATH 1 even for a brand-new
//   FAILED subscription_id.
//
// NEW PATH 1: isPro AND subscription_id matches DB → fast path
//   If subscription_id doesn't match what's in DB → fall to PATH 2.
//   PATH 2 calls Dodo API for the specific sub → Dodo returns status:"failed"
//   or "pending" → verified:false → cancel page.
//
// This way a failed payment NEVER shows the success page, even for users who
// are already Pro from a previous payment.
// ─────────────────────────────────────────────────────────────────────────────

import { auth }                      from "@clerk/nextjs/server";
import { NextRequest, NextResponse }  from "next/server";
import { getSubscription, upsertSubscription, isPro } from "@/lib/subscriptions";
import { dodo }                       from "@/lib/dodo";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {

  // ── 1. Must be authenticated ───────────────────────────────────────────────
  const { userId } = await auth();
  if (!userId) {
    console.log("[verify-payment] no session — not authenticated");
    return NextResponse.json(
      { verified: false, reason: "not_authenticated" },
      { status: 401 }
    );
  }

  const subscriptionId = req.nextUrl.searchParams.get("subscription_id");

  // ── 2. PATH 1 — DB fast path ───────────────────────────────────────────────
  // Only trust the DB if:
  //   a) user isPro, AND
  //   b) the subscription_id in the request matches what's in the DB
  //
  // If subscription_id differs → this is a NEW payment attempt (possibly failed).
  // Fall through to PATH 2 to verify the specific subscription with Dodo.
  try {
    const sub = await getSubscription(userId);

    console.log(`[verify-payment] DB check for ${userId}:`, {
      status:            sub?.status,
      payment_verified:  sub?.payment_verified,
      plan:              sub?.plan,
      db_subscription_id: sub?.subscription_id,
      requested_sub_id:  subscriptionId,
    });

    if (sub && isPro(sub)) {
      // Check: does this request's subscription_id match what's in DB?
      const subIdMatches = !subscriptionId || sub.subscription_id === subscriptionId;

      if (subIdMatches) {
        // Same subscription that was already verified → fast path ✅
        console.log(`[verify-payment] ✅ PATH 1 — DB confirmed pro for ${userId} (sub matches)`);
        return NextResponse.json({
          verified:  true,
          plan:      sub.plan,
          status:    sub.status,
          periodEnd: sub.current_period_end,
          source:    "database",
        });
      }

      // subscription_id is DIFFERENT from what's in DB.
      // This is a new payment attempt — could be failed, or upgrading plan.
      // Must verify this specific sub with Dodo — don't trust DB for a different sub.
      console.log(
        `[verify-payment] subscription_id mismatch — DB has "${sub.subscription_id}", ` +
        `request has "${subscriptionId}" — falling through to Dodo API check`
      );
    }
  } catch (err) {
    console.error("[verify-payment] DB read error:", err);
    // Don't return — fall through to Dodo API path
  }

  // ── 3. PATH 2 — Dodo API (webhook not fired, or different subscription) ────
  if (!subscriptionId) {
    console.log(`[verify-payment] no subscription_id param — webhook not yet received for ${userId}`);
    return NextResponse.json({
      verified: false,
      reason:   "webhook_not_received",
    });
  }

  try {
    console.log(`[verify-payment] PATH 2 — calling dodo.subscriptions.retrieve(${subscriptionId})`);

    const dodoSub = await dodo.subscriptions.retrieve(subscriptionId);

    console.log(`[verify-payment] Dodo API response:`, JSON.stringify({
      subscription_id:   dodoSub.subscription_id,
      status:            dodoSub.status,
      next_billing_date: dodoSub.next_billing_date,
      customer_id:       dodoSub.customer?.customer_id,
      metadata:          dodoSub.metadata,
    }, null, 2));

    // ── Security: clerk_id in metadata must match current session ─────────────
    const metaClerkId = dodoSub.metadata?.clerk_id;

    if (!metaClerkId) {
      console.warn(
        `[verify-payment] ⚠️  no clerk_id in Dodo metadata for ${subscriptionId}`
      );
      return NextResponse.json(
        { verified: false, reason: "missing_metadata" },
        { status: 403 }
      );
    }

    if (metaClerkId !== userId) {
      console.warn(
        `[verify-payment] ⚠️  clerk_id mismatch — session: ${userId}, metadata: ${metaClerkId}`
      );
      return NextResponse.json(
        { verified: false, reason: "ownership_mismatch" },
        { status: 403 }
      );
    }

    // ── Check Dodo subscription status ────────────────────────────────────────
    // Dodo statuses: 'pending' | 'active' | 'on_hold' | 'cancelled' | 'failed' | 'expired'
    // A failed payment lands here as 'pending' or 'failed' — not 'active'
    if (dodoSub.status !== "active") {
      console.log(
        `[verify-payment] ❌ Dodo status is "${dodoSub.status}" for ${subscriptionId} — not activating`
      );
      return NextResponse.json({
        verified: false,
        reason:   `dodo_status_${dodoSub.status}`,
      });
    }

    // ── Payment confirmed active — update DB ───────────────────────────────────
    await upsertSubscription({
      clerkId:          userId,
      plan:             dodoSub.metadata?.plan ?? "pro",
      status:           "active",
      customerId:       dodoSub.customer?.customer_id,
      subscriptionId:   dodoSub.subscription_id,
      currentPeriodEnd: dodoSub.next_billing_date,
      billingCycle:     dodoSub.metadata?.plan?.includes("yearly") ? "yearly" : "monthly",
      paymentVerified:  true,
    });

    console.log(`[verify-payment] ✅ PATH 2 — DB updated, activated for ${userId}`);

    return NextResponse.json({
      verified:  true,
      plan:      dodoSub.metadata?.plan ?? "pro",
      status:    "active",
      periodEnd: dodoSub.next_billing_date,
      source:    "dodo_api",
    });

  } catch (err: any) {
    console.error("[verify-payment] Dodo API error:", err?.message ?? err);
    return NextResponse.json(
      { verified: false, reason: "dodo_api_error" },
      { status: 500 }
    );
  }
}