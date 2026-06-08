import { notFound } from 'next/navigation';
import './categoria.css';

const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

// ─── Data fetching ───────────────────────────────────────────────────────────

async function getCategory(slug: string) {
  const res = await fetch(API + '/categories?slug=' + slug, { next: { revalidate: 3600 } });
  const cats = await res.json();
  return Array.isArray(cats) ? cats[0] : null;
}

const PER_PAGE = 12;

async function getCategoryPosts(categoryId: number, page: number) {
  const res = await fetch(
    `${API}/posts?categories=${categoryId}&per_page=${PER_PAGE}&page=${page}&_embed`,
    { next: { revalidate: 60 } }
  );
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
  const total      = parseInt(res.headers.get('X-WP-Total') || '0', 10);
  const posts      = await res.json();
  return { posts: Array.isArray(posts) ? posts : [], totalPages, total };
}

async function getUltimas() {
  const res = await fetch(API + '/posts?per_page=5&_embed', { next: { revalidate: 60 } });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function getClima() {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=9.9281&longitude=-84.0907&current=temperature_2m,weathercode&timezone=America/Costa_Rica',
      { next: { revalidate: 1800 } }
    );
    const data = await res.json();
    const code = data.current.weathercode;
    const temp = Math.round(data.current.temperature_2m);
    const icons: Record<number, string> = {
      0:'☀️', 1:'🌤️', 2:'⛅', 3:'☁️', 45:'🌫️', 51:'🌦️', 61:'🌧️', 80:'🌦️', 95:'⛈️',
    };
    const descs: Record<number, string> = {
      0:'Despejado', 1:'Mayormente despejado', 2:'Parcialmente nublado', 3:'Nublado',
      45:'Neblina', 51:'Llovizna', 61:'Lluvia', 80:'Chubascos', 95:'Tormenta',
    };
    return { temp, icon: icons[code] ?? '🌡️', desc: descs[code] ?? 'Variable' };
  } catch { return null; }
}

// ─── Per-category editorial metadata ────────────────────────────────────────

type CatMeta = {
  lede: string;
  subnav: string[];
  journalists: string;
  live: string;
  eyebrow: string[];
};

const CATEGORY_META: Record<string, CatMeta> = {
  nacionales: {
    lede: 'Cobertura completa de los hechos que definen el rumbo de Costa Rica. Desde la Asamblea Legislativa hasta los pueblos que pocas veces hacen titular.',
    subnav: ['Todo', 'Asamblea', 'Política', 'Provincias', 'Seguridad', 'Sociedad', 'Educación'],
    journalists: '12', live: 'Sesión — Asamblea',
    eyebrow: ['ACONTECER', 'CATEGORÍAS', 'NACIONALES'],
  },
  internacionales: {
    lede: 'El mundo visto desde Costa Rica. Política global, conflictos, diplomacia y los hechos que marcan el rumbo de América Latina y más allá.',
    subnav: ['Todo', 'EE.UU.', 'Centroamérica', 'Latinoamérica', 'Europa', 'Medio Oriente'],
    journalists: '6', live: 'Cumbre SICA',
    eyebrow: ['ACONTECER', 'CATEGORÍAS', 'INTERNACIONALES'],
  },
  deportes: {
    lede: 'Fútbol, olímpicos, selecciones nacionales y todo el deporte costarricense e internacional en un solo lugar.',
    subnav: ['Todo', 'Fútbol', 'Selección', 'Liga', 'Olimpiadas', 'Internacional'],
    journalists: '8', live: 'Liga Deportiva',
    eyebrow: ['ACONTECER', 'CATEGORÍAS', 'DEPORTES'],
  },
  economia: {
    lede: 'Tipo de cambio, mercados, empresas y el pulso económico de Costa Rica, América Latina y el mundo.',
    subnav: ['Todo', 'Mercados', 'Empresas', 'Tipo de cambio', 'Empleo', 'Finanzas'],
    journalists: '5', live: 'Mercados — BCCR',
    eyebrow: ['ACONTECER', 'CATEGORÍAS', 'ECONOMÍA'],
  },
  entretenimiento: {
    lede: 'Cine, música, televisión y cultura popular. Lo que Costa Rica y el mundo están viendo y escuchando.',
    subnav: ['Todo', 'Cine', 'Música', 'TV', 'Farándula', 'Arte'],
    journalists: '4', live: 'Estrenos del mes',
    eyebrow: ['ACONTECER', 'CATEGORÍAS', 'ENTRETENIMIENTO'],
  },
  opinion: {
    lede: 'Las voces más influyentes de Costa Rica. Análisis, columnas y tribuna libre de pensadores y periodistas.',
    subnav: ['Todo', 'Columnas', 'Análisis', 'Tribuna', 'Editorial'],
    journalists: '20+', live: 'Columna de hoy',
    eyebrow: ['ACONTECER', 'CATEGORÍAS', 'OPINIÓN'],
  },
  tecnologia: {
    lede: 'Innovación, startups, inteligencia artificial y el impacto de la tecnología en Costa Rica y el mundo.',
    subnav: ['Todo', 'IA', 'Startups', 'Mobile', 'Ciberseguridad', 'Ciencia'],
    journalists: '3', live: 'Tech News',
    eyebrow: ['ACONTECER', 'CATEGORÍAS', 'TECNOLOGÍA'],
  },
  salud: {
    lede: 'Salud pública, medicina, CCSS y bienestar. La información que necesitas para tu salud en Costa Rica.',
    subnav: ['Todo', 'CCSS', 'Medicina', 'Bienestar', 'Nutrición'],
    journalists: '4', live: 'Boletín CCSS',
    eyebrow: ['ACONTECER', 'CATEGORÍAS', 'SALUD'],
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&#8217;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/\[\.\.\.\]/g, '').trim();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min  = Math.floor(diff / 60000);
  if (min < 60) return `hace ${min} min`;
  const hrs  = Math.floor(min / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `hace ${days} d`;
  return new Date(dateStr).toLocaleDateString('es-CR', { day: 'numeric', month: 'short' });
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0] ?? '').join('').toUpperCase();
}

function getFeaturedImg(post: any): string | null {
  if (!post) return null;
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  // WP devuelve un objeto de error {code, message} cuando el media falla
  if (!media || media.code) return null;
  return (
    media.source_url ??
    media.media_details?.sizes?.large?.source_url ??
    media.media_details?.sizes?.medium_large?.source_url ??
    media.media_details?.sizes?.medium?.source_url ??
    null
  );
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

// ─── Metadata ────────────────────────────────────────────────────────────────

const SEO_LABELS: Record<string, string> = {
  nacionales: 'Noticias Nacionales', internacionales: 'Noticias Internacionales',
  deportes: 'Deportes Costa Rica', economia: 'Economía Costa Rica',
  entretenimiento: 'Entretenimiento', salud: 'Salud Costa Rica',
  tecnologia: 'Tecnología', opinion: 'Opinión',
};

export async function generateMetadata(
  { params, searchParams }: {
    params:       Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
  }
) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10));
  const category = await getCategory(slug);
  if (!category) return { title: 'Categoría no encontrada' };
  const meta  = CATEGORY_META[slug];
  const baseTitle = SEO_LABELS[slug] ?? category.name;
  // SEO: en paginación >=2, agregar ' — Página N' al title para no duplicar
  const title = page > 1
    ? `${baseTitle} — Página ${page}`
    : `${baseTitle}`;
  const desc  = category.description ? stripHtml(category.description) : meta?.lede ?? `Noticias de ${category.name} en Acontecer.co.cr`;
  // SEO: canonical SIEMPRE apunta a page=1 base — consolida duplicate content
  // (paginas paginadas usan robots noindex,follow desde page=2 en adelante)
  const canonicalUrl = `https://acontecer.co.cr/categoria/${slug}`;
  return {
    title,
    description: desc,
    alternates: { canonical: canonicalUrl },
    robots: page > 1 ? {
      // Paginas paginadas (page>=2): noindex,follow → no se indexan pero pasan link juice
      index: false, follow: true,
      googleBot: { index: false, follow: true },
    } : {
      index: true, follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    // ⚠️ CRÍTICO Google News: páginas de sección/categoría NO son artículos.
    // Sin este meta, Googlebot-News las puede confundir con noticias → Content Mismatch.
    other: { 'Googlebot-News': 'noindex, nofollow' },
    openGraph: { title, description: desc, url: canonicalUrl, type: 'website' },
  };
}

// ─── Page component ──────────────────────────────────────────────────────────

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params:       Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug }       = await params;
  const { page: pageP } = await searchParams;
  const page            = Math.max(1, parseInt(pageP ?? '1', 10));

  const [category, ultimas, clima] = await Promise.all([
    getCategory(slug), getUltimas(), getClima(),
  ]);
  if (!category) return notFound();

  const { posts, totalPages, total } = await getCategoryPosts(category.id, page);
  const meta = CATEGORY_META[slug] ?? {
    lede: `Las últimas noticias de ${category.name} en Acontecer.co.cr.`,
    subnav: ['Todo'],
    journalists: '5', live: 'En vivo',
    eyebrow: ['ACONTECER', 'CATEGORÍAS', (category.name as string).toUpperCase()],
  };

  // Split posts into featured / grid / list
  const featuredPost = page === 1 && posts.length > 0 ? posts[0] : null;
  const restPosts    = featuredPost ? posts.slice(1) : posts;
  const gridPosts    = restPosts.slice(0, 6);
  const listPosts    = restPosts.slice(6, 11);

  // Hero photos: toma los primeros 3 posts QUE TIENEN imagen (no necesariamente pos 0/1/2)
  const postsWithImg = posts.filter((p: any) => getFeaturedImg(p) !== null);
  const heroPhotos = [0, 1, 2].map((i) => ({
    img: getFeaturedImg(postsWithImg[i] ?? null),
    tag: `FOTO 0${i + 1}`,
  }));

  const sectionTitle = `Toda la cobertura de ${category.name}`;
  const shown        = Math.min(page * PER_PAGE, total);

  return (
    <>
      {/* ── Schema: BreadcrumbList ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio',       item: 'https://acontecer.co.cr' },
          { '@type': 'ListItem', position: 2, name: category.name,  item: `https://acontecer.co.cr/categoria/${slug}` },
        ],
      })}} />

      {/* ── Schema: ItemList (notas del listado) ── */}
      {/*   Le dice a Google que esta página es un archivo/listado de artículos.
             Habilita rich snippets de lista en SERP para queries de categoría. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${category.name} — Acontecer.co.cr`,
        description: `Últimas noticias de ${category.name} publicadas por Acontecer.co.cr`,
        numberOfItems: posts.length,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: posts.slice(0, 20).map((p: any, i: number) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://acontecer.co.cr/${slug}/${p.slug}`,
          name: (p.title?.rendered ?? '').replace(/<[^>]+>/g, ''),
        })),
      })}} />

      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
      <section className={`v1-hero v1-hero-${slug}`}>
        <div className="v1-hero-bg" />

        {/* 3-photo grid */}
        <div className="v1-hero-photos">
          {heroPhotos.map((p, i) => (
            <div key={i} className={`v1-hero-photo v1-photo-${i + 1}`}>
              {/* Imagen en div hijo para poder ocultarla con CSS por categoría/breakpoint */}
              {p.img && (
                <div className="v1-photo-img" style={{ backgroundImage: `url("${p.img}")` }} />
              )}
              <span className="v1-photo-tag">{p.tag}</span>
            </div>
          ))}
        </div>

        <div className="v1-hero-overlay" />
        <div className="v1-hero-grid" />

        <div className="v1-photo-credits">
          <span>FOTOGRAFÍA EDITORIAL · ACONTECER.CO.CR</span>
          <span className="sep">•</span>
          <span>3 IMÁGENES POR ROTACIÓN</span>
        </div>

        {/* Hero content */}
        <div className="v1-hero-content">
          <div className="v1-breadcrumb">
            {meta.eyebrow.map((p, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                {i > 0 && <span className="sep" style={{ opacity: 0.4 }}>/</span>}
                <span style={i === meta.eyebrow.length - 1 ? { color: '#fff' } : undefined}>{p}</span>
              </span>
            ))}
          </div>

          <h1 className="v1-title" dangerouslySetInnerHTML={{ __html: category.name }} />
          <p className="v1-lede">{meta.lede}</p>

          <div className="v1-meta-row">
            <div className="v1-meta">
              <div className="v1-meta-n">{total > 0 ? total.toLocaleString('es-CR') : category.count}</div>
              <div className="v1-meta-l">artículos publicados</div>
            </div>
            <div className="v1-divider-v" />
            <div className="v1-meta">
              <div className="v1-meta-n">{meta.journalists}</div>
              <div className="v1-meta-l">periodistas en redacción</div>
            </div>
            <div className="v1-divider-v" />
            <div className="v1-meta">
              <div className="v1-meta-n v1-meta-live">
                <span className="dot" /> En vivo
              </div>
              <div className="v1-meta-l">{meta.live}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ SUBNAV ══════════════════════════════ */}
      <nav className="v1-subnav" aria-label="Subtemas">
        <div className="v1-subnav-inner">
          {meta.subnav.map((s, i) => (
            <div key={s} className={`v1-subnav-item${i === 0 ? ' active' : ''}`}>
              {s}
              {i === 0 && <span className="v1-subnav-count">{total > 0 ? total.toLocaleString('es-CR') : category.count}</span>}
            </div>
          ))}
          <div className="v1-subnav-spacer" />
          <div className="v1-subnav-filter" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M6 12h12M10 18h4" />
            </svg>
            Más reciente
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════ BODY ══════════════════════════════ */}
      <div className="v1-body">
        <main className="v1-main">

          {/* ── Page 2+ heading ── */}
          {page > 1 && (
            <div className="v1-page-heading">
              <div>
                <div className="v1-sec-eyebrow" style={{ color: 'var(--blue-600)' }}>{category.name}</div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 400, margin: '6px 0 0', color: 'var(--ink-900)' }}>
                  Página {page}
                </h2>
              </div>
              <div className="v1-page-heading-n">Artículos {(page - 1) * PER_PAGE + 1}–{shown} de {total.toLocaleString('es-CR')}</div>
            </div>
          )}

          {slug === 'deportes' && page === 1 && (
            <section className="v1-worldcup-promo" aria-labelledby="mundial-2026-deportes">
              <div className="v1-worldcup-promo-copy">
                <div className="v1-worldcup-kicker">Cobertura especial</div>
                <h2 id="mundial-2026-deportes">Mundial 2026</h2>
                <p>
                  Calendario completo, grupos, perfiles de selecciones, ranking FIFA, marcadores y páginas individuales
                  de los 104 partidos.
                </p>
                <div className="v1-worldcup-actions">
                  <a className="v1-worldcup-primary" href="/mundial-2026">Abrir especial</a>
                  <a href="/mundial-2026/calendario">Ver calendario</a>
                </div>
              </div>
              <div className="v1-worldcup-promo-stats" aria-label="Datos del especial Mundial 2026">
                <div><strong>104</strong><span>partidos</span></div>
                <div><strong>48</strong><span>selecciones</span></div>
                <div><strong>12</strong><span>grupos</span></div>
              </div>
            </section>
          )}

          {/* ── Featured article (page 1 only) ── */}
          {featuredPost && (() => {
            const img          = getFeaturedImg(featuredPost);
            const authorData   = featuredPost._embedded?.author?.[0];
            const authorName   = (authorData?.name as string) ?? 'Redacción';
            const authorAvatar = (authorData?.avatar_urls?.['96'] as string | null) ?? null;
            const catName      = (featuredPost._embedded?.['wp:term']?.[0]?.[0]?.name as string) ?? category.name;
            const rawExcerpt   = stripHtml(featuredPost.excerpt?.rendered ?? '');
            const excerpt      = truncate(rawExcerpt, 180);
            const url          = `/${slug}/${featuredPost.slug}`;

            return (
              <a href={url} className="v1-feature" aria-label={stripHtml(featuredPost.title.rendered)}>
                {/* Image */}
                <div
                  className={`v1-feature-img${!img ? ' v1-no-img' : ''}`}
                  style={img ? {
                    backgroundImage: `linear-gradient(135deg,rgba(0,0,158,.35),rgba(10,115,206,.15)),url("${img}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } : undefined}
                >
                  <div className="v1-feature-img-tag">FOTOGRAFÍA · {(catName as string).toUpperCase()}</div>
                </div>

                {/* Content */}
                <div className="v1-feature-content">
                  <div className="v1-feature-tagrow">
                    <span className="chip chip-solid">DESTACADO</span>
                    <span className="chip chip-outline">{catName}</span>
                  </div>

                  <h2 className="v1-feature-title"
                    dangerouslySetInnerHTML={{ __html: featuredPost.title.rendered }} />

                  {excerpt && <p className="v1-feature-excerpt">{excerpt}</p>}

                  <div className="v1-feature-foot">
                    <div className="v1-author">
                      <div className="v1-avatar">
                        {authorAvatar
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={authorAvatar} alt={authorName} />
                          : getInitials(authorName)
                        }
                      </div>
                      <div>
                        <div className="v1-author-name">{authorName}</div>
                        <div className="v1-author-meta">{timeAgo(featuredPost.date)}</div>
                      </div>
                    </div>
                    <div className="v1-feature-actions">
                      <span className="v1-cta">Leer nota <span aria-hidden>→</span></span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })()}

          {/* ── Section heading ── */}
          {gridPosts.length > 0 && (
            <div className="v1-sec-head">
              <div>
                <div className="v1-sec-eyebrow">Más noticias</div>
                <h3 className="v1-sec-title">{sectionTitle}</h3>
              </div>
              <div className="v1-sec-actions">
                <button className="v1-tab active">Cuadrícula</button>
                <button className="v1-tab">Lista</button>
              </div>
            </div>
          )}

          {/* ── Article grid (6 cards) ── */}
          {gridPosts.length > 0 && (
            <div className="v1-grid">
              {gridPosts.map((post: any) => {
                const img          = getFeaturedImg(post);
                const authorData   = post._embedded?.author?.[0];
                const authorName   = (authorData?.name as string) ?? 'Redacción';
                const authorAvatar = (authorData?.avatar_urls?.['96'] as string | null) ?? null;
                const catName      = (post._embedded?.['wp:term']?.[0]?.[0]?.name as string) ?? category.name;
                return (
                  <a key={post.id} href={`/${slug}/${post.slug}`} className="v1-card-link">
                    <article className="v1-card">
                      <div
                        className={`v1-card-img${!img ? ' v1-no-img' : ''}`}
                        style={img ? {
                          backgroundImage: `linear-gradient(135deg,rgba(0,0,158,.18),rgba(10,115,206,.05)),url("${img}")`,
                        } : undefined}
                      />
                      <div className="v1-card-body">
                        <span className="v1-card-tag">{(catName as string).toUpperCase()}</span>
                        <h4 className="v1-card-title"
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                        <div className="v1-card-foot" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="v1-avatar" style={{ width: 24, height: 24, fontSize: 9 }}>
                            {authorAvatar
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={authorAvatar} alt={authorName} />
                              : getInitials(authorName)
                            }
                          </div>
                          <span>{authorName}</span>
                          <span className="dot-sep">·</span>
                          <span>{timeAgo(post.date)}</span>
                        </div>
                      </div>
                    </article>
                  </a>
                );
              })}
            </div>
          )}

          {/* ── Load more / count ── */}
          <div className="v1-load">
            {page < totalPages && (
              <a href={`/categoria/${slug}?page=${page + 1}`} className="v1-load-btn">
                Cargar más noticias →
              </a>
            )}
            <span className="v1-load-meta">
              Mostrando {shown.toLocaleString('es-CR')} de {total.toLocaleString('es-CR')} artículos
            </span>
          </div>

          {/* ── Numbered list ── */}
          {listPosts.length > 0 && (
            <>
              <div className="v1-list-head">
                <h3 className="v1-list-title">Más cobertura en {category.name}</h3>
                <div className="v1-list-meta">
                  <button className="v1-filter active">Recientes</button>
                  <button className="v1-filter">Más leídas</button>
                </div>
              </div>

              <div className="v1-list">
                {listPosts.map((post: any, i: number) => {
                  const img          = getFeaturedImg(post);
                  const authorData   = post._embedded?.author?.[0];
                  const authorName   = (authorData?.name as string) ?? 'Redacción';
                  const authorAvatar = (authorData?.avatar_urls?.['96'] as string | null) ?? null;
                  const catName      = (post._embedded?.['wp:term']?.[0]?.[0]?.name as string) ?? category.name;
                  return (
                    <a key={post.id} href={`/${slug}/${post.slug}`} className="v1-list-link">
                      <article className="v1-list-item">
                        <div className="v1-list-n">{String(i + 1).padStart(2, '0')}</div>
                        <div
                          className={`v1-list-thumb${!img ? ' v1-no-img' : ''}`}
                          style={img ? { backgroundImage: `url("${img}")` } : undefined}
                        />
                        <div className="v1-list-content">
                          <div className="v1-list-tag">{(catName as string).toUpperCase()}</div>
                          <h4 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                          <div className="v1-list-byline" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <div className="v1-avatar" style={{ width: 22, height: 22, fontSize: 8 }}>
                              {authorAvatar
                                // eslint-disable-next-line @next/next/no-img-element
                                ? <img src={authorAvatar} alt={authorName} />
                                : getInitials(authorName)
                              }
                            </div>
                            <span>{authorName}</span>
                            <span className="v1-list-dot" />
                            <span>{timeAgo(post.date)}</span>
                          </div>
                        </div>
                        <div className="v1-list-arrow" aria-hidden>→</div>
                      </article>
                    </a>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <nav className="v1-pager" aria-label="Paginación">
              {page > 1 && (
                <a href={`/categoria/${slug}?page=${page - 1}`} className="v1-page" aria-label="Página anterior">
                  ←
                </a>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                  if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('...');
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, idx) =>
                  n === '...'
                    ? <span key={`dots-${idx}`} className="v1-page-dots">…</span>
                    : <a key={n} href={`/categoria/${slug}?page=${n}`}
                        className={`v1-page${n === page ? ' active' : ''}`}
                        aria-label={`Página ${n}`}
                        aria-current={n === page ? 'page' : undefined}>
                        {n}
                      </a>
                )}

              {page < totalPages && (
                <a href={`/categoria/${slug}?page=${page + 1}`} className="v1-page-next">
                  Siguiente →
                </a>
              )}
            </nav>
          )}
        </main>

        {/* ══════════════════════════ SIDEBAR ══════════════════════════════ */}
        <aside className="v1-side">

          {/* Weather */}
          <div className="v1-weather">
            <div className="v1-weather-l">
              <div className="eyebrow" style={{ color: 'var(--ink-400)' }}>HOY · SAN JOSÉ</div>
              <div className="v1-weather-temp">
                {clima?.temp ?? '—'}<span>°C</span>
              </div>
              <div className="v1-weather-desc">{clima?.desc ?? 'Sin datos'}</div>
            </div>
            <div className="v1-weather-r">
              <div className="v1-weather-icon">{clima?.icon ?? '🌡️'}</div>
              <div className="v1-weather-sub">San José, CR</div>
            </div>
          </div>

          {/* Servicios de Economía — solo en la categoría economía */}
          {slug === 'economia' && (
            <div className="v1-trending">
              <div className="v1-trending-head">
                <h4>Servicios de economía</h4>
              </div>
              <a href="/tipo-de-cambio"
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 8, background: 'linear-gradient(135deg, #15803d, #0a73ce)', color: '#fff', marginBottom: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                <span style={{ fontSize: 18 }} aria-hidden="true">💵</span>
                <span>Tipo de cambio del dólar<br /><span style={{ fontWeight: 400, fontSize: 12, opacity: 0.85 }}>Dólar, euro y +12 monedas hoy</span></span>
              </a>
              <a href="/precio-combustibles"
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 8, background: 'linear-gradient(135deg, #b45309, #92400e)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                <span style={{ fontSize: 18 }} aria-hidden="true">⛽</span>
                <span>Precio de combustibles<br /><span style={{ fontWeight: 400, fontSize: 12, opacity: 0.85 }}>Gasolina y diésel vigentes</span></span>
              </a>
            </div>
          )}

          {/* Trending (últimas noticias) */}
          <div className="v1-trending">
            <div className="v1-trending-head">
              <h4>Últimas noticias</h4>
              <span className="eyebrow" style={{ color: 'var(--ink-400)' }}>AHORA</span>
            </div>
            {ultimas.map((post: any, i: number) => {
              const uSlug = (post._embedded?.['wp:term']?.[0]?.[0]?.slug as string) ?? 'nacionales';
              return (
                <a key={post.id} href={`/${uSlug}/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="v1-trend-item">
                    <span className="v1-trend-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="v1-trend-text"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  </div>
                </a>
              );
            })}
          </div>

          {/* Newsletter */}
          <div className="v1-newsletter">
            <div className="v1-news-icon">✉</div>
            <div className="v1-news-title">El resumen de {category.name}</div>
            <div className="v1-news-desc">
              Las noticias más importantes, cada mañana a las 7:00 a.m. Sin spam, prometido.
            </div>
            <div className="v1-news-input">
              <input type="email" placeholder="tu@correo.cr" aria-label="Correo electrónico" />
              <button type="button">Suscribir</button>
            </div>
            <div className="v1-news-small">+18,400 suscriptores · Acontecer.co.cr</div>
          </div>

          {/* Other categories */}
          <div className="v1-trending">
            <div className="v1-trending-head">
              <h4>Otras secciones</h4>
            </div>
            {Object.entries(CATEGORY_META)
              .filter(([k]) => k !== slug)
              .slice(0, 5)
              .map(([k, v]) => (
                <a key={k} href={`/categoria/${k}`} style={{ textDecoration: 'none' }}>
                  <div className="v1-trend-item">
                    <span className="v1-trend-num" style={{ fontSize: 12, width: 'auto', paddingRight: 4 }}>→</span>
                    <span className="v1-trend-text" style={{ fontWeight: 600 }}>
                      {v.eyebrow[v.eyebrow.length - 1]}
                    </span>
                  </div>
                </a>
              ))}
          </div>

          {/* Social / redes — iconos SVG de marca reales */}
          <div className="v1-trending">
            <div className="v1-trending-head">
              <h4>Síguenos</h4>
            </div>
            <a href="https://facebook.com/Acontecer.co.cr" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: '#1877f2', color: '#fff', marginBottom: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
              <svg viewBox="0 0 24 24" fill="#fff" style={{ width: 18, height: 18, flexShrink: 0 }} aria-hidden="true"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.029H9.101z"/></svg>
              Facebook
            </a>
            <a href="https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: '#25d366', color: '#fff', marginBottom: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
              <svg viewBox="0 0 24 24" fill="#fff" style={{ width: 18, height: 18, flexShrink: 0 }} aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Canal WhatsApp
            </a>
            <a href="https://youtube.com/@acontecercocr" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: '#ff0000', color: '#fff', marginBottom: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
              <svg viewBox="0 0 24 24" fill="#fff" style={{ width: 18, height: 18, flexShrink: 0 }} aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              YouTube
            </a>
            <a href="https://tiktok.com/@acontecer.co.cr" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: '#111', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
              <svg viewBox="0 0 24 24" fill="#fff" style={{ width: 18, height: 18, flexShrink: 0 }} aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.08-.14 1.62.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              TikTok
            </a>
          </div>

          {/* Ad block */}
          <div className="v1-ad">
            <div className="v1-ad-eyebrow">ESPACIO PUBLICITARIO</div>
            <div className="v1-ad-title">Llegamos a +15 millones de personas cada mes</div>
            <a href="/pauta" className="v1-ad-btn">Contáctenos</a>
          </div>
        </aside>
      </div>
    </>
  );
}
