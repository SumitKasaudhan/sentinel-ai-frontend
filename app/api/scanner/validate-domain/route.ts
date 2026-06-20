import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
const BASE = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api`;
export async function POST(req: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const token = await getToken();
  let body = {};
  try { body = await req.json(); } catch {}
  try {
    const res = await fetch(`${BASE}/scanner/validate-domain`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const text = await res.text();
    let data; try { data = JSON.parse(text); } catch { data = { error: text }; }
    return NextResponse.json(data, { status: res.status });
  } catch { return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 }); }
}