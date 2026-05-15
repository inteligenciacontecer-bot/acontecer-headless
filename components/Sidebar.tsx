import NoImage from '@/components/NoImage';

const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

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

async function getClima() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=9.9281&longitude=-84.0907&current=temperature_2m,weathercode,windspeed_10m&timezone=America/Costa_Rica', { next: { revalidate: 1800 } });
    const data = await res.json();
    const code = data.current.weathercode;
    const temp = Math.round(data.current.temperature_2m);
    const icons: { [key: number]: string } = { 0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'⛈️',80:'🌦️',81:'🌧️',82:'⛈️',95:'⛈️' };
    const descriptions: { [key: number]: string } = { 0:'Despejado',1:'Mayormente despejado',2:'Parcialmente nublado',3:'Nublado',45:'Neblina',51:'Llovizna',55:'Llovizna fuerte',61:'Lluvia leve',63:'Lluvia',65:'Lluvia fuerte',80:'Chubascos',95:'Tormenta' };
    return { temp, icon: icons[code] || '🌡️', desc: descriptions[code] || 'Variable' };
  } catch { return null; }
}

async function getUltimasNoticias() {
  try {
    const res = await fetch(API + '/posts?per_page=5&_embed', { next: { revalidate: 300 } });
    return res.json();
  } catch { return []; }
}

async function getNoticiasCategoria(cat: string) {
  try {
    const catRes = await fetch(API + '/categories?slug=' + cat, { next: { revalidate: 3600 } });
    const cats = await catRes.json();
    if (!cats[0]) return [];
    const res = await fetch(API + '/posts?categories=' + cats[0].id + '&per_page=4&_embed', { next: { revalidate: 300 } });
    return res.json();
  } catch { return []; }
}

export default async function Sidebar({ related, catSlug }: { related: any[], catSlug: string }) {
  const otherCat = catSlug === 'nacionales' ? 'deportes' : 'nacionales';
  const [tipoCambio, clima, ultimas, noticiasOtra] = await Promise.all([
    getTipoCambio(), getClima(), getUltimasNoticias(), getNoticiasCategoria(otherCat)
  ]);
  const ahora = new Date().toLocaleDateString('es-CR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const catLabels: { [key: string]: string } = { nacionales:'Nacionales', deportes:'Deportes', internacionales:'Internacionales', economia:'Economía', entretenimiento:'Entretenimiento' };

  return (
    <aside className="nota-sidebar-sticky">
      {/* FECHA + CLIMA */}
      <div style={{background:'white', borderRadius:'10px', padding:'16px 20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', marginBottom:'16px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontSize:'11px', color:'#0a73ce', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>Hoy</div>
            <div style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'13px', color:'#333', textTransform:'capitalize'}}>{ahora}</div>
          </div>
          {clima && (
            <div style={{textAlign:'center', background:'#f0f7ff', borderRadius:'10px', padding:'10px 14px'}}>
              <div style={{fontSize:'28px', lineHeight:1}}>{clima.icon}</div>
              <div style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'18px', fontWeight:'700', color:'#0000A2'}}>{clima.temp}°C</div>
              <div style={{fontSize:'11px', color:'#888'}}>San José</div>
            </div>
          )}
        </div>
        {clima && <div style={{fontSize:'12px', color:'#666', marginTop:'8px', textAlign:'center'}}>{clima.desc}</div>}
      </div>

      {/* TIPO DE CAMBIO */}
      <div style={{background:'white', borderRadius:'10px', padding:'16px 20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', marginBottom:'16px'}}>
        <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'14px', fontWeight:'700', color:'#0000A2', marginBottom:'12px', paddingBottom:'8px', borderBottom:'2px solid #0000A2'}}>
          💵 Tipo de Cambio · BCCR
        </h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
          <div style={{background:'#f0f7ff', borderRadius:'8px', padding:'12px', textAlign:'center'}}>
            <div style={{fontSize:'11px', color:'#888', marginBottom:'4px', textTransform:'uppercase'}}>Compra</div>
            <div style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'20px', fontWeight:'700', color:'#0000A2'}}>₡{tipoCambio?.compra || 'N/D'}</div>
          </div>
          <div style={{background:'#f0f7ff', borderRadius:'8px', padding:'12px', textAlign:'center'}}>
            <div style={{fontSize:'11px', color:'#888', marginBottom:'4px', textTransform:'uppercase'}}>Venta</div>
            <div style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'20px', fontWeight:'700', color:'#0a73ce'}}>₡{tipoCambio?.venta || 'N/D'}</div>
          </div>
        </div>
      </div>

      {/* BANNER */}
      <div style={{background:'linear-gradient(135deg, #0000A2, #0a73ce)', borderRadius:'10px', padding:'24px 20px', textAlign:'center', color:'white', marginBottom:'16px'}}>
        <p style={{fontSize:'11px', opacity:0.7, marginBottom:'6px', textTransform:'uppercase', letterSpacing:'1px'}}>Espacio publicitario</p>
        <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'17px', marginBottom:'10px', lineHeight:1.3}}>Llegue a miles de lectores</h3>
        <p style={{fontSize:'12px', opacity:0.8, marginBottom:'14px'}}>+15M vistas mensuales en Facebook</p>
        <a href="/pauta" style={{background:'white', color:'#0000A2', padding:'8px 20px', borderRadius:'20px', fontSize:'12px', fontWeight:'700', display:'inline-block'}}>Ver Media Kit</a>
      </div>

      {/* NOTICIAS RELACIONADAS */}
      {related.length > 0 && (
        <div style={{background:'white', borderRadius:'10px', padding:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', marginBottom:'16px'}}>
          <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'15px', fontWeight:'700', color:'#0000A2', marginBottom:'16px', paddingBottom:'10px', borderBottom:'2px solid #0000A2'}}>
            Noticias relacionadas
          </h3>
          {related.map((p: any) => (
            <a key={p.id} href={'/' + catSlug + '/' + p.slug} style={{display:'flex', gap:'10px', padding:'10px 0', borderBottom:'1px solid #f0f0f0', textDecoration:'none'}}>
              <div style={{width:'70px', height:'55px', borderRadius:'6px', flexShrink:0, overflow:'hidden', background:'#e8f0fe'}}>
                {p._embedded?.['wp:featuredmedia']?.[0]?.source_url
                  ? <img src={p._embedded['wp:featuredmedia'][0].source_url} alt={p.title?.rendered?.replace(/<[^>]+>/g, '') || ''} style={{width:'70px', height:'55px', objectFit:'cover'}} />
                  : <NoImage />}
              </div>
              <div style={{fontSize:'13px', fontWeight:'600', color:'#333', lineHeight:1.4}} dangerouslySetInnerHTML={{__html: p.title.rendered}} />
            </a>
          ))}
        </div>
      )}

      {/* ULTIMAS NOTICIAS */}
      {ultimas.length > 0 && (
        <div style={{background:'white', borderRadius:'10px', padding:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', marginBottom:'16px'}}>
          <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'15px', fontWeight:'700', color:'#0000A2', marginBottom:'16px', paddingBottom:'10px', borderBottom:'2px solid #0000A2'}}>
            Últimas noticias
          </h3>
          {ultimas.map((p: any, i: number) => {
            const pCatSlug = p._embedded?.['wp:term']?.[0]?.[0]?.slug || 'nacionales';
            return (
              <a key={p.id} href={`/${pCatSlug}/${p.slug}`} style={{display:'flex', gap:'10px', padding:'10px 0', borderBottom:'1px solid #f0f0f0', textDecoration:'none', alignItems:'flex-start'}}>
                <div style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'22px', fontWeight:'900', color:'#e8f0fe', lineHeight:1, minWidth:'28px', flexShrink:0}}>{i + 1}</div>
                <div style={{fontSize:'13px', fontWeight:'600', color:'#333', lineHeight:1.4}} dangerouslySetInnerHTML={{__html: p.title.rendered}} />
              </a>
            );
          })}
        </div>
      )}

      {/* REDES SOCIALES */}
      <div style={{background:'white', borderRadius:'10px', padding:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', marginBottom:'16px'}}>
        <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'15px', fontWeight:'700', color:'#0000A2', marginBottom:'16px', paddingBottom:'10px', borderBottom:'2px solid #0000A2'}}>
          Síguenos
        </h3>
        <a href="https://facebook.com/Acontecer.co.cr" target="_blank" rel="noopener"
          style={{display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', borderRadius:'8px', background:'#1877f2', color:'white', marginBottom:'8px', textDecoration:'none', fontWeight:'600', fontSize:'14px'}}>
          📘 Facebook
        </a>
        <a href="https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S" target="_blank" rel="noopener"
          style={{display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', borderRadius:'8px', background:'#25d366', color:'white', marginBottom:'8px', textDecoration:'none', fontWeight:'600', fontSize:'14px'}}>
          📱 Canal WhatsApp
        </a>
        <a href="https://tiktok.com/@acontecer.co.cr" target="_blank" rel="noopener"
          style={{display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', borderRadius:'8px', background:'#111', color:'white', textDecoration:'none', fontWeight:'600', fontSize:'14px'}}>
          🎵 TikTok
        </a>
      </div>

      {/* NOTICIAS DE OTRA CATEGORIA - solo desktop */}
      {noticiasOtra.length > 0 && (
        <div className="sidebar-desktop-only" style={{background:'white', borderRadius:'10px', padding:'20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', marginBottom:'16px'}}>
          <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'15px', fontWeight:'700', color:'#0000A2', marginBottom:'16px', paddingBottom:'10px', borderBottom:'2px solid #0000A2'}}>
            Lo último en {catLabels[otherCat] || otherCat}
          </h3>
          {noticiasOtra.map((p: any) => (
            <a key={p.id} href={'/' + otherCat + '/' + p.slug} style={{display:'flex', gap:'10px', padding:'10px 0', borderBottom:'1px solid #f0f0f0', textDecoration:'none'}}>
              <div style={{width:'70px', height:'55px', borderRadius:'6px', flexShrink:0, overflow:'hidden', background:'#e8f0fe'}}>
                {p._embedded?.['wp:featuredmedia']?.[0]?.source_url
                  ? <img src={p._embedded['wp:featuredmedia'][0].source_url} alt={p.title?.rendered?.replace(/<[^>]+>/g, '') || ''} style={{width:'70px', height:'55px', objectFit:'cover'}} />
                  : <NoImage />}
              </div>
              <div style={{fontSize:'13px', fontWeight:'600', color:'#333', lineHeight:1.4}} dangerouslySetInnerHTML={{__html: p.title.rendered}} />
            </a>
          ))}
          <a href={'/categoria/' + otherCat} style={{display:'block', textAlign:'center', marginTop:'12px', color:'#0a73ce', fontSize:'13px', fontWeight:'600'}}>
            Ver todo en {catLabels[otherCat]} →
          </a>
        </div>
      )}

      {/* BANNER AGENCIA - solo desktop */}
      <div className="sidebar-desktop-only" style={{background:'linear-gradient(135deg, #0a0a2e, #0000A2)', borderRadius:'10px', padding:'28px 20px', textAlign:'center', color:'white'}}>
        <div style={{fontSize:'36px', marginBottom:'12px'}}>📣</div>
        <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'18px', marginBottom:'10px', lineHeight:1.3}}>Agencia de Comunicación</h3>
        <p style={{fontSize:'13px', opacity:0.8, marginBottom:'16px', lineHeight:1.6}}>Redacción profesional, redes sociales y estrategia digital para su empresa</p>
        <a href="/agencia" style={{background:'white', color:'#0000A2', padding:'10px 24px', borderRadius:'20px', fontSize:'13px', fontWeight:'700', display:'inline-block'}}>Conocer más</a>
      </div>
    </aside>
  );
}
