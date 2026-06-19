// app/api/vault/reports/route.ts
// ─────────────────────────────────────────────────────────────────────────
// Proxies to backend Express vault module — no supabaseAdmin in frontend.
// ─────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { auth }         from "@clerk/nextjs/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET() {
  try {
    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = await getToken();

    const res = await fetch(`${BACKEND_URL}/api/vault/reports`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return NextResponse.json(
        { error: json.message || "Failed to fetch vault reports" },
        { status: res.ok ? 500 : res.status }
      );
    }

    return NextResponse.json(json.reports);
  } catch (err: unknown) {
    console.error("[vault/reports proxy] error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}