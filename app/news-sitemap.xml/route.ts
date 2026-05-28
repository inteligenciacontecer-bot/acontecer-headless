// Siempre dinámico — sin caché en Vercel para que Google vea noticias al instante
export const dynamic = 'force-dynamic';

const API  = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const BASE = 'https://acontecer.co.cr';

// SEO: reescribir URLs del CMS al dominio principal
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
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    // _embed trae featured media + terms (tags y categorías)
    const [postsRes, catsRes] = await Promise.all([
      fetch(
        `${API}/posts?per_page=100&after=${twoDaysAgo}&_embed&orderby=date&order=desc`,
        { cache: 'no-store' }
      ),
      fetch(
        `${API}/categories?per_page=50&_fields=id,slug`,
        { cache: 'no-store' }
      ),
    ]);

    if (!postsRes.ok) throw new Error(`WP API ${postsRes.status}`);

    const posts: any[] = await postsRes.json();
    const categories: any[] = catsRes.ok ? await catsRes.json() : [];

    const catMap: Record<number, string> = {};
    categories.forEach((c) => { catMap[c.id] = c.slug; });

    const items = Array.isArray(posts)
      ? posts.filter((p: any) => isValidSlug(p.slug)).map((p: any) => {
          const catSlug    = catMap[p.categories?.[0]] || 'nacionales';
          // WordPress devuelve p.date en hora local CR (sin zona).
          // new Date(str_sin_zona) en Node.js UTC lo interpretaría como UTC → fechas 6h desfasadas.
          // Forzamos la zona correcta antes de convertir para que ISO string sea UTC real.
          const pubDate    = p.date.includes('+') || p.date.endsWith('Z')
            ? p.date
            : p.date + '-06:00';
          const title      = stripHtml(p.title?.rendered ?? '');

          // Tags del artículo → keywords para Google News
          const tags: string[] = (p._embedded?.['wp:term']?.[1] || [])
            .map((t: any) => t.name).filter(Boolean);
          const keywords = tags.length > 0 ? tags.join(', ') : '';

          // Imagen destacada
          const media       = p._embedded?.['wp:featuredmedia']?.[0];
          const imgUrl      = media?.source_url ? cmsToLocal(media.source_url) : '';
          const imgTitle    = esc(stripHtml(media?.title?.rendered || title));
          const imgCaption  = media?.caption?.rendered
            ? esc(stripHtml(media.caption.rendered)) : '';

          const imgBlock = imgUrl ? `
    <image:image>
      <image:loc>${esc(imgUrl)}</image:loc>
      <image:title>${imgTitle}</image:title>${imgCaption ? `\n      <image:caption>${imgCaption}</image:caption>` : ''}
    </image:image>` : '';

          return `  <url>
    <loc>${BASE}/${catSlug}/${p.slug}</loc>
    <lastmod>${pubDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
    <news:news>
      <news:publication>
        <news:name>Acontecer.co.cr</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${esc(title)}</news:title>${keywords ? `\n      <news:keywords>${esc(keywords)}</news:keywords>` : ''}
    </news:news>${imgBlock}
  </url>`;
        })
        .join('\n')
      : '';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/news-sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${items}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (err) {
    console.error('[news-sitemap]', err);
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"></urlset>',
      { status: 200, headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
    );
  }
}
