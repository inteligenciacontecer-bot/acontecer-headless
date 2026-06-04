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

  // Tags duplicados (consolidacion SEO - redirigir al que tiene mas notas)
  '/etiqueta/asamblea-legislativa-2026-2030': '/etiqueta/asamblea-legislativa',
  '/etiqueta/asamblea-legislativa-2026-2030/': '/etiqueta/asamblea-legislativa',
  '/etiqueta/candidatos-presidenciales-2026': '/etiqueta/candidatos-presidenciales',
  '/etiqueta/candidatos-presidenciales-2026/': '/etiqueta/candidatos-presidenciales',
  '/etiqueta/candidatos-presidenciales-2022': '/etiqueta/candidatos-presidenciales',
  '/etiqueta/candidatos-presidenciales-2022/': '/etiqueta/candidatos-presidenciales',
  '/etiqueta/candidatos-presidenciales-2024': '/etiqueta/candidatos-presidenciales',
  '/etiqueta/candidatos-presidenciales-2024/': '/etiqueta/candidatos-presidenciales',
  '/etiqueta/candidatos-presidenciales-2025': '/etiqueta/candidatos-presidenciales',
  '/etiqueta/candidatos-presidenciales-2025/': '/etiqueta/candidatos-presidenciales',
  '/etiqueta/campana-presidencial-2026-2': '/etiqueta/campana-presidencial',
  '/etiqueta/campana-presidencial-2026-2/': '/etiqueta/campana-presidencial',
  '/etiqueta/campana-presidencial-2022': '/etiqueta/campana-presidencial',
  '/etiqueta/campana-presidencial-2022/': '/etiqueta/campana-presidencial',
  '/etiqueta/campana-presidencial-2024': '/etiqueta/campana-presidencial',
  '/etiqueta/campana-presidencial-2024/': '/etiqueta/campana-presidencial',
  '/etiqueta/campana-presidencial-2025': '/etiqueta/campana-presidencial',
  '/etiqueta/campana-presidencial-2025/': '/etiqueta/campana-presidencial',
  '/etiqueta/campana-presidencial-2': '/etiqueta/campana-presidencial',
  '/etiqueta/campana-presidencial-2/': '/etiqueta/campana-presidencial',
  '/etiqueta/campana-presidencial-2021': '/etiqueta/campana-presidencial',
  '/etiqueta/campana-presidencial-2021/': '/etiqueta/campana-presidencial',
  '/etiqueta/campana-electoral-2024': '/etiqueta/campana-electoral-2',
  '/etiqueta/campana-electoral-2024/': '/etiqueta/campana-electoral-2',
  '/etiqueta/campana-electoral-2022': '/etiqueta/campana-electoral-2',
  '/etiqueta/campana-electoral-2022/': '/etiqueta/campana-electoral-2',
  '/etiqueta/campana-electoral-2026': '/etiqueta/campana-electoral-2',
  '/etiqueta/campana-electoral-2026/': '/etiqueta/campana-electoral-2',
  '/etiqueta/campana-electoral-2025': '/etiqueta/campana-electoral-2',
  '/etiqueta/campana-electoral-2025/': '/etiqueta/campana-electoral-2',
  '/etiqueta/campana-politica-2024': '/etiqueta/campana-politica',
  '/etiqueta/campana-politica-2024/': '/etiqueta/campana-politica',
  '/etiqueta/campana-politica-2025': '/etiqueta/campana-politica',
  '/etiqueta/campana-politica-2025/': '/etiqueta/campana-politica',
  '/etiqueta/astronomia-2': '/etiqueta/astronomia',
  '/etiqueta/astronomia-2/': '/etiqueta/astronomia',
  '/etiqueta/brasil-2014': '/etiqueta/brasil',
  '/etiqueta/brasil-2014/': '/etiqueta/brasil',
  '/etiqueta/candidatos-2024': '/etiqueta/candidatos-2026',
  '/etiqueta/candidatos-2024/': '/etiqueta/candidatos-2026',
  '/etiqueta/candidatos-2025': '/etiqueta/candidatos-2026',
  '/etiqueta/candidatos-2025/': '/etiqueta/candidatos-2026',
  '/etiqueta/cambio-climatico': '/etiqueta/cambio-climatico-2',
  '/etiqueta/cambio-climatico/': '/etiqueta/cambio-climatico-2',
  '/etiqueta/candidatos-diputados-2024': '/etiqueta/candidatos-diputados',
  '/etiqueta/candidatos-diputados-2024/': '/etiqueta/candidatos-diputados',
  '/etiqueta/apertura-2023': '/etiqueta/apertura',
  '/etiqueta/apertura-2023/': '/etiqueta/apertura',
  '/etiqueta/apertura-2025': '/etiqueta/apertura',
  '/etiqueta/apertura-2025/': '/etiqueta/apertura',
  '/etiqueta/apoyo-politico-2': '/etiqueta/apoyo-politico',
  '/etiqueta/apoyo-politico-2/': '/etiqueta/apoyo-politico',
  '/etiqueta/campanas-electorales-2022': '/etiqueta/campanas-electorales',
  '/etiqueta/campanas-electorales-2022/': '/etiqueta/campanas-electorales',
  '/etiqueta/catar': '/etiqueta/catar-2022',
  '/etiqueta/catar/': '/etiqueta/catar-2022',
  '/etiqueta/alexander-solis': '/etiqueta/alexander-solis-2',
  '/etiqueta/alexander-solis/': '/etiqueta/alexander-solis-2',
  '/etiqueta/anna-katharina-muller-3': '/etiqueta/anna-katharina-muller-2',
  '/etiqueta/anna-katharina-muller-3/': '/etiqueta/anna-katharina-muller-2',
  '/etiqueta/bryan-ruiz-3': '/etiqueta/bryan-ruiz',
  '/etiqueta/bryan-ruiz-3/': '/etiqueta/bryan-ruiz',
  '/etiqueta/canal-11': '/etiqueta/canal-7',
  '/etiqueta/canal-11/': '/etiqueta/canal-7',
  '/etiqueta/canal-38': '/etiqueta/canal-7',
  '/etiqueta/canal-38/': '/etiqueta/canal-7',
  '/etiqueta/canal-8': '/etiqueta/canal-7',
  '/etiqueta/canal-8/': '/etiqueta/canal-7',
  '/etiqueta/alexandre-guimaraes-2': '/etiqueta/alexandre-guimaraes',
  '/etiqueta/alexandre-guimaraes-2/': '/etiqueta/alexandre-guimaraes',
  '/etiqueta/cancilleria-2': '/etiqueta/cancilleria',
  '/etiqueta/cancilleria-2/': '/etiqueta/cancilleria',
  '/etiqueta/adhesion-politica-2': '/etiqueta/adhesion-politica',
  '/etiqueta/adhesion-politica-2/': '/etiqueta/adhesion-politica',
  '/etiqueta/aeropuerto-juan-santamaria-2': '/etiqueta/aeropuerto-juan-santamaria',
  '/etiqueta/aeropuerto-juan-santamaria-2/': '/etiqueta/aeropuerto-juan-santamaria',
  '/etiqueta/agustin-lleida': '/etiqueta/agustin-lleida-2',
  '/etiqueta/agustin-lleida/': '/etiqueta/agustin-lleida-2',
  '/etiqueta/anfiteatro-coca-cola-2': '/etiqueta/anfiteatro-coca-cola',
  '/etiqueta/anfiteatro-coca-cola-2/': '/etiqueta/anfiteatro-coca-cola',
  '/etiqueta/australia-y-nueva-zelanda': '/etiqueta/australia-y-nueva-zelanda-2023',
  '/etiqueta/australia-y-nueva-zelanda/': '/etiqueta/australia-y-nueva-zelanda-2023',
  '/etiqueta/beligerancia-politica': '/etiqueta/beligerancia-politica-2',
  '/etiqueta/beligerancia-politica/': '/etiqueta/beligerancia-politica-2',
  '/etiqueta/boris-ramirez': '/etiqueta/boris-ramirez-2',
  '/etiqueta/boris-ramirez/': '/etiqueta/boris-ramirez-2',
  '/etiqueta/buenos-aires-2025': '/etiqueta/buenos-aires',
  '/etiqueta/buenos-aires-2025/': '/etiqueta/buenos-aires',
  '/etiqueta/canada-2': '/etiqueta/canada-3',
  '/etiqueta/canada-2/': '/etiqueta/canada-3',
  '/etiqueta/cancer': '/etiqueta/cancer-2',
  '/etiqueta/cancer/': '/etiqueta/cancer-2',
  '/etiqueta/candidatura-presidencial-2026': '/etiqueta/candidatura-presidencial',
  '/etiqueta/candidatura-presidencial-2026/': '/etiqueta/candidatura-presidencial',
  '/etiqueta/carceles-2': '/etiqueta/carceles',
  '/etiqueta/carceles-2/': '/etiqueta/carceles',
  '/etiqueta/adrian-gutierrez-2': '/etiqueta/adrian-gutierrez',
  '/etiqueta/adrian-gutierrez-2/': '/etiqueta/adrian-gutierrez',
  '/etiqueta/campanas-presidenciales-2025': '/etiqueta/campanas-presidenciales',
  '/etiqueta/campanas-presidenciales-2025/': '/etiqueta/campanas-presidenciales',
  '/etiqueta/campanas-presidenciales-2026': '/etiqueta/campanas-presidenciales',
  '/etiqueta/campanas-presidenciales-2026/': '/etiqueta/campanas-presidenciales',
  '/etiqueta/administracion-2022-2026': '/etiqueta/administracion',
  '/etiqueta/administracion-2022-2026/': '/etiqueta/administracion',
  '/etiqueta/armando-gonzalez': '/etiqueta/armando-gonzalez-2',
  '/etiqueta/armando-gonzalez/': '/etiqueta/armando-gonzalez-2',
  '/etiqueta/autodromo-de-monza': '/etiqueta/autodromo-de-monza-2',
  '/etiqueta/autodromo-de-monza/': '/etiqueta/autodromo-de-monza-2',
  '/etiqueta/barbara-gil-2': '/etiqueta/barbara-gil',
  '/etiqueta/barbara-gil-2/': '/etiqueta/barbara-gil',
  '/etiqueta/bienes-raices-2': '/etiqueta/bienes-raices',
  '/etiqueta/bienes-raices-2/': '/etiqueta/bienes-raices',
  '/etiqueta/black-friday': '/etiqueta/black-friday-2024',
  '/etiqueta/black-friday/': '/etiqueta/black-friday-2024',
  '/etiqueta/brisa-hennessy': '/etiqueta/brisahennessy',
  '/etiqueta/brisa-hennessy/': '/etiqueta/brisahennessy',
  '/etiqueta/candidatas-2026': '/etiqueta/candidatas-2025',
  '/etiqueta/candidatas-2026/': '/etiqueta/candidatas-2025',
  '/etiqueta/canton-central-2': '/etiqueta/canton-central',
  '/etiqueta/canton-central-2/': '/etiqueta/canton-central',
  '/etiqueta/carls-jr-3': '/etiqueta/carls-jr-2',
  '/etiqueta/carls-jr-3/': '/etiqueta/carls-jr-2',
  '/etiqueta/carretera-naranjo-san-carlos-2': '/etiqueta/carretera-naranjo-san-carlos',
  '/etiqueta/carretera-naranjo-san-carlos-2/': '/etiqueta/carretera-naranjo-san-carlos',
  '/etiqueta/cccan-2023': '/etiqueta/cccan2023',
  '/etiqueta/cccan-2023/': '/etiqueta/cccan2023',

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
  // /CAT/ sola → /categoria/CAT (sin prefijo /categoria/) — las 9 categorías
  {
    pattern: /^\/(nacionales|internacionales|deportes|economia|entretenimiento|tecnologia|opinion|tendencias|turismo)\/?$/i,
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
