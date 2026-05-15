import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WP = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea/ultima-hora';

export async function GET() {
  try {
    const r = await fetch(WP, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return NextResponse.json({ error: 'upstream error', status: r.status }, { status: 502 });
    const data = await r.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
