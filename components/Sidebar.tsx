import NoImage from '@/components/NoImage';

// SEO: reescribir URLs del CMS a dominio principal
const cmsToLocal = (u?: string | null) => u ? u.replace(/^https?:\/\/cms\.acontecer\.co\.cr\//i, 'https://acontecer.co.cr/') : u;


const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

async function getTipoCambio() {
  try {
    const res = await fetch('https://tipodecambio.paginasweb.cr/api', { next: { revalidate: 3600 } });
    const data = await res.json();
    if (data.compra && data.venta) {
      return {
        compra: parseFloat(data.compra).toFixed(2),
        venta:  parseFloat(data.venta).toFixed(2),
      };
    }
    return null;
  } catch { return null; }
}

async function getClima() {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=9.9281&longitude=-84.0907' +
      '&current=temperature_2m,weathercode' +
      '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
      '&timezone=America/Costa_Rica&forecast_days=1',
      { next: { revalidate: 1800 } }
    );
    const data = await res.json();
    const code = data.current.weathercode;
    const temp = Math.round(data.current.temperature_2m);
    const maxT = Math.round(data.daily?.temperature_2m_max?.[0] ?? temp + 3);
    const minT = Math.round(data.daily?.temperature_2m_min?.[0] ?? temp - 4);
    const rain = data.daily?.precipitation_probability_max?.[0] ?? 0;
    const icons: Record<number, string> = {
      0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',
      51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'⛈️',
      80:'🌦️',81:'🌧️',82:'⛈️',95:'⛈️',
    };
    const descriptions: Record<number, string> = {
      0:'Despejado',1:'Mayormente despejado',2:'Parcialmente nublado',
      3:'Nublado',45:'Neblina',51:'Llovizna',55:'Llovizna fuerte',
      61:'Lluvia leve',63:'Lluvia',65:'Lluvia fuerte',80:'Chubascos',95:'Tormenta',
    };
    return { temp, maxT, minT, rain, icon: icons[code] || '🌡️', desc: descriptions[code] || 'Variable' };
  } catch { return null; }
}

export interface Heading { id: string; text: string; level: number; }

interface SidebarProps {
  related:     any[];
  catSlug:     string;
  headings?:   Heading[];
  readingTime?: number;
}

export default async function Sidebar({ related, catSlug, headings = [], readingTime = 0 }: SidebarProps) {
  const [tipoCambio, clima] = await Promise.all([getTipoCambio(), getClima()]);

  return (
    <aside className="nv2-side">

      {/* PROGRESO DE LECTURA */}
      <div className="nv2-side-card nv2-progress-card">
        <div className="nv2-side-eyebrow">Progreso de lectura</div>
        <div className="nv2-progress-card-row">
          <div className="nv2-progress-card-pct" id="nv2-sidebar-pct">0%</div>
          {readingTime > 0 && (
            <div className="nv2-progress-card-time">{readingTime} MIN LECTURA</div>
          )}
        </div>
        <div className="nv2-progress-card-bar">
          <span id="nv2-sidebar-bar" />
        </div>
      </div>

      {/* TABLA DE CONTENIDOS */}
      {headings.length > 0 && (
        <div className="nv2-side-card nv2-toc-card">
          <div className="nv2-side-eyebrow">En esta nota</div>
          <h3 className="nv2-side-title">Contenido</h3>
          <nav className="nv2-toc">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className={h.level === 3 ? 'nv2-toc-h3' : undefined}
              >
                {h.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* CLIMA */}
      {clima && (
        <div className="nv2-side-card nv2-clima-card">
          <div className="nv2-side-eyebrow">Hoy · San José</div>
          <h3 className="nv2-side-title">Clima</h3>
          <div className="nv2-clima-row">
            <div className="nv2-clima-icon">{clima.icon}</div>
            <div>
              <div className="nv2-clima-temp">{clima.temp}<sup>°C</sup></div>
              <div className="nv2-clima-desc">{clima.desc}</div>
            </div>
          </div>
          <div className="nv2-clima-meta">
            <span>MÁX <b>{clima.maxT}°</b></span>
            <span>MÍN <b>{clima.minT}°</b></span>
            <span>LLUVIA <b>{clima.rain}%</b></span>
          </div>
        </div>
      )}

      {/* TIPO DE CAMBIO */}
      {tipoCambio && (
        <div className="nv2-side-card nv2-cambio-card">
          <div className="nv2-side-eyebrow">BCCR · cierre</div>
          <h3 className="nv2-side-title">Tipo de cambio</h3>
          <div className="nv2-cambio-grid">
            <div className="nv2-cambio-cell">
              <div className="nv2-cambio-lbl">Compra</div>
              <div className="nv2-cambio-val">₡{tipoCambio.compra}</div>
            </div>
            <div className="nv2-cambio-cell">
              <div className="nv2-cambio-lbl">Venta</div>
              <div className="nv2-cambio-val">₡{tipoCambio.venta}</div>
            </div>
          </div>
        </div>
      )}

      {/* RELACIONADAS */}
      {related.length > 0 && (
        <div className="nv2-side-card nv2-related-card">
          <div className="nv2-side-eyebrow">Te puede interesar</div>
          <h3 className="nv2-side-title">Relacionadas</h3>
          {related.slice(0, 4).map((p: any) => {
            const pCat  = p._embedded?.['wp:term']?.[0]?.[0]?.slug || catSlug;
            const pCatN = p._embedded?.['wp:term']?.[0]?.[0]?.name || catSlug;
            const pImg  = cmsToLocal(p._embedded?.['wp:featuredmedia']?.[0]?.source_url);
            return (
              <a key={p.id} href={`/${pCat}/${p.slug}`} className="nv2-related-item">
                <div className="nv2-related-thumb">
                  {pImg
                    ? <img src={pImg} alt={p.title?.rendered?.replace(/<[^>]+>/g, '') || ''} loading="lazy" />
                    : <NoImage />}
                </div>
                <div>
                  <div className="nv2-related-cat">{pCatN}</div>
                  <div
                    className="nv2-related-title"
                    dangerouslySetInnerHTML={{__html: p.title.rendered}}
                  />
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* WHATSAPP CTA */}
      <div className="nv2-side-card nv2-wa-card">
        <div className="nv2-side-eyebrow">Canal oficial</div>
        <h3 className="nv2-side-title">Noticias al instante</h3>
        <p>Únase al canal de WhatsApp de Acontecer y reciba lo más importante de Costa Rica directo en su teléfono.</p>
        <a
          href="https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S"
          target="_blank"
          rel="noopener noreferrer"
          className="nv2-wa-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}>
            <path d="M20.5 3.5A11 11 0 0 0 3.5 17l-1.4 5 5-1.4a11 11 0 0 0 13.4-17z"/>
          </svg>
          Unirse al canal
        </a>
      </div>

      {/* PAUTE CON NOSOTROS */}
      <div className="nv2-side-card nv2-paute-card">
        <div className="nv2-side-eyebrow">Espacio publicitario</div>
        <h3 className="nv2-side-title">Paute con nosotros</h3>
        <p>Llegue a miles de lectores costarricenses. +15M vistas mensuales en nuestras plataformas.</p>
        <a
          href="https://wa.me/50662889467?text=Hola%2C+me+interesa+pautar+en+Acontecer.co.cr"
          target="_blank"
          rel="noopener noreferrer"
          className="nv2-paute-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}>
            <path d="M20.5 3.5A11 11 0 0 0 3.5 17l-1.4 5 5-1.4a11 11 0 0 0 13.4-17z"/>
          </svg>
          Escribir por WhatsApp
        </a>
      </div>

    </aside>
  );
}
