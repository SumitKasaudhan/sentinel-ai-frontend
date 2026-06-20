import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
const BASE = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api`;
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const token = await getToken();
  try {
    const res = await fetch(`${BASE}/scans/${id}/risk-heatmap`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
    const text = await res.text();
    let data; try { data = JSON.parse(text); } catch { data = { error: text }; }
    return NextResponse.json(data, { status: res.status });
  } catch { return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 }); }
}