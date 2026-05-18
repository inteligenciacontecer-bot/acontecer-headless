import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware:
 * 1) www.acontecer.co.cr → acontecer.co.cr (301)
 * 2) Paths con mayúsculas → minúsculas (301)
 * 3) Redirects 301 masivos para URLs legacy/wp/404 detectadas por GSC
 * 4) Inyecta x-pathname para server components
 */

// ── Redirects exactos (path completo) ───────────────────────────────────────
const exactRedirects: Record<string, string> = {
  // Categorías muertas
  '/categoria/salud': '/categoria/nacionales',
  '/categoria/Salud': '/categoria/nacionales',
  '/categoria/nacionales-2': '/categoria/nacionales',

  // WordPress legacy paths
  '/inicio': '/',
  '/inicio/': '/',
  '/inicioreal': '/',
  '/inicioreal/': '/',
  '/homepage': '/',
  '/homepage/': '/',
  '/base': '/',
  '/base/': '/',

  // WooCommerce / e-commerce (no aplica al medio)
  '/mi-cuenta': '/',
  '/mi-cuenta/': '/',
  '/carrito': '/',
  '/carrito/': '/',
  '/finalizar-compra': '/',
  '/finalizar-compra/': '/',
  '/newsletter': '/',
  '/newsletter/': '/',
  '/shop': '/',

  // Páginas de demo de Elementor/temas
  '/contemporary-home': '/',
  '/contemporary-home/': '/',
  '/elementor-12118': '/',
  '/elementor-12118/': '/',
  '/woo-products-liquid-fullscreen': '/',
  '/woo-products-liquid-fullscreen/': '/',
  '/woo-products-liquid-fullscreen-2': '/',
  '/woo-products-liquid-fullscreen-2/': '/',
  '/post-magazine-grid-with-pagination': '/',
  '/post-magazine-grid-with-pagination/': '/',
  '/post-magazine-grid-with-pagination-2': '/',
  '/post-magazine-grid-with-pagination-2/': '/',
  '/post-accordion-with-sync': '/',
  '/post-accordion-with-sync/': '/',
  '/news-post-list': '/',
  '/news-post-list/': '/',
  '/news-post-list-3': '/',
  '/news-post-list-3/': '/',
  '/news-post-list-4': '/',
  '/news-post-list-4/': '/',
  '/news-post-list-5': '/',
  '/news-post-list-5/': '/',
  '/currency-converter-with-content-ticker': '/',
  '/currency-converter-with-content-ticker/': '/',

  // Páginas institucionales con nombres viejos
  '/equipo-editorial': '/autores',
  '/equipo-editorial/': '/autores',
  '/authors': '/autores',
  '/authors/': '/autores',
  '/legal-notice': '/privacidad',
  '/legal-notice/': '/privacidad',
  '/privacy': '/privacidad',
  '/privacy/': '/privacidad',
  '/politica-de-correcciones-acontecer-co-cr': '/politicas',
  '/politica-de-correcciones-acontecer-co-cr/': '/politicas',
  '/politica-de-etica-acontecer-co-crpolitica-de-etica-acontecer-co-cr': '/politicas',
  '/politica-de-etica-acontecer-co-crpolitica-de-etica-acontecer-co-cr/': '/politicas',
  '/propiedad-y-financiacion': '/nosotros',
  '/propiedad-y-financiacion/': '/nosotros',
  '/acontecer-co-cr-tu-agencia-de-publicidad': '/agencia',
  '/acontecer-co-cr-tu-agencia-de-publicidad/': '/agencia',
  '/media-kit-2026': '/pauta',
  '/media-kit-2026/': '/pauta',

  // WordPress admin / login (intentos de scan)
  '/wp-admin': '/',
  '/wp-admin/': '/',
  '/wp-login.php': '/',
  '/index.php': '/',
};

// ── Redirects con regex (patrones) ──────────────────────────────────────────
const patternRedirects: Array<{ pattern: RegExp; replacement: string }> = [
  // /author/X/page/N → /autor/X (legacy WP English)
  { pattern: /^\/author\/([a-z0-9_-]+)(?:\/page\/\d+)?\/?$/i, replacement: '/autor/$1' },
  // /tag/X/page/N → /etiqueta/X (legacy WP English)
  { pattern: /^\/tag\/([a-z0-9_-]+)(?:\/page\/\d+)?\/?$/i, replacement: '/etiqueta/$1' },
  // /categoria/X/page/N → /categoria/X (paginación vieja con /page/)
  { pattern: /^\/categoria\/([a-z0-9-]+)\/page\/\d+\/?$/i, replacement: '/categoria/$1' },
  // /etiqueta/X/page/N → /etiqueta/X
  { pattern: /^\/etiqueta\/([a-z0-9-]+)\/page\/\d+\/?$/i, replacement: '/etiqueta/$1' },
  // /CAT/page/N → /categoria/CAT (sin prefijo /categoria)
  {
    pattern: /^\/(nacionales|internacionales|deportes|economia|entretenimiento|tecnologia|opinion|tendencias|turismo)\/page\/\d+\/?$/i,
    replacement: '/categoria/$1',
  },
  // /CAT/ sola → /categoria/CAT (sin prefijo /categoria/)
  {
    pattern: /^\/(tecnologia|entretenimiento|opinion)\/?$/i,
    replacement: '/categoria/$1',
  },
  // /etiqueta/X/feed → /etiqueta/X
  { pattern: /^\/etiqueta\/([a-z0-9-]+)\/feed\/?$/i, replacement: '/etiqueta/$1' },
  // /categoria/X/feed → /categoria/X
  { pattern: /^\/categoria\/([a-z0-9-]+)\/feed\/?$/i, replacement: '/categoria/$1' },
  // /[categoria]/[slug]/feed → /[categoria]/[slug]
  { pattern: /^(\/[a-z0-9-]+\/[a-z0-9-]+)\/feed\/?$/i, replacement: '$1' },
  // /2021/MM/DD/slug → /nacionales/slug (asumir nacionales, mejor que 404)
  // NOTA: estas URLs son histórico WP, mejor 410 Gone que redirect (Google las olvida más rápido)
  // Por ahora redirect, si Semrush sigue marcándolas considerar 410
  { pattern: /^\/\d{4}\/\d{2}\/\d{2}\/([a-z0-9-]+)\/?$/i, replacement: '/nacionales/$1' },
];

// ── Paths que deben dar 410 Gone (URLs malformadas/spam — no redirect) ─────
// Lista de regex para 410 (Gone permanentemente)
const gonePatterns: RegExp[] = [
  /^\/(news|content|goods|shop|amazon|google|yahoo|blog|about|item)\/ywnv/i, // URLs spam tipo /news/ywnv*.html
  /^\/[a-z0-9-]+\/menu-[a-z0-9-]+\.html/i, // /xxx/menu-xxx.html (spam)
  /^\/(welmer-ramos-pide-fin|rebajo-del-marchamo-no|cespedes-costarricenses|fabricio-alvarado-presas|alimentacion-y)-?$/i, // URLs truncadas
];

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

  // ── 3. URLs que deben dar 410 Gone (spam, truncadas) ─────────────────────
  for (const pattern of gonePatterns) {
    if (pattern.test(url.pathname)) {
      return new NextResponse(null, { status: 410 });
    }
  }

  // ── 4. Redirects 301 exactos ─────────────────────────────────────────────
  const exactTarget = exactRedirects[url.pathname];
  if (exactTarget !== undefined) {
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const cleanHost = host.split(':')[0] || 'acontecer.co.cr';
    return NextResponse.redirect(`${proto}://${cleanHost}${exactTarget}`, { status: 301 });
  }

  // ── 5. Redirects 301 con patterns regex ──────────────────────────────────
  for (const { pattern, replacement } of patternRedirects) {
    if (pattern.test(url.pathname)) {
      const newPath = url.pathname.replace(pattern, replacement);
      if (newPath !== url.pathname) {
        const proto = req.headers.get('x-forwarded-proto') || 'https';
        const cleanHost = host.split(':')[0] || 'acontecer.co.cr';
        return NextResponse.redirect(`${proto}://${cleanHost}${newPath}${url.search}`, { status: 301 });
      }
    }
  }

  // ── 6. Inyectar x-pathname para uso de server components ─────────────────
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', url.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|otf|css|js)$).*)',
  ],
};
