import { NextRequest, NextResponse } from 'next/server';

const BASE = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api`;

export async function POST(req: NextRequest) {
  let body = {};
  try { body = await req.json(); } catch {}
  try {
    const res = await fetch(`${BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const text = await res.text();
    let data; try { data = JSON.parse(text); } catch { data = { error: text }; }
    return NextResponse.json(data, { status: res.status });
  } catch { return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 }); }
}