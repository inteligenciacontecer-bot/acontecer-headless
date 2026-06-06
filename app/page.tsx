import './portada.css';
import HeroCarousel from '@/components/HeroCarousel';
import YoutubeEmbed from '@/components/YoutubeEmbed';
import { getFocalPoint } from '@/lib/focalPoint';

// SEO: reescribir URLs del CMS a relativas (next.config rewrite)
const cmsToLocal = (u?: string | null) => u ? u.replace(/^https?:\/\/cms\.acontecer\.co\.cr\//i, 'https://acontecer.co.cr/') : u;


const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

async function getPosts(n = 18) {
  const res = await fetch(`${API}/posts?per_page=${n}&_embed`, { next: { revalidate: 60 } });
  return res.json();
}
async function getCategories() {
  const res = await fetch(`${API}/categories?per_page=30`, { next: { revalidate: 3600 } });
  return res.json();
}
async function getPostsByCategory(slug: string, n = 5) {
  const catRes = await fetch(`${API}/categories?slug=${slug}`, { next: { revalidate: 3600 } });
  const cats = await catRes.json();
  if (!cats[0]) return [];
  const res = await fetch(`${API}/posts?categories=${cats[0].id}&per_page=${n}&_embed`, { next: { revalidate: 60 } });
  return res.json();
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
    const icons: Record<number, string> = { 0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',51:'🌦️',61:'🌧️',80:'🌦️',95:'⛈️' };
    const descs: Record<number, string> = { 0:'Despejado',1:'Mayormente despejado',2:'Parcialmente nublado',3:'Nublado',45:'Neblina',51:'Llovizna',61:'Lluvia',80:'Chubascos',95:'Tormenta' };
    return { temp, icon: icons[code] || '🌡️', desc: descs[code] || 'Variable' };
  } catch { return null; }
}
async function getTipoCambio() {
  try {
    const res = await fetch('https://tipodecambio.paginasweb.cr/api', { next: { revalidate: 3600 } });
    const data = await res.json();
    if (data.compra && data.venta)
      return { compra: parseFloat(data.compra).toFixed(2), venta: parseFloat(data.venta).toFixed(2) };
    return null;
  } catch { return null; }
}

/** Strip HTML entities + tags */
function pt(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&nbsp;/g,' ')
    .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g,(_,h)=>String.fromCharCode(parseInt(h,16)))
    .trim();
}
function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max).trimEnd() + '…' : str;
}
function timeAgoDate(isoDate: string): string | null {
  const diff = Date.now() - new Date(isoDate).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `Hace ${m || 1} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d >= 14) return null; // notas viejas: no mostrar tiempo en portada
  return `Hace ${d} día${d > 1 ? 's' : ''}`;
}
function fmtDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('es-CR', { day:'numeric', month:'long', year:'numeric' });
}
function heroDate(isoDate: string) {
  const d = new Date(isoDate);
  return `${d.getDate().toString().padStart(2,'0')} · ${d.toLocaleDateString('es-CR',{month:'short'}).toUpperCase().replace('.', '')} · ${d.getFullYear()}`;
}
function getFeaturedImg(post: any): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media || media.code) return null;
  const raw = media.media_details?.sizes?.large?.source_url
      || media.media_details?.sizes?.medium_large?.source_url
      || media.source_url
      || null;
  // SEO: reescribir URLs del CMS al dominio principal (next.config rewrite)
  return cmsToLocal(raw) ?? null;
}
function getCatInfo(post: any, categories: any[]): { name: string; slug: string } {
  const cat = categories.find((c: any) => post.categories?.includes(c.id) && c.name !== 'Uncategorized');
  return { name: cat?.name || 'Nacionales', slug: cat?.slug || 'nacionales' };
}

const VIDEOS = [
  { id: '1MyP4W4FGAI', title: 'Últimas entrevistas', meta: 'Acontecer · YouTube' },
  { id: 'fkhbES0FAIU', title: 'Cobertura especial', meta: 'Acontecer · YouTube' },
  { id: 'o9WZnHd-9E4', title: 'Análisis político', meta: 'Acontecer · YouTube' },
];

const SUBNAV = [
  { label: 'Lo más reciente', href: '/', active: true },
  { label: 'Nacionales',       href: '/categoria/nacionales' },
  { label: 'Internacionales',  href: '/categoria/internacionales' },
  { label: 'Deportes',         href: '/categoria/deportes' },
  { label: 'Economía',         href: '/categoria/economia' },
  { label: 'Entretenimiento',  href: '/categoria/entretenimiento' },
  { label: 'Opinión',          href: '/categoria/opinion' },
];

export default async function Home() {
  const [posts, categories, deportes, economia, opinion, clima, tipoCambio] = await Promise.all([
    getPosts(18),
    getCategories(),
    getPostsByCategory('deportes', 5),
    getPostsByCategory('economia', 4),
    getPostsByCategory('opinion', 3),
    getClima(),
    getTipoCambio(),
  ]);

  // Hero: first 5 posts
  const heroPosts = (posts as any[]).slice(0, 5);

  // Detectar punto focal de cada imagen en paralelo (cacheado 7 días)
  const DEFAULT_FOCAL = { x: 50, y: 28 };
  const heroImgUrls = heroPosts.map((p: any) => getFeaturedImg(p));
  const focalPoints = await Promise.all(
    heroImgUrls.map((url: string | null) =>
      url ? getFocalPoint(url) : Promise.resolve(DEFAULT_FOCAL)
    )
  );

  const heroSlides = heroPosts.map((p: any, i: number) => {
    const { name, slug } = getCatInfo(p, categories);
    const author = p._embedded?.['author']?.[0];
    const authorName = author?.name || 'Redacción Acontecer';
    const authorSlug = author?.slug || 'editor';
    // Gravatar: cambiamos d=mm (mystery-man silhouette) por d=404 para que el servidor
    // devuelva HTTP 404 cuando no hay foto real. El componente AuthorAvatar captura el
    // onError y muestra las iniciales con gradiente azul en su lugar.
    const rawAvatar: string | null = author?.avatar_urls?.['96'] || null;
    const authorAvatar: string | null = rawAvatar ? rawAvatar.replace('d=mm', 'd=404') : null;
    return {
      id: p.id,
      href: `/${slug}/${p.slug}`,
      title: p.title.rendered,
      catName: name,
      catSlug: slug,
      date: heroDate(p.date),
      dateIso: p.date,
      imgUrl: heroImgUrls[i],
      focalPoint: focalPoints[i] ?? DEFAULT_FOCAL,
      lede: truncate(pt(p.excerpt?.rendered || ''), 160),
      authorName,
      authorAvatar,
      authorSlug,
    };
  });

  // Mosaic: posts 5-8
  const mosaicPosts = (posts as any[]).slice(5, 9);

  // News grid: posts 9-14
  const gridPosts = (posts as any[]).slice(9, 15);

  // Recent sidebar: first 5
  const recentPosts = (posts as any[]).slice(0, 5);

  return (
    <>
      {/* ── HERO CAROUSEL ───────────────────────────────────────────────── */}
      {/* Preload del primer slide: el browser lo descarga con maxima prioridad
          antes de que HeroCarousel hidrate y asigne el backgroundImage. */}
      {heroSlides[0]?.imgUrl && (
        <link rel="preload" as="image" href={heroSlides[0].imgUrl} fetchPriority="high" />
      )}
      <HeroCarousel slides={heroSlides} />

      {/* ── MOSAIC ──────────────────────────────────────────────────────── */}
      <section className="p-mosaic">
        <div className="p-mosaic-inner">
          {mosaicPosts.map((post: any) => {
            const { name, slug } = getCatInfo(post, categories);
            const img = getFeaturedImg(post);
            return (
              <a key={post.id} className="p-mosaic-item" href={`/${slug}/${post.slug}`} title={pt(post.title.rendered)}>
                <div
                  className="p-mosaic-thumb"
                  style={img ? { backgroundImage: `url("${img}")` } : { background: 'linear-gradient(135deg,#00007a,#0000A2)' }}
                />
                <div className="p-mosaic-eyebrow">{name}</div>
                <h3 className="p-mosaic-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                {timeAgoDate(post.date) && <div className="p-mosaic-meta">{timeAgoDate(post.date)}</div>}
              </a>
            );
          })}
        </div>
      </section>

      {/* ── SUBNAV ──────────────────────────────────────────────────────── */}
      <nav className="p-subnav" aria-label="Secciones">
        <div className="p-subnav-wrap">
          <div className="p-subnav-inner">
            {SUBNAV.map(tab => (
              <a
                key={tab.href}
                href={tab.href}
                className={`p-subnav-tab${tab.active ? ' active' : ''}`}
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── BODY GRID ───────────────────────────────────────────────────── */}
      <div className="p-body">
        <main className="p-body-main">

          {/* Lo más reciente */}
          <div className="p-sec-head">
            <div>
              <div className="p-sec-eyebrow">Última hora</div>
              <h2 className="p-sec-title">Lo más reciente</h2>
            </div>
            <a className="p-sec-more" href="/">Ver todo →</a>
          </div>

          <div className="p-grid-3">
            {gridPosts.map((post: any) => {
              const { name, slug } = getCatInfo(post, categories);
              const img = getFeaturedImg(post);
              return (
                <a key={post.id} className="p-card" href={`/${slug}/${post.slug}`} title={pt(post.title.rendered)}>
                  <div
                    className="p-card-img"
                    style={img ? { backgroundImage: `url("${img}")` } : { background: 'linear-gradient(135deg,#001a5e,#0a73ce)' }}
                  >
                    <div className="p-card-img-pattern" />
                  </div>
                  <span className="p-card-tag">{name}</span>
                  <h3 className="p-card-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  <div className="p-card-foot">
                    {timeAgoDate(post.date) && <span>{timeAgoDate(post.date)}</span>}
                  </div>
                </a>
              );
            })}
          </div>

          {/* Deportes */}
          {deportes.length > 0 && (
            <>
              <div className="p-sec-head" style={{ marginTop: '60px' }}>
                <div>
                  <div className="p-sec-eyebrow">⚽ Deportes</div>
                  <h2 className="p-sec-title">Lo último en deportes</h2>
                </div>
                <a className="p-sec-more" href="/categoria/deportes">Ver Deportes →</a>
              </div>
              <div className="p-ce">
                <a className="p-ce-feature" href={`/deportes/${(deportes as any[])[0].slug}`} title={pt((deportes as any[])[0].title.rendered)}>
                  <div
                    className="p-ce-feature-img"
                    style={getFeaturedImg((deportes as any[])[0])
                      ? { backgroundImage: `url("${getFeaturedImg((deportes as any[])[0])}")` }
                      : { background: 'linear-gradient(135deg,#0a73ce,#0000A2)' }}
                  />
                  <span className="p-card-tag" style={{ alignSelf: 'flex-start' }}>Deportes</span>
                  <h3 className="p-ce-feature-title" dangerouslySetInnerHTML={{ __html: (deportes as any[])[0].title.rendered }} />
                  <p className="p-ce-feature-excerpt">{truncate(pt((deportes as any[])[0].excerpt?.rendered || ''), 160)}</p>
                </a>
                <div className="p-ce-list">
                  {(deportes as any[]).slice(1).map((post: any) => {
                    const img = getFeaturedImg(post);
                    return (
                      <a key={post.id} className="p-ce-item" href={`/deportes/${post.slug}`} title={pt(post.title.rendered)}>
                        <div
                          className="p-ce-item-img"
                          style={img ? { backgroundImage: `url("${img}")` } : { background: 'linear-gradient(135deg,#001a5e,#0a73ce)' }}
                        />
                        <div>
                          <div className="p-ce-item-eyebrow">Deportes</div>
                          <h4 className="p-ce-item-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                          {timeAgoDate(post.date) && <div className="p-ce-item-meta">{timeAgoDate(post.date)}</div>}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Economía */}
          {economia.length > 0 && (
            <>
              <div className="p-sec-head" style={{ marginTop: '8px' }}>
                <div>
                  <div className="p-sec-eyebrow">💰 Economía</div>
                  <h2 className="p-sec-title">Mercados y política monetaria</h2>
                </div>
                <a className="p-sec-more" href="/categoria/economia">Ver Economía →</a>
              </div>
              <div className="p-ce">
                <a className="p-ce-feature" href={`/economia/${(economia as any[])[0].slug}`} title={pt((economia as any[])[0].title.rendered)}>
                  <div
                    className="p-ce-feature-img"
                    style={getFeaturedImg((economia as any[])[0])
                      ? { backgroundImage: `url("${getFeaturedImg((economia as any[])[0])}")` }
                      : { background: 'linear-gradient(135deg,#00007a,#0000A2)' }}
                  />
                  <span className="p-card-tag" style={{ alignSelf: 'flex-start' }}>Economía</span>
                  <h3 className="p-ce-feature-title" dangerouslySetInnerHTML={{ __html: (economia as any[])[0].title.rendered }} />
                  <p className="p-ce-feature-excerpt">{truncate(pt((economia as any[])[0].excerpt?.rendered || ''), 160)}</p>
                </a>
                <div className="p-ce-list">
                  {(economia as any[]).slice(1).map((post: any) => {
                    const img = getFeaturedImg(post);
                    return (
                      <a key={post.id} className="p-ce-item" href={`/economia/${post.slug}`} title={pt(post.title.rendered)}>
                        <div
                          className="p-ce-item-img"
                          style={img ? { backgroundImage: `url("${img}")` } : { background: 'linear-gradient(135deg,#00007a,#0000A2)' }}
                        />
                        <div>
                          <div className="p-ce-item-eyebrow">Economía</div>
                          <h4 className="p-ce-item-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                          {timeAgoDate(post.date) && <div className="p-ce-item-meta">{timeAgoDate(post.date)}</div>}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </main>

        {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
        <aside className="p-body-aside">
          {/* Clima */}
          <div className="p-widget">
            <div className="p-widget-eyebrow">Hoy en San José</div>
            <h3 className="p-widget-title">Clima</h3>
            {clima ? (
              <>
                <div className="p-clima-row">
                  <div className="p-clima-icon">{clima.icon}</div>
                  <div>
                    <div className="p-clima-temp">{clima.temp}<sup>°C</sup></div>
                    <div className="p-clima-desc">{clima.desc}</div>
                  </div>
                </div>
                <div className="p-clima-meta">
                  <span>San José, CR</span>
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--ink-400)', fontSize: 13 }}>Datos no disponibles</div>
            )}
          </div>

          {/* Tipo de cambio */}
          <a href="/tipo-de-cambio" className="p-widget p-cambio-link" aria-label="Ver tipo de cambio del dólar y convertidor">
            <div className="p-widget-eyebrow">BCCR · cierre del día</div>
            <h3 className="p-widget-title">Tipo de cambio</h3>
            <div className="p-cambio-grid">
              <div className="p-cambio-cell">
                <div className="lbl">Compra</div>
                <div className="val">₡{tipoCambio?.compra || 'N/D'}</div>
              </div>
              <div className="p-cambio-cell">
                <div className="lbl">Venta</div>
                <div className="val">₡{tipoCambio?.venta || 'N/D'}</div>
              </div>
            </div>
            <span className="p-cambio-more">Convertidor de dólares <span aria-hidden="true">→</span></span>
          </a>

          {/* Lo más reciente */}
          <div className="p-widget">
            <div className="p-widget-eyebrow">Lo más leído</div>
            <h3 className="p-widget-title">Esta semana</h3>
            <div className="p-leidos">
              {recentPosts.map((post: any, i: number) => {
                const { slug } = getCatInfo(post, categories);
                return (
                  <a key={post.id} className="p-leidos-item" href={`/${slug}/${post.slug}`} title={pt(post.title.rendered)}>
                    <div className="p-leidos-num">{String(i + 1).padStart(2, '0')}</div>
                    <div>
                      <div className="p-leidos-title">{pt(post.title.rendered)}</div>
                      <div className="p-leidos-meta">{getCatInfo(post, categories).name.toUpperCase()} · {fmtDate(post.date)}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Síguenos */}
          <div className="p-widget">
            <div className="p-widget-eyebrow">Redes sociales</div>
            <h3 className="p-widget-title">Síguenos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { href: 'https://facebook.com/Acontecer.co.cr',             bg: '#1877f2', name: 'Facebook', icon: (<svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }} aria-hidden="true"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.029H9.101z"/></svg>) },
                { href: 'https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S', bg: '#25d366', name: 'Canal WhatsApp', icon: (<svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }} aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>) },
                { href: 'https://youtube.com/@acontecercocr',                bg: '#ff0000', name: 'YouTube', icon: (<svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }} aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>) },
                { href: 'https://tiktok.com/@acontecer.co.cr',               bg: '#111',    name: 'TikTok', icon: (<svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }} aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.08-.14 1.62.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>) },
              ].map(s => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank" rel="noopener"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 8,
                    background: s.bg, color: 'white',
                    textDecoration: 'none', fontWeight: 600, fontSize: 14,
                  }}
                >
                  {s.icon}
                  <span>{s.name}</span>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ── OPINIÓN ─────────────────────────────────────────────────────── */}
      {opinion.length > 0 && (
        <section className="p-op">
          <div className="p-op-inner">
            <div className="p-sec-head" style={{ marginBottom: 36 }}>
              <div>
                <div className="p-sec-eyebrow">Voces · análisis</div>
                <h2 className="p-sec-title">Opinión</h2>
              </div>
              <a className="p-sec-more" href="/categoria/opinion">Ver todas las columnas →</a>
            </div>
            <div className="p-op-grid">
              {(opinion as any[]).map((post: any) => {
                const authorData = post._embedded?.['author']?.[0];
                const authorName = authorData?.name || 'Redacción Acontecer';
                const authorImg = authorData?.avatar_urls?.['96'] || null;
                const initials = authorName.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
                return (
                  <a key={post.id} className="p-op-card" href={`/opinion/${post.slug}`}>
                    <div className="p-op-author">
                      <div className="p-op-avatar">
                        {authorImg
                          ? <img src={authorImg} alt={authorName} />
                          : initials
                        }
                      </div>
                      <div>
                        <div className="p-op-author-name">{authorName}</div>
                        <div className="p-op-author-role">Columnista</div>
                      </div>
                    </div>
                    <h3 className="p-op-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    <p className="p-op-excerpt">{truncate(pt(post.excerpt?.rendered || ''), 130)}</p>
                    <div className="p-op-foot">
                      <span>{fmtDate(post.date)}</span>
                      <span className="read">Leer →</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── MONITOR LEGISLATIVO ─────────────────────────────────────────── */}
      <section className="p-ml">
        <div className="p-ml-grid-bg" />
        <div className="p-ml-inner">
          <div className="p-ml-head">
            <div>
              <div className="p-ml-eyebrow"><span className="dot" />Asamblea Legislativa</div>
              <h2 className="p-ml-title">Monitor Legislativo</h2>
            </div>
            <a href="/asamblea" className="p-ml-cta">
              Abrir dashboard
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 16, maxWidth: 640, lineHeight: 1.6 }}>
            Seguimiento en tiempo real de votaciones, expedientes y sesiones de la Asamblea Legislativa de Costa Rica.
            Transparencia parlamentaria al alcance de todos.
          </p>
        </div>
      </section>

      {/* ── ESTADÍSTICAS ────────────────────────────────────────────────── */}
      <section className="p-stats">
        <div className="p-stats-inner">
          <div className="p-stats-head">
            <div className="p-stats-eyebrow">Periodismo independiente</div>
            <h2 className="p-stats-title">Acontecer en cifras</h2>
          </div>
          <a className="p-stats-grid" href="/pauta" aria-label="Paute con nosotros en Acontecer">
            {[
              { num: '+15M',  lbl: 'Vistas mensuales',  sub: 'en Facebook' },
              { num: '+200K',  lbl: 'Lectores únicos',    sub: 'cada mes' },
              { num: '+1.200',lbl: 'Artículos',          sub: 'publicados' },
              { num: '2020',  lbl: 'Fundados en',        sub: 'San José, Costa Rica' },
            ].map(s => (
              <div key={s.lbl} className="p-stat-cell">
                <div className="num">{s.num}</div>
                <div className="lbl">{s.lbl}</div>
                <div className="sub">{s.sub}</div>
              </div>
            ))}
          </a>
          <a className="p-stats-cta" href="/pauta">
            Paute con nosotros
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </section>

      {/* ── YOUTUBE ─────────────────────────────────────────────────────── */}
      <section className="p-yt">
        <div className="p-yt-inner">
          <div className="p-yt-head">
            <div>
              <div className="p-yt-eyebrow"><svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 15, height: 15 }} aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>Canal de YouTube</div>
              <h2 className="p-yt-title">Últimas entrevistas y coberturas</h2>
            </div>
            <a href="https://youtube.com/@acontecercocr" target="_blank" rel="noopener" className="p-yt-cta">
              Ver canal →
            </a>
          </div>
          <div className="p-yt-grid">
            {VIDEOS.map(v => (
              <div key={v.id} className="p-yt-card">
                <div className="p-yt-thumb">
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    <YoutubeEmbed id={v.id} title={v.title} />
                  </div>
                </div>
                <div className="p-yt-body">
                  <h4 className="p-yt-card-title">{v.title}</h4>
                  <div className="p-yt-meta">{v.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHATSAPP CTA ────────────────────────────────────────────────── */}
      <section className="p-wa">
        <div className="p-wa-grid-bg" />
        <div className="p-wa-inner">
          <div>
            <div className="p-wa-eyebrow">
              <span className="p-wa-dot" />
              Canal oficial
            </div>
            <h2 className="p-wa-title">Reciba las noticias en tiempo real</h2>
            <p className="p-wa-p">
              Únase a nuestro canal de WhatsApp y sea el primero en enterarse de lo que pasa
              en Costa Rica y el mundo, con la curaduría de la redacción de Acontecer.
            </p>
            <div className="p-wa-actions">
              <a
                href="https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S"
                target="_blank" rel="noopener"
                className="p-wa-btn-primary"
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                  <path d="M20.5 3.5A11 11 0 0 0 3.5 17l-1.4 5 5-1.4a11 11 0 0 0 13.4-17z" />
                </svg>
                Unirse al canal de WhatsApp
              </a>
              <a
                href="https://facebook.com/Acontecer.co.cr"
                target="_blank" rel="noopener"
                className="p-wa-btn-secondary"
              >
                Ver otras redes →
              </a>
            </div>
          </div>
          {/* Phone mockup decorativo - solo desktop */}
          <div style={{
            aspectRatio: '9/17', maxWidth: 280,
            background: '#050520', borderRadius: 32,
            border: '6px solid rgba(255,255,255,.1)',
            padding: 14, position: 'relative',
            boxShadow: '0 24px 80px rgba(0,0,0,.5)',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              background: '#fff', borderRadius: 18, flex: 1,
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>
              {/* Barra WhatsApp */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 12px', background: '#25d366' }}>
                <svg viewBox="0 0 24 24" fill="#fff" style={{ width: 14, height: 14 }} aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.02em' }}>WhatsApp</span>
              </div>
              {/* Cabecera del canal */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon.png" alt="Acontecer.co.cr" width={36} height={36} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid #eee' }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>Acontecer.co.cr</div>
                  <div style={{ fontSize: 9, color: '#888', fontFamily: 'var(--mono)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 2 }}>CANAL · 12K SEGUIDORES</div>
                </div>
              </div>
              {/* Mensajes */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflow: 'hidden' }}>
                {[
                  '🔴 Nueva nota: Diputados aprueban reforma fiscal',
                  'Banco Central recorta tasa al 5,75 %',
                  '⚽ Saprissa 3-0 Alajuelense — Final',
                ].map((msg, i) => (
                  <div key={i} style={{
                    background: 'var(--blue-50)', padding: '8px 10px',
                    borderRadius: '12px 12px 12px 3px', maxWidth: '88%',
                  }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 11, lineHeight: 1.35, fontWeight: 500, color: '#111' }}>{msg}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: '#999', marginTop: 4, letterSpacing: '.04em' }}>
                      {i === 0 ? 'Hace 5 min ✓✓' : i === 1 ? 'Hace 1 h ✓✓' : 'Ayer ✓✓'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
