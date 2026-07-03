import { MetadataRoute } from 'next';
import { PROVINCIAS, CANTONES, DISTRITOS } from '@/lib/clima';
import { FUNCIONARIOS, funcionarioSlug } from '@/lib/gobierno';
import { MUNDIAL_GROUPS, MUNDIAL_MATCHES, getMundialTeams } from '@/lib/mundial-2026';

const API  = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const BASE = 'https://acontecer.co.cr';

export const revalidate = 300;

// ── lastmod estable para páginas evergreen (fix de señal SEO) ──────────────
// Antes estas páginas usaban `new Date()`, así que CADA regeneración del sitio
// marcaba miles de URLs como "modificadas ahora". Para Google era ruido: URLs
// que "cambian" a diario sin que sea cierto → mala señal de crawl.
//
// Ahora la lastmod es una FECHA FIJA que solo se sube a mano cuando el
// contenido realmente cambia. Determinista: VPS y repo generan el mismo XML,
// así que un deploy no vuelve a disparar el ruido.
//
// ⚠️ Bumpear estas fechas SOLO cuando se edite el contenido correspondiente.
const CONTENIDO_LASTMOD = new Date('2026-06-30T12:00:00-06:00'); // páginas institucionales
const GOBIERNO_LASTMOD  = new Date('2026-06-11T12:00:00-06:00'); // directorio del Ejecutivo

// Para páginas VIVAS (clima, mundial, home, categorías…) trunca la fecha a la
// granularidad de su changeFrequency. Una página `daily` solo "cambia" a
// medianoche; una `hourly` solo al inicio de cada hora. Dentro del período,
// todas las regeneraciones producen el MISMO lastmod → sin ruido de "todo
// modificado ahora", pero honesto para contenido que sí se actualiza.
function lastmodVivo(freq: 'hourly' | 'daily', now: Date = new Date()): Date {
  const d = new Date(now);
  d.setMinutes(0, 0, 0);            // recorta minutos/segundos/ms → inicio de hora
  if (freq === 'daily') d.setHours(0);  // → medianoche
  return d;
}


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

// ── Filtro de calidad del sitemap (NO deindexa: solo deja de apuntar a Google).
// Concentra el crawl budget en lo que vale. Reversible. Las páginas ya indexadas
// siguen indexadas y las que tienen enlaces internos se siguen rastreando.
const DOCE_MESES_MS = 365 * 24 * 60 * 60 * 1000;
// Marcadores de evento ya pasado en el slug. 2025/2026 NO se filtran (actual/futuro).
const ANIOS_PASADOS = /\b(2019|2020|2021|2022|2023|2024)\b/;

/** Grupo C — slug basura: palabras pegadas sin guiones (import roto de WP viejo). */
function esSlugBasura(slug: string): boolean {
  if (!slug.includes('-') && slug.length >= 14) return true;     // henrycalimunoz, carmenchancannabis
  if (/^[a-z]{15,}-\d+$/.test(slug)) return true;                // carolinahidalgocand-3
  return false;
}

/**
 * Decide si una nota entra al sitemap.
 *  - Reciente (<12 meses): siempre (noticia fresca, aunque sea efímera).
 *  - Grupo C (basura): nunca.
 *  - Grupo B (efímera vieja: slug con año pasado): fuera.
 *  - Grupo A (evergreen viejo, sin marcadores): se mantiene.
 */
function incluirEnSitemap(slug: string, pubDate: Date, now: Date): boolean {
  if (esSlugBasura(slug)) return false;
  if (now.getTime() - pubDate.getTime() < DOCE_MESES_MS) return true;
  if (ANIOS_PASADOS.test(slug)) return false;
  return true;
}

async function getAllPosts() {
  try {
    const all: any[] = [];
    let page = 1;
    while (true) {
      const res = await fetch(
        `${API}/posts?per_page=100&page=${page}&_fields=slug,date,modified,categories&_embed=false`,
        { next: { revalidate: 300 } }
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
    const res = await fetch(`${API}/categories?per_page=50&_fields=id,slug`, { next: { revalidate: 300 } });
    return res.json();
  } catch { return []; }
}

// getPopularTags eliminado — etiquetas removidas del sitemap (ver comentario abajo)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);

  const catMap: Record<number, string> = {};
  categories.forEach((c: any) => { catMap[c.id] = c.slug; });

  const staticPages: MetadataRoute.Sitemap = [
    // Home y hubs vivos: lastmod truncado a la hora (no cambia en cada regen).
    { url: BASE,                   lastModified: lastmodVivo('hourly'), changeFrequency: 'hourly',  priority: 1   },
    // Institucionales/legales: fecha fija (solo cambia al editar contenido).
    { url: `${BASE}/nosotros`,     lastModified: CONTENIDO_LASTMOD, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contacto`,     lastModified: CONTENIDO_LASTMOD, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/pauta`,        lastModified: CONTENIDO_LASTMOD, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/agencia`,      lastModified: CONTENIDO_LASTMOD, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/servicios`,      lastModified: CONTENIDO_LASTMOD, changeFrequency: 'monthly', priority: 0.6 },
    // Datos que se actualizan a diario: lastmod truncado al día.
    { url: `${BASE}/tipo-de-cambio`, lastModified: lastmodVivo('daily'), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE}/clima`,          lastModified: lastmodVivo('daily'), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE}/precio-combustibles`, lastModified: lastmodVivo('daily'), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/resultados-loteria`, lastModified: lastmodVivo('daily'), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE}/feriados-costa-rica`, lastModified: CONTENIDO_LASTMOD, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/restriccion-vehicular`, lastModified: lastmodVivo('daily'), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE}/gobierno`,       lastModified: GOBIERNO_LASTMOD, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/politicas`,    lastModified: CONTENIDO_LASTMOD, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/privacidad`,   lastModified: CONTENIDO_LASTMOD, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/enlaces`,      lastModified: lastmodVivo('daily'), changeFrequency: 'daily',   priority: 0.6 },
    { url: `${BASE}/asamblea`,     lastModified: lastmodVivo('hourly'), changeFrequency: 'hourly',  priority: 0.8 },
    { url: `${BASE}/asamblea/actas`, lastModified: lastmodVivo('daily'), changeFrequency: 'daily',  priority: 0.6 },
    { url: `${BASE}/mundial-2026`, lastModified: lastmodVivo('hourly'), changeFrequency: 'hourly',  priority: 0.85 },
    { url: `${BASE}/mundial-2026/calendario`, lastModified: lastmodVivo('hourly'), changeFrequency: 'hourly', priority: 0.8 },
  ];

  // Clima por provincia — dato diario: lastmod truncado al día (no por regen)
  const climaProvinciaPages: MetadataRoute.Sitemap = PROVINCIAS.map((p) => ({
    url: `${BASE}/clima/${p.slug}`,
    lastModified: lastmodVivo('daily'),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  // Clima por cantón — páginas estáticas (SEO local: "clima [cantón]")
  const climaCantonPages: MetadataRoute.Sitemap = Object.entries(CANTONES).flatMap(
    ([provSlug, cantones]) => cantones.map((c) => ({
      url: `${BASE}/clima/${provSlug}/${c.slug}`,
      lastModified: lastmodVivo('daily'),
      changeFrequency: 'daily' as const,
      priority: 0.55,
    })),
  );

  // Clima por distrito/localidad turística (SEO: "clima tamarindo", "clima jaco"…)
  const climaDistritoPages: MetadataRoute.Sitemap = DISTRITOS.map((d) => ({
    url: `${BASE}/clima/${d.provincia}/${d.canton}/${d.slug}`,
    lastModified: lastmodVivo('daily'),
    changeFrequency: 'daily' as const,
    priority: 0.55,
  }));

  // Perfiles del Poder Ejecutivo — evergreen: fecha fija del directorio.
  const gobiernoPages: MetadataRoute.Sitemap = FUNCIONARIOS.map((f) => ({
    url: `${BASE}/gobierno/${funcionarioSlug(f)}`,
    lastModified: GOBIERNO_LASTMOD,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Categorías — listas de noticias: lastmod truncado a la hora.
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c: any) => c.slug !== 'uncategorized')
    .map((c: any) => ({
      url: `${BASE}/categoria/${c.slug}`,
      lastModified: lastmodVivo('hourly'),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    }));

  const mundialPages: MetadataRoute.Sitemap = MUNDIAL_MATCHES.map((match) => ({
    url: `${BASE}/mundial-2026/partido/${match.slug}`,
    lastModified: lastmodVivo('hourly'),
    changeFrequency: 'hourly' as const,
    priority: match.matchNumber <= 72 ? 0.72 : 0.68,
  }));

  const mundialTeamPages: MetadataRoute.Sitemap = getMundialTeams().map((team) => ({
    url: `${BASE}/mundial-2026/seleccion/${team.slug}`,
    lastModified: lastmodVivo('daily'),
    changeFrequency: 'daily' as const,
    priority: 0.66,
  }));

  const mundialGroupPages: MetadataRoute.Sitemap = Object.keys(MUNDIAL_GROUPS).map((group) => ({
    url: `${BASE}/mundial-2026/grupo/${group.toLowerCase()}`,
    lastModified: lastmodVivo('hourly'),
    changeFrequency: 'hourly' as const,
    priority: 0.74,
  }));

  // Para artículos: usar modified solo si es reciente (< 90 días).
  // Editar un artículo viejo (corregir typo, agregar backlink) actualiza `modified`
  // → sitemap muestra hoy como lastmod → Google lo re-rastrea y puede mostrar
  // la fecha de modificación como si fuera publicación reciente.
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const now = new Date();

  const postPages: MetadataRoute.Sitemap = posts
    .filter((p: any) => isValidSlug(p.slug) && incluirEnSitemap(p.slug, safeDate(p.date, now), now))
    .map((p: any) => {
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

  // Web Stories — una entry por cada artículo reciente (últimos 200, mismo filtro)
  const storyPages: MetadataRoute.Sitemap = posts
    .filter((p: any) => isValidSlug(p.slug) && incluirEnSitemap(p.slug, safeDate(p.date, now), now))
    .slice(0, 200)
    .map((p: any) => ({
      url: `${BASE}/stories/${p.slug}`,
      lastModified: safeDate(p.date, now), // siempre fecha original para stories
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  // ⚠️ Etiquetas eliminadas del sitemap — son contenido delgado (listas de links).
  // Incluirlas consume crawl budget y hacen que site: muestre etiquetas en vez de artículos.
  // Las páginas de etiqueta tienen noindex en su propio page.tsx.

  return [...staticPages, ...climaProvinciaPages, ...climaCantonPages, ...climaDistritoPages, ...gobiernoPages, ...categoryPages, ...mundialPages, ...mundialTeamPages, ...mundialGroupPages, ...postPages, ...storyPages];
}
