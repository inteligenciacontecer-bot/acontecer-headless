import type { Metadata } from 'next';
import Link from 'next/link';
import './gobierno.css';
import { PRESIDENCIA, MINISTROS, PRESIDENCIAS, funcionarioSlug, type Funcionario } from '@/lib/gobierno';

export const revalidate = 86400;

const URL_PAGINA = 'https://acontecer.co.cr/gobierno';

function iniciales(nombre: string): string {
  const p = nombre.trim().split(/\s+/);
  return ((p[0]?.[0] || '') + (p[p.length - 1]?.[0] || '')).toUpperCase();
}

const SIN_RECORTE_EN_TARJETA = new Set([
  'jose-miguel-jimenez-araya',
  'carlos-andres-robles-obando',
  'johnny-leiva-badilla',
]);

function recorteGobierno(funcionario: Funcionario): string | null {
  if (funcionario.grupo === 'presidencia') return null;
  const slug = funcionarioSlug(funcionario);
  if (SIN_RECORTE_EN_TARJETA.has(slug)) return null;
  if (!funcionario.foto?.startsWith('/gobierno/fotos/')) return null;

  return funcionario.foto
    .replace('/gobierno/fotos/', '/gobierno/recortes/')
    .replace(/\.jpe?g$/i, '.png');
}

export const metadata: Metadata = {
  title: 'Gobierno de Costa Rica 2026-2030 — Ministros y Presidencias Ejecutivas',
  description: `Directorio del Poder Ejecutivo de Costa Rica en la administración de Laura Fernández: la presidenta, los vicepresidentes, los ${MINISTROS.length} ministros del gabinete y los ${PRESIDENCIAS.length} presidentes ejecutivos de las instituciones autónomas.`,
  alternates: { canonical: URL_PAGINA },
  openGraph: {
    type: 'website', url: URL_PAGINA,
    title: 'Gobierno de Costa Rica 2026-2030 — Gabinete de Laura Fernández | Acontecer.co.cr',
    description: 'Ministros y presidencias ejecutivas del gobierno de Laura Fernández.',
    locale: 'es_CR',
  },
};

const FAQ = [
  {
    q: '¿Quién es la presidenta de Costa Rica?',
    a: 'La presidenta de Costa Rica es Laura Fernández Delgado, quien asumió el cargo en mayo de 2026 para el periodo 2026-2030. La acompañan el primer vicepresidente, Francisco Gamboa, y el segundo vicepresidente, Douglas Soto.',
  },
  {
    q: '¿Cuántos ministros tiene el gobierno de Costa Rica?',
    a: `El gabinete está conformado por los ministros que dirigen las distintas carteras del Poder Ejecutivo. En esta administración, Rodrigo Chaves Robles ocupa de forma simultánea los ministerios de la Presidencia y de Hacienda.`,
  },
  {
    q: '¿Qué es un presidente ejecutivo en Costa Rica?',
    a: 'El presidente o presidenta ejecutiva es la persona que dirige una institución autónoma del Estado —como la CCSS, el ICE, el INS o el AyA— y es nombrada por el Poder Ejecutivo. No debe confundirse con los ministros, que encabezan los ministerios.',
  },
  {
    q: '¿Cada cuánto se actualiza este directorio?',
    a: 'Este directorio refleja los nombramientos oficiales del gobierno y se actualiza cuando hay cambios en el gabinete o en las presidencias ejecutivas.',
  },
];

function Tarjeta({ funcionario, accent }: { funcionario: Funcionario; accent: string }) {
  const { nombre, cargo, foto } = funcionario;
  const recorte = recorteGobierno(funcionario);
  const avatarClass = [
    'gb-card-avatar',
    recorte ? 'gb-card-avatar--cutout' : '',
    funcionario.grupo === 'presidencia' ? 'gb-card-avatar--presidencia' : '',
  ].filter(Boolean).join(' ');

  return (
    <Link href={`/gobierno/${funcionarioSlug(funcionario)}`} className="gb-card" style={{ borderTopColor: accent }}>
      <div className={avatarClass} style={{ background: recorte ? undefined : accent + '15', color: accent }}>
        {foto
          ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={recorte || foto} alt={nombre} loading="lazy" decoding="async" />
          : iniciales(nombre)}
      </div>
      <div className="gb-card-info">
        <div className="gb-card-nombre">{nombre}</div>
        <div className="gb-card-cargo">{cargo}</div>
      </div>
    </Link>
  );
}

export default function GobiernoPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://acontecer.co.cr' },
      { '@type': 'ListItem', position: 2, name: 'Gobierno', item: URL_PAGINA },
    ],
  };
  const todos = [...PRESIDENCIA, ...MINISTROS, ...PRESIDENCIAS];
  const itemListSchema = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: 'Poder Ejecutivo de Costa Rica 2026-2030',
    itemListElement: todos.map((p, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Person', name: p.nombre, jobTitle: p.cargo, worksFor: { '@type': 'GovernmentOrganization', name: 'Gobierno de Costa Rica' } },
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

      {/* Header azul (estilo Monitor Legislativo) */}
      <div className="gb-hero">
        <div className="gb-hero-inner">
          <span className="gb-hero-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="22" y2="22" /><line x1="6" x2="6" y1="18" y2="11" /><line x1="10" x2="10" y1="18" y2="11" /><line x1="14" x2="14" y1="18" y2="11" /><line x1="18" x2="18" y1="18" y2="11" /><polygon points="12 2 20 7 4 7" /></svg>
          </span>
          <h1 className="gb-hero-title">Gobierno de Costa Rica</h1>
          <p className="gb-hero-sub">
            Poder Ejecutivo 2026–2030 · Presidenta Laura Fernández · {MINISTROS.length} ministros · {PRESIDENCIAS.length} presidencias ejecutivas
          </p>
        </div>
      </div>

      <main className="gb-wrap">
        <nav className="gb-crumbs" aria-label="Migas de pan">
          <Link href="/">Inicio</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Gobierno</span>
        </nav>

        <h2 className="gb-section-title">Presidencia</h2>
        <div className="gb-grid">
          {PRESIDENCIA.map((p) => <Tarjeta key={p.nombre} funcionario={p} accent="#0000A2" />)}
        </div>

        <h2 className="gb-section-title">Gabinete · Ministros</h2>
        <div className="gb-grid">
          {MINISTROS.map((p) => <Tarjeta key={p.nombre} funcionario={p} accent="#0a73ce" />)}
        </div>

        <h2 className="gb-section-title">Presidencias ejecutivas</h2>
        <div className="gb-grid">
          {PRESIDENCIAS.map((p) => <Tarjeta key={p.nombre} funcionario={p} accent="#0e9f6e" />)}
        </div>

        <section className="gb-prose">
          <p>
            El Poder Ejecutivo de Costa Rica lo encabeza la <strong>presidenta de la República</strong>, junto con dos
            vicepresidentes y el <strong>Consejo de Gobierno</strong>, integrado por los ministros que dirigen cada
            cartera. Además, las <strong>instituciones autónomas</strong> —como la CCSS, el ICE, el INS o el AyA— son
            dirigidas por presidentes ejecutivos nombrados por el Ejecutivo.
          </p>
          <p className="gb-disclaimer">
            <strong>Importante:</strong> este directorio es informativo y se basa en los nombramientos oficiales. Ante
            cualquier cambio en el gabinete, la referencia es la Presidencia de la República y Casa Presidencial.
          </p>
        </section>

        <section className="gb-faq" aria-label="Preguntas frecuentes sobre el gobierno">
          <h2 className="gb-faq-title">Preguntas frecuentes</h2>
          {FAQ.map((f, i) => (
            <details key={i} className="gb-faq-item">
              <summary className="gb-faq-q">{f.q}</summary>
              <p className="gb-faq-a">{f.a}</p>
            </details>
          ))}
        </section>

        <footer className="gb-footer">
          <p className="gb-links">
            <Link href="/asamblea">Monitor Legislativo (diputados)</Link> ·{' '}
            <Link href="/servicios">Servicios</Link> ·{' '}
            <Link href="/">Portada</Link>
          </p>
        </footer>
      </main>
    </>
  );
}
