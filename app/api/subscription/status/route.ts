// app/api/subscription/status/route.ts
// ─────────────────────────────────────────────────────────────────────────
// Lightweight endpoint consumed by useSubscription() hook on the client.
// Proxies to backend Express API — no supabaseAdmin / service-role key
// needed in the frontend anymore.
// ─────────────────────────────────────────────────────────────────────────
import { auth }          from "@clerk/nextjs/server";
import { NextResponse }  from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET() {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json(
        { isPro: false, status: null, plan: null },
        { status: 401 }
      );
    }

    const token = await getToken();

    const res = await fetch(`${BACKEND_URL}/api/subscription/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { isPro: false, status: null, plan: "free" },
        { status: 200 }
      );
    }

    const json = await res.json();
    const sub  = json?.data;

    const isPro =
      !!sub &&
      sub.status === "active" &&
      sub.plan !== "free";

    return NextResponse.json({
      isPro,
      status: sub?.status ?? null,
      plan:   sub?.plan   ?? "free",
    });
  } catch (err) {
    console.error("[subscription/status] error:", err);
    return NextResponse.json(
      { isPro: false, status: null, plan: "free" },
      { status: 200 }
    );
  }
}