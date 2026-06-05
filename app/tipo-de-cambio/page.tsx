import type { Metadata } from 'next';
import Link from 'next/link';
import './tipo-de-cambio.css';
import ConvertidorDivisas from '@/components/ConvertidorDivisas';

// ISR: la tarifa y el dateModified se refrescan cada hora.
// Una sola URL evergreen que se actualiza sola → acumula autoridad y rankea durable.
export const revalidate = 3600;

const URL_PAGINA = 'https://acontecer.co.cr/tipo-de-cambio';

interface TipoCambio {
  compra: number;
  venta: number;
  fecha: string; // DD/MM/YYYY
}

async function getTipoCambio(): Promise<TipoCambio | null> {
  try {
    const res = await fetch('https://tipodecambio.paginasweb.cr/api', { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const d = await res.json();
    if (d.compra && d.venta) {
      return {
        compra: parseFloat(d.compra),
        venta: parseFloat(d.venta),
        fecha: typeof d.fecha === 'string' ? d.fecha : '',
      };
    }
    return null;
  } catch {
    return null;
  }
}

const nf = new Intl.NumberFormat('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function fechaBonita(f: string): string {
  const [d, m, y] = (f || '').split('/').map(Number);
  if (!d || !m || !y) return f || '';
  return new Date(y, m - 1, d).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function generateMetadata(): Promise<Metadata> {
  const tc = await getTipoCambio();
  const desc = tc
    ? `¿Cuánto está el dólar hoy en Costa Rica? Compra ₡${nf.format(tc.compra)} y venta ₡${nf.format(tc.venta)} según el tipo de cambio de referencia del BCCR. Convertidor de dólares a colones actualizado automáticamente.`
    : 'Tipo de cambio del dólar en Costa Rica hoy: compra y venta según el tipo de cambio de referencia del BCCR. Convertidor de dólares a colones actualizado automáticamente.';
  return {
    title: 'Tipo de Cambio del Dólar Hoy en Costa Rica',
    description: desc,
    alternates: { canonical: URL_PAGINA },
    openGraph: {
      type: 'website',
      url: URL_PAGINA,
      title: 'Tipo de Cambio del Dólar Hoy en Costa Rica | Acontecer.co.cr',
      description: desc,
      locale: 'es_CR',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Tipo de Cambio del Dólar Hoy en Costa Rica',
      description: desc,
    },
  };
}

// FAQ — fuente única para el contenido visible y para el FAQPage schema.
function buildFaq(tc: TipoCambio | null) {
  const hoy = tc
    ? `Hoy el dólar está en ₡${nf.format(tc.venta)} para la venta y ₡${nf.format(tc.compra)} para la compra, según el tipo de cambio de referencia del Banco Central de Costa Rica (BCCR)${tc.fecha ? ` del ${fechaBonita(tc.fecha)}` : ''}.`
    : 'El dólar se cotiza según el tipo de cambio de referencia que publica a diario el Banco Central de Costa Rica (BCCR). Esta página se actualiza automáticamente con el último dato disponible.';
  return [
    {
      q: '¿Cuánto está el dólar hoy en Costa Rica?',
      a: hoy,
    },
    {
      q: '¿Cuál es la diferencia entre el tipo de cambio de compra y de venta?',
      a: 'El de compra es el precio al que las entidades financieras compran los dólares del público (que recibe colones a cambio). El de venta es el precio al que venden dólares (el cliente entrega colones). La venta siempre es más alta que la compra; esa diferencia es el margen de la entidad.',
    },
    {
      q: '¿Qué es el tipo de cambio de referencia del BCCR?',
      a: 'Es un promedio que calcula a diario el Banco Central de Costa Rica con base en las operaciones del mercado mayorista de divisas (Monex). Funciona como referencia oficial, pero cada banco y casa de cambio fija su propia tarifa, que puede ser un poco más alta o más baja.',
    },
    {
      q: '¿Dónde puedo cambiar dólares a colones en Costa Rica?',
      a: 'En los bancos (Banco Nacional, BCR, BAC, Davivienda, Scotiabank, entre otros), en casas de cambio autorizadas y en algunos cajeros automáticos. Conviene comparar, porque cada entidad aplica su propio margen sobre el tipo de cambio de referencia.',
    },
    {
      q: '¿El tipo de cambio del dólar cambia los fines de semana y feriados?',
      a: 'El BCCR publica el dato de referencia únicamente en días hábiles. Durante sábados, domingos y feriados se mantiene el último valor disponible hasta la siguiente actualización.',
    },
    {
      q: '¿Cada cuánto se actualiza esta página?',
      a: 'Esta página se actualiza de forma automática cada hora con el último tipo de cambio de referencia publicado por el Banco Central de Costa Rica. No requiere recargarla de forma manual.',
    },
  ];
}

export default async function TipoCambioPage() {
  const tc = await getTipoCambio();
  const faq = buildFaq(tc);
  const ahoraISO = new Date().toISOString();

  // ── Schema.org ──────────────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://acontecer.co.cr' },
      { '@type': 'ListItem', position: 2, name: 'Economía', item: 'https://acontecer.co.cr/categoria/economia' },
      { '@type': 'ListItem', position: 3, name: 'Tipo de cambio del dólar', item: URL_PAGINA },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${URL_PAGINA}#webpage`,
    url: URL_PAGINA,
    name: 'Tipo de Cambio del Dólar Hoy en Costa Rica',
    description:
      'Tipo de cambio del dólar en Costa Rica hoy: compra y venta según el BCCR, con convertidor de dólares a colones actualizado a diario.',
    inLanguage: 'es-CR',
    datePublished: '2026-06-05T06:00:00-06:00',
    dateModified: ahoraISO,
    isPartOf: { '@type': 'WebSite', '@id': 'https://acontecer.co.cr/#website', name: 'Acontecer.co.cr', url: 'https://acontecer.co.cr' },
    publisher: {
      '@type': 'NewsMediaOrganization',
      '@id': 'https://acontecer.co.cr/#organization',
      name: 'Acontecer.co.cr',
      url: 'https://acontecer.co.cr',
      logo: { '@type': 'ImageObject', url: 'https://acontecer.co.cr/logo.png', width: 600, height: 94 },
    },
    about: { '@type': 'Thing', name: 'Tipo de cambio del dólar estadounidense respecto al colón costarricense' },
    ...(tc && {
      mainEntity: {
        '@type': 'ExchangeRateSpecification',
        currency: 'CRC',
        currentExchangeRate: {
          '@type': 'UnitPriceSpecification',
          price: tc.venta,
          priceCurrency: 'CRC',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: 'USD' },
        },
      },
    }),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="tc-wrap">
        <nav className="tc-crumbs" aria-label="Migas de pan">
          <Link href="/">Inicio</Link>
          <span aria-hidden="true">›</span>
          <Link href="/categoria/economia">Economía</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Tipo de cambio</span>
        </nav>

        <header className="tc-head">
          <span className="tc-eyebrow">Servicio en vivo · BCCR</span>
          <h1 className="tc-title">Tipo de cambio del dólar hoy en Costa Rica</h1>
          <p className="tc-lead">
            El precio del dólar estadounidense (USD) frente al colón (CRC) se rige por el tipo de cambio de
            referencia del Banco Central de Costa Rica. La información se actualiza automáticamente cada hora.
          </p>
        </header>

        {/* ── Tarjeta de tarifa en vivo ── */}
        {tc ? (
          <section className="tc-card" aria-label="Tipo de cambio de referencia de hoy">
            <div className="tc-card-grid">
              <div className="tc-rate tc-rate--compra">
                <span className="tc-rate-lbl">Compra</span>
                <span className="tc-rate-val">
                  <span className="tc-rate-sym">₡</span>
                  {nf.format(tc.compra)}
                </span>
                <span className="tc-rate-hint">Para cambiar dólares a colones</span>
              </div>
              <div className="tc-rate tc-rate--venta">
                <span className="tc-rate-lbl">Venta</span>
                <span className="tc-rate-val">
                  <span className="tc-rate-sym">₡</span>
                  {nf.format(tc.venta)}
                </span>
                <span className="tc-rate-hint">Para comprar dólares con colones</span>
              </div>
            </div>
            <div className="tc-card-foot">
              <span className="tc-source">
                Fuente: Banco Central de Costa Rica{tc.fecha ? ` · referencia del ${fechaBonita(tc.fecha)}` : ''}
              </span>
            </div>
          </section>
        ) : (
          <section className="tc-card tc-card--off" aria-label="Tipo de cambio">
            <p>El dato de referencia está temporalmente no disponible. Intente de nuevo en unos minutos.</p>
          </section>
        )}

        {/* ── Convertidor interactivo ── */}
        {tc && <ConvertidorDivisas compra={tc.compra} venta={tc.venta} />}

        {/* ── Contenido / E-E-A-T ── */}
        <section className="tc-prose">
          <h2>¿Qué es el tipo de cambio del dólar en Costa Rica?</h2>
          <p>
            El tipo de cambio indica cuántos colones cuesta un dólar estadounidense. En Costa Rica, la referencia
            principal es el <strong>tipo de cambio de referencia</strong> que publica a diario el Banco Central de
            Costa Rica (BCCR), calculado a partir de las operaciones del mercado mayorista de divisas (Monex). Ese
            valor sirve de guía para bancos, comercios y personas, aunque cada entidad fija después su propia tarifa.
          </p>

          <h2>Compra y venta: ¿cuál tarifa aplica en cada caso?</h2>
          <p>
            Siempre aparecen dos números. El <strong>tipo de compra</strong> es el precio al que la entidad compra
            los dólares del público —es decir, los colones que se reciben al vender dólares—. El <strong>tipo de venta</strong> es el
            precio al que la entidad vende dólares, los colones que se pagan por cada dólar. La venta es más alta que la compra, y
            esa diferencia (el «diferencial») es la ganancia de la entidad.
          </p>

          <h2>¿Por qué sube o baja el precio del dólar?</h2>
          <p>
            El colón flota según la oferta y la demanda de divisas. Influyen factores como la entrada de dólares por
            turismo y exportaciones, la inversión extranjera, las remesas, las tasas de interés internas y externas, la
            estacionalidad (por ejemplo, el pago de impuestos o la temporada alta turística) y las intervenciones del
            BCCR para suavizar movimientos bruscos. Por eso el valor cambia día a día.
          </p>

          <h2>¿Dónde cambiar dólares a colones?</h2>
          <p>
            Las divisas se pueden cambiar en bancos como el Banco Nacional, BCR, BAC, Davivienda o Scotiabank, en casas de
            cambio autorizadas y en algunos cajeros. Conviene comparar: cada entidad aplica su propio margen sobre el
            tipo de cambio de referencia, así que el monto final recibido o pagado puede variar de una a otra.
          </p>

          <p className="tc-disclaimer">
            <strong>Importante:</strong> los valores mostrados corresponden al tipo de cambio de referencia del BCCR y
            tienen carácter informativo. No constituyen una oferta de compra o venta de divisas. Conviene verificar la
            tarifa vigente con la entidad financiera antes de realizar cualquier transacción.
          </p>
        </section>

        {/* ── Preguntas frecuentes ── */}
        <section className="tc-faq" aria-label="Preguntas frecuentes sobre el tipo de cambio">
          <h2 className="tc-faq-title">Preguntas frecuentes</h2>
          {faq.map((f, i) => (
            <details key={i} className="tc-faq-item">
              <summary className="tc-faq-q">{f.q}</summary>
              <p className="tc-faq-a">{f.a}</p>
            </details>
          ))}
        </section>

        <footer className="tc-footer">
          <p className="tc-updated">
            Actualizado automáticamente con datos del Banco Central de Costa Rica.
          </p>
          <p className="tc-links">
            Más en{' '}
            <Link href="/categoria/economia">Economía</Link> ·{' '}
            <Link href="/">Portada de Acontecer</Link>
          </p>
        </footer>
      </main>
    </>
  );
}
