import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BASE = process.env.NEXT_PUBLIC_API_URL;

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

  if (method === 'POST') {
    init.body = JSON.stringify(await req.json());
  }

  const res = await fetch(url.toString(), init);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function GET(req: NextRequest)   { return proxy(req, 'GET'); }
export async function POST(req: NextRequest)  { return proxy(req, 'POST'); }
export async function PATCH(req: NextRequest) { return proxy(req, 'PATCH'); }
export async function DELETE(req: NextRequest){ return proxy(req, 'DELETE'); }