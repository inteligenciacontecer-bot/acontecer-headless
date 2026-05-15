import { NextRequest, NextResponse } from 'next/server';

const BASE   = 'https://acontecer.co.cr';
const KEY    = '9ca71b6a25dfdad339f49c83c99ee7c4';
const SECRET = process.env.INDEXING_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    // Verificar clave secreta
    const authHeader = req.headers.get('x-webhook-secret');
    if (!SECRET || authHeader !== SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { url } = body;

    if (!url || !url.startsWith(`${BASE}/`)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // IndexNow — notifica a Google, Bing y Yandex simultáneamente
    const indexNowRes = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'acontecer.co.cr',
        key: KEY,
        keyLocation: `${BASE}/${KEY}.txt`,
        urlList: [url],
      }),
    });

    if (indexNowRes.ok || indexNowRes.status === 202) {
      console.log('[indexnow] Enviado:', url);
      return NextResponse.json({ ok: true, url, status: indexNowRes.status });
    }

    const errText = await indexNowRes.text();
    console.error('[indexnow] Error:', indexNowRes.status, errText.slice(0, 200));
    return NextResponse.json({ error: errText, status: indexNowRes.status }, { status: 500 });

  } catch (err: any) {
    console.error('[index-url]', err?.message);
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
