import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  // Get the real n8n URL from env (Server-side)
  // We can reuse NEXT_PUBLIC_N8N_WEBHOOK_URL since it's available, 
  // or use a specific server-only var if we wanted to hide it.
  const n8nBase = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL; 

  if (!n8nBase) {
    return NextResponse.json({ error: 'N8N Configuration Missing' }, { status: 500 });
  }

  // Construct target URL (e.g. http://localhost:5678/webhook/chat)
  // Be careful with slashes. n8nBase usually includes /webhook based on my previous setup.
  // My previous setup: NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook
  const targetUrl = `${n8nBase}/${slug}`;

  try {
    const body = await request.json();

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
        const text = await response.text();
        return NextResponse.json({ error: `n8n Error: ${response.status}`, details: text }, { status: response.status });
    }

    // n8n might return JSON or text.
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
        const data = await response.json();
        return NextResponse.json(data);
    } else {
        const text = await response.text();
        return NextResponse.json({ output: text }); // Wrap text in JSON
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
