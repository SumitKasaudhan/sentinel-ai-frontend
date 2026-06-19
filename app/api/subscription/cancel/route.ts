// app/api/subscription/cancel/route.ts
// ─────────────────────────────────────────────────────────────────────────
// Schedules cancellation at the end of the current billing period via
// Dodo Payments. The subscriber keeps Pro access until current_period_end
// — matches Dodo's own "Cancel at next billing date" behavior.
//
// Note: this route does NOT write to Supabase directly. Dodo sends a
// subscription.updated webhook when cancel_at_next_billing_date changes,
// and the existing webhook handler (app/api/webhooks/dodo) is already
// responsible for calling upsertSubscription() to sync that — same as
// every other subscription state change in this app.
// ─────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSubscription } from "@/lib/subscriptions";
import { dodo } from "@/lib/dodo";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getSubscription(userId);
  if (!subscription?.subscription_id) {
    return NextResponse.json(
      { error: "No active subscription found" },
      { status: 404 }
    );
  }

  try {
    await dodo.subscriptions.update(subscription.subscription_id, {
      cancel_at_next_billing_date: true,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[subscription/cancel] Dodo error:", err);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}