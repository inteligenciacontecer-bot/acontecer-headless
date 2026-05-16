import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import './autor.css';

const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const PER_PAGE = 9; // 1 destacada + 8 en grid

/* ── Metadata ─────────────────────────────────────────────────────── */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetch(API + '/users?slug=' + slug, { next: { revalidate: 3600 } });
  const users = await res.json().catch(() => []);
  const author = Array.isArray(users) ? users[0] : null;
  if (!author) return { title: 'Autor | Acontecer.co.cr' };
  const avatarUrl = author.avatar_urls?.['96'] || null;
  return {
    title: `${author.name} — Periodista | Acontecer.co.cr`,
    description: author.description
      ? author.description.slice(0, 155)
      : `Artículos escritos por ${author.name} en Acontecer.co.cr, el medio digital independiente de Costa Rica.`,
    alternates: { canonical: `https://acontecer.co.cr/autor/${slug}` },
    openGraph: {
      url: `https://acontecer.co.cr/autor/${slug}`,
      images: avatarUrl ? [{ url: avatarUrl }] : [],
    },
    twitter: {
      card: 'summary',
      title: `${author.name} | Acontecer.co.cr`,
    },
  };
}

/* ── Helpers ─────────────────────────────────────────────────────── */
function decodeHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .trim();
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
}

/* ── Data fetching ───────────────────────────────────────────────── */
async function getAuthor(slug: string) {
  const res = await fetch(API + '/users?slug=' + slug, { next: { revalidate: 3600 } });
  const users = await res.json().catch(() => []);
  return Array.isArray(users) ? users[0] : null;
}

async function getAuthorPosts(authorId: number, page: number) {
  const res = await fetch(
    `${API}/posts?author=${authorId}&per_page=${PER_PAGE}&page=${page}&_embed`,
    { next: { revalidate: 60 } }
  );
  const posts = await res.json().catch(() => []);
  return {
    posts: Array.isArray(posts) ? posts : [],
    totalPages: parseInt(res.headers.get('X-WP-TotalPages') || '1', 10),
    total: parseInt(res.headers.get('X-WP-Total') || '0', 10),
  };
}

const FIXED_AUTHORS = [1, 4, 27, 39]; // Redacción · Carlos Valencia · Glenn Hernández · Brandon Segura

async function getRelatedAuthors(currentId: number) {
  const include = FIXED_AUTHORS.filter(id => id !== currentId).join(',');
  if (!include) return [];
  const res = await fetch(`${API}/users?include=${include}&per_page=4`, {
    next: { revalidate: 3600 },
  });
  const users = await res.json().catch(() => []);
  // Reordenar según el orden fijo original
  const order = FIXED_AUTHORS.filter(id => id !== currentId);
  return (Array.isArray(users) ? users : []).sort(
    (a: any, b: any) => order.indexOf(a.id) - order.indexOf(b.id)
  );
}

/* ── SVG Icons ───────────────────────────────────────────────────── */
const IcWA = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.88 11.9L4 20l4.2-1.1a7.93 7.93 0 0 0 3.84.98h.01a7.94 7.94 0 0 0 7.94-7.92 7.88 7.88 0 0 0-2.39-5.64zm-5.55 12.21h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.49.65.66-2.43-.16-.25a6.6 6.6 0 0 1-1.01-3.51 6.62 6.62 0 0 1 11.3-4.68 6.58 6.58 0 0 1 1.94 4.68 6.62 6.62 0 0 1-6.63 6.6zm3.62-4.94c-.2-.1-1.17-.58-1.35-.65-.18-.07-.31-.1-.45.1-.13.2-.51.65-.62.78-.12.13-.23.15-.42.05-.2-.1-.84-.31-1.6-.99-.6-.53-1-1.18-1.12-1.38-.12-.2-.01-.31.09-.4.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34-.12-.01-.25-.01-.39-.01a.75.75 0 0 0-.54.25c-.18.2-.7.69-.7 1.67 0 .99.72 1.94.82 2.07.1.13 1.42 2.16 3.43 3.03.48.21.85.33 1.14.42.48.15.92.13 1.26.08.39-.06 1.17-.48 1.34-.94.16-.46.16-.86.12-.94-.05-.08-.18-.13-.38-.23z" />
  </svg>
);
const IcVerified = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L14.5 4.5L18 4L19 7.5L22 9L21 12.5L22 16L19 17.5L18 21L14.5 21L12 23L9.5 21L6 21L5 17.5L2 16L3 12.5L2 9L5 7.5L6 4L9.5 4.5L12 2Z" fill="#0a73ce" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 12L11 15L16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcSort = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18M6 12h12M10 18h4" />
  </svg>
);

/* ── Page ────────────────────────────────────────────────────────── */
export default async function AutorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10));

  const author = await getAuthor(slug);
  if (!author) return notFound();

  const [{ posts, totalPages, total }, relatedAuthors] = await Promise.all([
    getAuthorPosts(author.id, page),
    getRelatedAuthors(author.id),
  ]);

  /* Topics: top categorías de los artículos cargados */
  const topicMap = new Map<string, { name: string; slug: string; count: number }>();
  for (const post of posts) {
    const cats = (post._embedded?.['wp:term']?.[0] || []) as any[];
    for (const cat of cats) {
      if (!cat || cat.slug === 'uncategorized') continue;
      const ex = topicMap.get(cat.slug);
      if (ex) ex.count++;
      else topicMap.set(cat.slug, { name: cat.name, slug: cat.slug, count: 1 });
    }
  }
  const topics = [...topicMap.values()].sort((a, b) => b.count - a.count).slice(0, 8);

  /* Avatar: pedir tamaño 280 al Gravatar */
  const avatarUrl = author.avatar_urls?.['96']
    ? (author.avatar_urls['96'] as string).replace('s=96', 's=280').replace('s%3D96', 's%3D280')
    : null;

  const initials = getInitials(author.name || '');
  const firstName = (author.name as string || '').split(' ')[0];
  const shareUrl = `https://acontecer.co.cr/autor/${slug}`;

  const featured = posts[0] || null;
  const grid = posts.slice(1);

  /* ── Render ────────────────────────────────────────────────────── */
  return (
    <div className="ap-wrap">

      {/* SCHEMA — Person enriquecido (E-E-A-T: autoridad del autor) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': shareUrl + '#person',
          name: author.name,
          url: shareUrl,
          mainEntityOfPage: shareUrl,
          image: avatarUrl ? {
            '@type': 'ImageObject',
            url: avatarUrl,
            caption: author.name,
          } : undefined,
          description: author.description || undefined,
          jobTitle: 'Periodista',
          knowsAbout: topics.length > 0
            ? topics.map(t => t.name)
            : ['Noticias Costa Rica', 'Periodismo digital'],
          worksFor: {
            '@type': 'NewsMediaOrganization',
            name: 'Acontecer.co.cr',
            url: 'https://acontecer.co.cr',
            logo: 'https://acontecer.co.cr/logo.png',
          },
          nationality: { '@type': 'Country', name: 'Costa Rica' },
        }),
      }} />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="ap-hero">
        <div className="ap-hero-bg" aria-hidden="true" />
        <div className="ap-hero-grid-pattern" aria-hidden="true" />
        <div className="ap-blob ap-blob-1" aria-hidden="true" />
        <div className="ap-blob ap-blob-2" aria-hidden="true" />

        <div className="ap-hero-inner">
          {/* Breadcrumb */}
          <nav className="ap-breadcrumb" aria-label="Ruta de navegación">
            <a href="/">ACONTECER</a>
            <span className="ap-sep" aria-hidden="true">/</span>
            <span>REDACCIÓN</span>
            <span className="ap-sep" aria-hidden="true">/</span>
            <span aria-current="page">{(author.name as string).toUpperCase()}</span>
          </nav>

          <div className="ap-hero-cols">
            {/* Columna izquierda: info */}
            <div className="ap-hero-left">
              <div className="ap-eyebrow-row">
                <span className="ap-role-pill">Periodista · Acontecer.co.cr</span>
                <span className="ap-verified">
                  <IcVerified />
                  Periodista verificado
                </span>
              </div>

              <h1 className="ap-name">{author.name}</h1>

              {author.description && (
                <p className="ap-bio">{author.description}</p>
              )}

              {/* Stats */}
              <div className="ap-stats-row">
                <div className="ap-stat">
                  <div className="ap-stat-n">{total}</div>
                  <div className="ap-stat-l">notas publicadas</div>
                </div>
                <div className="ap-divider-v" aria-hidden="true" />
                <div className="ap-stat">
                  <div className="ap-stat-n">Acontecer</div>
                  <div className="ap-stat-l">medio editorial</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="ap-cta-row">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Seguí las notas de ${author.name} en Acontecer: ${shareUrl}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="ap-cta-ghost"
                >
                  <IcWA /> Compartir
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Siguiendo a ${author.name} en @acontecercocr`)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="ap-soc"
                  aria-label="Compartir en X / Twitter"
                >𝕏</a>
              </div>
            </div>

            {/* Columna derecha: avatar + cita */}
            <div className="ap-hero-right">
              <div className="ap-avatar-wrap">
                <div className="ap-avatar-ring" aria-hidden="true" />
                {avatarUrl
                  ? <img src={avatarUrl} alt={author.name} className="ap-avatar ap-avatar-img" />
                  : <div className="ap-avatar ap-avatar-init" aria-label={author.name}>{initials}</div>
                }
                <div className="ap-avatar-badge" aria-hidden="true">
                  <span className="ap-live-dot" />
                  EN ACTIVO
                </div>
              </div>

              {author.description && (
                <div className="ap-quote">
                  <span className="ap-quote-mark" aria-hidden="true">&ldquo;</span>
                  <p>{author.description.split('.')[0].trim() + '.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Sticky subnav ────────────────────────────────────────── */}
      <nav className="ap-subnav" aria-label="Filtros de publicaciones">
        <div className="ap-subnav-inner">
          <div className="ap-subnav-pills">
            <span className="ap-pill ap-pill-active" aria-current="page">
              Todo <span className="ap-pill-n">{total}</span>
            </span>
          </div>
          <span className="ap-sort-lbl">
            <IcSort /> Más recientes
          </span>
        </div>
      </nav>

      {/* ─── Body ─────────────────────────────────────────────────── */}
      <div className="ap-body">
        <main className="ap-main">

          {/* Nota destacada */}
          {featured && (() => {
            const fImg = featured._embedded?.['wp:featuredmedia']?.[0]?.source_url as string | undefined;
            const fCat = featured._embedded?.['wp:term']?.[0]?.[0] as any;
            const fTitle = decodeHtml(featured.title?.rendered || '');
            const fExcerpt = decodeHtml(featured.excerpt?.rendered || '').slice(0, 200);
            const fHref = `/${fCat?.slug || 'nacionales'}/${featured.slug}`;
            const fDate = new Date(featured.date).toLocaleDateString('es-CR', { day: 'numeric', month: 'long' });
            const fWords = (featured.content?.rendered || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
            const fRead = Math.max(1, Math.ceil(fWords / 200));
            return (
              <article className="ap-featured">
                <a href={fHref} className="ap-featured-link" aria-label={fTitle}>
                  <div
                    className="ap-featured-img"
                    style={fImg ? {
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,158,.15) 0%, rgba(0,0,158,.6) 100%), url("${fImg}")`,
                    } : undefined}
                  >
                    <span className="ap-featured-pill">⚡ Nota destacada</span>
                    <div className="ap-featured-content">
                      <div className="ap-featured-tags">
                        {fCat && <span className="ap-chip-solid">{fCat.name.toUpperCase()}</span>}
                        <span className="ap-chip-outline">{fDate}</span>
                      </div>
                      <h2 className="ap-featured-title">{fTitle}</h2>
                      {fExcerpt && <p className="ap-featured-excerpt">{fExcerpt}</p>}
                      <div className="ap-featured-foot">
                        <span className="ap-featured-meta">{fRead} min lectura</span>
                        <span className="ap-featured-btn">Leer nota →</span>
                      </div>
                    </div>
                  </div>
                </a>
              </article>
            );
          })()}

          {/* Encabezado de sección */}
          <div className="ap-sec-head">
            <div>
              <div className="ap-eyebrow-small">Archivo</div>
              <h3 className="ap-sec-title">Todas las publicaciones de {firstName}</h3>
            </div>
          </div>

          {/* Grid numerado 2×n */}
          <div className="ap-grid">
            {grid.map((post: any, i: number) => {
              const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url as string | undefined;
              const cat = post._embedded?.['wp:term']?.[0]?.[0] as any;
              const title = decodeHtml(post.title?.rendered || '');
              const excerpt = decodeHtml(post.excerpt?.rendered || '').slice(0, 120);
              const href = `/${cat?.slug || 'nacionales'}/${post.slug}`;
              const date = new Date(post.date).toLocaleDateString('es-CR', { day: 'numeric', month: 'short' });
              const words = (post.content?.rendered || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
              const readTime = Math.max(1, Math.ceil(words / 200));
              return (
                <a key={post.id} href={href} className="ap-card">
                  <span className="ap-card-num">{String(i + 2).padStart(2, '0')}</span>
                  <div
                    className="ap-card-img"
                    style={img ? { backgroundImage: `url("${img}")` } : undefined}
                  >
                    {cat && <span className="ap-card-tag">{cat.name.toUpperCase()}</span>}
                  </div>
                  <div className="ap-card-body">
                    <h4 className="ap-card-title">{title}</h4>
                    {excerpt && <p className="ap-card-excerpt">{excerpt}</p>}
                    <div className="ap-card-foot">
                      <span>{date}</span>
                      <span className="ap-dot" aria-hidden="true" />
                      <span>{readTime} min</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="ap-pager">
              {page > 1
                ? <a href={`/autor/${slug}?page=${page - 1}`} className="ap-page-prev" aria-label="Página anterior">← Anterior</a>
                : <span className="ap-page-prev ap-disabled" aria-disabled="true">← Anterior</span>
              }
              <div className="ap-pager-nums">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                  .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                    if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('...');
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, idx) =>
                    n === '...'
                      ? <span key={`e-${idx}`} className="ap-dots">…</span>
                      : <a
                          key={n}
                          href={`/autor/${slug}?page=${n}`}
                          className={`ap-pg${n === page ? ' ap-pg-active' : ''}`}
                          aria-current={n === page ? 'page' : undefined}
                        >{n}</a>
                  )}
              </div>
              {page < totalPages
                ? <a href={`/autor/${slug}?page=${page + 1}`} className="ap-page-next" aria-label="Página siguiente">Siguiente →</a>
                : <span className="ap-page-next ap-disabled" aria-disabled="true">Siguiente →</span>
              }
            </div>
          )}

          <p className="ap-pager-meta">
            Mostrando <strong>{posts.length}</strong> de <strong>{total}</strong> publicaciones · Ordenadas por fecha
          </p>
        </main>

        {/* ─── Sidebar ──────────────────────────────────────────── */}
        <aside className="ap-side">

          {/* Más autores */}
          {relatedAuthors.length > 0 && (
            <div className="ap-side-block">
              <div className="ap-side-head">
                <h4 className="ap-side-title">Más autores</h4>
                <a href="/autores" className="ap-side-link">Ver todos →</a>
              </div>
              <div className="ap-author-grid">
                {relatedAuthors.map((ra: any) => {
                  const raAvatar = ra.avatar_urls?.['96']
                    ? (ra.avatar_urls['96'] as string).replace('s=96', 's=160').replace('s%3D96', 's%3D160')
                    : null;
                  const raInitials = getInitials(ra.name || '');
                  return (
                    <a key={ra.id} href={`/autor/${ra.slug}`} className="ap-author-card">
                      <div className="ap-author-card-photo" style={raAvatar ? { backgroundImage: `url("${raAvatar}")` } : undefined}>
                        {!raAvatar && <span className="ap-author-card-init">{raInitials}</span>}
                      </div>
                      <div className="ap-author-card-info">
                        <div className="ap-author-card-name">{ra.name}</div>
                        <div className="ap-author-card-role">Redacción</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* WhatsApp CTA */}
          <div className="ap-wa">
            <div className="ap-wa-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.88 11.9L4 20l4.2-1.1a7.93 7.93 0 0 0 3.84.98h.01a7.94 7.94 0 0 0 7.94-7.92 7.88 7.88 0 0 0-2.39-5.64zm-5.55 12.21h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.49.65.66-2.43-.16-.25a6.6 6.6 0 0 1-1.01-3.51 6.62 6.62 0 0 1 11.3-4.68 6.58 6.58 0 0 1 1.94 4.68 6.62 6.62 0 0 1-6.63 6.6zm3.62-4.94c-.2-.1-1.17-.58-1.35-.65-.18-.07-.31-.1-.45.1-.13.2-.51.65-.62.78-.12.13-.23.15-.42.05-.2-.1-.84-.31-1.6-.99-.6-.53-1-1.18-1.12-1.38-.12-.2-.01-.31.09-.4.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34-.12-.01-.25-.01-.39-.01a.75.75 0 0 0-.54.25c-.18.2-.7.69-.7 1.67 0 .99.72 1.94.82 2.07.1.13 1.42 2.16 3.43 3.03.48.21.85.33 1.14.42.48.15.92.13 1.26.08.39-.06 1.17-.48 1.34-.94.16-.46.16-.86.12-.94-.05-.08-.18-.13-.38-.23z" />
              </svg>
            </div>
            <div className="ap-wa-title">Recibí noticias por WhatsApp</div>
            <div className="ap-wa-desc">Canal oficial de Acontecer. Te llegan en cuanto se publican, sin spam ni grupos.</div>
            <a
              href="https://whatsapp.com/channel/0029VatPp3wEfeyvk2DUSK3B"
              target="_blank" rel="noopener noreferrer"
              className="ap-wa-btn"
            >
              <IcWA /> Unirme al canal
            </a>
            <div className="ap-wa-meta">+18,400 personas ya suscritas</div>
          </div>

          {/* Topics */}
          {topics.length > 0 && (
            <div className="ap-side-block">
              <div className="ap-side-head">
                <h4 className="ap-side-title">Sobre qué escribe {firstName}</h4>
              </div>
              <div className="ap-topic-chips">
                {topics.map(t => (
                  <a key={t.name} href={`/categoria/${t.slug}`} className="ap-topic-chip">
                    #{t.name}
                    <span className="ap-topic-n">{t.count}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
}
