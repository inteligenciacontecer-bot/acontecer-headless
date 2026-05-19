import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acontecer.co.cr — Links',
  description: 'Noticias, Monitor Legislativo y contacto directo con Acontecer.co.cr, el medio digital independiente de Costa Rica.',
  alternates: { canonical: 'https://acontecer.co.cr/enlaces' },
  openGraph: {
    title: 'Acontecer.co.cr',
    description: 'El medio digital independiente de Costa Rica.',
    url: 'https://acontecer.co.cr/enlaces',
    images: [{ url: '/icon.png', width: 225, height: 225 }],
  },
};

// ISR: revalida cada 5 minutos — noticias frescas sin costo de SSR por request
export const revalidate = 300;

const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  categories: number[];
  _embedded?: { 'wp:term'?: Array<Array<{ slug: string; name: string }>> };
}
interface WPCat { id: number; slug: string }

function decodeTitle(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

async function getLatestPosts(): Promise<{ title: string; url: string }[]> {
  try {
    const [postsRes, catsRes] = await Promise.all([
      fetch(`${API}/posts?per_page=12&_embed=wp:term&_fields=id,slug,title,categories`, {
        next: { revalidate: 300 },
      }),
      fetch(`${API}/categories?per_page=50&_fields=id,slug`, {
        next: { revalidate: 3600 },
      }),
    ]);
    if (!postsRes.ok) return [];
    const posts: WPPost[] = await postsRes.json();
    const cats: WPCat[] = catsRes.ok ? await catsRes.json() : [];
    const catMap: Record<number, string> = {};
    cats.forEach(c => { catMap[c.id] = c.slug; });

    return posts.map(p => {
      const catSlug =
        p._embedded?.['wp:term']?.[0]?.[0]?.slug ||
        catMap[p.categories?.[0]] ||
        'nacionales';
      const title = decodeTitle(p.title.rendered);
      return { title, url: `/${catSlug}/${p.slug}` };
    });
  } catch {
    return [];
  }
}

export default async function EnlacesPage() {
  const noticias = await getLatestPosts();
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .links-wrap {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        .links-page {
          width: 100%;
          max-width: 480px;
          padding: 32px 18px 48px;
          display: flex;
          flex-direction: column;
        }

        /* Profile */
        .profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          margin-bottom: 32px;
        }
        .logo-wrap {
          width: 96px;
          height: 96px;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 0 0 3px rgba(0,212,255,0.4), 0 0 32px rgba(0,212,255,0.25);
        }
        .logo-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .profile-name {
          font-family: 'Georgia', serif;
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.3px;
        }
        .profile-tag {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin-top: -8px;
        }

        /* News items */
        .btn-news {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-left: 3px solid #00c6ff;
          color: rgba(255,255,255,0.88);
          border-radius: 10px;
          text-decoration: none;
          margin-bottom: 10px;
          transition: background 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-news:hover { background: rgba(0,198,255,0.07); }
        .btn-news:active { transform: scale(0.97); }
        .btn-text { flex: 1; min-width: 0; }
        .btn-label {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.4;
          display: block;
        }
        .btn-arrow {
          flex-shrink: 0;
          opacity: 0.4;
          font-size: 14px;
          padding-top: 2px;
        }

        /* Section separator */
        .section-sep {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 14px;
        }
        .section-sep-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }
        .section-sep-label {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.35);
        }

        /* Footer */
        .page-footer {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .social-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .social-btn {
          padding: 7px 14px;
          border-radius: 20px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7);
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
        }
        .footer-copy {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
        }
      `}</style>
      <div className="links-wrap">
        <div className="links-page">

          {/* Profile */}
          <div className="profile">
            <div className="logo-wrap">
              <img src="/icon.png" alt="Acontecer.co.cr" width={96} height={96} />
            </div>
            <div className="profile-name">Acontecer.co.cr</div>
            <div className="profile-tag">El medio digital independiente de Costa Rica</div>
          </div>

          {/* Latest news */}
          {noticias.length > 0 && (
            <>
              <div className="section-sep">
                <div className="section-sep-line" />
                <span className="section-sep-label">Últimas noticias</span>
                <div className="section-sep-line" />
              </div>

              {noticias.map((n, i) => (
                <a key={i} href={n.url} className="btn-news">
                  <span className="btn-text">
                    <span className="btn-label">{n.title}</span>
                  </span>
                  <span className="btn-arrow">›</span>
                </a>
              ))}
            </>
          )}

          {/* Footer */}
          <div className="page-footer">
            <div className="social-row">
              <a href="https://facebook.com/Acontecer.co.cr" target="_blank" rel="noopener" className="social-btn">Facebook</a>
              <a href="https://youtube.com/@acontecercocr" target="_blank" rel="noopener" className="social-btn">YouTube</a>
              <a href="https://tiktok.com/@acontecer.co.cr" target="_blank" rel="noopener" className="social-btn">TikTok</a>
            </div>
            <div className="footer-copy">© {year} Acontecer.co.cr</div>
          </div>

        </div>
      </div>
    </>
  );
}
