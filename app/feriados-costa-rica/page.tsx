import type { Metadata } from 'next';
import Link from 'next/link';
import './feriados.css';

// Revalida a diario → actualiza el "próximo feriado" y el conteo.
export const revalidate = 86400;

const URL_PAGINA = 'https://acontecer.co.cr/feriados-costa-rica';

type Pago = 'obligatorio' | 'no obligatorio';
interface Feriado { fecha: string; nombre: string; pago: Pago }

// ⚠️ Feriados oficiales por año. Actualizar cada año cuando el Ministerio de
// Trabajo confirme las fechas (y si aplica traslado a lunes por ley).
// Fuente: Ministerio de Trabajo y Seguridad Social (MTSS) / Código de Trabajo.
const FERIADOS: Record<number, Feriado[]> = {
  2026: [
    { fecha: '2026-01-01', nombre: 'Año Nuevo', pago: 'obligatorio' },
    { fecha: '2026-04-02', nombre: 'Jueves Santo', pago: 'obligatorio' },
    { fecha: '2026-04-03', nombre: 'Viernes Santo', pago: 'obligatorio' },
    { fecha: '2026-04-11', nombre: 'Día de Juan Santamaría', pago: 'obligatorio' },
    { fecha: '2026-05-01', nombre: 'Día Internacional del Trabajo', pago: 'obligatorio' },
    { fecha: '2026-07-25', nombre: 'Anexión del Partido de Nicoya', pago: 'obligatorio' },
    { fecha: '2026-08-02', nombre: 'Día de la Virgen de los Ángeles', pago: 'no obligatorio' },
    { fecha: '2026-08-15', nombre: 'Día de la Madre', pago: 'obligatorio' },
    { fecha: '2026-08-31', nombre: 'Día de la Persona Negra y la Cultura Afrocostarricense', pago: 'no obligatorio' },
    { fecha: '2026-09-15', nombre: 'Día de la Independencia', pago: 'obligatorio' },
    { fecha: '2026-12-01', nombre: 'Día de la Abolición del Ejército', pago: 'no obligatorio' },
    { fecha: '2026-12-25', nombre: 'Navidad', pago: 'obligatorio' },
  ],
};

const AÑOS = Object.keys(FERIADOS).map(Number).sort((a, b) => a - b);

function añoVigente(): number {
  const y = new Date().getFullYear();
  if (FERIADOS[y]) return y;
  // Si el año actual aún no está cargado, usar el más reciente disponible.
  return AÑOS[AÑOS.length - 1];
}

function fechaPartes(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function diaSemana(iso: string): string {
  return fechaPartes(iso).toLocaleDateString('es-CR', { weekday: 'long' });
}
function diaMes(iso: string): string {
  return fechaPartes(iso).toLocaleDateString('es-CR', { day: 'numeric', month: 'long' });
}

function proximoFeriado(lista: Feriado[]): { f: Feriado; dias: number } | null {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  for (const f of lista) {
    const d = fechaPartes(f.fecha);
    if (d >= hoy) {
      const dias = Math.round((d.getTime() - hoy.getTime()) / 86400000);
      return { f, dias };
    }
  }
  return null;
}

export function generateMetadata(): Metadata {
  const año = añoVigente();
  const prox = proximoFeriado(FERIADOS[año]);
  const proxTxt = prox ? ` Próximo: ${prox.f.nombre}, ${diaMes(prox.f.fecha)}.` : '';
  const desc = `Calendario oficial de los feriados de Costa Rica ${año}: las ${FERIADOS[año].length} fechas, su día de la semana y si son de pago obligatorio o no obligatorio.${proxTxt}`;
  return {
    title: `Feriados de Costa Rica ${año} — Calendario Oficial`,
    description: desc,
    alternates: { canonical: URL_PAGINA },
    openGraph: {
      type: 'website',
      url: URL_PAGINA,
      title: `Feriados de Costa Rica ${año} — Calendario Oficial | Acontecer.co.cr`,
      description: desc,
      locale: 'es_CR',
    },
    twitter: { card: 'summary_large_image', title: `Feriados de Costa Rica ${año}`, description: desc },
  };
}

function buildFaq(año: number, lista: Feriado[]) {
  const prox = proximoFeriado(lista);
  return [
    {
      q: `¿Cuál es el próximo feriado en Costa Rica?`,
      a: prox
        ? `El próximo feriado es ${prox.f.nombre}, el ${diaSemana(prox.f.fecha)} ${diaMes(prox.f.fecha)} de ${año} (faltan ${prox.dias} día${prox.dias === 1 ? '' : 's'}). Es de pago ${prox.f.pago}.`
        : `Ya pasaron todos los feriados de ${año}. El calendario del próximo año se publica al confirmarse las fechas oficiales.`,
    },
    {
      q: `¿Cuántos feriados hay en Costa Rica en ${año}?`,
      a: `En ${año} hay ${lista.length} feriados de disfrute nacional. ${lista.filter((f) => f.pago === 'obligatorio').length} son de pago obligatorio y ${lista.filter((f) => f.pago === 'no obligatorio').length} de pago no obligatorio.`,
    },
    {
      q: '¿Qué diferencia hay entre feriado de pago obligatorio y no obligatorio?',
      a: 'En los feriados de pago obligatorio, el trabajador descansa con goce de salario, y si labora ese día se le debe pagar el doble. En los de pago no obligatorio, el patrono puede acordar si concede el día; si la persona trabaja, normalmente se paga como un día ordinario.',
    },
    {
      q: '¿Los feriados se trasladan al lunes en Costa Rica?',
      a: `En ${año} no se aplican traslados: cada feriado se conmemora en su fecha natural, sin importar el día de la semana. Los traslados a lunes dependen de que exista una ley vigente que los autorice para ese año.`,
    },
  ];
}

export default function FeriadosPage() {
  const año = añoVigente();
  const lista = FERIADOS[año];
  const prox = proximoFeriado(lista);
  const faq = buildFaq(año, lista);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://acontecer.co.cr' },
      { '@type': 'ListItem', position: 2, name: 'Servicios', item: 'https://acontecer.co.cr/servicios' },
      { '@type': 'ListItem', position: 3, name: `Feriados ${año}`, item: URL_PAGINA },
    ],
  };
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${URL_PAGINA}#webpage`,
    url: URL_PAGINA,
    name: `Feriados de Costa Rica ${año} — Calendario Oficial`,
    description: `Calendario oficial de los feriados de Costa Rica ${año} con su día de la semana y modalidad de pago.`,
    inLanguage: 'es-CR',
    datePublished: '2026-06-06T06:00:00-06:00',
    dateModified: new Date().toISOString(),
    isPartOf: { '@type': 'WebSite', '@id': 'https://acontecer.co.cr/#website', name: 'Acontecer.co.cr', url: 'https://acontecer.co.cr' },
    publisher: {
      '@type': 'NewsMediaOrganization', '@id': 'https://acontecer.co.cr/#organization', name: 'Acontecer.co.cr', url: 'https://acontecer.co.cr',
      logo: { '@type': 'ImageObject', url: 'https://acontecer.co.cr/logo.png', width: 600, height: 94 },
    },
    about: { '@type': 'Thing', name: `Feriados de Costa Rica ${año}` },
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

      <main className="fr-wrap">
        <nav className="fr-crumbs" aria-label="Migas de pan">
          <Link href="/">Inicio</Link>
          <span aria-hidden="true">›</span>
          <Link href="/servicios">Servicios</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Feriados</span>
        </nav>

        <header className="fr-head">
          <span className="fr-eyebrow">Calendario oficial · Costa Rica</span>
          <h1 className="fr-title">Feriados de Costa Rica {año}</h1>
          <p className="fr-lead">
            Las {lista.length} fechas de disfrute nacional de {año}, con su día de la semana y si son de pago
            obligatorio o no obligatorio según el Código de Trabajo.
          </p>
        </header>

        {prox && (
          <section className="fr-next" aria-label="Próximo feriado">
            <span className="fr-next-lbl">Próximo feriado</span>
            <span className="fr-next-name">{prox.f.nombre}</span>
            <span className="fr-next-date">{diaSemana(prox.f.fecha)} {diaMes(prox.f.fecha)}</span>
            <span className="fr-next-count">{prox.dias === 0 ? '¡Es hoy!' : `Faltan ${prox.dias} día${prox.dias === 1 ? '' : 's'}`}</span>
          </section>
        )}

        <section aria-label={`Lista de feriados ${año}`}>
          <div className="fr-list">
            {lista.map((f) => {
              const pasado = prox ? fechaPartes(f.fecha) < fechaPartes(prox.f.fecha) : false;
              const esProx = prox?.f.fecha === f.fecha;
              return (
                <div key={f.fecha} className={`fr-item${pasado ? ' is-pasado' : ''}${esProx ? ' is-prox' : ''}`}>
                  <div className="fr-item-fecha">
                    <span className="fr-item-dia">{fechaPartes(f.fecha).getDate()}</span>
                    <span className="fr-item-mes">{fechaPartes(f.fecha).toLocaleDateString('es-CR', { month: 'short' }).replace('.', '')}</span>
                  </div>
                  <div className="fr-item-body">
                    <span className="fr-item-nombre">{f.nombre}</span>
                    <span className="fr-item-semana">{diaSemana(f.fecha)}</span>
                  </div>
                  <span className={`fr-badge ${f.pago === 'obligatorio' ? 'fr-badge--ob' : 'fr-badge--no'}`}>
                    {f.pago === 'obligatorio' ? 'Pago obligatorio' : 'Pago no obligatorio'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="fr-prose">
          <h2>¿Cómo se pagan los feriados en Costa Rica?</h2>
          <p>
            Los feriados se dividen en dos categorías. En los de <strong>pago obligatorio</strong>, la persona
            trabajadora descansa con goce de salario; si labora ese día, el patrono debe pagarle el <strong>doble</strong>.
            En los de <strong>pago no obligatorio</strong>, el patrono puede acordar si concede el día libre, y el pago se
            rige por lo pactado o por la jornada ordinaria si se trabaja.
          </p>
          <h2>¿Se trasladan los feriados al lunes?</h2>
          <p>
            En {año} los feriados se conmemoran en su fecha natural, sin traslados. La posibilidad de mover un feriado al
            lunes —para formar fines de semana largos que favorezcan el turismo— depende de que exista una ley vigente
            que lo autorice para ese año en particular.
          </p>
          <p className="fr-disclaimer">
            <strong>Importante:</strong> esta página tiene carácter informativo. Para efectos laborales, la referencia
            oficial es el Ministerio de Trabajo y Seguridad Social (MTSS) y el Código de Trabajo.
          </p>
        </section>

        <section className="fr-faq" aria-label="Preguntas frecuentes sobre los feriados">
          <h2 className="fr-faq-title">Preguntas frecuentes</h2>
          {faq.map((f, i) => (
            <details key={i} className="fr-faq-item">
              <summary className="fr-faq-q">{f.q}</summary>
              <p className="fr-faq-a">{f.a}</p>
            </details>
          ))}
        </section>

        <footer className="fr-footer">
          <p className="fr-links">
            Más servicios:{' '}
            <Link href="/tipo-de-cambio">Tipo de cambio</Link> ·{' '}
            <Link href="/clima">Clima</Link> ·{' '}
            <Link href="/servicios">Ver todos</Link>
          </p>
        </footer>
      </main>
    </>
  );
}
