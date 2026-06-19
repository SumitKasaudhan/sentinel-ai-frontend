// app/api/vault/scans/route.ts
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

    const res = await fetch(`${BACKEND_URL}/api/vault/scans`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return NextResponse.json(
        { error: json.message || "Failed to fetch vault scans" },
        { status: res.ok ? 500 : res.status }
      );
    }

    return NextResponse.json(json.scans);
  } catch (err: unknown) {
    console.error("[vault/scans proxy] error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}