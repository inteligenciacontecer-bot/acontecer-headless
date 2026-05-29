import { NextRequest, NextResponse } from 'next/server';

const BASE          = 'https://acontecer.co.cr';
const INDEXNOW_KEY  = '9ca71b6a25dfdad339f49c83c99ee7c4';
const SECRET        = process.env.INDEXING_WEBHOOK_SECRET || '';
const SA_KEY_B64    = process.env.GOOGLE_INDEXING_KEY || '';

// ── Google Indexing API ──────────────────────────────────────────────────────
// Genera un JWT firmado con el service account para obtener un access token
// y notificar a Google de una URL nueva/actualizada.
// Docs: https://developers.google.com/search/apis/indexing-api/v3/using-api

async function getGoogleAccessToken(sa: any): Promise<string> {
  const now   = Math.floor(Date.now() / 1000);
  const claim = {
    iss  : sa.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud  : sa.token_uri,
    exp  : now + 3600,
    iat  : now,
  };

  // Encode JWT header + payload
  const enc  = (obj: any) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const header  = enc({ alg: 'RS256', typ: 'JWT' });
  const payload = enc(claim);
  const sigInput = `${header}.${payload}`;

  // Importar clave privada RSA del service account
  const pemBody = sa.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\n/g, '');
  const keyBytes  = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', keyBytes.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );

  // Firmar
  const sigBytes = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', cryptoKey,
    new TextEncoder().encode(sigInput)
  );
  const sig = btoa(String.fromCharCode(...new Uint8Array(sigBytes)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const jwt = `${sigInput}.${sig}`;

  // Intercambiar JWT por access token
  const tokenRes = await fetch(sa.token_uri, {
    method : 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body   : `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const tokenData = await tokenRes.json() as any;
  if (!tokenData.access_token) throw new Error(`Token error: ${JSON.stringify(tokenData)}`);
  return tokenData.access_token;
}

async function notifyGoogle(url: string): Promise<{ ok: boolean; status: number; body?: string }> {
  if (!SA_KEY_B64) return { ok: false, status: 0, body: 'GOOGLE_INDEXING_KEY not set' };
  try {
    const sa          = JSON.parse(atob(SA_KEY_B64));
    const accessToken = await getGoogleAccessToken(sa);
    const gRes = await fetch(
      'https://indexing.googleapis.com/v3/urlNotifications:publish',
      {
        method : 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body   : JSON.stringify({ url, type: 'URL_UPDATED' }),
      }
    );
    const body = await gRes.text();
    return { ok: gRes.ok, status: gRes.status, body: body.slice(0, 200) };
  } catch (err: any) {
    return { ok: false, status: 0, body: err?.message };
  }
}

// ── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('x-webhook-secret');
    if (!SECRET || authHeader !== SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { url } = body;

    if (!url || !url.startsWith(`${BASE}/`)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Llamar todo en paralelo
    const [indexNowRes, googleRes, sitemapPingRes] = await Promise.allSettled([
      // IndexNow → Bing + Yandex
      fetch('https://api.indexnow.org/indexnow', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body   : JSON.stringify({
          host       : 'acontecer.co.cr',
          key        : INDEXNOW_KEY,
          keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
          urlList    : [url],
        }),
      }),
      // Google Indexing API → Google Search + Discover (requiere SA verificado en GSC)
      notifyGoogle(url),
      // Google Sitemap Ping → fuerza re-crawl del news-sitemap sin auth
      fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(`${BASE}/news-sitemap.xml`)}`),
    ]);

    const inStatus   = indexNowRes.status === 'fulfilled' ? indexNowRes.value.status : 'error';
    const gResult    = googleRes.status   === 'fulfilled' ? googleRes.value : { ok: false, status: 0, body: 'rejected' };
    const pingStatus = sitemapPingRes.status === 'fulfilled' ? sitemapPingRes.value.status : 'error';

    console.log(`[index-url] ${url} | IndexNow:${inStatus} | GoogleAPI:${gResult.status}(${gResult.ok?'OK':gResult.body?.slice(0,80)}) | Ping:${pingStatus}`);

    return NextResponse.json({
      ok       : true,
      url,
      indexnow : inStatus,
      google   : { ok: gResult.ok, status: gResult.status },
      ping     : pingStatus,
    });

  } catch (err: any) {
    console.error('[index-url]', err?.message);
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
