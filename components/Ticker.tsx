const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

function decodeHtml(html: string): string {
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

async function getLatestPosts() {
  const res = await fetch(API + '/posts?per_page=6&_embed', { next: { revalidate: 300 } });
  return res.json();
}

export default async function Ticker() {
  const posts = await getLatestPosts();

  // Renderizamos los titulares DOS veces para el loop sin salto:
  // La animación va de translateX(0) → translateX(-50%) y se repite.
  // Cuando el primer bloque sale por la izquierda, el segundo (idéntico)
  // ya está en pantalla — efecto marquee continuo y sin corte.
  const items = (posts as any[]).map((p: any) => ({
    id:      p.id,
    title:   decodeHtml(p.title.rendered),
    catSlug: (p._embedded?.['wp:term']?.[0]?.[0]?.slug as string) || 'nacionales',
    slug:    p.slug as string,
  }));

  return (
    <div className="ticker-sticky" style={{
      background:    '#fff',
      borderBottom:  '1px solid #e5e7eb',
      overflow:      'hidden',
      whiteSpace:    'nowrap',
      width:         '100%',
      height:        '40px',
      display:       'flex',
      alignItems:    'center',
      gap:           0,
      position:      'sticky',
      top:           60,
      zIndex:        110,
    }}>
      {/* Etiqueta "Última hora" */}
      <div style={{
        flexShrink:     0,
        display:        'inline-flex',
        alignItems:     'center',
        gap:            6,
        fontFamily:     "'JetBrains Mono', ui-monospace, monospace",
        fontSize:       10,
        fontWeight:     600,
        letterSpacing:  '0.16em',
        textTransform:  'uppercase',
        color:          '#fff',
        background:     '#0a73ce',
        padding:        '5px 12px',
        borderRadius:   4,
        margin:         '0 18px 0 16px',
        height:         28,
      }}>
        <span style={{
          width:       6,
          height:      6,
          background:  '#fff',
          borderRadius:'50%',
          animation:   'ticker-pulse 1.4s ease-in-out infinite',
          display:     'inline-block',
        }} />
        Última hora
      </div>

      {/* Marquee — duplicado para loop continuo sin salto */}
      {/* position:relative + span absolute → el span animado queda FUERA del flujo
          del documento y no puede expandir el ancho de la página en móvil */}
      <div style={{ overflow: 'hidden', flex: 1, minWidth: 0, height: '100%', position: 'relative' }}>
        <span style={{
          position:   'absolute',
          top:        0,
          left:       0,
          height:     '100%',
          display:    'inline-flex',
          alignItems: 'center',
          animation:  'ticker-scroll 35s linear infinite',
          whiteSpace: 'nowrap',
        }}>
          {/* Primera copia */}
          {items.map((item) => (
            <a
              key={item.id}
              href={'/' + item.catSlug + '/' + item.slug}
              style={{ color: '#1f2937', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}
            >
              <span style={{ color: '#0a73ce', paddingRight: 6 }}>›</span>
              {item.title}
              <span style={{ paddingRight: 48 }} />
            </a>
          ))}
          {/* Segunda copia idéntica — cierra el loop sin salto */}
          {items.map((item) => (
            <a
              key={'b-' + item.id}
              href={'/' + item.catSlug + '/' + item.slug}
              aria-hidden="true"
              style={{ color: '#1f2937', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}
            >
              <span style={{ color: '#0a73ce', paddingRight: 6 }}>›</span>
              {item.title}
              <span style={{ paddingRight: 48 }} />
            </a>
          ))}
        </span>
      </div>

      <style>{`
        .ticker-sticky { position: sticky; top: 60px; z-index: 110; }
        @media (min-width: 1100px) { .ticker-sticky { top: 80px; } }
        @keyframes ticker-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: .35; }
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
