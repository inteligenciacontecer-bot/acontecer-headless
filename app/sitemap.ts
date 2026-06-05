import { MetadataRoute } from 'next';

const API  = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const BASE = 'https://acontecer.co.cr';


// Filtra slugs corruptos que ensucian el sitemap (URLs de WP rotas con fbclid,
// __trashed, etc.) — afectan presupuesto de rastreo y dan errores en Semrush.
// safeDate — evita "Invalid Date" que rompe el build con RangeError en toISOString().
// WordPress puede devolver date/modified null, vacío o malformado en posts corruptos.
function safeDate(value: any, fallback: Date): Date {
  if (!value) return fallback;
  const d = new Date(value);
  return isNaN(d.getTime()) ? fallback : d;
}

function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  if (slug.startsWith('__')) return false;          // __trashed, __backup
  if (slug.includes('fbclid')) return false;        // URLs con fbclid pegado
  if (slug.includes('utm_')) return false;
  if (slug.includes('https-') || slug.includes('http-')) return false;  // URLs pegadas como slug
  if (slug.length > 150) return false;              // slugs absurdamente largos
  if (/^\d{4}-\d{2}-\d{2}/.test(slug)) return false;  // fechas como slug
  return true;
}

async function getAllPosts() {
  try {
    const all: any[] = [];
    let page = 1;
    while (true) {
      const res = await fetch(
        `${API}/posts?per_page=100&page=${page}&_fields=slug,date,modified,categories&_embed=false`,
        { next: { revalidate: 1800 } }
      );
      if (!res.ok) break;
      const data = await res.json();
      if (!data.length) break;
      all.push(...data);
      if (data.length < 100) break;
      page++;
    }
    return all;
  } catch { return []; }
}

async function getCategories() {
  try {
    const res = await fetch(`${API}/categories?per_page=50&_fields=id,slug`, { next: { revalidate: 3600 } });
    return res.json();
  } catch { return []; }
}

// getPopularTags eliminado — etiquetas removidas del sitemap (ver comentario abajo)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);

  const catMap: Record<number, string> = {};
  categories.forEach((c: any) => { catMap[c.id] = c.slug; });

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                   lastModified: new Date(), changeFrequency: 'hourly',  priority: 1   },
    { url: `${BASE}/nosotros`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contacto`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/pauta`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/agencia`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/tipo-de-cambio`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE}/politicas`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/privacidad`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/enlaces`,      lastModified: new Date(), changeFrequency: 'daily',   priority: 0.6 },
    { url: `${BASE}/asamblea`,     lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.8 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c: any) => c.slug !== 'uncategorized')
    .map((c: any) => ({
      url: `${BASE}/categoria/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    }));

  // Para artículos: usar modified solo si es reciente (< 90 días).
  // Editar un artículo viejo (corregir typo, agregar backlink) actualiza `modified`
  // → sitemap muestra hoy como lastmod → Google lo re-rastrea y puede mostrar
  // la fecha de modificación como si fuera publicación reciente.
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const now = new Date();

  const postPages: MetadataRoute.Sitemap = posts.filter((p: any) => isValidSlug(p.slug)).map((p: any) => {
    const pubDate = safeDate(p.date, now);
    const modDate = safeDate(p.modified, pubDate);
    // Artículos recientes: señalar modificaciones. Viejos: fecha original.
    const lastMod = modDate > ninetyDaysAgo ? modDate : pubDate;
    return {
      url: `${BASE}/${catMap[p.categories?.[0]] || 'nacionales'}/${p.slug}`,
      lastModified: lastMod,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
  });

  // Web Stories — una entry por cada artículo reciente (últimos 200)
  const storyPages: MetadataRoute.Sitemap = posts.filter((p: any) => isValidSlug(p.slug)).slice(0, 200).map((p: any) => ({
    url: `${BASE}/stories/${p.slug}`,
    lastModified: safeDate(p.date, now), // siempre fecha original para stories
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // ⚠️ Etiquetas eliminadas del sitemap — son contenido delgado (listas de links).
  // Incluirlas consume crawl budget y hacen que site: muestre etiquetas en vez de artículos.
  // Las páginas de etiqueta tienen noindex en su propio page.tsx.

  return [...staticPages, ...categoryPages, ...postPages, ...storyPages];
}
