import type { Metadata } from 'next';
import Link from 'next/link';
import './servicios.css';

export const metadata: Metadata = {
  title: 'Servicios de Costa Rica — Tipo de Cambio, Clima, Combustibles y Lotería',
  description: 'Servicios y datos de Costa Rica actualizados a diario: tipo de cambio del dólar, clima y pronóstico, precio de los combustibles y resultados de la lotería de la JPS.',
  alternates: { canonical: 'https://acontecer.co.cr/servicios' },
  openGraph: {
    type: 'website',
    url: 'https://acontecer.co.cr/servicios',
    title: 'Servicios de Costa Rica | Acontecer.co.cr',
    description: 'Tipo de cambio, clima, precio de combustibles y resultados de lotería de Costa Rica, actualizados automáticamente.',
    locale: 'es_CR',
  },
};

const IcDolar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
);
const IcClima = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M17 7l1.4-1.4M5.6 18.4 7 17" /></svg>
);
const IcCombustible = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="22" x2="15" y2="22" /><line x1="4" y1="9" x2="14" y2="9" /><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" /><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0V9.83a2 2 0 0 0-.59-1.42L18 5" /></svg>
);
const IcLoteria = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v14" strokeDasharray="2 3" /></svg>
);
const IcArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);

const SERVICIOS = [
  { href: '/tipo-de-cambio', nombre: 'Tipo de cambio del dólar', desc: 'Precio del dólar hoy (compra y venta) según el BCCR, con convertidor de dólares a colones.', icon: <IcDolar /> },
  { href: '/clima', nombre: 'Clima en Costa Rica', desc: 'Temperatura actual, pronóstico por hora y de 7 días, y condiciones por provincia.', icon: <IcClima /> },
  { href: '/precio-combustibles', nombre: 'Precio de combustibles', desc: 'Precio de la gasolina y el diésel hoy según ARESEP, con calculadora de costo por litros.', icon: <IcCombustible /> },
  { href: '/resultados-loteria', nombre: 'Resultados de lotería', desc: 'Nuevos Tiempos, 3 Monazos, Lotería Nacional, Lotto y Chances de la JPS, en tiempo real.', icon: <IcLoteria /> },
];

export default function ServiciosPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://acontecer.co.cr' },
      { '@type': 'ListItem', position: 2, name: 'Servicios', item: 'https://acontecer.co.cr/servicios' },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Servicios de Costa Rica — Acontecer.co.cr',
    itemListElement: SERVICIOS.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.nombre,
      url: `https://acontecer.co.cr${s.href}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <main className="sv-wrap">
        <nav className="sv-crumbs" aria-label="Migas de pan">
          <Link href="/">Inicio</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Servicios</span>
        </nav>

        <header className="sv-head">
          <span className="sv-eyebrow">Datos de Costa Rica · actualizados a diario</span>
          <h1 className="sv-title">Servicios de Costa Rica</h1>
          <p className="sv-lead">
            Los datos que más se consultan en Costa Rica, en un solo lugar y actualizados automáticamente: el tipo de
            cambio del dólar, el clima, el precio de los combustibles y los resultados de la lotería.
          </p>
        </header>

        <section className="sv-grid" aria-label="Servicios disponibles">
          {SERVICIOS.map((s) => (
            <Link key={s.href} href={s.href} className="sv-card">
              <span className="sv-card-icon">{s.icon}</span>
              <span className="sv-card-body">
                <span className="sv-card-name">{s.nombre}</span>
                <span className="sv-card-desc">{s.desc}</span>
              </span>
              <span className="sv-card-arrow"><IcArrow /></span>
            </Link>
          ))}
        </section>

        <section className="sv-prose">
          <p>
            Todos estos servicios se actualizan de forma automática con fuentes oficiales —el Banco Central de Costa
            Rica (BCCR), ARESEP, la Junta de Protección Social (JPS) y modelos meteorológicos— para que siempre
            encuentres la información más reciente sin tener que buscar en varios sitios.
          </p>
        </section>

        <footer className="sv-footer">
          <p className="sv-links">
            <Link href="/">Portada de Acontecer</Link> ·{' '}
            <Link href="/categoria/economia">Economía</Link> ·{' '}
            <Link href="/asamblea">Monitor Legislativo</Link>
          </p>
        </footer>
      </main>
    </>
  );
}
