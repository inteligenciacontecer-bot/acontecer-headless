import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../../../clima.css';
import {
  DISTRITOS, getDistrito, getCanton, getDistritosByCanton,
  getClimaCompleto, wmo, diaNombre, type ClimaActual,
} from '@/lib/clima';

// ISR: clima cada 30 min. Páginas estáticas por distrito/localidad.
export const revalidate = 1800;

const BASE = 'https://acontecer.co.cr';

export function generateStaticParams() {
  return DISTRITOS.map((d) => ({ provincia: d.provincia, canton: d.canton, distrito: d.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ provincia: string; canton: string; distrito: string }> },
): Promise<Metadata> {
  const { provincia, canton, distrito } = await params;
  const d = getDistrito(provincia, canton, distrito);
  if (!d) return { title: 'Localidad no encontrada' };
  const url = `${BASE}/clima/${provincia}/${canton}/${distrito}`;
  const clima = await getClimaCompleto(d.lat, d.lon);
  const w = clima ? wmo(clima.current.code) : null;
  const desc = clima
    ? `Clima en ${d.nombre} hoy: ${clima.current.temp}°C, ${w?.desc.toLowerCase()}. Pronóstico del tiempo por hora y de 7 días para ${d.nombre}, ${d.cantonNombre}, Costa Rica. Actualizado automáticamente.`
    : `Clima en ${d.nombre} hoy: temperatura actual, pronóstico por hora y de 7 días para ${d.nombre}, Costa Rica.`;
  return {
    title: `Clima en ${d.nombre} Hoy — Pronóstico del Tiempo por Hora`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: 'website', url,
      title: `Clima en ${d.nombre} Hoy — Pronóstico por Hora y 7 Días | Acontecer.co.cr`,
      description: desc, locale: 'es_CR',
    },
    twitter: { card: 'summary_large_image', title: `Clima en ${d.nombre} Hoy`, description: desc },
  };
}

function buildFaq(d: { nombre: string; cantonNombre: string }, cur: ClimaActual | null) {
  const hoy = cur
    ? `Ahora en ${d.nombre} hay ${cur.temp}°C (sensación ${cur.feels}°C), ${wmo(cur.code).desc.toLowerCase()}, con ${cur.humidity}% de humedad. El pronóstico por hora y de 7 días está más arriba en esta página.`
    : `El clima de ${d.nombre} se actualiza automáticamente con la temperatura actual, el pronóstico por hora y el de los próximos 7 días.`;
  return [
    { q: `¿Qué clima hace hoy en ${d.nombre}?`, a: hoy },
    {
      q: `¿Cómo estará el tiempo esta semana en ${d.nombre}?`,
      a: `En la sección de pronóstico de 7 días se muestran la temperatura máxima y mínima y la probabilidad de lluvia para cada día en ${d.nombre}, ${d.cantonNombre}. Los datos se actualizan automáticamente cada 30 minutos.`,
    },
    {
      q: `¿Es buen momento para visitar la playa en ${d.nombre}?`,
      a: `El pronóstico por hora de esta página ayuda a planear: muestra la temperatura y la probabilidad de lluvia hora por hora. En la costa de Costa Rica la estación seca (diciembre a abril) suele ser la más soleada, mientras que de mayo a noviembre hay más lluvia, generalmente por la tarde.`,
    },
    {
      q: '¿De dónde provienen estos datos del clima?',
      a: 'Los datos provienen de modelos meteorológicos abiertos (Open-Meteo) y se actualizan automáticamente. Para alertas y avisos oficiales, la referencia es el Instituto Meteorológico Nacional (IMN) y la Comisión Nacional de Emergencias (CNE).',
    },
  ];
}

export default async function ClimaDistritoPage(
  { params }: { params: Promise<{ provincia: string; canton: string; distrito: string }> },
) {
  const { provincia, canton, distrito } = await params;
  const d = getDistrito(provincia, canton, distrito);
  if (!d) return notFound();

  const url = `${BASE}/clima/${provincia}/${canton}/${distrito}`;
  const clima = await getClimaCompleto(d.lat, d.lon);
  const cur = clima?.current ?? null;
  const curW = cur ? wmo(cur.code) : null;
  const faq = buildFaq(d, cur);
  const ahoraISO = new Date().toISOString();
  const hermanos = getDistritosByCanton(provincia, canton).filter((x) => x.slug !== d.slug);
  const cantonExiste = !!getCanton(provincia, canton); // ¿hay página de cantón para el breadcrumb?

  const crumbs: { '@type': 'ListItem'; position: number; name: string; item: string }[] = [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'Clima en Costa Rica', item: `${BASE}/clima` },
    { '@type': 'ListItem', position: 3, name: `Clima en ${cap(provincia)}`, item: `${BASE}/clima/${provincia}` },
  ];
  if (cantonExiste) {
    crumbs.push({ '@type': 'ListItem', position: 4, name: `Clima en ${d.cantonNombre}`, item: `${BASE}/clima/${provincia}/${canton}` });
  }
  crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: `Clima en ${d.nombre}`, item: url });

  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs };
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: `Clima en ${d.nombre} Hoy — Pronóstico por Hora y 7 Días`,
    description: `Pronóstico del tiempo en ${d.nombre}, ${d.cantonNombre}, Costa Rica: temperatura actual, por hora y de 7 días, actualizado automáticamente.`,
    inLanguage: 'es-CR',
    datePublished: '2026-06-06T06:00:00-06:00',
    dateModified: ahoraISO,
    isPartOf: { '@type': 'WebSite', '@id': `${BASE}/#website`, name: 'Acontecer.co.cr', url: BASE },
    publisher: {
      '@type': 'NewsMediaOrganization', '@id': `${BASE}/#organization`,
      name: 'Acontecer.co.cr', url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/logo.png`, width: 600, height: 94 },
    },
    about: { '@type': 'Thing', name: `Clima y pronóstico del tiempo en ${d.nombre}, Costa Rica` },
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

      <main className="cl-wrap">
        <nav className="cl-crumbs" aria-label="Migas de pan">
          <Link href="/">Inicio</Link>
          <span aria-hidden="true">›</span>
          <Link href="/clima">Clima</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/clima/${provincia}`}>{cap(provincia)}</Link>
          {cantonExiste && (
            <>
              <span aria-hidden="true">›</span>
              <Link href={`/clima/${provincia}/${canton}`}>{d.cantonNombre}</Link>
            </>
          )}
          <span aria-hidden="true">›</span>
          <span aria-current="page">{d.nombre}</span>
        </nav>

        <header className="cl-head">
          <span className="cl-eyebrow">Servicio en vivo · Open-Meteo</span>
          <h1 className="cl-title">Clima en {d.nombre} hoy</h1>
          <p className="cl-lead">
            Pronóstico del tiempo en {d.nombre}, {d.cantonNombre}: temperatura actual, por hora y de 7 días.
            La información se actualiza automáticamente cada 30 minutos.
          </p>
        </header>

        {cur && curW ? (
          <section className="cl-now" aria-label={`Clima actual en ${d.nombre}`}>
            <div className="cl-now-main">
              <span className="cl-now-icon" aria-hidden="true">{curW.icon}</span>
              <div>
                <div className="cl-now-place">{d.nombre} · ahora</div>
                <div className="cl-now-temp">{cur.temp}<span className="cl-now-deg">°C</span></div>
                <div className="cl-now-desc">{curW.desc}</div>
              </div>
            </div>
            <div className="cl-now-meta">
              <div className="cl-now-cell"><span className="cl-now-lbl">Sensación</span><span className="cl-now-val">{cur.feels}°C</span></div>
              <div className="cl-now-cell"><span className="cl-now-lbl">Humedad</span><span className="cl-now-val">{cur.humidity}%</span></div>
              <div className="cl-now-cell"><span className="cl-now-lbl">Viento</span><span className="cl-now-val">{cur.wind} km/h</span></div>
            </div>
          </section>
        ) : (
          <section className="cl-now cl-now--off"><p>El dato del clima está temporalmente no disponible. Intente de nuevo en unos minutos.</p></section>
        )}

        {clima && clima.horas.length > 0 && (
          <section aria-label={`Pronóstico por hora en ${d.nombre}`}>
            <h2 className="cl-section-title">Pronóstico por hora · {d.nombre}</h2>
            <div className="cl-hourly-strip">
              {clima.horas.map((h, i) => (
                <div key={i} className="cl-hour">
                  <span className="cl-hour-time">{h.hora}</span>
                  <span className="cl-hour-icon" aria-hidden="true">{h.icon}</span>
                  <span className="cl-hour-temp">{h.temp}°</span>
                  <span className="cl-hour-rain">💧 {h.lluvia}%</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {clima && clima.dias.length > 0 && (
          <section aria-label={`Pronóstico de 7 días en ${d.nombre}`}>
            <h2 className="cl-section-title">Pronóstico de 7 días · {d.nombre}</h2>
            <div className="cl-forecast">
              {clima.dias.map((dd, i) => {
                const w = wmo(dd.code);
                return (
                  <div key={dd.fecha} className="cl-day">
                    <span className="cl-day-name">{diaNombre(dd.fecha, i)}</span>
                    <span className="cl-day-icon" aria-hidden="true" title={w.desc}>{w.icon}</span>
                    <span className="cl-day-temps"><b>{dd.tmax}°</b> <span className="cl-day-min">{dd.tmin}°</span></span>
                    <span className="cl-day-rain">💧 {dd.lluvia}%</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Otras localidades del mismo cantón */}
        {hermanos.length > 0 && (
          <section aria-label={`Clima en otras playas y localidades de ${d.cantonNombre}`}>
            <h2 className="cl-section-title">Otras localidades de {d.cantonNombre}</h2>
            <div className="cl-prov-links">
              {hermanos.map((x) => (
                <Link key={x.slug} href={`/clima/${x.provincia}/${x.canton}/${x.slug}`} className="cl-prov-link">{x.nombre}</Link>
              ))}
              {cantonExiste && (
                <Link href={`/clima/${provincia}/${canton}`} className="cl-prov-link cl-prov-link--all">Todo {d.cantonNombre}</Link>
              )}
            </div>
          </section>
        )}

        <section className="cl-prose">
          <h2>El clima en {d.nombre}</h2>
          <p>
            {d.nombre}, en {d.cantonNombre} ({cap(provincia)}), tiene el clima tropical característico de la zona.
            Costa Rica vive dos estaciones: la seca (de diciembre a abril) y la lluviosa (de mayo a noviembre). En la
            costa, los aguaceros de la estación lluviosa suelen caer por la tarde, dejando mañanas despejadas.
          </p>
          <p className="cl-disclaimer">
            <strong>Importante:</strong> esta página es informativa y los datos provienen de modelos meteorológicos
            automáticos. Para alertas y avisos oficiales, consulte el Instituto Meteorológico Nacional (IMN) y la
            Comisión Nacional de Emergencias (CNE).
          </p>
        </section>

        <section className="cl-faq" aria-label={`Preguntas frecuentes sobre el clima en ${d.nombre}`}>
          <h2 className="cl-faq-title">Preguntas frecuentes</h2>
          {faq.map((f, i) => (
            <details key={i} className="cl-faq-item">
              <summary className="cl-faq-q">{f.q}</summary>
              <p className="cl-faq-a">{f.a}</p>
            </details>
          ))}
        </section>

        <footer className="cl-footer">
          <p className="cl-updated">Actualizado automáticamente con datos meteorológicos de Open-Meteo.</p>
          <p className="cl-links">
            <Link href={`/clima/${provincia}`}>Clima en {cap(provincia)}</Link> ·{' '}
            <Link href="/clima">Todo Costa Rica</Link> ·{' '}
            <Link href="/tipo-de-cambio">Tipo de cambio</Link>
          </p>
        </footer>
      </main>
    </>
  );
}

function cap(slug: string): string {
  return slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}
