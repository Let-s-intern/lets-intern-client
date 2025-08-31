export async function POST(req: Request) {
  try {
    const body = await req.json();
    // For now, just echo back the payload for testing.
    // eslint-disable-next-line no-console
    console.log('[API] /api/b2b-introduce/lead received:', body);
    return Response.json({ ok: true, received: body, ts: new Date().toISOString() });
  } catch (e) {
    return new Response('Invalid JSON', { status: 400 });
  }
}

export function GET() {
  return Response.json({ ok: true, info: 'POST a JSON body to submit a lead.' });
}

