// Image sitemap — TODAS las imágenes históricas del CMS
// Acelera indexación en Google Imágenes después del cambio de X-Robots-Tag
// Ref: https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API  = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const BASE = 'https://acontecer.co.cr';

const cmsToLocal = (u: string): string =>
  u.replace(/^https?:\/\/cms\.acontecer\.co\.cr\//i, 'https://acontecer.co.cr/');

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'")
    .trim();
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// Extrae todas las URLs de <img src="..."> dentro del HTML del contenido
function extractImagesFromHtml(html: string): string[] {
  if (!html) return [];
  const matches = html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
  const urls: string[] = [];
  for (const m of matches) {
    if (m[1] && /\.(webp|jpg|jpeg|png|gif)(\?|$)/i.test(m[1])) {
      urls.push(cmsToLocal(m[1]));
    }
  }
  return urls;
}


function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  if (slug.startsWith('__')) return false;
  if (slug.includes('fbclid')) return false;
  if (slug.includes('utm_')) return false;
  if (slug.includes('https-') || slug.includes('http-')) return false;
  if (slug.length > 150) return false;
  return true;
}

export async function GET() {
  try {
    // Trae TODOS los posts paginados (limit 1000 = ~10 páginas) con _embed para imágenes
    const all: any[] = [];
    let page = 1;
    while (page <= 10) {
      const res = await fetch(
        `${API}/posts?per_page=100&page=${page}&_embed&orderby=date&order=desc`,
        { cache: 'no-store' }
      );
      if (!res.ok) break;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;
      all.push(...data);
      if (data.length < 100) break;
      page++;
    }

    const catsRes = await fetch(
      `${API}/categories?per_page=50&_fields=id,slug`,
      { cache: 'no-store' }
    );
    const categories: any[] = catsRes.ok ? await catsRes.json() : [];
    const catMap: Record<number, string> = {};
    categories.forEach((c) => { catMap[c.id] = c.slug; });

    const items = all
      .filter((p: any) => isValidSlug(p.slug))
      .map((p: any) => {
        const catSlug = catMap[p.categories?.[0]] || 'nacionales';
        const title   = stripHtml(p.title?.rendered ?? '');
        const lastmod = new Date(p.modified || p.date).toISOString();
        const pageUrl = `${BASE}/${catSlug}/${p.slug}`;

        // Imágenes: featured + embebidas en el contenido
        const allImgs = new Set<string>();
        const media   = p._embedded?.['wp:featuredmedia']?.[0];
        if (media?.source_url) allImgs.add(cmsToLocal(media.source_url));

        const content = p.content?.rendered || '';
        for (const u of extractImagesFromHtml(content)) allImgs.add(u);

        if (allImgs.size === 0) return '';

        const imgBlocks = [...allImgs]
          .slice(0, 1000) // límite por <url>: Google permite hasta 1000 imágenes por entrada
          .map((u) => `    <image:image>
      <image:loc>${esc(u)}</image:loc>
      <image:title>${esc(title)}</image:title>
    </image:image>`)
          .join('\n');

        return `  <url>
    <loc>${esc(pageUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
${imgBlocks}
  </url>`;
      })
      .filter(Boolean)
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${items}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (err) {
    console.error('[image-sitemap]', err);
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"></urlset>',
      { status: 200, headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
    );
  }
}
