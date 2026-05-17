/**
 * /api/diputado-foto?url=ENCODED_URL
 *
 * Proxy para imágenes de diputados desde asamblea.go.cr.
 * Si la imagen externa devuelve error → redirige a /imagen-no-disponible.jpg
 *
 * Cachea aggressively (1 día) para reducir requests al servidor externo
 * que es lento/inestable.
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FALLBACK = 'https://acontecer.co.cr/imagen-no-disponible.jpg';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  // Validación: solo permitir URLs de asamblea.go.cr (seguridad: no proxy abierto)
  if (!url || !/^https?:\/\/(?:www\.)?asamblea\.go\.cr\//i.test(url)) {
    return NextResponse.redirect(FALLBACK, { status: 302 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AcontecerBot/1.0; +https://acontecer.co.cr)',
      },
      next: { revalidate: 86400 }, // cache 1 día
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.redirect(FALLBACK, { status: 302 });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) {
      return NextResponse.redirect(FALLBACK, { status: 302 });
    }

    const buffer = await res.arrayBuffer();
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'X-Robots-Tag': 'all',
      },
    });
  } catch (err) {
    // Timeout, network error, 5xx, etc → fallback
    return NextResponse.redirect(FALLBACK, { status: 302 });
  }
}
