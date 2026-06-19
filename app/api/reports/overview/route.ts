import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = await getToken();
  const res = await fetch(`${BASE}/reports/overview`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}