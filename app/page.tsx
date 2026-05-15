import Image from 'next/image';
import YoutubeEmbed from '@/components/YoutubeEmbed';
import HeroCarousel from '@/components/HeroCarousel';

const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

async function getPosts() {
  const res = await fetch(API + '/posts?per_page=14&_embed', { next: { revalidate: 60 } });
  return res.json();
}

async function getCategories() {
  const res = await fetch(API + '/categories?per_page=20', { next: { revalidate: 3600 } });
  return res.json();
}

async function getPostsByCategory(slug: string) {
  const catRes = await fetch(API + '/categories?slug=' + slug, { next: { revalidate: 3600 } });
  const cats = await catRes.json();
  if (!cats[0]) return [];
  const res = await fetch(API + '/posts?categories=' + cats[0].id + '&per_page=5&_embed', { next: { revalidate: 60 } });
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

async function getTipoCambio() {
  try {
    const res = await fetch('https://tipodecambio.paginasweb.cr/api', { next: { revalidate: 3600 } });
    const data = await res.json();
    if (data.compra && data.venta) {
      return { compra: parseFloat(data.compra).toFixed(2), venta: parseFloat(data.venta).toFixed(2) };
    }
    return null;
  } catch { return null; }
}

function pt(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h: string) => String.fromCharCode(parseInt(h, 16)))
    .trim();
}

export default async function Home() {
  const [posts, categories, deportes, economia, clima, tipoCambio] = await Promise.all([
    getPosts(), getCategories(), getPostsByCategory('deportes'), getPostsByCategory('economia'), getClima(), getTipoCambio(),
  ]);

  const [hero, second, third, ...rest] = posts;
  const ahora = new Date().toLocaleDateString('es-CR', { weekday:'long', day:'numeric', month:'long' });

  const getCatName = (ids: number[]) => {
    const cat = categories.find((c: any) => ids.includes(c.id) && c.name !== 'Uncategorized');
    return cat?.name || 'Nacionales';
  };
  const getCatSlug = (ids: number[]) => {
    const cat = categories.find((c: any) => ids.includes(c.id) && c.name !== 'Uncategorized');
    return cat?.slug || 'nacionales';
  };
  const getFeaturedImg = (post: any) => post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

  const videos = [
    { id: '1MyP4W4FGAI', title: 'Últimas entrevistas' },
    { id: 'fkhbES0FAIU', title: 'Cobertura especial' },
    { id: 'o9WZnHd-9E4', title: 'Análisis político' },
  ];

  return (
    <>
      <div className="cats-bar">
        <div className="cats-inner">
          {['Lo mas reciente','Nacionales','Internacionales','Deportes','Economia','Entretenimiento','Opinion'].map((cat, i) => (
            <a
              key={cat}
              href={i === 0 ? '/' : '/categoria/' + cat.toLowerCase()}
              className={'cat-link' + (i === 0 ? ' active' : '')}
              title={i === 0 ? 'Ver las últimas noticias de Costa Rica' : 'Noticias de ' + cat}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      <HeroCarousel slides={posts.slice(0, 5).map((p: any) => ({
        id: p.id,
        href: '/' + getCatSlug(p.categories) + '/' + p.slug,
        title: p.title.rendered,
        catName: getCatName(p.categories),
        date: new Date(p.date).toLocaleDateString('es-CR', {day:'numeric', month:'long', year:'numeric'}),
        imgUrl: getFeaturedImg(p),
      }))} />

      <div className="main-grid">
        <div>
          <div className="section-title">Ultimas Noticias</div>
          <div className="news-grid">
            {rest.slice(0,6).map((post: any) => (
              <a
                key={post.id}
                href={'/' + getCatSlug(post.categories) + '/' + post.slug}
                className="news-card"
                title={pt(post.title.rendered)}
              >
                {getFeaturedImg(post)
                  ? <img src={getFeaturedImg(post)!} alt={pt(post.title.rendered)} className="news-card-img" loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 380px" />
                  : <div className="news-card-placeholder">📰</div>
                }
                <div className="news-card-body">
                  <div className="news-card-cat">{getCatName(post.categories)}</div>
                  <div className="news-card-title" dangerouslySetInnerHTML={{__html: post.title.rendered}} />
                  <div className="news-card-date">{new Date(post.date).toLocaleDateString('es-CR', {day:'numeric', month:'long', year:'numeric'})}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="clima-mobile">
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'24px'}}>
              <div style={{background:'white', borderRadius:'10px', padding:'16px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
                <div style={{fontSize:'11px', color:'#0a73ce', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px'}}>Clima · San José</div>
                {clima && (
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <div style={{fontSize:'32px'}}>{clima.icon}</div>
                    <div>
                      <div style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'22px', fontWeight:'700', color:'#0000A2'}}>{clima.temp}°C</div>
                      <div style={{fontSize:'11px', color:'#888'}}>{clima.desc}</div>
                    </div>
                  </div>
                )}
              </div>
              <div style={{background:'white', borderRadius:'10px', padding:'16px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
                <div style={{fontSize:'11px', color:'#0a73ce', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px'}}>Tipo de Cambio</div>
                <div style={{marginBottom:'6px'}}>
                  <div style={{fontSize:'11px', color:'#888'}}>Compra</div>
                  <div style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'18px', fontWeight:'700', color:'#0000A2'}}>₡{tipoCambio?.compra || 'N/D'}</div>
                </div>
                <div>
                  <div style={{fontSize:'11px', color:'#888'}}>Venta</div>
                  <div style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'18px', fontWeight:'700', color:'#0a73ce'}}>₡{tipoCambio?.venta || 'N/D'}</div>
                </div>
              </div>
            </div>
          </div>

          {deportes.length > 0 && (
            <>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px', paddingBottom:'10px', borderBottom:'3px solid #0a73ce'}}>
                <h2 style={{fontFamily:'Playfair Display, serif', fontSize:'22px', fontWeight:'700', color:'#0a73ce'}}>⚽ Deportes</h2>
                <a href="/categoria/deportes" title="Ver todas las noticias de Deportes" style={{fontSize:'13px', color:'#0a73ce', fontWeight:'600'}}>Ver todo →</a>
              </div>
              <>
                <div className="news-grid" style={{marginBottom:'30px', display:'none'}} aria-hidden="true" />
                <div className="cat-editorial" style={{marginBottom:'30px'}}>
                  {deportes[0] && (
                    <a href={'/deportes/' + deportes[0].slug} className="cat-editorial-main" title={pt(deportes[0].title.rendered)}>
                      {getFeaturedImg(deportes[0])
                        ? <img src={getFeaturedImg(deportes[0])!} alt={pt(deportes[0].title.rendered)} className="cat-editorial-main-img" loading="lazy" sizes="(max-width: 1024px) 100vw, 713px" />
                        : <div className="cat-editorial-main-img" style={{background:'linear-gradient(135deg,#0a73ce,#0000A2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'60px'}}>⚽</div>
                      }
                      <div className="cat-editorial-main-overlay">
                        <div style={{background:'#0a73ce',color:'white',fontSize:'10px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'2px',padding:'3px 10px',borderRadius:'3px',display:'inline-block',marginBottom:'10px'}}>Deportes</div>
                        <div className="cat-editorial-main-title" dangerouslySetInnerHTML={{__html: deportes[0].title.rendered}} />
                        <div className="cat-editorial-main-date">{new Date(deportes[0].date).toLocaleDateString('es-CR', {day:'numeric', month:'long'})}</div>
                      </div>
                    </a>
                  )}
                  <div className="cat-editorial-list">
                    {deportes.slice(1).map((post: any) => (
                      <a key={post.id} href={'/deportes/' + post.slug} className="cat-editorial-item" title={pt(post.title.rendered)}>
                        {getFeaturedImg(post)
                          ? <img src={getFeaturedImg(post)!} alt={pt(post.title.rendered)} className="cat-editorial-item-img" loading="lazy" sizes="(max-width: 640px) 80px, 100px" />
                          : <div className="cat-editorial-item-placeholder">⚽</div>
                        }
                        <div>
                          <div className="cat-editorial-item-title" dangerouslySetInnerHTML={{__html: post.title.rendered}} />
                          <div className="cat-editorial-item-date">{new Date(post.date).toLocaleDateString('es-CR', {day:'numeric', month:'long', year:'numeric'})}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            </>
          )}

          {economia.length > 0 && (
            <>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px', paddingBottom:'10px', borderBottom:'3px solid #0000A2'}}>
                <h2 style={{fontFamily:'Playfair Display, serif', fontSize:'22px', fontWeight:'700', color:'#0000A2'}}>💰 Economía</h2>
                <a href="/categoria/economia" title="Ver todas las noticias de Economía" style={{fontSize:'13px', color:'#0000A2', fontWeight:'600'}}>Ver todo →</a>
              </div>
              <>
                <div className="cat-editorial" style={{marginBottom:'30px'}}>
                  {economia[0] && (
                    <a href={'/economia/' + economia[0].slug} className="cat-editorial-main" title={pt(economia[0].title.rendered)}>
                      {getFeaturedImg(economia[0])
                        ? <img src={getFeaturedImg(economia[0])!} alt={pt(economia[0].title.rendered)} className="cat-editorial-main-img" loading="lazy" sizes="(max-width: 1024px) 100vw, 713px" />
                        : <div className="cat-editorial-main-img" style={{background:'linear-gradient(135deg,#00007a,#0000A2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'60px'}}>💰</div>
                      }
                      <div className="cat-editorial-main-overlay">
                        <div style={{background:'#0000A2',color:'white',fontSize:'10px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'2px',padding:'3px 10px',borderRadius:'3px',display:'inline-block',marginBottom:'10px'}}>Economía</div>
                        <div className="cat-editorial-main-title" dangerouslySetInnerHTML={{__html: economia[0].title.rendered}} />
                        <div className="cat-editorial-main-date">{new Date(economia[0].date).toLocaleDateString('es-CR', {day:'numeric', month:'long'})}</div>
                      </div>
                    </a>
                  )}
                  <div className="cat-editorial-list">
                    {economia.slice(1).map((post: any) => (
                      <a key={post.id} href={'/economia/' + post.slug} className="cat-editorial-item" title={pt(post.title.rendered)}>
                        {getFeaturedImg(post)
                          ? <img src={getFeaturedImg(post)!} alt={pt(post.title.rendered)} className="cat-editorial-item-img" loading="lazy" sizes="(max-width: 640px) 80px, 100px" />
                          : <div className="cat-editorial-item-placeholder">💰</div>
                        }
                        <div>
                          <div className="cat-editorial-item-title" dangerouslySetInnerHTML={{__html: post.title.rendered}} />
                          <div className="cat-editorial-item-date">{new Date(post.date).toLocaleDateString('es-CR', {day:'numeric', month:'long', year:'numeric'})}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            </>
          )}
        </div>

        <aside>
          <div className="clima-desktop" style={{background:'white', borderRadius:'10px', padding:'16px 20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', marginBottom:'16px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontSize:'11px', color:'#0a73ce', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>Hoy</div>
                <div style={{fontFamily:'Playfair Display, serif', fontSize:'13px', color:'#333', textTransform:'capitalize'}}>{ahora}</div>
              </div>
              {clima && (
                <div style={{textAlign:'center', background:'#f0f7ff', borderRadius:'10px', padding:'10px 14px'}}>
                  <div style={{fontSize:'28px', lineHeight:1}}>{clima.icon}</div>
                  <div style={{fontFamily:'Playfair Display, serif', fontSize:'18px', fontWeight:'700', color:'#0000A2'}}>{clima.temp}°C</div>
                  <div style={{fontSize:'11px', color:'#888'}}>San José</div>
                </div>
              )}
            </div>
            {clima && <div style={{fontSize:'12px', color:'#666', marginTop:'8px', textAlign:'center'}}>{clima.desc}</div>}
          </div>

          <div style={{background:'white', borderRadius:'10px', padding:'16px 20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', marginBottom:'16px'}}>
            <div style={{fontFamily:'Playfair Display, serif', fontSize:'14px', fontWeight:'700', color:'#0000A2', marginBottom:'12px', paddingBottom:'8px', borderBottom:'2px solid #0000A2'}}>
              💵 Tipo de Cambio · BCCR
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
              <div style={{background:'#f0f7ff', borderRadius:'8px', padding:'12px', textAlign:'center'}}>
                <div style={{fontSize:'11px', color:'#888', marginBottom:'4px'}}>Compra</div>
                <div style={{fontFamily:'Playfair Display, serif', fontSize:'20px', fontWeight:'700', color:'#0000A2'}}>₡{tipoCambio?.compra || 'N/D'}</div>
              </div>
              <div style={{background:'#f0f7ff', borderRadius:'8px', padding:'12px', textAlign:'center'}}>
                <div style={{fontSize:'11px', color:'#888', marginBottom:'4px'}}>Venta</div>
                <div style={{fontFamily:'Playfair Display, serif', fontSize:'20px', fontWeight:'700', color:'#0a73ce'}}>₡{tipoCambio?.venta || 'N/D'}</div>
              </div>
            </div>
          </div>

          <div className="sidebar-ad">
            <p style={{fontSize:'13px', opacity:0.8, marginBottom:'8px'}}>ESPACIO PUBLICITARIO</p>
            <h3 style={{fontFamily:'Playfair Display, serif', fontSize:'18px', marginBottom:'12px'}}>Quiere llegar a miles de lectores?</h3>
            <a href="/pauta" title="Contáctenos para pautar en Acontecer.co.cr" style={{background:'white', color:'#0000A2', padding:'8px 20px', borderRadius:'20px', fontSize:'12px', fontWeight:'700', display:'inline-block'}}>Contactenos</a>
          </div>

          <div className="sidebar-widget" style={{marginTop:'16px'}}>
            <div className="sidebar-title">Lo mas reciente</div>
            {posts.slice(0,5).map((post: any, i: number) => (
              <a
                key={post.id}
                href={'/' + getCatSlug(post.categories) + '/' + post.slug}
                className="sidebar-item"
                title={pt(post.title.rendered)}
              >
                <span className="sidebar-num">{String(i+1).padStart(2,'0')}</span>
                <div>
                  <div className="sidebar-item-title" dangerouslySetInnerHTML={{__html: post.title.rendered}} />
                  <div className="sidebar-item-date">{new Date(post.date).toLocaleDateString('es-CR', {day:'numeric', month:'long'})}</div>
                </div>
              </a>
            ))}
          </div>

          <div style={{background:'white', borderRadius:'10px', padding:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', marginTop:'16px'}}>
            <div className="sidebar-title">Síguenos</div>
            <a href="https://facebook.com/Acontecer.co.cr" target="_blank" rel="noopener" title="Síguenos en Facebook"
              style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', borderRadius:'8px', background:'#1877f2', color:'white', marginBottom:'8px', textDecoration:'none', fontWeight:'600', fontSize:'14px'}}>
              📘 Facebook
            </a>
            <a href="https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S" target="_blank" rel="noopener" title="Únete al canal de WhatsApp de Acontecer"
              style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', borderRadius:'8px', background:'#25d366', color:'white', marginBottom:'8px', textDecoration:'none', fontWeight:'600', fontSize:'14px'}}>
              📱 Canal WhatsApp
            </a>
            <a href="https://youtube.com/@acontecercocr" target="_blank" rel="noopener" title="Ver el canal de YouTube de Acontecer"
              style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', borderRadius:'8px', background:'#ff0000', color:'white', marginBottom:'8px', textDecoration:'none', fontWeight:'600', fontSize:'14px'}}>
              ▶ YouTube
            </a>
            <a href="https://tiktok.com/@acontecer.co.cr" target="_blank" rel="noopener" title="Síguenos en TikTok"
              style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', borderRadius:'8px', background:'#111', color:'white', textDecoration:'none', fontWeight:'600', fontSize:'14px'}}>
              🎵 TikTok
            </a>
          </div>
        </aside>
      </div>

      <div style={{background:'linear-gradient(135deg, #00007a, #0000A2)', padding:'40px 20px', margin:'0'}}>
        <div className="stats-grid">
          {[
            {num:'+15M', label:'Vistas mensuales', sub:'en Facebook'},
            {num:'+50K', label:'Lectores únicos', sub:'cada mes'},
            {num:'+1,200', label:'Artículos', sub:'publicados'},
            {num:'2022', label:'Fundados en', sub:'Costa Rica'},
          ].map(s => (
            <div key={s.label}>
              <div style={{fontFamily:'Playfair Display, serif', fontSize:'clamp(28px,4vw,42px)', fontWeight:'900', color:'white', marginBottom:'6px'}}>{s.num}</div>
              <div style={{color:'rgba(255,255,255,0.9)', fontSize:'14px', fontWeight:'600'}}>{s.label}</div>
              <div style={{color:'rgba(255,255,255,0.5)', fontSize:'12px'}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:'#f4f6fa', padding:'50px 20px'}}>
        <div style={{maxWidth:'1500px', margin:'0 auto'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px'}}>
            <div>
              <div style={{fontSize:'11px', color:'#ff0000', fontWeight:'700', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'6px'}}>▶ Canal de YouTube</div>
              <h2 style={{fontFamily:'Playfair Display, serif', fontSize:'28px', fontWeight:'700', color:'#0000A2'}}>Últimas entrevistas y coberturas</h2>
            </div>
            <a href="https://youtube.com/@acontecercocr" target="_blank" rel="noopener" title="Ver el canal de YouTube de Acontecer"
              style={{background:'#ff0000', color:'white', padding:'10px 20px', borderRadius:'8px', fontSize:'13px', fontWeight:'700', textDecoration:'none', flexShrink:0}}>
              Ver canal →
            </a>
          </div>
          <div className="youtube-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px'}}>
            {videos.map((v) => (
              <div key={v.id} style={{borderRadius:'12px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', background:'white'}}>
                <div style={{position:'relative', paddingBottom:'56.25%', height:0}}>
                  <YoutubeEmbed id={v.id} title={v.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:'linear-gradient(135deg, #0000A2, #0a73ce)', padding:'50px 20px', textAlign:'center'}}>
        <div style={{maxWidth:'700px', margin:'0 auto'}}>
          <div style={{fontSize:'48px', marginBottom:'16px'}}>📱</div>
          <h2 style={{fontFamily:'Playfair Display, serif', fontSize:'clamp(24px,4vw,36px)', fontWeight:'700', color:'white', marginBottom:'12px'}}>
            Reciba las noticias en tiempo real
          </h2>
          <p style={{color:'rgba(255,255,255,0.85)', fontSize:'16px', marginBottom:'28px', lineHeight:1.6}}>
            Únase a nuestro canal de WhatsApp y sea el primero en enterarse de lo que pasa en Costa Rica y el mundo.
          </p>
          <a href="https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S" target="_blank" rel="noopener"
            title="Unirse al canal de WhatsApp de Acontecer"
            style={{background:'white', color:'#0000A2', padding:'14px 36px', borderRadius:'50px', fontSize:'16px', fontWeight:'800', display:'inline-block', boxShadow:'0 4px 15px rgba(0,0,0,0.2)'}}>
            Unirse al canal de WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
