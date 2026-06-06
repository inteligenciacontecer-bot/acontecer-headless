import type { Metadata } from 'next';
import Link from 'next/link';
import { readFileSync } from 'fs';
import { join } from 'path';
import './combustible.css';
import CalculadoraCombustible from '@/components/CalculadoraCombustible';

export const revalidate = 86400;

const URL_PAGINA = 'https://acontecer.co.cr/precio-combustibles';

interface Combustible { nombre: string; precio: number; nota: string }
interface Precios { vigenteDesde: string; combustibles: Combustible[] }

// ──────────────────────────────────────────────────────────────────────────
// PRECIOS: se actualizan SOLOS vía cron (vps-scripts/scraper_combustibles.py),
// que escribe data/combustibles.json desde RECOPE el 2.º sábado de cada mes.
// Esta constante es solo el FALLBACK si el JSON no existe o falla el scraper.
// Para actualizar a mano: editar data/combustibles.json o estos valores.
// Fuente: https://www.recope.go.cr/productos/precios-nacionales/tabla-precios/
// ──────────────────────────────────────────────────────────────────────────
const PRECIOS_FALLBACK: Precios = {
  vigenteDesde: '2026-06-03',
  combustibles: [
    { nombre: 'Gasolina Súper', precio: 753, nota: '95 octanos' },
    { nombre: 'Gasolina Plus 91', precio: 756, nota: '91 octanos · regular' },
    { nombre: 'Diésel', precio: 670, nota: 'Diésel 50' },
  ],
};

// Lee el JSON generado por el cron. Defensivo: cualquier problema → fallback.
function getPrecios(): Precios {
  try {
    const raw = readFileSync(join(process.cwd(), 'data', 'combustibles.json'), 'utf-8');
    const d = JSON.parse(raw);
    if (d && typeof d.vigenteDesde === 'string'
        && Array.isArray(d.combustibles) && d.combustibles.length >= 3
        && d.combustibles.every((c: any) => typeof c?.precio === 'number' && c.precio > 0)) {
      return { vigenteDesde: d.vigenteDesde, combustibles: d.combustibles };
    }
  } catch { /* archivo ausente o inválido → fallback */ }
  return PRECIOS_FALLBACK;
}

const nf = new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 });

function fechaBonita(iso: string): string {
  const [y, m, d] = (iso || '').split('-').map(Number);
  if (!y || !m || !d) return iso || '';
  return new Date(y, m - 1, d).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function generateMetadata(): Metadata {
  const PRECIOS = getPrecios();
  const sup = PRECIOS.combustibles[0].precio;
  const reg = PRECIOS.combustibles[1].precio;
  const die = PRECIOS.combustibles[2].precio;
  const desc = `Precio de la gasolina y el diésel hoy en Costa Rica: Súper ₡${nf.format(sup)}, Plus 91 ₡${nf.format(reg)} y diésel ₡${nf.format(die)} por litro, según ARESEP. Incluye calculadora de cuánto cuesta llenar el tanque.`;
  return {
    title: 'Precio de la Gasolina y el Diésel Hoy en Costa Rica',
    description: desc,
    alternates: { canonical: URL_PAGINA },
    openGraph: {
      type: 'website',
      url: URL_PAGINA,
      title: 'Precio de la Gasolina y el Diésel Hoy en Costa Rica | Acontecer.co.cr',
      description: desc,
      locale: 'es_CR',
    },
    twitter: { card: 'summary_large_image', title: 'Precio de los Combustibles Hoy en Costa Rica', description: desc },
  };
}

function buildFaq(PRECIOS: Precios) {
  const [sup, reg, die] = PRECIOS.combustibles;
  return [
    {
      q: '¿Cuánto cuesta la gasolina hoy en Costa Rica?',
      a: `El precio al consumidor vigente es de ₡${nf.format(sup.precio)} por litro de gasolina Súper, ₡${nf.format(reg.precio)} la Plus 91 (regular) y ₡${nf.format(die.precio)} el diésel, según las tarifas de ARESEP en vigor desde el ${fechaBonita(PRECIOS.vigenteDesde)}.`,
    },
    {
      q: '¿Quién fija el precio de los combustibles en Costa Rica?',
      a: 'Los precios al consumidor los establece la Autoridad Reguladora de los Servicios Públicos (ARESEP). RECOPE importa y distribuye el combustible, y ARESEP aprueba la tarifa final que se cobra en las estaciones de servicio en todo el país.',
    },
    {
      q: '¿Cada cuánto cambian los precios de la gasolina?',
      a: 'Se revisan de forma mensual. El proceso de ajuste suele iniciar el segundo viernes de cada mes, aunque pueden darse ajustes extraordinarios según las variaciones del precio internacional del petróleo y del tipo de cambio del dólar.',
    },
    {
      q: '¿Por qué la gasolina Plus 91 a veces cuesta más que la Súper?',
      a: 'El precio de cada combustible depende de su estructura de costos internacional, los impuestos y los márgenes, que se calculan por separado. Por eso, en algunos periodos la gasolina regular (Plus 91) puede quedar incluso un poco más cara que la Súper (95 octanos).',
    },
    {
      q: '¿El precio es igual en todas las gasolineras del país?',
      a: 'Sí. A diferencia de otros países, en Costa Rica el precio al consumidor de los combustibles es regulado y uniforme en todo el territorio nacional, por lo que es el mismo en cualquier estación de servicio.',
    },
    {
      q: '¿Cada cuánto se actualiza esta página?',
      a: 'Esta página refleja la tarifa oficial vigente de ARESEP y se actualiza cuando se aprueba un nuevo ajuste de precios.',
    },
  ];
}

export default function CombustiblePage() {
  const PRECIOS = getPrecios();
  const faq = buildFaq(PRECIOS);
  const fechaISO = `${PRECIOS.vigenteDesde}T00:00:00-06:00`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://acontecer.co.cr' },
      { '@type': 'ListItem', position: 2, name: 'Economía', item: 'https://acontecer.co.cr/categoria/economia' },
      { '@type': 'ListItem', position: 3, name: 'Precio de combustibles', item: URL_PAGINA },
    ],
  };
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${URL_PAGINA}#webpage`,
    url: URL_PAGINA,
    name: 'Precio de la Gasolina y el Diésel Hoy en Costa Rica',
    description: 'Precio al consumidor vigente de la gasolina Súper, Plus 91 y diésel en Costa Rica según ARESEP, con calculadora de costo por litros.',
    inLanguage: 'es-CR',
    datePublished: '2026-06-05T06:00:00-06:00',
    dateModified: fechaISO,
    isPartOf: { '@type': 'WebSite', '@id': 'https://acontecer.co.cr/#website', name: 'Acontecer.co.cr', url: 'https://acontecer.co.cr' },
    publisher: {
      '@type': 'NewsMediaOrganization',
      '@id': 'https://acontecer.co.cr/#organization',
      name: 'Acontecer.co.cr',
      url: 'https://acontecer.co.cr',
      logo: { '@type': 'ImageObject', url: 'https://acontecer.co.cr/logo.png', width: 600, height: 94 },
    },
    about: { '@type': 'Thing', name: 'Precio de los combustibles en Costa Rica' },
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

      <main className="cb-wrap">
        <nav className="cb-crumbs" aria-label="Migas de pan">
          <Link href="/">Inicio</Link>
          <span aria-hidden="true">›</span>
          <Link href="/categoria/economia">Economía</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Combustibles</span>
        </nav>

        <header className="cb-head">
          <span className="cb-eyebrow">Servicio · ARESEP / RECOPE</span>
          <h1 className="cb-title">Precio de la gasolina y el diésel hoy en Costa Rica</h1>
          <p className="cb-lead">
            Precio al consumidor vigente de los combustibles según ARESEP, igual en todas las estaciones del país.
            Vigente desde el {fechaBonita(PRECIOS.vigenteDesde)}.
          </p>
        </header>

        {/* Tarjetas de precio */}
        <section className="cb-cards" aria-label="Precios de combustibles vigentes">
          {PRECIOS.combustibles.map((c) => (
            <div key={c.nombre} className="cb-card">
              <span className="cb-card-name">{c.nombre}</span>
              <span className="cb-card-price"><span className="cb-card-sym">₡</span>{nf.format(c.precio)}</span>
              <span className="cb-card-unit">por litro · {c.nota}</span>
            </div>
          ))}
        </section>
        <p className="cb-source">Fuente: ARESEP / RECOPE · precio al consumidor vigente desde el {fechaBonita(PRECIOS.vigenteDesde)}.</p>

        {/* Calculadora */}
        <CalculadoraCombustible combustibles={PRECIOS.combustibles} />

        {/* Contenido */}
        <section className="cb-prose">
          <h2>¿Quién decide el precio de los combustibles?</h2>
          <p>
            En Costa Rica el precio al consumidor lo fija la <strong>Autoridad Reguladora de los Servicios Públicos
            (ARESEP)</strong>. RECOPE es la empresa estatal que importa y distribuye el combustible, y ARESEP aprueba la
            tarifa final que se cobra en las gasolineras. Por eso el precio es <strong>el mismo en todo el país</strong>,
            sin importar la estación de servicio.
          </p>
          <h2>¿Cada cuánto cambia el precio?</h2>
          <p>
            Los precios se revisan mensualmente, y el ajuste suele tramitarse alrededor del segundo viernes de cada mes.
            También pueden darse ajustes extraordinarios cuando el precio internacional del petróleo o el tipo de cambio
            del dólar varían de forma marcada.
          </p>
          <h2>¿Qué hace subir o bajar el precio?</h2>
          <p>
            Influyen el precio internacional del crudo y de los derivados, el tipo de cambio del dólar (RECOPE compra en
            dólares), el impuesto único a los combustibles, los subsidios y los márgenes de RECOPE, del transportista y
            de la estación de servicio. Cuando el barril sube o el colón se debilita, la tarifa tiende a aumentar.
          </p>
          <p className="cb-disclaimer">
            <strong>Importante:</strong> los valores corresponden a la tarifa oficial vigente de ARESEP y tienen carácter
            informativo. Para la resolución tarifaria detallada, consulte los sitios oficiales de ARESEP y RECOPE.
          </p>
        </section>

        {/* FAQ */}
        <section className="cb-faq" aria-label="Preguntas frecuentes sobre el precio de los combustibles">
          <h2 className="cb-faq-title">Preguntas frecuentes</h2>
          {faq.map((f, i) => (
            <details key={i} className="cb-faq-item">
              <summary className="cb-faq-q">{f.q}</summary>
              <p className="cb-faq-a">{f.a}</p>
            </details>
          ))}
        </section>

        <footer className="cb-footer">
          <p className="cb-updated">Tarifa oficial de ARESEP. Se actualiza con cada nuevo ajuste de precios.</p>
          <p className="cb-links">
            Más servicios:{' '}
            <Link href="/tipo-de-cambio">Tipo de cambio</Link> ·{' '}
            <Link href="/clima">Clima</Link> ·{' '}
            <Link href="/categoria/economia">Economía</Link>
          </p>
        </footer>
      </main>
    </>
  );
}
