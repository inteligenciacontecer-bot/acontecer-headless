import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de unificación de URLs
 * 1) www.acontecer.co.cr → acontecer.co.cr (301)
 * 2) Paths con mayúsculas → minúsculas (301)
 * Objetivo: concentrar todas las señales SEO en una sola propiedad canónica.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const url = req.nextUrl.clone();

  // ── 1. Redirect www → raíz ───────────────────────────────────────────────
  // Construimos la URL como string para evitar que NextURL filtre el puerto
  // interno (3000) cuando el proxy corre detrás de Nginx/Cloudflare.
  if (host.startsWith('www.')) {
    const target = `https://acontecer.co.cr${url.pathname}${url.search}`;
    return NextResponse.redirect(target, { status: 301 });
  }

  // ── 2. Redirect uppercase → lowercase en el pathname ─────────────────────
  const lower = url.pathname.toLowerCase();
  if (url.pathname !== lower) {
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const cleanHost = host.split(':')[0]; // quita puerto si lo trae el header
    const target = `${proto}://${cleanHost}${lower}${url.search}`;
    return NextResponse.redirect(target, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Aplicar a todos los paths EXCEPTO:
   * - _next/static  → assets de Next.js
   * - _next/image   → optimizador de imágenes
   * - archivos con extensión (favicon, png, jpg, etc.)
   */
  matcher: [
    '/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|otf|css|js)$).*)',
  ],
};
