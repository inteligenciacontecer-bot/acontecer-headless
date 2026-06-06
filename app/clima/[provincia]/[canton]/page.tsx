import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../../clima.css';
import {
  PROVINCIAS, CANTONES, getProvincia, getCanton, getCantones,
  getClimaCompleto, wmo, diaNombre, type ClimaActual,
} from '@/lib/clima';

// ISR: clima cada 30 min. Páginas estáticas por cantón (generateStaticParams).
export const revalidate = 1800;

const BASE = 'https://acontecer.co.cr';

export function generateStaticParams() {
  const params: { provincia: string; canton: string }[] = [];
  for (const provincia of Object.keys(CANTONES)) {
    for (const c of CANTONES[provincia]) {
      params.push({ provincia, canton: c.slug });
    }
  }
  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ provincia: string; canton: string }> },
): Promise<Metadata> {
  const { provincia, canton } = await params;
  const prov = getProvincia(provincia);
  const cant = getCanton(provincia, canton);
  if (!prov || !cant) return { title: 'Cantón no encontrado' };
  const url = `${BASE}/clima/${prov.slug}/${cant.slug}`;
  const clima = await getClimaCompleto(cant.lat, cant.lon);
  const w = clima ? wmo(clima.current.code) : null;
  const desc = clima
    ? `Clima en ${cant.nombre} hoy: ${clima.current.temp}°C, ${w?.desc.toLowerCase()}. Pronóstico del tiempo por hora y de 7 días para ${cant.nombre}, ${prov.provincia}, Costa Rica. Actualizado automáticamente.`
    : `Clima en ${cant.nombre} hoy: temperatura actual, pronóstico por hora y de 7 días para ${cant.nombre}, ${prov.provincia}, Costa Rica.`;
  return {
    title: `Clima en ${cant.nombre} Hoy — Pronóstico del Tiempo por Hora`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: 'website', url,
      title: `Clima en ${cant.nombre} Hoy — Pronóstico por Hora y 7 Días | Acontecer.co.cr`,
      description: desc, locale: 'es_CR',
    },
    twitter: { card: 'summary_large_image', title: `Clima en ${cant.nombre} Hoy`, description: desc },
  };
}

function buildFaq(cant: { nombre: string }, prov: { provincia: string }, cur: ClimaActual | null) {
  const hoy = cur
    ? `Ahora en ${cant.nombre} hay ${cur.temp}°C (sensación ${cur.feels}°C), ${wmo(cur.code).desc.toLowerCase()}, con ${cur.humidity}% de humedad. El pronóstico por hora y de 7 días está más arriba en esta página.`
    : `El clima de ${cant.nombre} se actualiza automáticamente con la temperatura actual, el pronóstico por hora y el de los próximos 7 días.`;
  return [
    { q: `¿Qué clima hace hoy en ${cant.nombre}?`, a: hoy },
    {
      q: `¿Cómo estará el tiempo esta semana en ${cant.nombre}?`,
      a: `En la sección de pronóstico de 7 días se muestran la temperatura máxima y mínima y la probabilidad de lluvia para cada día en ${cant.nombre}, ${prov.provincia}. Los datos se actualizan automáticamente cada 30 minutos.`,
    },
    {
      q: '¿De dónde provienen estos datos del clima?',
      a: 'Los datos provienen de modelos meteorológicos abiertos (Open-Meteo) y se actualizan automáticamente. Para alertas y avisos oficiales, la referencia es el Instituto Meteorológico Nacional (IMN) y la Comisión Nacional de Emergencias (CNE).',
    },
  ];
}

export default async function ClimaCantonPage(
  { params }: { params: Promise<{ provincia: string; canton: string }> },
) {
  const { provincia, canton } = await params;
  const prov = getProvincia(provincia);
  const cant = getCanton(provincia, canton);
  if (!prov || !cant) return notFound();

  const url = `${BASE}/clima/${prov.slug}/${cant.slug}`;
  const clima = await getClimaCompleto(cant.lat, cant.lon);
  const cur = clima?.current ?? null;
  const curW = cur ? wmo(cur.code) : null;
  const faq = buildFaq(cant, prov, cur);
  const ahoraISO = new Date().toISOString();
  const hermanos = getCantones(provincia).filter((c) => c.slug !== cant.slug);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Clima en Costa Rica', item: `${BASE}/clima` },
      { '@type': 'ListItem', position: 3, name: `Clima en ${prov.provincia}`, item: `${BASE}/clima/${prov.slug}` },
      { '@type': 'ListItem', position: 4, name: `Clima en ${cant.nombre}`, item: url },
    ],
  };
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: `Clima en ${cant.nombre} Hoy — Pronóstico por Hora y 7 Días`,
    description: `Pronóstico del tiempo en ${cant.nombre}, ${prov.provincia}, Costa Rica: temperatura actual, por hora y de 7 días, actualizado automáticamente.`,
    inLanguage: 'es-CR',
    datePublished: '2026-06-06T06:00:00-06:00',
    dateModified: ahoraISO,
    isPartOf: { '@type': 'WebSite', '@id': `${BASE}/#website`, name: 'Acontecer.co.cr', url: BASE },
    publisher: {
      '@type': 'NewsMediaOrganization', '@id': `${BASE}/#organization`,
      name: 'Acontecer.co.cr', url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/logo.png`, width: 600, height: 94 },
    },
    about: { '@type': 'Thing', name: `Clima y pronóstico del tiempo en ${cant.nombre}, Costa Rica` },
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
          <Link href={`/clima/${prov.slug}`}>{prov.provincia}</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{cant.nombre}</span>
        </nav>

        <header className="cl-head">
          <span className="cl-eyebrow">Servicio en vivo · Open-Meteo</span>
          <h1 className="cl-title">Clima en {cant.nombre} hoy</h1>
          <p className="cl-lead">
            Pronóstico del tiempo en {cant.nombre}, {prov.provincia}: temperatura actual, por hora y de 7 días.
            La información se actualiza automáticamente cada 30 minutos.
          </p>
        </header>

        {cur && curW ? (
          <section className="cl-now" aria-label={`Clima actual en ${cant.nombre}`}>
            <div className="cl-now-main">
              <span className="cl-now-icon" aria-hidden="true">{curW.icon}</span>
              <div>
                <div className="cl-now-place">{cant.nombre} · ahora</div>
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
          <section aria-label={`Pronóstico por hora en ${cant.nombre}`}>
            <h2 className="cl-section-title">Pronóstico por hora · {cant.nombre}</h2>
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
          <section aria-label={`Pronóstico de 7 días en ${cant.nombre}`}>
            <h2 className="cl-section-title">Pronóstico de 7 días · {cant.nombre}</h2>
            <div className="cl-forecast">
              {clima.dias.map((d, i) => {
                const w = wmo(d.code);
                return (
                  <div key={d.fecha} className="cl-day">
                    <span className="cl-day-name">{diaNombre(d.fecha, i)}</span>
                    <span className="cl-day-icon" aria-hidden="true" title={w.desc}>{w.icon}</span>
                    <span className="cl-day-temps"><b>{d.tmax}°</b> <span className="cl-day-min">{d.tmin}°</span></span>
                    <span className="cl-day-rain">💧 {d.lluvia}%</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Otros cantones de la provincia */}
        {hermanos.length > 0 && (
          <section aria-label={`Clima en otros cantones de ${prov.provincia}`}>
            <h2 className="cl-section-title">Clima en otros cantones de {prov.provincia}</h2>
            <div className="cl-prov-links">
              {hermanos.map((c) => (
                <Link key={c.slug} href={`/clima/${prov.slug}/${c.slug}`} className="cl-prov-link">{c.nombre}</Link>
              ))}
              <Link href={`/clima/${prov.slug}`} className="cl-prov-link cl-prov-link--all">Toda {prov.provincia}</Link>
            </div>
          </section>
        )}

        <section className="cl-prose">
          <h2>El clima en {cant.nombre}, {prov.provincia}</h2>
          <p>{prov.intro}</p>
          <p>
            Costa Rica tiene dos estaciones: la seca (de diciembre a abril) y la lluviosa (de mayo a noviembre).
            En {cant.nombre} y el resto de {prov.provincia}, el relieve genera microclimas, por lo que la temperatura
            y la lluvia pueden variar dentro de la misma zona en un mismo día.
          </p>
          <p className="cl-disclaimer">
            <strong>Importante:</strong> esta página es informativa y los datos provienen de modelos meteorológicos
            automáticos. Para alertas y avisos oficiales, consulte el Instituto Meteorológico Nacional (IMN) y la
            Comisión Nacional de Emergencias (CNE).
          </p>
        </section>

        <section className="cl-faq" aria-label={`Preguntas frecuentes sobre el clima en ${cant.nombre}`}>
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
            <Link href={`/clima/${prov.slug}`}>Clima en {prov.provincia}</Link> ·{' '}
            <Link href="/clima">Todo Costa Rica</Link> ·{' '}
            <Link href="/tipo-de-cambio">Tipo de cambio</Link>
          </p>
        </footer>
      </main>
    </>
  );
}
