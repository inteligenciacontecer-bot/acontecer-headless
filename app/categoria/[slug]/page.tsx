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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: 'Categoría no encontrada' };
  const meta  = CATEGORY_META[slug];
  const title = (SEO_LABELS[slug] ?? category.name) + ' | Acontecer.co.cr';
  const desc  = category.description ? stripHtml(category.description) : meta?.lede ?? `Noticias de ${category.name} en Acontecer.co.cr`;
  return {
    title,
    description: desc,
    alternates:  { canonical: `https://acontecer.co.cr/categoria/${slug}` },
    openGraph:   { title, description: desc, url: `https://acontecer.co.cr/categoria/${slug}`, type: 'website' },
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
      {/* ── Schema ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio',       item: 'https://acontecer.co.cr' },
          { '@type': 'ListItem', position: 2, name: category.name,  item: `https://acontecer.co.cr/categoria/${slug}` },
        ],
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

          {/* Social / redes */}
          <div className="v1-trending">
            <div className="v1-trending-head">
              <h4>Síguenos</h4>
            </div>
            <a href="https://facebook.com/Acontecer.co.cr" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: '#1877f2', color: '#fff', marginBottom: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
              📘 Facebook
            </a>
            <a href="https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: '#25d366', color: '#fff', marginBottom: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
              📱 Canal WhatsApp
            </a>
            <a href="https://youtube.com/@acontecercocr" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: '#ff0000', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
              ▶ YouTube
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
