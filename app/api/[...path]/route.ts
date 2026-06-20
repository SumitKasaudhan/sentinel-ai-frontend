import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BASE = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api`;

async function proxy(req: NextRequest, params: { path: string[] }) {
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = await getToken();
  const path = params.path.join('/');
  const url = new URL(`${BASE}/${path}`);
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

  const init: RequestInit = {
    method: req.method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  };

  if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
    try { init.body = JSON.stringify(await req.json()); } catch {}
  }

  try {
    const res = await fetch(url.toString(), init);
    const text = await res.text();
    let data; try { data = JSON.parse(text); } catch { data = { error: text }; }
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[catch-all proxy]', err);
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) { return proxy(req, await params); }
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) { return proxy(req, await params); }
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) { return proxy(req, await params); }
export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) { return proxy(req, await params); }
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) { return proxy(req, await params); }