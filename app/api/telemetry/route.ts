import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    // Лёгкая телеметрия: логируем на сервере
    console.log('[telemetry]', body);
    return new Response(null, { status: 204 });
  } catch {
    return new Response(JSON.stringify({ error: { code: 'INTERNAL_ERROR', message: 'Telemetry error' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
