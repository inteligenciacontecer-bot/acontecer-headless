import type { Metadata } from 'next';
import Link from 'next/link';
import '../mundial.css';
import {
  MUNDIAL_MATCHES,
  formatCostaRicaDateTime,
  getMundialTeamFlag,
  getMundialTeamSlug,
} from '@/lib/mundial-2026';
import { getMundialCalendarData } from '@/lib/mundial-data';

const SITE_URL = 'https://acontecer.co.cr';

export const metadata: Metadata = {
  title: 'Calendario Mundial 2026: partidos, fechas y sedes',
  description: 'Calendario completo del Mundial 2026 con 104 partidos, fases, sedes y horarios de Costa Rica.',
  alternates: { canonical: 'https://acontecer.co.cr/mundial-2026/calendario' },
  openGraph: {
    url: 'https://acontecer.co.cr/mundial-2026/calendario',
    title: 'Calendario Mundial 2026: partidos, fechas y sedes',
    description: 'Calendario completo del Mundial 2026 con fases, sedes y horarios de Costa Rica.',
    images: [{ url: 'https://acontecer.co.cr/mundial-2026/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['https://acontecer.co.cr/mundial-2026/opengraph-image'] },
};

export const revalidate = 300;

function CalendarMatchCard({ match }: { match: (typeof MUNDIAL_MATCHES)[number] }) {
  const homeFlag = getMundialTeamFlag(match.home);
  const awayFlag = getMundialTeamFlag(match.away);

  return (
    <article className="wc-fixture-card">
      <div className="wc-fixture-card-head">
        <span>{match.phaseEs}</span>
        <strong>Partido {match.matchNumber}</strong>
      </div>
      <div className="wc-fixture-teams">
        <Link className="wc-fixture-team-link" href={`/mundial-2026/seleccion/${getMundialTeamSlug(match.home)}`}>
          <img src={homeFlag.url} alt={`Bandera de ${match.home}`} loading="lazy" />
          <strong>{match.home}</strong>
        </Link>
        <Link className="wc-fixture-score" href={`/mundial-2026/partido/${match.slug}`} aria-label={`Ver partido ${match.home} vs ${match.away}`}>
          <span>{match.homeScore ?? 0}</span>
          <b>-</b>
          <span>{match.awayScore ?? 0}</span>
        </Link>
        <Link className="wc-fixture-team-link" href={`/mundial-2026/seleccion/${getMundialTeamSlug(match.away)}`}>
          <img src={awayFlag.url} alt={`Bandera de ${match.away}`} loading="lazy" />
          <strong>{match.away}</strong>
        </Link>
      </div>
      <Link className="wc-fixture-meta" href={`/mundial-2026/partido/${match.slug}`}>
        <span>{formatCostaRicaDateTime(match.kickoffUtc)}</span>
        <span>{match.venue}</span>
      </Link>
    </article>
  );
}

export default async function MundialCalendarioPage() {
  const { byDate, byPhase, matches } = await getMundialCalendarData();
  const url = `${SITE_URL}/mundial-2026/calendario`;
  const title = 'Calendario Mundial 2026: partidos, fechas y sedes';
  const description = 'Calendario completo del Mundial 2026 con 104 partidos, fases, sedes y horarios de Costa Rica.';
  const faq = [
    {
      question: '¿Cuántos partidos tiene el Mundial 2026?',
      answer: `El calendario del Mundial 2026 tiene ${matches.length} partidos entre fase de grupos, eliminación directa y final.`,
    },
    {
      question: '¿Dónde ver los horarios del Mundial 2026 en Costa Rica?',
      answer: 'Acontecer.co.cr publica el calendario del Mundial 2026 con horarios adaptados a Costa Rica, sedes, grupos y enlaces a cada partido.',
    },
    {
      question: '¿Cada partido del Mundial 2026 tiene página individual?',
      answer: 'Sí. Cada partido tiene una página individual con marcador, ficha, estadísticas, alineaciones y minuto a minuto preparado para datos en vivo.',
    },
  ];
  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: 'es-CR',
    isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: 'Acontecer.co.cr', url: SITE_URL },
    publisher: { '@type': 'NewsMediaOrganization', '@id': `${SITE_URL}/#organization`, name: 'Acontecer.co.cr', url: SITE_URL },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Portada', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Mundial 2026', item: `${SITE_URL}/mundial-2026` },
      { '@type': 'ListItem', position: 3, name: 'Calendario', item: url },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Partidos del Mundial 2026',
    itemListElement: matches.map((match, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/mundial-2026/partido/${match.slug}`,
      name: `${match.home} vs ${match.away}`,
    })),
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
      {[webpageSchema, breadcrumbSchema, itemListSchema, faqSchema].map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <section className="wc-hero">
        <div className="wc-hero-inner">
          <div className="wc-kicker">Mundial 2026</div>
          <h1 className="wc-title">Calendario</h1>
          <p className="wc-subtitle">Los 104 partidos ordenados por fecha. Cada partido tiene página individual preparada para marcador, crónica, estadísticas, alineaciones y minuto a minuto.</p>
        </div>
      </section>
      <nav className="wc-nav">
        <div className="wc-nav-inner">
          <Link href="/mundial-2026">Portada</Link>
          <Link className="is-active" href="/mundial-2026/calendario">Calendario</Link>
          {byPhase.slice(0, 6).map((phase) => <a key={phase.phase} href={`#${phase.phase.replace(/\s+/g, '-')}`}>{phase.phaseEs}</a>)}
          <a href="#faq">Preguntas</a>
        </div>
      </nav>
      <div className="wc-wrap">
        <section>
          <div className="wc-section-head">
            <div>
              <h2>Por fecha</h2>
              <p>Vista pensada para encontrar rápido qué se juega hoy, mañana o en cada jornada.</p>
            </div>
          </div>
          {byDate.map((day) => (
            <div className="wc-date-block" key={day.dateLabel}>
              <h3 className="wc-date-title">{day.dateLabel}</h3>
              <div className="wc-fixture-card-list">
                {day.matches.map((match) => <CalendarMatchCard match={match} key={match.id} />)}
              </div>
            </div>
          ))}
        </section>

        <section className="wc-match-module" id="faq" style={{ marginTop: 28 }}>
          <div className="wc-module-head">
            <div>
              <p className="wc-kicker">SEO</p>
              <h2>Preguntas frecuentes del calendario</h2>
            </div>
          </div>
          <div className="wc-faq-list">
            {faq.map((item) => (
              <article key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
