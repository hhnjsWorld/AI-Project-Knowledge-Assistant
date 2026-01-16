import { NextResponse } from 'next/server';
import { encodeProjectToken } from '@/lib/projectToken';

export async function POST(request: Request) {
  const body = await request.json();
  const id = body?.id;

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing project id' }, { status: 400 });
  }

  const token = encodeProjectToken(id);
  return NextResponse.json({ token });
}
