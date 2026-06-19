// app/api/subscription/details/route.ts
// ─────────────────────────────────────────────────────────────────────────
// Full subscription record for the Settings page card (dates, billing
// cycle, cancel_at_period_end, etc.) — separate from /api/subscription/status,
// which only returns the trimmed { isPro, status, plan } shape for gating.
// Reuses the existing getSubscription() read function as-is.
// ─────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSubscription } from "@/lib/subscriptions";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscription = await getSubscription(userId);
    return NextResponse.json({ subscription });
  } catch (err) {
    console.error("[subscription/details] error:", err);
    return NextResponse.json(
      { error: "Failed to load subscription" },
      { status: 500 }
    );
  }
}