import type { Metadata } from 'next';
import Link from 'next/link';
import './clima.css';

// ISR: el clima se refresca cada 30 min. Una sola URL evergreen.
export const revalidate = 1800;

const URL_PAGINA = 'https://acontecer.co.cr/clima';

// Provincias / ciudades principales de Costa Rica (lat, lon)
const CIUDADES = [
  { nombre: 'San José',    lat: 9.9281, lon: -84.0907 },
  { nombre: 'Alajuela',    lat: 10.0162, lon: -84.2116 },
  { nombre: 'Cartago',     lat: 9.8644,  lon: -83.9194 },
  { nombre: 'Heredia',     lat: 9.9981,  lon: -84.1169 },
  { nombre: 'Liberia',     lat: 10.6346, lon: -85.4377 },
  { nombre: 'Puntarenas',  lat: 9.9763,  lon: -84.8384 },
  { nombre: 'Limón',       lat: 9.9907,  lon: -83.0359 },
  { nombre: 'Pérez Zeledón', lat: 9.3741, lon: -83.7033 },
];

interface WmoInfo { icon: string; desc: string; }
function wmo(code: number): WmoInfo {
  const m: Record<number, WmoInfo> = {
    0:  { icon: '☀️', desc: 'Despejado' },
    1:  { icon: '🌤️', desc: 'Mayormente despejado' },
    2:  { icon: '⛅', desc: 'Parcialmente nublado' },
    3:  { icon: '☁️', desc: 'Nublado' },
    45: { icon: '🌫️', desc: 'Neblina' },
    48: { icon: '🌫️', desc: 'Neblina con escarcha' },
    51: { icon: '🌦️', desc: 'Llovizna ligera' },
    53: { icon: '🌦️', desc: 'Llovizna' },
    55: { icon: '🌧️', desc: 'Llovizna intensa' },
    56: { icon: '🌧️', desc: 'Llovizna helada' },
    57: { icon: '🌧️', desc: 'Llovizna helada intensa' },
    61: { icon: '🌦️', desc: 'Lluvia ligera' },
    63: { icon: '🌧️', desc: 'Lluvia' },
    65: { icon: '🌧️', desc: 'Lluvia intensa' },
    66: { icon: '🌧️', desc: 'Lluvia helada' },
    67: { icon: '🌧️', desc: 'Lluvia helada intensa' },
    71: { icon: '❄️', desc: 'Nevada ligera' },
    73: { icon: '❄️', desc: 'Nevada' },
    75: { icon: '❄️', desc: 'Nevada intensa' },
    80: { icon: '🌦️', desc: 'Chubascos ligeros' },
    81: { icon: '🌧️', desc: 'Chubascos' },
    82: { icon: '⛈️', desc: 'Chubascos fuertes' },
    95: { icon: '⛈️', desc: 'Tormenta eléctrica' },
    96: { icon: '⛈️', desc: 'Tormenta con granizo' },
    99: { icon: '⛈️', desc: 'Tormenta fuerte con granizo' },
  };
  return m[code] || { icon: '🌡️', desc: 'Variable' };
}

interface CurrentSJ {
  temp: number;
  feels: number;
  humidity: number;
  wind: number;
  code: number;
}
interface DiaForecast {
  fecha: string; // ISO yyyy-mm-dd
  code: number;
  tmax: number;
  tmin: number;
  lluvia: number; // prob %
}
interface CiudadClima { nombre: string; temp: number | null; code: number; }

async function getSanJose(): Promise<{ current: CurrentSJ; dias: DiaForecast[] } | null> {
  try {
    const url =
      'https://api.open-meteo.com/v1/forecast?latitude=9.9281&longitude=-84.0907' +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
      '&timezone=America/Costa_Rica&forecast_days=7';
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const d = await res.json();
    const c = d.current;
    const dl = d.daily;
    if (!c || !dl) return null;
    const dias: DiaForecast[] = (dl.time || []).map((t: string, i: number) => ({
      fecha: t,
      code: dl.weather_code?.[i] ?? 0,
      tmax: Math.round(dl.temperature_2m_max?.[i] ?? 0),
      tmin: Math.round(dl.temperature_2m_min?.[i] ?? 0),
      lluvia: dl.precipitation_probability_max?.[i] ?? 0,
    }));
    return {
      current: {
        temp: Math.round(c.temperature_2m ?? 0),
        feels: Math.round(c.apparent_temperature ?? c.temperature_2m ?? 0),
        humidity: Math.round(c.relative_humidity_2m ?? 0),
        wind: Math.round(c.wind_speed_10m ?? 0),
        code: c.weather_code ?? 0,
      },
      dias,
    };
  } catch {
    return null;
  }
}

async function getCiudades(): Promise<CiudadClima[]> {
  try {
    const lats = CIUDADES.map((c) => c.lat).join(',');
    const lons = CIUDADES.map((c) => c.lon).join(',');
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}` +
      '&current=temperature_2m,weather_code&timezone=America/Costa_Rica&forecast_days=1';
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return CIUDADES.map((c) => ({ nombre: c.nombre, temp: null, code: 0 }));
    const data = await res.json();
    const arr = Array.isArray(data) ? data : [data];
    return CIUDADES.map((c, i) => ({
      nombre: c.nombre,
      temp: arr[i]?.current?.temperature_2m != null ? Math.round(arr[i].current.temperature_2m) : null,
      code: arr[i]?.current?.weather_code ?? 0,
    }));
  } catch {
    return CIUDADES.map((c) => ({ nombre: c.nombre, temp: null, code: 0 }));
  }
}

function diaNombre(iso: string, idx: number): string {
  if (idx === 0) return 'Hoy';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-CR', { weekday: 'short' }).replace('.', '');
}

export async function generateMetadata(): Promise<Metadata> {
  const sj = await getSanJose();
  const w = sj ? wmo(sj.current.code) : null;
  const desc = sj
    ? `Clima en Costa Rica hoy: San José ${sj.current.temp}°C, ${w?.desc.toLowerCase()}. Pronóstico de 7 días y temperatura actual por provincia. Datos actualizados automáticamente.`
    : 'Clima en Costa Rica hoy: temperatura actual, pronóstico de 7 días y condiciones por provincia. Datos actualizados automáticamente.';
  return {
    title: 'Clima en Costa Rica Hoy — Pronóstico del Tiempo',
    description: desc,
    alternates: { canonical: URL_PAGINA },
    openGraph: {
      type: 'website',
      url: URL_PAGINA,
      title: 'Clima en Costa Rica Hoy — Pronóstico del Tiempo | Acontecer.co.cr',
      description: desc,
      locale: 'es_CR',
    },
    twitter: { card: 'summary_large_image', title: 'Clima en Costa Rica Hoy', description: desc },
  };
}

function buildFaq(sj: { current: CurrentSJ } | null) {
  const hoy = sj
    ? `Ahora mismo en San José hay ${sj.current.temp}°C (sensación ${sj.current.feels}°C), ${wmo(sj.current.code).desc.toLowerCase()}, con ${sj.current.humidity}% de humedad. El detalle por provincia y el pronóstico de 7 días están más arriba en esta página.`
    : 'El clima de Costa Rica se actualiza automáticamente en esta página con la temperatura actual y el pronóstico de los próximos 7 días para San José y las principales provincias.';
  return [
    { q: '¿Qué clima hace hoy en Costa Rica?', a: hoy },
    {
      q: '¿Cuándo es la estación seca y la lluviosa en Costa Rica?',
      a: 'Costa Rica tiene dos estaciones: la seca (verano), que va aproximadamente de diciembre a abril, y la lluviosa (invierno), de mayo a noviembre. En el Caribe el patrón es distinto: puede llover durante todo el año, con periodos más secos en septiembre y octubre.',
    },
    {
      q: '¿Por qué la temperatura cambia tanto entre regiones?',
      a: 'Costa Rica tiene muchos microclimas por su relieve. El Valle Central (San José, Heredia, Cartago, Alajuela) es templado por la altura; Guanacaste (Liberia) es caliente y seco; el Caribe (Limón) es húmedo y lluvioso; y las zonas altas como Cartago o la Zona de los Santos son más frescas.',
    },
    {
      q: '¿De dónde provienen estos datos del clima?',
      a: 'Los datos provienen de modelos meteorológicos abiertos (Open-Meteo) y se actualizan de forma automática cada media hora. Para alertas oficiales y avisos de emergencia, la referencia es el Instituto Meteorológico Nacional (IMN) y la Comisión Nacional de Emergencias (CNE).',
    },
    {
      q: '¿Cada cuánto se actualiza esta página?',
      a: 'La temperatura actual y el pronóstico se actualizan automáticamente cada 30 minutos. No es necesario recargar la página de forma manual.',
    },
  ];
}

export default async function ClimaPage() {
  const [sj, ciudades] = await Promise.all([getSanJose(), getCiudades()]);
  const faq = buildFaq(sj);
  const ahoraISO = new Date().toISOString();
  const cur = sj?.current;
  const curW = cur ? wmo(cur.code) : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://acontecer.co.cr' },
      { '@type': 'ListItem', position: 2, name: 'Clima en Costa Rica', item: URL_PAGINA },
    ],
  };
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${URL_PAGINA}#webpage`,
    url: URL_PAGINA,
    name: 'Clima en Costa Rica Hoy — Pronóstico del Tiempo',
    description: 'Clima en Costa Rica hoy: temperatura actual, pronóstico de 7 días y condiciones por provincia, actualizado automáticamente.',
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
    about: { '@type': 'Thing', name: 'Clima y pronóstico del tiempo en Costa Rica' },
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
          <span aria-current="page">Clima</span>
        </nav>

        <header className="cl-head">
          <span className="cl-eyebrow">Servicio en vivo · Open-Meteo</span>
          <h1 className="cl-title">Clima en Costa Rica hoy</h1>
          <p className="cl-lead">
            Temperatura actual, pronóstico de 7 días y condiciones por provincia. La información se actualiza
            automáticamente cada 30 minutos.
          </p>
        </header>

        {/* Tarjeta actual San José */}
        {cur && curW ? (
          <section className="cl-now" aria-label="Clima actual en San José">
            <div className="cl-now-main">
              <span className="cl-now-icon" aria-hidden="true">{curW.icon}</span>
              <div>
                <div className="cl-now-place">San José · ahora</div>
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

        {/* Pronóstico 7 días */}
        {sj && sj.dias.length > 0 && (
          <section aria-label="Pronóstico de 7 días para San José">
            <h2 className="cl-section-title">Pronóstico de 7 días · San José</h2>
            <div className="cl-forecast">
              {sj.dias.map((d, i) => {
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

        {/* Por provincia ahora */}
        <section aria-label="Temperatura actual por provincia">
          <h2 className="cl-section-title">Temperatura ahora por provincia</h2>
          <div className="cl-cities">
            {ciudades.map((c) => {
              const w = wmo(c.code);
              return (
                <div key={c.nombre} className="cl-city">
                  <span className="cl-city-icon" aria-hidden="true" title={w.desc}>{w.icon}</span>
                  <span className="cl-city-name">{c.nombre}</span>
                  <span className="cl-city-temp">{c.temp != null ? `${c.temp}°C` : '—'}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contenido */}
        <section className="cl-prose">
          <h2>¿Cómo es el clima en Costa Rica?</h2>
          <p>
            Costa Rica tiene un clima tropical con dos estaciones marcadas en la mayor parte del país: la
            <strong> estación seca</strong> (de diciembre a abril) y la <strong>estación lluviosa</strong> (de mayo a
            noviembre). Gracias a su relieve montañoso, el país concentra numerosos microclimas, por lo que la
            temperatura puede variar bastante de una región a otra en un mismo día.
          </p>
          <h2>¿Por qué varía tanto el clima entre regiones?</h2>
          <p>
            El Valle Central —San José, Heredia, Alajuela y Cartago— tiene un clima templado por la altitud. La región
            de Guanacaste (Liberia) es la más caliente y seca; el Caribe (Limón) es húmedo y lluvioso casi todo el año;
            y las zonas altas, como Cartago o la Zona de los Santos, registran las temperaturas más frescas.
          </p>
          <h2>¿Cuándo llueve más en Costa Rica?</h2>
          <p>
            En la vertiente del Pacífico, las lluvias se concentran entre mayo y noviembre, con frecuentes aguaceros por
            la tarde. En el Caribe el patrón es distinto y puede llover durante todo el año. Septiembre y octubre suelen
            ser los meses más lluviosos en el Pacífico, mientras que en el Caribe son relativamente más secos.
          </p>
          <p className="cl-disclaimer">
            <strong>Importante:</strong> esta página tiene carácter informativo y los datos provienen de modelos
            meteorológicos automáticos. Para alertas y avisos oficiales, consulte el Instituto Meteorológico Nacional
            (IMN) y la Comisión Nacional de Emergencias (CNE).
          </p>
        </section>

        {/* FAQ */}
        <section className="cl-faq" aria-label="Preguntas frecuentes sobre el clima en Costa Rica">
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
            Más servicios:{' '}
            <Link href="/tipo-de-cambio">Tipo de cambio</Link> ·{' '}
            <Link href="/precio-combustibles">Precio de combustibles</Link> ·{' '}
            <Link href="/">Portada</Link>
          </p>
        </footer>
      </main>
    </>
  );
}
