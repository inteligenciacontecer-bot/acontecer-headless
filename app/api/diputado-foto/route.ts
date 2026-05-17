/**
 * /api/diputado-foto?url=ENCODED_URL
 *
 * Proxy para imágenes de diputados desde asamblea.go.cr.
 *
 * El servidor asamblea.go.cr tiene cadena SSL incompleta — Node.js fetch
 * falla con UNABLE_TO_VERIFY_LEAF_SIGNATURE. Usamos node:https con
 * rejectUnauthorized:false SOLO para este host autorizado.
 *
 * Si la imagen externa devuelve error → redirige a /imagen-no-disponible.jpg
 * Cachea 1 día.
 */
import { NextRequest, NextResponse } from 'next/server';
import https from 'node:https';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FALLBACK = 'https://acontecer.co.cr/imagen-no-disponible.jpg';

interface FetchResult {
  ok: boolean;
  status: number;
  contentType: string;
  buffer: Buffer;
}

function fetchInsecure(url: string, timeoutMs = 8000): Promise<FetchResult> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: 'GET',
        timeout: timeoutMs,
        rejectUnauthorized: false, // SSL relajado solo para asamblea.go.cr
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AcontecerBot/1.0; +https://acontecer.co.cr)',
          'Accept': 'image/webp,image/avif,image/jpeg,image/png,image/*,*/*;q=0.8',
        },
      },
      (res) => {
        // Manejar redirects
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, url).toString();
          if (/^https?:\/\/(?:www\.)?asamblea\.go\.cr\//i.test(redirectUrl)) {
            res.resume(); // descartar este body
            fetchInsecure(redirectUrl, timeoutMs).then(resolve).catch(reject);
            return;
          }
        }

        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            ok: !!res.statusCode && res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode || 0,
            contentType: res.headers['content-type'] || 'image/jpeg',
            buffer: Buffer.concat(chunks),
          });
        });
        res.on('error', reject);
      }
    );

    req.on('timeout', () => {
      req.destroy(new Error('timeout'));
    });
    req.on('error', reject);
    req.end();
  });
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  // Validación: solo permitir URLs de asamblea.go.cr (seguridad)
  if (!url || !/^https:\/\/(?:www\.)?asamblea\.go\.cr\//i.test(url)) {
    return NextResponse.redirect(FALLBACK, { status: 302 });
  }

  try {
    const result = await fetchInsecure(url, 8000);

    if (!result.ok || !result.contentType.startsWith('image/') || result.buffer.length < 200) {
      return NextResponse.redirect(FALLBACK, { status: 302 });
    }

    return new Response(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        'Content-Type': result.contentType,
        'Content-Length': String(result.buffer.length),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'X-Robots-Tag': 'all',
      },
    });
  } catch (err) {
    console.error('[diputado-foto] error:', (err as any)?.message || err);
    return NextResponse.redirect(FALLBACK, { status: 302 });
  }
}
