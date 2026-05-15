import { MetadataRoute } from 'next';

const API  = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const BASE = 'https://acontecer.co.cr';

async function getAllPosts() {
  try {
    const all: any[] = [];
    let page = 1;
    while (true) {
      const res = await fetch(
        `${API}/posts?per_page=100&page=${page}&_fields=slug,modified,categories&_embed=false`,
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

async function getPopularTags() {
  try {
    // Solo etiquetas con al menos 3 artículos para no incluir tags huérfanas
    const res = await fetch(`${API}/tags?per_page=100&orderby=count&order=desc&_fields=slug,count`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const tags = await res.json();
    return Array.isArray(tags) ? tags.filter((t: any) => t.count >= 3) : [];
  } catch { return []; }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, popularTags] = await Promise.all([getAllPosts(), getCategories(), getPopularTags()]);

  const catMap: Record<number, string> = {};
  categories.forEach((c: any) => { catMap[c.id] = c.slug; });

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                   lastModified: new Date(), changeFrequency: 'hourly',  priority: 1   },
    { url: `${BASE}/nosotros`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contacto`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/pauta`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/agencia`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
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

  const postPages: MetadataRoute.Sitemap = posts.map((p: any) => ({
    url: `${BASE}/${catMap[p.categories?.[0]] || 'nacionales'}/${p.slug}`,
    lastModified: new Date(p.modified),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Web Stories — una entry por cada artículo reciente (últimos 200)
  // Google Discover las descubre a través de este sitemap
  const storyPages: MetadataRoute.Sitemap = posts.slice(0, 200).map((p: any) => ({
    url: `${BASE}/stories/${p.slug}`,
    lastModified: new Date(p.modified),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Etiquetas populares (≥ 3 artículos)
  const tagPages: MetadataRoute.Sitemap = popularTags.map((t: any) => ({
    url: `${BASE}/etiqueta/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...tagPages, ...postPages, ...storyPages];
}
