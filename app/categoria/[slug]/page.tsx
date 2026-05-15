import { notFound } from 'next/navigation';

const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

async function getCategory(slug: string) {
  const res = await fetch(API + '/categories?slug=' + slug, { next: { revalidate: 3600 } });
  const cats = await res.json();
  return cats[0];
}

const PER_PAGE = 12;

async function getCategoryPosts(categoryId: number, page: number) {
  const res = await fetch(
    API + `/posts?categories=${categoryId}&per_page=${PER_PAGE}&page=${page}&_embed`,
    { next: { revalidate: 60 } }
  );
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
  const total      = parseInt(res.headers.get('X-WP-Total') || '0', 10);
  const posts      = await res.json();
  return { posts: Array.isArray(posts) ? posts : [], totalPages, total };
}

async function getUltimas() {
  const res = await fetch(API + '/posts?per_page=5&_embed', { next: { revalidate: 60 } });
  return res.json();
}

async function getClima() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=9.9281&longitude=-84.0907&current=temperature_2m,weathercode&timezone=America/Costa_Rica', { next: { revalidate: 1800 } });
    const data = await res.json();
    const code = data.current.weathercode;
    const temp = Math.round(data.current.temperature_2m);
    const icons: { [key: number]: string } = { 0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',51:'🌦️',61:'🌧️',80:'🌦️',95:'⛈️' };
    const descs: { [key: number]: string } = { 0:'Despejado',1:'Mayormente despejado',2:'Parcialmente nublado',3:'Nublado',45:'Neblina',51:'Llovizna',61:'Lluvia',80:'Chubascos',95:'Tormenta' };
    return { temp, icon: icons[code] || '🌡️', desc: descs[code] || 'Variable' };
  } catch { return null; }
}

// SVG paths para cada categoría (viewBox 0 0 24 24, stroke-based)
const categoryIconPath: { [key: string]: string } = {
  nacionales:      'M4 22V4h16v18M9 22V12h6v10M2 4h20',                        // building/institution
  internacionales: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2c-3 4-5 8-5 10s2 6 5 8M12 2c3 4 5 8 5 10s-2 6-5 8', // globe
  deportes:        'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M4.9 4.9l14.2 14.2M4.9 19.1L19.1 4.9', // ball cross
  economia:        'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', // dollar sign
  entretenimiento: 'M15 10l4.553-2.276A1 1 0 0 1 21 8.723v6.554a1 1 0 0 1-1.447.894L15 14v-4zM3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z', // video
  salud:           'M22 12h-4l-3 9L9 3l-3 9H2',                                 // heart rate
  tecnologia:      'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18', // monitor
  opinion:         'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z', // edit
};

const categoryLabels: { [key: string]: string } = {
  nacionales: 'Nacionales', internacionales: 'Internacionales', deportes: 'Deportes',
  economia: 'Economía', entretenimiento: 'Entretenimiento', salud: 'Salud',
  tecnologia: 'Tecnología', opinion: 'Opinión',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: 'Categoría no encontrada' };
  const labels: { [key: string]: string } = {
    nacionales: 'Noticias Nacionales', internacionales: 'Noticias Internacionales',
    deportes: 'Deportes Costa Rica', economia: 'Economía Costa Rica',
    entretenimiento: 'Entretenimiento', salud: 'Salud Costa Rica',
    tecnologia: 'Tecnología', opinion: 'Opinión'
  };
  const titulo = (labels[slug] || category.name) + ' | Acontecer.co.cr';
  const descripcion = category.description || `Las últimas noticias de ${category.name} en Costa Rica. Información actualizada en Acontecer.co.cr`;
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: `https://acontecer.co.cr/categoria/${slug}` },
    openGraph: { title: titulo, description: descripcion, url: `https://acontecer.co.cr/categoria/${slug}`, type: 'website' },
  };
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10));

  const [category, ultimas, clima] = await Promise.all([
    getCategory(slug), getUltimas(), getClima(),
  ]);
  if (!category) return notFound();

  const { posts, totalPages } = await getCategoryPosts(category.id, page);
  const [featured, ...rest] = page === 1 ? posts : [null, ...posts];
  const iconPath = categoryIconPath[slug] || categoryIconPath.nacionales;
  const ahora = new Date().toLocaleDateString('es-CR', { weekday:'long', day:'numeric', month:'long' });

  const getFeaturedImg = (post: any) => post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://acontecer.co.cr' },
          { '@type': 'ListItem', 'position': 2, 'name': category.name, 'item': `https://acontecer.co.cr/categoria/${slug}` },
        ]
      })}} />
      <div className="cat-hero">
        <div className="cat-hero-inner">
          <div className="cat-hero-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{width:40,height:40}}>
                <path d={iconPath}/>
              </svg>
            </div>
          <div style={{flex:1}}>
            <h1 style={{fontFamily:'Fraunces, serif', fontSize:'36px', color:'white', fontWeight:'900', marginBottom:'6px'}}
              dangerouslySetInnerHTML={{__html: category.name}} />
            <p style={{color:'rgba(255,255,255,0.75)', fontSize:'15px'}}>
              {category.description
                ? <span dangerouslySetInnerHTML={{__html: category.description}} />
                : 'Las noticias mas importantes en Acontecer.co.cr'}
            </p>
          </div>
          <div style={{textAlign:'right', color:'rgba(255,255,255,0.6)', fontSize:'13px', flexShrink:0}}>
            <strong style={{display:'block', fontSize:'32px', color:'white', fontFamily:'Fraunces, serif'}}>{category.count}</strong>
            articulos
          </div>
        </div>
      </div>

      <div className="cat-main-grid">
        <div>
          {featured && (
            <a href={'/' + slug + '/' + featured.slug} className="featured-card">
              {getFeaturedImg(featured)
                ? <img src={getFeaturedImg(featured)} alt={featured.title?.rendered?.replace(/<[^>]+>/g, '') || ''} style={{width:'100%', height:'280px', objectFit:'cover', objectPosition:'top'}} />
                : <div style={{height:'280px', background:'linear-gradient(135deg, #0000A2, #0a73ce)', display:'flex', alignItems:'center', justifyContent:'center'}}><svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} strokeLinecap="round" style={{width:80,height:80}}><path d="M4 22V4h16v18M9 22V12h6v10M2 4h20"/></svg></div>}
              <div style={{padding:'28px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
                <span style={{background:'#0a73ce', color:'white', fontSize:'10px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'2px', padding:'4px 10px', borderRadius:'3px', marginBottom:'14px', width:'fit-content'}}>
                  Destacado
                </span>
                <h2 style={{fontFamily:'Fraunces, serif', fontSize:'22px', fontWeight:'700', lineHeight:1.3, color:'#111', marginBottom:'12px'}}
                  dangerouslySetInnerHTML={{__html: featured.title.rendered}} />
                {slug === 'opinion' && featured._embedded?.author?.[0]?.name && (
                  <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px'}}>
                    {featured._embedded.author[0].avatar_urls?.['48'] &&
                      <img src={featured._embedded.author[0].avatar_urls['48']} alt="" style={{width:'28px', height:'28px', borderRadius:'50%', objectFit:'cover'}} />}
                    <span style={{fontSize:'13px', fontWeight:'600', color:'#0000A2'}}>
                      Por {featured._embedded.author[0].name}
                    </span>
                  </div>
                )}
                <span style={{fontSize:'12px', color:'#aaa'}}>
                  {new Date(featured.date).toLocaleDateString('es-CR', {day:'numeric', month:'long', year:'numeric'})}
                </span>
              </div>
            </a>
          )}

          <div className="section-title">{page === 1 ? 'Mas noticias' : `Página ${page}`}</div>
          <div className={slug === 'opinion' ? 'posts-grid-opinion' : 'posts-grid'}>
            {rest.filter(Boolean).map((post: any) => {
              const authorName = post._embedded?.author?.[0]?.name;
              const authorAvatar = post._embedded?.author?.[0]?.avatar_urls?.['48'];
              const authorSlug = post._embedded?.author?.[0]?.slug;
              return slug === 'opinion' ? (
                <a key={post.id} href={'/' + slug + '/' + post.slug} className="opinion-card">
                  <div className="opinion-card-img-wrap">
                    {getFeaturedImg(post)
                      ? <img src={getFeaturedImg(post)} alt={post.title?.rendered?.replace(/<[^>]+>/g, '') || ''} className="opinion-card-img" />
                      : <div className="opinion-card-img-placeholder">✍️</div>}
                  </div>
                  <div className="opinion-card-body">
                    {authorName && (
                      <div className="opinion-card-author">
                        {authorAvatar
                          ? <img src={authorAvatar} alt={authorName} className="opinion-card-avatar" />
                          : <div className="opinion-card-avatar-placeholder">{authorName.charAt(0)}</div>}
                        <span className="opinion-card-author-name">Por {authorName}</span>
                      </div>
                    )}
                    <h3 className="opinion-card-title" dangerouslySetInnerHTML={{__html: post.title.rendered}} />
                    <div className="opinion-card-date">
                      {new Date(post.date).toLocaleDateString('es-CR', {day:'numeric', month:'long', year:'numeric'})}
                    </div>
                  </div>
                </a>
              ) : (
                <a key={post.id} href={'/' + slug + '/' + post.slug} className="post-card">
                  {getFeaturedImg(post)
                    ? <img src={getFeaturedImg(post)} alt={post.title?.rendered?.replace(/<[^>]+>/g, '') || ''} className="post-card-img" />
                    : <div className="post-card-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.2} strokeLinecap="round" style={{width:32,height:32}}><path d="M4 22V4h16v18M9 22V12h6v10"/></svg></div>}
                  <div className="post-card-body">
                    <h3 style={{fontFamily:'Fraunces, serif', fontSize:'16px', fontWeight:'700', lineHeight:1.4, color:'#111', marginBottom:'8px'}}
                      dangerouslySetInnerHTML={{__html: post.title.rendered}} />
                    <div style={{fontSize:'11px', color:'#aaa'}}>
                      {new Date(post.date).toLocaleDateString('es-CR', {day:'numeric', month:'long', year:'numeric'})}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'32px 0 16px', flexWrap:'wrap'}}>
              {/* Anterior */}
              {page > 1 && (
                <a href={`/categoria/${slug}?page=${page - 1}`}
                  style={{display:'flex', alignItems:'center', gap:'4px', padding:'8px 16px', borderRadius:'8px', border:'1px solid #e0e0e0', background:'white', color:'#0000A2', textDecoration:'none', fontWeight:'600', fontSize:'14px'}}>
                  ← Anterior
                </a>
              )}

              {/* Números */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                  if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('...');
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, idx) =>
                  n === '...'
                    ? <span key={`dots-${idx}`} style={{padding:'8px 4px', color:'#aaa'}}>…</span>
                    : <a key={n} href={`/categoria/${slug}?page=${n}`}
                        style={{
                          minWidth:'38px', height:'38px', display:'flex', alignItems:'center', justifyContent:'center',
                          borderRadius:'8px', border: n === page ? 'none' : '1px solid #e0e0e0',
                          background: n === page ? '#0000A2' : 'white',
                          color: n === page ? 'white' : '#333',
                          textDecoration:'none', fontWeight: n === page ? '700' : '500', fontSize:'14px',
                        }}>
                        {n}
                      </a>
                )}

              {/* Siguiente */}
              {page < totalPages && (
                <a href={`/categoria/${slug}?page=${page + 1}`}
                  style={{display:'flex', alignItems:'center', gap:'4px', padding:'8px 16px', borderRadius:'8px', border:'1px solid #e0e0e0', background:'white', color:'#0000A2', textDecoration:'none', fontWeight:'600', fontSize:'14px'}}>
                  Siguiente →
                </a>
              )}
            </div>
          )}
        </div>

        <aside>
          {/* CLIMA - solo desktop */}
          <div className="sidebar-desktop-only" style={{background:'white', borderRadius:'10px', padding:'16px 20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', marginBottom:'16px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontSize:'11px', color:'#0a73ce', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>Hoy</div>
                <div style={{fontFamily:'Fraunces, serif', fontSize:'13px', color:'#333', textTransform:'capitalize'}}>{ahora}</div>
              </div>
              {clima && (
                <div style={{textAlign:'center', background:'#f0f7ff', borderRadius:'10px', padding:'10px 14px'}}>
                  <div style={{fontSize:'28px', lineHeight:1}}>{clima.icon}</div>
                  <div style={{fontFamily:'Fraunces, serif', fontSize:'18px', fontWeight:'700', color:'#0000A2'}}>{clima.temp}°C</div>
                  <div style={{fontSize:'11px', color:'#888'}}>San José</div>
                </div>
              )}
            </div>
            {clima && <div style={{fontSize:'12px', color:'#666', marginTop:'8px', textAlign:'center'}}>{clima.desc}</div>}
          </div>

          {/* BANNER */}
          <div className="sidebar-ad">
            <p style={{fontSize:'13px', opacity:0.8, marginBottom:'8px'}}>ESPACIO PUBLICITARIO</p>
            <h3 style={{fontFamily:'Fraunces, serif', fontSize:'18px', marginBottom:'12px'}}>Quiere llegar a miles de lectores?</h3>
            <a href="/pauta" style={{background:'white', color:'#0000A2', padding:'8px 20px', borderRadius:'20px', fontSize:'12px', fontWeight:'700', display:'inline-block'}}>Contactenos</a>
          </div>

          {/* ULTIMAS NOTICIAS */}
          <div className="sidebar-widget" style={{marginTop:'16px'}}>
            <div className="sidebar-title">Ultimas noticias</div>
            {ultimas.map((post: any, i: number) => {
              const uCatSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'nacionales';
              return (
              <a key={post.id} href={`/${uCatSlug}/${post.slug}`} className="sidebar-item">
                <span className="sidebar-num">{String(i+1).padStart(2,'0')}</span>
                <div>
                  <div className="sidebar-item-title" dangerouslySetInnerHTML={{__html: post.title.rendered}} />
                  <div className="sidebar-item-date">{new Date(post.date).toLocaleDateString('es-CR', {day:'numeric', month:'long'})}</div>
                </div>
              </a>
              );
            })}
          </div>

          {/* OTRAS CATEGORIAS - solo desktop */}
          <div className="sidebar-desktop-only sidebar-widget" style={{marginTop:'16px'}}>
            <div className="sidebar-title">Otras categorias</div>
            {Object.entries(categoryIconPath).filter(([k]) => k !== slug).map(([s, path]) => (
              <a key={s} href={'/categoria/' + s} className="other-cat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14,flexShrink:0}}>
                  <path d={path}/>
                </svg>
                {categoryLabels[s] || s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            ))}
          </div>

          {/* REDES - solo desktop */}
          <div className="sidebar-desktop-only" style={{background:'white', borderRadius:'10px', padding:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', marginTop:'16px'}}>
            <div className="sidebar-title">Siguenos</div>
            <a href="https://facebook.com/Acontecer.co.cr" target="_blank" rel="noopener"
              style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', borderRadius:'8px', background:'#1877f2', color:'white', marginBottom:'8px', textDecoration:'none', fontWeight:'600', fontSize:'14px'}}>
              📘 Facebook
            </a>
            <a href="https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S" target="_blank" rel="noopener"
              style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', borderRadius:'8px', background:'#25d366', color:'white', marginBottom:'8px', textDecoration:'none', fontWeight:'600', fontSize:'14px'}}>
              📱 Canal WhatsApp
            </a>
            <a href="https://youtube.com/@acontecercocr" target="_blank" rel="noopener"
              style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', borderRadius:'8px', background:'#ff0000', color:'white', textDecoration:'none', fontWeight:'600', fontSize:'14px'}}>
              ▶ YouTube
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
