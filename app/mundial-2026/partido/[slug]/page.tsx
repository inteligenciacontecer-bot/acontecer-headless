import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MundialLivePanel from '@/components/MundialLivePanel';
import '../../mundial.css';
import { MUNDIAL_MATCHES, formatCostaRicaDateTime, getMundialMatch } from '@/lib/mundial-2026';

type Props = { params: Promise<{ slug: string }> };
type Match = (typeof MUNDIAL_MATCHES)[number];

const SITE_URL = 'https://acontecer.co.cr';

function getMatchUrl(slug: string) {
  return `${SITE_URL}/mundial-2026/partido/${slug}`;
}

function getMatchTitle(match: Match) {
  return `${match.home} vs ${match.away}: hora, sede y minuto a minuto | Mundial 2026`;
}

function getMatchDescription(match: Match) {
  return `${match.home} vs ${match.away} en el Mundial 2026: fecha, horario de Costa Rica, sede, grupo, ficha del partido y cobertura minuto a minuto en Acontecer.co.cr.`;
}

function getMatchKeywords(match: Match) {
  return [
    `${match.home} vs ${match.away}`,
    `${match.home} ${match.away} Mundial 2026`,
    `partido ${match.matchNumber} Mundial 2026`,
    `hora ${match.home} vs ${match.away}`,
    `minuto a minuto ${match.home} vs ${match.away}`,
    `resultado ${match.home} vs ${match.away}`,
    `alineaciones ${match.home} vs ${match.away}`,
    'calendario Mundial 2026',
    match.phaseEs,
    match.group ? `Grupo ${match.group} Mundial 2026` : match.phaseEs,
    match.venue,
  ];
}

export function generateStaticParams() {
  return MUNDIAL_MATCHES.map((match) => ({ slug: match.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const match = getMundialMatch(slug);
  if (!match) return { title: 'Partido Mundial 2026' };

  const title = getMatchTitle(match);
  const description = getMatchDescription(match);
  const url = getMatchUrl(match.slug);
  const image = `${url}/opengraph-image`;
  const keywords = getMatchKeywords(match);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    category: 'Deportes',
    authors: [{ name: 'Acontecer.co.cr', url: SITE_URL }],
    publisher: 'Acontecer.co.cr',
    alternates: {
      canonical: url,
      languages: {
        'es-CR': url,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'article',
      locale: 'es_CR',
      siteName: 'Acontecer.co.cr',
      url,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `${match.home} vs ${match.away} - Mundial 2026` }],
      publishedTime: match.kickoffUtc || undefined,
      section: 'Mundial 2026',
      tags: keywords.slice(0, 8),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export const revalidate = 60;

export default async function MundialPartidoPage({ params }: Props) {
  const { slug } = await params;
  const match = getMundialMatch(slug);
  if (!match) notFound();

  const url = getMatchUrl(match.slug);
  const title = getMatchTitle(match);
  const description = getMatchDescription(match);
  const image = `${url}/opengraph-image`;
  const formattedTime = formatCostaRicaDateTime(match.kickoffUtc);
  const phaseLine = match.group ? `${match.phaseEs}, Grupo ${match.group}` : match.phaseEs;
  const faq = [
    {
      question: `¿Cuándo juega ${match.home} vs ${match.away}?`,
      answer: `${match.home} vs ${match.away} está programado para ${formattedTime}, según el calendario importado para el Mundial 2026.`,
    },
    {
      question: `¿Dónde se juega ${match.home} vs ${match.away}?`,
      answer: `El partido ${match.home} vs ${match.away} se juega en ${match.venue}.`,
    },
    {
      question: `¿Dónde seguir el minuto a minuto de ${match.home} vs ${match.away}?`,
      answer: `Acontecer.co.cr mantiene esta página preparada para el marcador, eventos, goles, tarjetas, cambios, faltas y actualizaciones en vivo del partido.`,
    },
  ];
  const sportsEventSchema = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    '@id': `${url}#event`,
    name: `${match.home} vs ${match.away} - Mundial 2026`,
    description,
    image,
    startDate: match.kickoffUtc || undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    sport: 'Soccer',
    location: {
      '@type': 'Place',
      name: match.venue,
    },
    competitor: [
      { '@type': 'SportsTeam', name: match.home },
      { '@type': 'SportsTeam', name: match.away },
    ],
    performer: [
      { '@type': 'SportsTeam', name: match.home },
      { '@type': 'SportsTeam', name: match.away },
    ],
    organizer: { '@type': 'Organization', name: 'FIFA' },
    url,
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Portada', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Mundial 2026', item: `${SITE_URL}/mundial-2026` },
      { '@type': 'ListItem', position: 3, name: 'Calendario', item: `${SITE_URL}/mundial-2026/calendario` },
      { '@type': 'ListItem', position: 4, name: `${match.home} vs ${match.away}`, item: url },
    ],
  };
  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: 'es-CR',
    isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: 'Acontecer.co.cr', url: SITE_URL },
    publisher: { '@type': 'NewsMediaOrganization', '@id': `${SITE_URL}/#organization`, name: 'Acontecer.co.cr', url: SITE_URL },
    primaryImageOfPage: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
    about: { '@id': `${url}#event` },
    mainEntity: { '@id': `${url}#event` },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <main className="wc-page">
      {[sportsEventSchema, breadcrumbSchema, webpageSchema, faqSchema].map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <section className="wc-match-hero">
        <div className="wc-match-hero-inner">
          <div className="wc-kicker">Partido #{match.matchNumber} · {match.phaseEs}</div>
          <div className="wc-score-title">
            <strong>{match.home}</strong>
            <span>vs</span>
            <strong>{match.away}</strong>
          </div>
          <p className="wc-subtitle" style={{ marginTop: 18 }}>
            {formattedTime} · {match.venue}
          </p>
        </div>
      </section>

      <nav className="wc-nav">
        <div className="wc-nav-inner">
          <Link href="/mundial-2026">Portada</Link>
          <Link href="/mundial-2026/calendario">Calendario</Link>
          <a className="is-active" href="#minuto-a-minuto">Minuto a minuto</a>
        </div>
      </nav>

      <div className="wc-wrap">
        <section className="wc-layout">
          <div id="minuto-a-minuto">
            <MundialLivePanel match={match} />
          </div>

          <aside className="wc-card">
            <h2 style={{ marginTop: 0 }}>Ficha del partido</h2>
            <p><strong>Fase:</strong> {phaseLine}</p>
            {match.group && <p><strong>Grupo:</strong> {match.group}</p>}
            <p><strong>Partido:</strong> #{match.matchNumber}</p>
            <p><strong>Sede:</strong> {match.venue}</p>
            <p><strong>Hora CR:</strong> {formattedTime}</p>
            <p className="wc-source">
              La página queda preparada para actualización en vivo. El panel recibirá eventos desde el proveedor de datos:
              goles, tarjetas, cambios, faltas, VAR y estado del marcador.
            </p>
          </aside>
        </section>

        <section className="wc-seo-section" aria-labelledby="previa-partido">
          <div className="wc-seo-copy">
            <p className="wc-kicker">Previa y seguimiento</p>
            <h2 id="previa-partido">{match.home} vs {match.away}: horario, sede y cobertura del Mundial 2026</h2>
            <p>
              {match.home} vs {match.away} corresponde al partido #{match.matchNumber} del Mundial 2026.
              El encuentro está ubicado en {phaseLine} y se disputará en {match.venue}.
              En Costa Rica, el horario de referencia es {formattedTime}.
            </p>
            <p>
              Esta página reúne la información base del partido, el enlace permanente para consulta y el espacio
              donde Acontecer.co.cr publicará el minuto a minuto cuando el juego esté en desarrollo. La cobertura
              está preparada para incorporar marcador, goles, tarjetas, cambios, faltas, revisiones VAR, alineaciones
              y actualizaciones relevantes antes, durante y después del encuentro.
            </p>
          </div>

          <div className="wc-seo-grid">
            <article className="wc-card">
              <h3>Datos clave</h3>
              <ul className="wc-seo-list">
                <li><strong>Partido:</strong> {match.home} vs {match.away}</li>
                <li><strong>Competencia:</strong> Copa Mundial de la FIFA 2026</li>
                <li><strong>Fase:</strong> {phaseLine}</li>
                <li><strong>Sede:</strong> {match.venue}</li>
                <li><strong>Horario en Costa Rica:</strong> {formattedTime}</li>
              </ul>
            </article>

            <article className="wc-card">
              <h3>Qué se actualizará</h3>
              <ul className="wc-seo-list">
                <li>Resultado y marcador del partido.</li>
                <li>Goles, tarjetas y cambios.</li>
                <li>Faltas, revisiones VAR y eventos principales.</li>
                <li>Alineaciones y contexto previo cuando esté disponible.</li>
                <li>Resumen posterior al pitazo final.</li>
              </ul>
            </article>
          </div>

          <div className="wc-faq">
            <h2>Preguntas frecuentes</h2>
            {faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>

          <div className="wc-related-links">
            <Link href="/mundial-2026">Cobertura del Mundial 2026</Link>
            <Link href="/mundial-2026/calendario">Calendario completo</Link>
            <Link href="/categoria/deportes">Más noticias de deportes</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
