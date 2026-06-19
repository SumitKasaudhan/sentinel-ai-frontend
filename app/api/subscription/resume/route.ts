// app/api/subscription/resume/route.ts
// ─────────────────────────────────────────────────────────────────────────
// Reverses a pending "cancel at period end" — the subscription keeps
// auto-renewing as normal. Same pattern as cancel: Dodo is the source of
// truth, the existing webhook handler syncs cancel_at_period_end back to
// false in Supabase once Dodo confirms the change.
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
      cancel_at_next_billing_date: false,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[subscription/resume] Dodo error:", err);
    return NextResponse.json(
      { error: "Failed to resume subscription" },
      { status: 500 }
    );
  }
}