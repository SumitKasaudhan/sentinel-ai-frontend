import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BASE = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api`; // server-side only, no infinite loop

async function proxy(req: NextRequest, method: string) {
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = await getToken();
  const url = new URL(`${BASE}/notifications`);
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

  const init: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  };

  if (method === 'POST' || method === 'PATCH') {
    try { init.body = JSON.stringify(await req.json()); } catch {}
  }

  try {
    const res = await fetch(url.toString(), init);
    const text = await res.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Backend ne plain text diya (jaise 429 message) — wrap karo
      data = { error: text };
    }
    
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[notifications proxy]', err);
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 });
  }
}

export async function GET(req: NextRequest)    { return proxy(req, 'GET'); }
export async function POST(req: NextRequest)   { return proxy(req, 'POST'); }
export async function PATCH(req: NextRequest)  { return proxy(req, 'PATCH'); }
export async function DELETE(req: NextRequest) { return proxy(req, 'DELETE'); }