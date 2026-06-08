import type { Metadata } from 'next';
import Link from 'next/link';
import '../mundial.css';
import { formatCostaRicaDateTime, getMatchesByDate, getMatchesByPhase } from '@/lib/mundial-2026';

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

export default function MundialCalendarioPage() {
  const byDate = getMatchesByDate();
  const byPhase = getMatchesByPhase();

  return (
    <main className="wc-page">
      <section className="wc-hero">
        <div className="wc-hero-inner">
          <div className="wc-kicker">Mundial 2026</div>
          <h1 className="wc-title">Calendario</h1>
          <p className="wc-subtitle">Los 104 partidos ordenados por fecha. Cada partido tiene página individual preparada para marcador y minuto a minuto.</p>
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
              <p>Vista pensada para usuarios que quieren encontrar rápido qué se juega hoy, mañana o en cada jornada.</p>
            </div>
          </div>
          {byDate.map((day) => (
            <div className="wc-date-block" key={day.dateLabel}>
              <h3 className="wc-date-title">{day.dateLabel}</h3>
              <div className="wc-match-list">
                {day.matches.map((match) => (
                  <Link className="wc-match-card" href={`/mundial-2026/partido/${match.slug}`} key={match.id}>
                    <div className="wc-match-num">#{match.matchNumber}</div>
                    <div className="wc-match-main">
                      <strong>{match.home} vs {match.away}</strong>
                      <span>{match.phaseEs} · {match.venue}</span>
                    </div>
                    <div className="wc-match-meta">{formatCostaRicaDateTime(match.kickoffUtc)}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
