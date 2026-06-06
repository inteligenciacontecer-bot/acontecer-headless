import { PROVINCIAS, CANTONES, DISTRITOS } from '@/lib/clima';

// Sitemap dedicado de las páginas de clima (general + provincias + cantones +
// distritos/lugares). Propósito: que Google las descubra agrupadas y poder
// monitorear en Search Console cuántas se indexan. NO fuerza indexación.
export const dynamic = 'force-static';
export const revalidate = 86400; // 1 día — son URLs estables (evergreen)

const BASE = 'https://acontecer.co.cr';

export function GET() {
  const hoy = new Date().toISOString().slice(0, 10);

  const urls: { loc: string; priority: string }[] = [];
  urls.push({ loc: `${BASE}/clima`, priority: '0.8' });
  for (const p of PROVINCIAS) {
    urls.push({ loc: `${BASE}/clima/${p.slug}`, priority: '0.6' });
  }
  for (const [prov, cantones] of Object.entries(CANTONES)) {
    for (const c of cantones) {
      urls.push({ loc: `${BASE}/clima/${prov}/${c.slug}`, priority: '0.55' });
    }
  }
  for (const d of DISTRITOS) {
    urls.push({ loc: `${BASE}/clima/${d.provincia}/${d.canton}/${d.slug}`, priority: '0.55' });
  }

  const items = urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
