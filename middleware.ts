import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de unificación de URLs + inyección de pathname header
 * 1) www.acontecer.co.cr → acontecer.co.cr (301)
 * 2) Paths con mayúsculas → minúsculas (301)
 * 3) Inyecta x-pathname para que server components puedan leer la ruta
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const url = req.nextUrl.clone();

  // ── 1. Redirect www → raíz ───────────────────────────────────────────────
  if (host.startsWith('www.')) {
    const target = `https://acontecer.co.cr${url.pathname}${url.search}`;
    return NextResponse.redirect(target, { status: 301 });
  }

  // ── 2. Redirect uppercase → lowercase en el pathname ─────────────────────
  const lower = url.pathname.toLowerCase();
  if (url.pathname !== lower) {
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const cleanHost = host.split(':')[0];
    const target = `${proto}://${cleanHost}${lower}${url.search}`;
    return NextResponse.redirect(target, { status: 301 });
  }

  // ── 2.5. Redirects 301 para URLs viejas / categorías inexistentes ────────
  // Estas URLs aparecen en backlinks externos, Semrush, Google Search
  // o componentes viejos. Redirigimos a destino canónico para evitar 404.
  const redirects301: Record<string, string> = {
    '/categoria/salud':     '/categoria/nacionales',  // Categoria no existe en WP — redirigir a nacionales
    '/categoria/Salud':     '/categoria/nacionales',  // por si llega con capitalizacion antigua
    '/autores/':            '/autores',  // sin slash final
    '/blog':                '/',  // legacy WordPress
    '/blog/':               '/',
    '/index.php':           '/',
    '/wp-admin':            '/',  // intentos de scan
    '/wp-admin/':           '/',
    '/wp-login.php':        '/',
  };
  if (redirects301[url.pathname] !== undefined) {
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const cleanHost = host.split(':')[0] || 'acontecer.co.cr';
    const target = `${proto}://${cleanHost}${redirects301[url.pathname]}`;
    return NextResponse.redirect(target, { status: 301 });
  }

  // ── 3. Inyectar x-pathname para uso de server components ─────────────────
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', url.pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|otf|css|js)$).*)',
  ],
};
