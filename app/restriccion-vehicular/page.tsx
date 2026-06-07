import type { Metadata } from 'next';
import Link from 'next/link';
import './restriccion.css';

// Revalida cada hora → el "hoy" siempre es correcto (cambia a medianoche CR).
export const revalidate = 3600;

const URL_PAGINA = 'https://acontecer.co.cr/restriccion-vehicular';

interface Dia { dow: number; nombre: string; digitos: string[] }
const DIAS: Dia[] = [
  { dow: 1, nombre: 'Lunes', digitos: ['1', '2'] },
  { dow: 2, nombre: 'Martes', digitos: ['3', '4'] },
  { dow: 3, nombre: 'Miércoles', digitos: ['5', '6'] },
  { dow: 4, nombre: 'Jueves', digitos: ['7', '8'] },
  { dow: 5, nombre: 'Viernes', digitos: ['9', '0'] },
];

// Día de la semana en hora de Costa Rica (0=domingo … 6=sábado).
function dowCR(): number {
  const dn = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Costa_Rica', weekday: 'short' }).format(new Date());
  return ({ Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 } as Record<string, number>)[dn] ?? 0;
}
function nombreDow(dow: number): string {
  return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][dow];
}

export function generateMetadata(): Metadata {
  const hoy = DIAS.find((d) => d.dow === dowCR());
  const txt = hoy
    ? `Hoy ${hoy.nombre} no circulan en el centro de San José las placas terminadas en ${hoy.digitos.join(' y ')}.`
    : 'Hoy no hay restricción vehicular en el centro de San José (fin de semana).';
  const desc = `Restricción vehicular en San José hoy: qué placas no pueden circular, horario (6 a. m. a 7 p. m.) y zona. ${txt}`;
  return {
    title: 'Restricción Vehicular en San José Hoy — Placas y Horario',
    description: desc,
    alternates: { canonical: URL_PAGINA },
    openGraph: {
      type: 'website',
      url: URL_PAGINA,
      title: 'Restricción Vehicular en San José Hoy | Acontecer.co.cr',
      description: desc,
      locale: 'es_CR',
    },
    twitter: { card: 'summary_large_image', title: 'Restricción Vehicular en San José Hoy', description: desc },
  };
}

function buildFaq(hoy: Dia | undefined) {
  return [
    {
      q: '¿Qué placas tienen restricción hoy en San José?',
      a: hoy
        ? `Hoy ${hoy.nombre.toLowerCase()} no pueden circular en el centro de San José los vehículos con placa terminada en ${hoy.digitos.join(' y ')}, de 6 a. m. a 7 p. m.`
        : 'Hoy es fin de semana, por lo que no rige la restricción vehicular en el centro de San José.',
    },
    {
      q: '¿En qué horario y zona aplica la restricción vehicular?',
      a: 'La restricción rige de lunes a viernes, de 6 a. m. a 7 p. m., únicamente en el casco central de San José, dentro del área delimitada por la ruta de Circunvalación. Fuera de esa zona y de ese horario no hay restricción.',
    },
    {
      q: '¿Cómo es el calendario de placas por día?',
      a: 'Lunes no circulan las placas terminadas en 1 y 2; martes, 3 y 4; miércoles, 5 y 6; jueves, 7 y 8; y viernes, 9 y 0. Sábados, domingos y feriados no hay restricción.',
    },
    {
      q: '¿Qué vehículos están exentos de la restricción?',
      a: 'Existen excepciones, como los vehículos de emergencia (ambulancias, bomberos, policía), el transporte público, los vehículos eléctricos y otros casos definidos por el MOPT. La lista completa y vigente la establece el Ministerio de Obras Públicas y Transportes.',
    },
    {
      q: '¿Qué pasa si circulo en restricción?',
      a: 'Conducir dentro de la zona y el horario de restricción sin estar exento conlleva una multa de tránsito. El monto vigente lo fija la Ley de Tránsito; conviene verificarlo con el MOPT o el COSEVI.',
    },
  ];
}

export default function RestriccionPage() {
  const dow = dowCR();
  const hoy = DIAS.find((d) => d.dow === dow);
  const faq = buildFaq(hoy);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://acontecer.co.cr' },
      { '@type': 'ListItem', position: 2, name: 'Servicios', item: 'https://acontecer.co.cr/servicios' },
      { '@type': 'ListItem', position: 3, name: 'Restricción vehicular', item: URL_PAGINA },
    ],
  };
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${URL_PAGINA}#webpage`,
    url: URL_PAGINA,
    name: 'Restricción Vehicular en San José Hoy — Placas y Horario',
    description: 'Restricción vehicular en el centro de San José: qué placas no circulan hoy, horario y zona, actualizado a diario.',
    inLanguage: 'es-CR',
    datePublished: '2026-06-07T06:00:00-06:00',
    dateModified: new Date().toISOString(),
    isPartOf: { '@type': 'WebSite', '@id': 'https://acontecer.co.cr/#website', name: 'Acontecer.co.cr', url: 'https://acontecer.co.cr' },
    publisher: {
      '@type': 'NewsMediaOrganization', '@id': 'https://acontecer.co.cr/#organization', name: 'Acontecer.co.cr', url: 'https://acontecer.co.cr',
      logo: { '@type': 'ImageObject', url: 'https://acontecer.co.cr/logo.png', width: 600, height: 94 },
    },
    about: { '@type': 'Thing', name: 'Restricción vehicular en San José, Costa Rica' },
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

      <main className="rv-wrap">
        <nav className="rv-crumbs" aria-label="Migas de pan">
          <Link href="/">Inicio</Link>
          <span aria-hidden="true">›</span>
          <Link href="/servicios">Servicios</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Restricción vehicular</span>
        </nav>

        <header className="rv-head">
          <span className="rv-eyebrow">Centro de San José · MOPT</span>
          <h1 className="rv-title">Restricción vehicular en San José hoy</h1>
          <p className="rv-lead">
            Qué placas no pueden circular en el centro de San José según el día de la semana. Rige de lunes a viernes,
            de 6 a. m. a 7 p. m., dentro de la Circunvalación.
          </p>
        </header>

        {/* HOY */}
        {hoy ? (
          <section className="rv-hoy" aria-label="Restricción de hoy">
            <span className="rv-hoy-lbl">Hoy {nombreDow(dow)} no circulan placas terminadas en</span>
            <div className="rv-hoy-digitos">
              {hoy.digitos.map((d) => <span key={d} className="rv-placa">{d}</span>)}
            </div>
            <span className="rv-hoy-horario">De 6 a. m. a 7 p. m. · centro de San José</span>
          </section>
        ) : (
          <section className="rv-hoy rv-hoy--libre" aria-label="Restricción de hoy">
            <span className="rv-hoy-lbl">Hoy {nombreDow(dow)}</span>
            <div className="rv-hoy-libre-txt">Sin restricción vehicular</div>
            <span className="rv-hoy-horario">Los fines de semana no rige la restricción</span>
          </section>
        )}

        {/* Calendario semanal */}
        <section aria-label="Calendario semanal de restricción">
          <h2 className="rv-section-title">Calendario de la semana</h2>
          <div className="rv-cal">
            {DIAS.map((d) => (
              <div key={d.dow} className={`rv-cal-dia${d.dow === dow ? ' is-hoy' : ''}`}>
                <span className="rv-cal-nombre">{d.nombre}</span>
                <span className="rv-cal-digitos">{d.digitos.join(' · ')}</span>
              </div>
            ))}
            <div className={`rv-cal-dia rv-cal-finde${dow === 0 || dow === 6 ? ' is-hoy' : ''}`}>
              <span className="rv-cal-nombre">Sáb y Dom</span>
              <span className="rv-cal-digitos">Libre</span>
            </div>
          </div>
        </section>

        {/* Contenido */}
        <section className="rv-prose">
          <h2>¿Cómo funciona la restricción vehicular en San José?</h2>
          <p>
            La restricción se basa en el <strong>último dígito de la placa</strong> y aplica solo de lunes a viernes,
            de <strong>6 a. m. a 7 p. m.</strong>, dentro del casco central de San José, en la zona delimitada por la
            ruta de Circunvalación. Fuera de ese horario y de esa zona, los vehículos pueden circular con normalidad.
          </p>
          <h2>¿Qué vehículos están exentos?</h2>
          <p>
            Quedan exentos, entre otros, los vehículos de emergencia, el transporte público y los vehículos eléctricos.
            El detalle completo de excepciones lo define el Ministerio de Obras Públicas y Transportes (MOPT).
          </p>
          <p className="rv-disclaimer">
            <strong>Importante:</strong> esta página es informativa. La zona, el horario, las excepciones y las multas
            vigentes son los que define oficialmente el MOPT; verifícalos ante cualquier duda.
          </p>
        </section>

        {/* FAQ */}
        <section className="rv-faq" aria-label="Preguntas frecuentes sobre la restricción vehicular">
          <h2 className="rv-faq-title">Preguntas frecuentes</h2>
          {faq.map((f, i) => (
            <details key={i} className="rv-faq-item">
              <summary className="rv-faq-q">{f.q}</summary>
              <p className="rv-faq-a">{f.a}</p>
            </details>
          ))}
        </section>

        <footer className="rv-footer">
          <p className="rv-links">
            Más servicios:{' '}
            <Link href="/clima">Clima</Link> ·{' '}
            <Link href="/tipo-de-cambio">Tipo de cambio</Link> ·{' '}
            <Link href="/servicios">Ver todos</Link>
          </p>
        </footer>
      </main>
    </>
  );
}
