import type { Metadata } from 'next';
import Link from 'next/link';
import { readFileSync } from 'fs';
import { join } from 'path';
import './loteria.css';

// ISR: se re-lee el JSON cada 10 min → los resultados aparecen rápido tras cada sorteo.
export const revalidate = 600;

const URL_PAGINA = 'https://acontecer.co.cr/resultados-loteria';

interface Sorteo { etiqueta: string; numeros: string[]; serie?: string }
interface Juego { clave: string; nombre: string; fecha?: string | null; sorteos: Sorteo[] }
interface Resultados { actualizado: string; fuente: string; juegos: Juego[] }

// ──────────────────────────────────────────────────────────────────────────
// Los resultados se actualizan SOLOS vía cron (vps-scripts/scraper_loteria.py),
// que escribe data/loteria.json tras cada sorteo. Esta constante es el FALLBACK
// si el JSON no existe o falla el scraper.
// Fuente: jpsloteria.com (republica resultados oficiales de la JPS).
// ──────────────────────────────────────────────────────────────────────────
const FALLBACK: Resultados = {
  actualizado: '2026-06-06T05:00:00-06:00',
  fuente: 'Junta de Protección Social (JPS)',
  juegos: [
    { clave: 'nuevos-tiempos', nombre: 'Nuevos Tiempos', fecha: 'Viernes 5 de Junio de 2026', sorteos: [
      { etiqueta: 'Mediodía', numeros: ['42'] }, { etiqueta: 'Tarde', numeros: ['13'] }, { etiqueta: 'Noche', numeros: ['96'] } ] },
    { clave: '3-monazos', nombre: '3 Monazos', fecha: 'Viernes 5 de Junio de 2026', sorteos: [
      { etiqueta: 'Mediodía', numeros: ['025'] }, { etiqueta: 'Tarde', numeros: ['709'] }, { etiqueta: 'Noche', numeros: ['548'] } ] },
    { clave: 'lotto', nombre: 'Lotto', fecha: 'Miércoles 3 de Junio de 2026', sorteos: [
      { etiqueta: 'Lotto', numeros: ['3', '8', '24', '29', '35'] }, { etiqueta: 'Revancha', numeros: ['0', '1', '3', '7', '37'] } ] },
    { clave: 'loteria-nacional', nombre: 'Lotería Nacional', fecha: 'Domingo 31 de Mayo de 2026', sorteos: [
      { etiqueta: 'Primer premio', numeros: ['29'], serie: '126' } ] },
    { clave: 'chances', nombre: 'Chances', fecha: 'Viernes 5 de Junio de 2026', sorteos: [
      { etiqueta: 'Primer premio', numeros: ['96'], serie: '300' } ] },
  ],
};

function getResultados(): Resultados {
  try {
    const raw = readFileSync(join(process.cwd(), 'data', 'loteria.json'), 'utf-8');
    const d = JSON.parse(raw);
    if (d && Array.isArray(d.juegos) && d.juegos.length >= 3
        && d.juegos.every((j: any) => j?.nombre && Array.isArray(j?.sorteos) && j.sorteos.length > 0)) {
      return { actualizado: d.actualizado || new Date().toISOString(), fuente: d.fuente || 'Junta de Protección Social (JPS)', juegos: d.juegos };
    }
  } catch { /* archivo ausente o inválido → fallback */ }
  return FALLBACK;
}

function fechaActualizada(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es-CR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hour12: true });
  } catch { return ''; }
}

export function generateMetadata(): Metadata {
  const r = getResultados();
  const nt = r.juegos.find((j) => j.clave === 'nuevos-tiempos');
  const ntTxt = nt ? ` Nuevos Tiempos: ${nt.sorteos.map((s) => s.numeros.join('-')).join(', ')}.` : '';
  const desc = `Resultados de la lotería de Costa Rica hoy: Nuevos Tiempos, 3 Monazos, Lotería Nacional, Lotto y Chances de la JPS, actualizados automáticamente.${ntTxt}`;
  return {
    title: 'Resultados de la Lotería de Costa Rica Hoy — JPS',
    description: desc,
    alternates: { canonical: URL_PAGINA },
    openGraph: {
      type: 'website',
      url: URL_PAGINA,
      title: 'Resultados de la Lotería de Costa Rica Hoy — JPS | Acontecer.co.cr',
      description: desc,
      locale: 'es_CR',
    },
    twitter: { card: 'summary_large_image', title: 'Resultados de la Lotería de Costa Rica Hoy', description: desc },
  };
}

function buildFaq(r: Resultados) {
  const nt = r.juegos.find((j) => j.clave === 'nuevos-tiempos');
  const ntHoy = nt
    ? `Los últimos números de Nuevos Tiempos son ${nt.sorteos.map((s) => `${s.numeros.join('-')} (${s.etiqueta.toLowerCase()})`).join(', ')}${nt.fecha ? `, del sorteo del ${nt.fecha}` : ''}.`
    : 'Los resultados de los sorteos de la JPS se publican en esta página y se actualizan de forma automática.';
  return [
    { q: '¿Cuáles son los resultados de Nuevos Tiempos hoy?', a: ntHoy },
    {
      q: '¿A qué hora son los sorteos de Nuevos Tiempos y 3 Monazos?',
      a: 'Nuevos Tiempos y 3 Monazos tienen tres sorteos al día, de lunes a domingo: el de mediodía (alrededor de las 12:55 p. m.), el de la tarde (cerca de las 4:30 p. m.) y el de la noche (aproximadamente a las 7:30 p. m.).',
    },
    {
      q: '¿Cuándo se juega la Lotería Nacional, el Lotto y los Chances?',
      a: 'La Lotería Nacional se sortea los domingos y en fechas especiales; el Lotto (con su Revancha) los miércoles y sábados; y los Chances (Lotería Popular) los martes y viernes.',
    },
    {
      q: '¿Cómo se cobra un premio de la lotería en Costa Rica?',
      a: 'Los premios menores se pueden cobrar con vendedores autorizados y en comercios afiliados; los premios mayores se cobran directamente en la Junta de Protección Social (JPS). Conserve el billete o tiquete original, que es el documento que respalda el premio.',
    },
    {
      q: '¿De dónde provienen estos resultados?',
      a: 'Los resultados corresponden a los sorteos oficiales de la Junta de Protección Social (JPS) y se actualizan de forma automática en esta página después de cada sorteo. Ante cualquier diferencia, el dato oficial es el que publica la JPS.',
    },
    {
      q: '¿Cada cuánto se actualiza esta página?',
      a: 'Esta página se actualiza automáticamente varias veces al día, después de cada sorteo, con los últimos resultados disponibles.',
    },
  ];
}

export default function LoteriaPage() {
  const r = getResultados();
  const faq = buildFaq(r);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://acontecer.co.cr' },
      { '@type': 'ListItem', position: 2, name: 'Resultados de la lotería', item: URL_PAGINA },
    ],
  };
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${URL_PAGINA}#webpage`,
    url: URL_PAGINA,
    name: 'Resultados de la Lotería de Costa Rica Hoy — JPS',
    description: 'Resultados de los sorteos de la lotería de Costa Rica (JPS): Nuevos Tiempos, 3 Monazos, Lotería Nacional, Lotto y Chances, actualizados automáticamente.',
    inLanguage: 'es-CR',
    datePublished: '2026-06-06T06:00:00-06:00',
    dateModified: r.actualizado,
    isPartOf: { '@type': 'WebSite', '@id': 'https://acontecer.co.cr/#website', name: 'Acontecer.co.cr', url: 'https://acontecer.co.cr' },
    publisher: {
      '@type': 'NewsMediaOrganization',
      '@id': 'https://acontecer.co.cr/#organization',
      name: 'Acontecer.co.cr',
      url: 'https://acontecer.co.cr',
      logo: { '@type': 'ImageObject', url: 'https://acontecer.co.cr/logo.png', width: 600, height: 94 },
    },
    about: { '@type': 'Thing', name: 'Resultados de la lotería de la Junta de Protección Social de Costa Rica' },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="lt-wrap">
        <nav className="lt-crumbs" aria-label="Migas de pan">
          <Link href="/">Inicio</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Resultados de lotería</span>
        </nav>

        <header className="lt-head">
          <span className="lt-eyebrow">Resultados oficiales · JPS</span>
          <h1 className="lt-title">Resultados de la lotería de Costa Rica hoy</h1>
          <p className="lt-lead">
            Últimos números de los sorteos de la Junta de Protección Social: Nuevos Tiempos, 3 Monazos, Lotería
            Nacional, Lotto y Chances. Se actualizan automáticamente después de cada sorteo.
          </p>
        </header>

        {/* Tarjetas por juego */}
        <section className="lt-juegos" aria-label="Resultados por juego">
          {r.juegos.map((j) => (
            <article key={j.clave} className={`lt-juego lt-juego--${j.clave}`}>
              <div className="lt-juego-head">
                <h2 className="lt-juego-nombre">{j.nombre}</h2>
                {j.fecha && <span className="lt-juego-fecha">{j.fecha}</span>}
              </div>
              <div className="lt-sorteos">
                {j.sorteos.map((s, i) => (
                  <div key={i} className="lt-sorteo">
                    <span className="lt-sorteo-lbl">{s.etiqueta}</span>
                    <span className="lt-bolas">
                      {s.numeros.map((n, k) => (
                        <span key={k} className="lt-bola">{n}</span>
                      ))}
                    </span>
                    {s.serie && <span className="lt-serie">Serie <b>{s.serie}</b></span>}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <p className="lt-source">
          Fuente: Junta de Protección Social (JPS) · actualizado el {fechaActualizada(r.actualizado)}.
        </p>

        {/* Contenido */}
        <section className="lt-prose">
          <h2>Horarios de los sorteos de la JPS</h2>
          <p>
            <strong>Nuevos Tiempos</strong> y <strong>3 Monazos</strong> se juegan tres veces al día, todos los días:
            mediodía (~12:55 p. m.), tarde (~4:30 p. m.) y noche (~7:30 p. m.). La <strong>Lotería Nacional</strong> se
            sortea los domingos; el <strong>Lotto</strong> y su Revancha, los miércoles y sábados; y los
            <strong> Chances</strong> (Lotería Popular), los martes y viernes.
          </p>
          <h2>¿Cómo se cobran los premios?</h2>
          <p>
            Los premios menores se cobran con vendedores autorizados y comercios afiliados, mientras que los premios
            mayores se pagan directamente en la Junta de Protección Social. Es indispensable conservar el billete o
            tiquete original en buen estado, ya que es el documento que respalda el premio.
          </p>
          <p className="lt-disclaimer">
            <strong>Importante:</strong> esta página tiene carácter informativo y reproduce los resultados de los
            sorteos de la JPS. Ante cualquier diferencia, el resultado oficial y válido es el que publica la Junta de
            Protección Social.
          </p>
        </section>

        {/* FAQ */}
        <section className="lt-faq" aria-label="Preguntas frecuentes sobre la lotería">
          <h2 className="lt-faq-title">Preguntas frecuentes</h2>
          {faq.map((f, i) => (
            <details key={i} className="lt-faq-item">
              <summary className="lt-faq-q">{f.q}</summary>
              <p className="lt-faq-a">{f.a}</p>
            </details>
          ))}
        </section>

        <footer className="lt-footer">
          <p className="lt-updated">Resultados de la Junta de Protección Social (JPS), actualizados automáticamente.</p>
          <p className="lt-links">
            Más servicios:{' '}
            <Link href="/tipo-de-cambio">Tipo de cambio</Link> ·{' '}
            <Link href="/clima">Clima</Link> ·{' '}
            <Link href="/precio-combustibles">Combustibles</Link>
          </p>
        </footer>
      </main>
    </>
  );
}
