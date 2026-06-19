import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Please sign in to continue.' },
        { status: 401 }
      );
    }

    const token = await getToken();
    const body  = await req.json();

    const backendRes = await fetch(
      `${BACKEND_URL}/api/subscription/create-checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    console.error('[create-checkout proxy] error:', err?.message);
    return NextResponse.json(
      { error: 'Could not create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}