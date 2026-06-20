import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BASE = process.env.BACKEND_URL || 'http://localhost:5000/api';

async function parseRes(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { error: text }; }
}

export async function GET(req: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const token = await getToken();
  try {
    const url = new URL(`${BASE}/reports/list`);
    req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    return NextResponse.json(await parseRes(res), { status: res.status });
  } catch { return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 }); }
}

export async function POST(req: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const token = await getToken();
  try {
    const body = await req.json();
    const res = await fetch(`${BASE}/reports/list`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return NextResponse.json(await parseRes(res), { status: res.status });
  } catch { return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 }); }
}

export async function DELETE(req: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const token = await getToken();
  try {
    const url = new URL(`${BASE}/reports/list`);
    req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(await parseRes(res), { status: res.status });
  } catch { return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 }); }
}