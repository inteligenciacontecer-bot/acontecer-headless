import type { Metadata } from 'next';
import './not-found.css';

const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

export const metadata: Metadata = {
  title: 'Página no encontrada — 404',
  description: 'La página que buscás no existe o fue movida. Acá tenés las últimas noticias de Costa Rica.',
  robots: { index: false, follow: true },
};

/* ── Helpers ─────────────────────────────────────────────────────────── */
function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#8220;|&#8221;/g, '"').replace(/&#8217;/g, "'")
    .trim();
}
function cmsToLocal(u?: string | null): string | null {
  return u ? u.replace(/^https?:\/\/cms\.acontecer\.co\.cr\//i, 'https://acontecer.co.cr/') : null;
}

/* ── Data fetching ───────────────────────────────────────────────────── */
async function getUltimas() {
  try {
    const res = await fetch(`${API}/posts?per_page=6&_embed`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

const CATEGORIAS = [
  { slug: 'nacionales',      name: 'Nacionales' },
  { slug: 'internacionales', name: 'Internacionales' },
  { slug: 'deportes',        name: 'Deportes' },
  { slug: 'economia',        name: 'Economía' },
  { slug: 'opinion',         name: 'Opinión' },
  { slug: 'tecnologia',      name: 'Tecnología' },
  { slug: 'entretenimiento', name: 'Entretenimiento' },
  { slug: 'salud',           name: 'Salud' },
];

/* ── Page ────────────────────────────────────────────────────────────── */
export default async function NotFound() {
  const ultimas = await getUltimas();

  return (
    <main className="nf-wrap">
      {/* HERO 404 */}
      <section className="nf-hero">
        <div className="nf-hero-bg" aria-hidden="true" />
        <div className="nf-hero-grid" aria-hidden="true" />
        <div className="nf-hero-inner">
          <div className="nf-eyebrow">ERROR · 404</div>
          <h1 className="nf-title">
            La página que buscás <span className="nf-title-em">no existe</span>
          </h1>
          <p className="nf-lede">
            Puede que haya sido movida, eliminada o que la dirección esté mal escrita.
            Mientras tanto, acá tenés las últimas noticias de Costa Rica.
          </p>

          {/* BUSCADOR */}
          <form action="/buscar" method="GET" className="nf-search" role="search">
            <svg className="nf-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="search"
              name="q"
              placeholder="Buscar noticias, diputados, temas…"
              aria-label="Buscar en Acontecer"
              autoComplete="off"
              required
              minLength={2}
            />
            <button type="submit">Buscar</button>
          </form>

          <div className="nf-cta-row">
            <a href="/" className="nf-cta-primary">← Volver al inicio</a>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="nf-body">
        {/* Categorías */}
        <div className="nf-cats">
          <h2 className="nf-section-title">Explorá por sección</h2>
          <div className="nf-cats-row">
            {CATEGORIAS.map(c => (
              <a key={c.slug} href={`/categoria/${c.slug}`} className="nf-cat-chip">
                {c.name}
              </a>
            ))}
          </div>
        </div>

        {/* Últimas */}
        {ultimas.length > 0 && (
          <div className="nf-ultimas">
            <h2 className="nf-section-title">Últimas noticias</h2>
            <div className="nf-ultimas-grid">
              {ultimas.map((p: any) => {
                const cat = p._embedded?.['wp:term']?.[0]?.[0];
                const catSlug = cat?.slug || 'nacionales';
                const catName = cat?.name || 'Nacionales';
                const img = cmsToLocal(p._embedded?.['wp:featuredmedia']?.[0]?.source_url);
                const titulo = stripHtml(p.title?.rendered ?? '');
                const fecha = new Date(p.date).toLocaleDateString('es-CR', {
                  day: 'numeric', month: 'short',
                });
                return (
                  <a key={p.id} href={`/${catSlug}/${p.slug}`} className="nf-card">
                    <div
                      className="nf-card-img"
                      style={img ? { backgroundImage: `url("${img}")` } : { background: 'linear-gradient(135deg,#00007a,#0000A2)' }}
                    />
                    <div className="nf-card-body">
                      <div className="nf-card-cat">{catName.toUpperCase()}</div>
                      <h3 className="nf-card-title">{titulo}</h3>
                      <div className="nf-card-date">{fecha}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
