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
  const { byDate, byPhase } = await getMundialCalendarData();

  return (
    <main className="wc-page">
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
      </div>
    </main>
  );
}
