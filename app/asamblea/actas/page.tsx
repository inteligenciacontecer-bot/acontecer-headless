import type { Metadata } from 'next';
import Link from 'next/link';
import './actas.css';

export const revalidate = 3600;

const API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea/actas';
const URL_PAGINA = 'https://acontecer.co.cr/asamblea/actas';

interface Acta {
  tipo: string;
  categoria: string;
  titulo: string;
  numero: string;
  fecha: string | null;
  url_archivo: string;
  formato: string;
  resumen: string;
}

// Configuración visual y orden de cada grupo
const GRUPOS: { tipo: string; label: string; descripcion: string; accent: string; id: string }[] = [
  { tipo: 'directorio', label: 'Directorio Legislativo', id: 'directorio', accent: '#0000A2',
    descripcion: 'Actas de las sesiones del Directorio, el órgano que administra la Asamblea.' },
  { tipo: 'jefaturas', label: 'Jefes de Fracción', id: 'jefaturas', accent: '#0a73ce',
    descripcion: 'Actas de las reuniones de jefes y jefas de fracción, donde se acuerda la agenda legislativa.' },
  { tipo: 'comisiones', label: 'Comisiones', id: 'comisiones', accent: '#0e9f6e',
    descripcion: 'Actas de instalación de las comisiones permanentes para la legislatura 2026-2027.' },
];

async function getActas(): Promise<Acta[]> {
  try {
    const r = await fetch(`${API}?per_page=400`, { next: { revalidate: 3600 } });
    if (!r.ok) return [];
    const data = await r.json();
    return Array.isArray(data?.actas) ? data.actas : [];
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Actas de la Asamblea Legislativa de Costa Rica — Directorio, Fracciones y Comisiones',
  description:
    'Repositorio de actas legislativas de Costa Rica con una explicación de cada una y enlace al documento oficial: sesiones del Directorio, reuniones de jefes de fracción y actas de comisiones.',
  alternates: { canonical: URL_PAGINA },
  openGraph: {
    type: 'website', url: URL_PAGINA,
    title: 'Actas de la Asamblea Legislativa de Costa Rica | Acontecer.co.cr',
    description: 'Cada acta legislativa explicada, con enlace al documento oficial de la Asamblea.',
    locale: 'es_CR',
  },
};

const FAQ = [
  {
    q: '¿Qué son las actas legislativas?',
    a: 'Las actas son el registro oficial de lo discutido y acordado en cada sesión de los órganos de la Asamblea Legislativa: el Directorio, las reuniones de jefes de fracción y las comisiones. Acontecer.co.cr resume cada acta y enlaza al documento original.',
  },
  {
    q: '¿De dónde provienen estos documentos?',
    a: 'Todos los documentos provienen de los repositorios oficiales de la Asamblea Legislativa de Costa Rica (asamblea.go.cr). El enlace de cada acta apunta directamente al archivo original publicado por la institución.',
  },
  {
    q: '¿Cada cuánto se actualizan las actas?',
    a: 'Este repositorio se sincroniza automáticamente todos los días con los documentos que publica la Asamblea, de modo que las actas más recientes aparecen poco después de su publicación oficial.',
  },
];

function fechaCR(iso: string | null): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Date(y, m - 1, d).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const IconDoc = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export default async function ActasPage() {
  const actas = await getActas();

  const porTipo: Record<string, Acta[]> = {};
  for (const a of actas) {
    (porTipo[a.tipo] ??= []).push(a);
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://acontecer.co.cr' },
      { '@type': 'ListItem', position: 2, name: 'Monitor Legislativo', item: 'https://acontecer.co.cr/asamblea' },
      { '@type': 'ListItem', position: 3, name: 'Actas', item: URL_PAGINA },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: 'Actas de la Asamblea Legislativa de Costa Rica',
    numberOfItems: actas.length,
    itemListElement: actas.slice(0, 100).map((a, i) => ({
      '@type': 'ListItem', position: i + 1, name: a.titulo, url: a.url_archivo,
    })),
  };
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="act-hero">
        <div className="act-hero-inner">
          <span className="act-hero-icon" aria-hidden="true">{IconDoc}</span>
          <h1 className="act-hero-title">Actas de la Asamblea Legislativa</h1>
          <p className="act-hero-sub">
            Cada acta legislativa de Costa Rica explicada en lenguaje claro, con enlace al documento oficial. Directorio, jefes de fracción y comisiones.
          </p>
        </div>
      </div>

      <main className="act-wrap">
        <nav className="act-crumbs" aria-label="Migas de pan">
          <Link href="/">Inicio</Link>
          <span aria-hidden="true">›</span>
          <Link href="/asamblea">Monitor Legislativo</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Actas</span>
        </nav>

        <p className="act-intro">
          Las actas son el registro oficial de lo que se discute y acuerda en cada sesión de la Asamblea Legislativa.
          Aquí encontrará un resumen de cada una y el enlace directo al documento publicado por la institución.
        </p>

        {actas.length > 0 && (
          <div className="act-tabs">
            {GRUPOS.filter((g) => (porTipo[g.tipo]?.length ?? 0) > 0).map((g) => (
              <a key={g.id} href={`#${g.id}`} className="act-tab">{g.label} ({porTipo[g.tipo].length})</a>
            ))}
          </div>
        )}

        {actas.length === 0 && (
          <div className="act-empty">
            Las actas se están sincronizando con la Asamblea Legislativa. Vuelva pronto.
          </div>
        )}

        {GRUPOS.map((g) => {
          const lista = porTipo[g.tipo] ?? [];
          if (lista.length === 0) return null;
          return (
            <section key={g.id} id={g.id} className="act-section">
              <div className="act-section-head">
                <span className="act-section-bar" style={{ background: g.accent }} />
                <h2 className="act-section-title">{g.label}</h2>
                <span className="act-section-count">{lista.length}</span>
              </div>
              <p className="act-intro" style={{ marginTop: -8, marginBottom: 16, fontSize: '0.92rem' }}>{g.descripcion}</p>
              <div className="act-grid">
                {lista.map((a, i) => (
                  <article key={i} className="act-card" style={{ ['--accent' as string]: g.accent }}>
                    <div className="act-card-body">
                      <div className="act-card-meta">
                        {a.categoria && a.tipo === 'comisiones' && (
                          <span className="act-card-cat" style={{ background: g.accent + '15', color: g.accent }}>
                            {a.categoria.replace(/^Comisión\s+/i, '')}
                          </span>
                        )}
                        {a.fecha && <span className="act-card-fecha">{fechaCR(a.fecha)}</span>}
                      </div>
                      <h3 className="act-card-titulo">{a.titulo}</h3>
                      <p className="act-card-resumen">{a.resumen}</p>
                    </div>
                    <div className="act-card-foot">
                      <a className="act-card-link" href={a.url_archivo} target="_blank" rel="noopener nofollow"
                        style={{ color: g.accent }}>
                        {IconDoc}
                        Ver acta oficial
                        <span className="act-card-fmt">{a.formato}</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        <p className="act-disclaimer">
          <strong>Fuente:</strong> los documentos provienen de los repositorios oficiales de la Asamblea Legislativa de
          Costa Rica. Los resúmenes son elaborados por Acontecer.co.cr para facilitar su lectura; ante cualquier duda,
          el documento oficial enlazado es la referencia.
        </p>

        <section className="act-faq" aria-label="Preguntas frecuentes sobre las actas legislativas">
          <h2 className="act-faq-title">Preguntas frecuentes</h2>
          {FAQ.map((f, i) => (
            <details key={i} className="act-faq-item">
              <summary className="act-faq-q">{f.q}</summary>
              <p className="act-faq-a">{f.a}</p>
            </details>
          ))}
        </section>

        <footer className="act-footer">
          <p className="act-links">
            <Link href="/asamblea">Monitor Legislativo</Link> ·{' '}
            <Link href="/asamblea/diputados">Diputados</Link> ·{' '}
            <Link href="/gobierno">Gobierno</Link> ·{' '}
            <Link href="/">Portada</Link>
          </p>
        </footer>
      </main>
    </>
  );
}
