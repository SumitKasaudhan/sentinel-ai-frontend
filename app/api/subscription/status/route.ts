// app/api/subscription/status/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Proxies subscription status from backend Express API.
// CRITICAL: never collapse "backend failed" into "isPro:false" with a 200.
// Real failures must return a non-200 status so the client can distinguish
// "confirmed free" from "couldn't check right now" and retry instead of
// flashing the user down to Free.
// ─────────────────────────────────────────────────────────────────────────────
import { auth }          from "@clerk/nextjs/server";
import { NextResponse }  from "next/server";

export const dynamic = "force-dynamic"; // never statically cache this route

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET() {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      // Genuinely unauthenticated — this IS a real "no access" state, fine to 401
      return NextResponse.json(
        { isPro: false, status: null, plan: null },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const token = await getToken();

    if (!token) {
      // Clerk session not ready yet — this is NOT "user is free", it's
      // "we don't know yet". Surface as 503 so client retries instead
      // of showing Free.
      return NextResponse.json(
        { error: "session_not_ready" },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }

    const res = await fetch(`${BACKEND_URL}/api/subscription/status`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      // Backend failed — propagate as a real error status, NOT a fake
      // "free" 200. The client must retry, not downgrade the UI.
      console.error(`[subscription/status] backend returned ${res.status}`);
      return NextResponse.json(
        { error: "backend_unavailable" },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    const json = await res.json();
    const sub  = json?.data;

    const isPro =
      !!sub &&
      sub.status === "active" &&
      sub.plan !== "free";

    return NextResponse.json(
      {
        isPro,
        status: sub?.status ?? null,
        plan:   sub?.plan   ?? "free",
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[subscription/status] error:", err);
    // Network/unexpected exception — real error, not "free"
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}