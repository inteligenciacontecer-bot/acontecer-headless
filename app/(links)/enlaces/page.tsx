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
const BASE = 'https://acontecer.co.cr';

interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  categories: number[];
  _embedded?: { 'wp:term'?: Array<Array<{ slug: string; name: string }>> };
}
interface WPCat { id: number; slug: string }

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
      const title = p.title.rendered.replace(/<[^>]+>/g, '').trim();
      return { title, url: `${BASE}/${catSlug}/${p.slug}` };
    });
  } catch {
    return [];
  }
}

// ── Botones estratégicos fijos ────────────────────────────────────────────────
const LINKS_FIJOS = [
  {
    href: '/asamblea',
    icon: '🏛️',
    label: 'Monitor Legislativo',
    sublabel: 'Diputados, votaciones y expedientes en tiempo real',
    variant: 'primary' as const,
  },
  {
    href: 'https://www.whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S',
    icon: '💬',
    label: 'Únete a nuestra comunidad',
    sublabel: 'Canal oficial de Acontecer en WhatsApp',
    variant: 'whatsapp' as const,
    external: true,
  },
  {
    href: '/pauta',
    icon: '📢',
    label: 'Publicidad y Pauta',
    sublabel: 'Llegue a miles de lectores en Costa Rica',
    variant: 'secondary' as const,
  },
  {
    href: '/contacto',
    icon: '✉️',
    label: 'Contacto y Redacción',
    sublabel: 'Columnas de opinión y comunicados de prensa',
    variant: 'secondary' as const,
  },
];

export default async function EnlacesPage() {
  const noticias = await getLatestPosts();

  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#050520" />
        <link rel="icon" href="/favicon.ico" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background: #050520;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            min-height: 100dvh;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .page {
            width: 100%;
            max-width: 480px;
            padding: 32px 18px 48px;
            display: flex;
            flex-direction: column;
            gap: 0;
          }

          /* ── Logo y Header ── */
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

          /* ── Botón base ── */
          .btn {
            display: flex;
            align-items: center;
            gap: 14px;
            width: 100%;
            padding: 14px 18px;
            border-radius: 14px;
            text-decoration: none;
            margin-bottom: 10px;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
            -webkit-tap-highlight-color: transparent;
            position: relative;
            overflow: hidden;
          }
          .btn:active { transform: scale(0.97); }

          /* Primary — gradiente celeste→azul con glow */
          .btn-primary {
            background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
            box-shadow: 0 4px 20px rgba(0,198,255,0.35);
            color: white;
          }
          .btn-primary::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
            border-radius: inherit;
          }

          /* WhatsApp */
          .btn-whatsapp {
            background: linear-gradient(135deg, #00c853 0%, #007c34 100%);
            box-shadow: 0 4px 20px rgba(0,200,83,0.3);
            color: white;
          }
          .btn-whatsapp::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
            border-radius: inherit;
          }

          /* Secondary — vidrio oscuro con borde celeste */
          .btn-secondary {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(0,198,255,0.25);
            color: rgba(255,255,255,0.92);
          }
          .btn-secondary:hover { background: rgba(0,198,255,0.08); border-color: rgba(0,198,255,0.5); }

          /* News — vidrio oscuro con borde lateral celeste */
          .btn-news {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-left: 3px solid #00c6ff;
            color: rgba(255,255,255,0.88);
            padding: 12px 16px;
            border-radius: 10px;
            align-items: flex-start;
          }
          .btn-news:hover { background: rgba(0,198,255,0.07); }

          .btn-icon {
            font-size: 22px;
            flex-shrink: 0;
            width: 28px;
            text-align: center;
            position: relative;
          }
          .btn-text { flex: 1; position: relative; }
          .btn-label {
            font-size: 15px;
            font-weight: 700;
            line-height: 1.3;
            display: block;
          }
          .btn-sublabel {
            font-size: 11.5px;
            opacity: 0.7;
            display: block;
            margin-top: 2px;
            font-weight: 400;
          }
          .btn-news .btn-label { font-size: 14px; font-weight: 600; }
          .btn-arrow {
            flex-shrink: 0;
            opacity: 0.4;
            font-size: 14px;
            position: relative;
          }

          /* ── Separador de sección ── */
          .section-sep {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 8px 0 14px;
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

          /* ── Footer ── */
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
      </head>
      <body>
        <div className="page">

          {/* ── Perfil ── */}
          <div className="profile">
            <div className="logo-wrap">
              <img src="/icon.png" alt="Acontecer.co.cr" width={96} height={96} />
            </div>
            <div className="profile-name">Acontecer.co.cr</div>
            <div className="profile-tag">El medio digital independiente de Costa Rica</div>
          </div>

          {/* ── Botones estratégicos ── */}
          {LINKS_FIJOS.map(link => (
            <a
              key={link.href}
              href={link.external ? link.href : `${BASE}${link.href}`}
              className={`btn btn-${link.variant}`}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className="btn-icon">{link.icon}</span>
              <span className="btn-text">
                <span className="btn-label">{link.label}</span>
                <span className="btn-sublabel">{link.sublabel}</span>
              </span>
              <span className="btn-arrow">›</span>
            </a>
          ))}

          {/* ── Noticias recientes ── */}
          {noticias.length > 0 && (
            <>
              <div className="section-sep">
                <div className="section-sep-line" />
                <span className="section-sep-label">📰 Últimas noticias</span>
                <div className="section-sep-line" />
              </div>

              {noticias.map((n, i) => (
                <a key={i} href={n.url} className="btn btn-news">
                  <span className="btn-text">
                    <span className="btn-label">{n.title}</span>
                  </span>
                  <span className="btn-arrow">›</span>
                </a>
              ))}
            </>
          )}

          {/* ── Footer ── */}
          <div className="page-footer">
            <div className="social-row">
              <a href="https://facebook.com/Acontecer.co.cr" target="_blank" rel="noopener" className="social-btn">📘 Facebook</a>
              <a href="https://youtube.com/@acontecercocr" target="_blank" rel="noopener" className="social-btn">▶ YouTube</a>
              <a href="https://tiktok.com/@acontecer.co.cr" target="_blank" rel="noopener" className="social-btn">🎵 TikTok</a>
            </div>
            <div className="footer-copy">© {new Date().getFullYear()} Acontecer.co.cr</div>
          </div>

        </div>
      </body>
    </html>
  );
}
