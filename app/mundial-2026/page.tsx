import type { Metadata } from 'next';
import Link from 'next/link';
import MundialGroupsTable from '@/components/MundialGroupsTable';
import './mundial.css';
import {
  MUNDIAL_GROUPS,
  MUNDIAL_MATCHES,
  MUNDIAL_SOURCE,
  formatCostaRicaDateTime,
  getMundialGroupStandings,
  getMundialTeamFlag,
  getMundialTeams,
  getMatchesByDate,
  getUpcomingMundialMatches,
} from '@/lib/mundial-2026';

export const metadata: Metadata = {
  title: 'Mundial 2026: calendario, partidos y resultados en vivo',
  description: 'Calendario del Mundial 2026 con partidos, grupos, sedes, horarios de Costa Rica y base para seguimiento en vivo.',
  alternates: { canonical: 'https://acontecer.co.cr/mundial-2026' },
  openGraph: {
    url: 'https://acontecer.co.cr/mundial-2026',
    title: 'Mundial 2026: calendario, partidos y resultados en vivo',
    description: 'Partidos, grupos, sedes, horarios de Costa Rica y seguimiento en vivo del Mundial 2026.',
    images: [{ url: 'https://acontecer.co.cr/mundial-2026/opengraph-image', width: 1200, height: 630, alt: 'Mundial 2026 en Acontecer.co.cr' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mundial 2026: calendario y partidos',
    description: 'Calendario, grupos, sedes y seguimiento en vivo del Mundial 2026.',
    images: ['https://acontecer.co.cr/mundial-2026/opengraph-image'],
  },
};

export const revalidate = 300;

function MatchCard({ match }: { match: (typeof MUNDIAL_MATCHES)[number] }) {
  const homeFlag = getMundialTeamFlag(match.home);
  const awayFlag = getMundialTeamFlag(match.away);
  const homeScore = match.homeScore ?? 0;
  const awayScore = match.awayScore ?? 0;

  return (
    <Link className="wc-fixture-card" href={`/mundial-2026/partido/${match.slug}`}>
      <div className="wc-fixture-card-head">
        <span>{match.phaseEs}</span>
        <strong>Partido {match.matchNumber}</strong>
      </div>
      <div className="wc-fixture-teams">
        <div>
          <img src={homeFlag.url} alt={`Bandera de ${match.home}`} loading="lazy" />
          <strong>{match.home}</strong>
        </div>
        <div className="wc-fixture-score">
          <span>{homeScore}</span>
          <b>-</b>
          <span>{awayScore}</span>
        </div>
        <div>
          <img src={awayFlag.url} alt={`Bandera de ${match.away}`} loading="lazy" />
          <strong>{match.away}</strong>
        </div>
      </div>
      <div className="wc-fixture-meta">
        <span>{formatCostaRicaDateTime(match.kickoffUtc)}</span>
        <span>{match.venue}</span>
      </div>
    </Link>
  );
}

export default function Mundial2026Page() {
  const upcoming = getUpcomingMundialMatches(6);
  const dates = getMatchesByDate().slice(0, 6);
  const groupCount = Object.keys(MUNDIAL_GROUPS).length;
  const standings = getMundialGroupStandings();
  const teams = getMundialTeams();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Mundial 2026 en Acontecer.co.cr',
    url: 'https://acontecer.co.cr/mundial-2026',
    inLanguage: 'es-CR',
    about: 'FIFA World Cup 2026',
    hasPart: MUNDIAL_MATCHES.slice(0, 12).map((match) => ({
      '@type': 'SportsEvent',
      name: `${match.home} vs ${match.away}`,
      startDate: match.kickoffUtc || undefined,
      location: match.venue,
      url: `https://acontecer.co.cr/mundial-2026/partido/${match.slug}`,
    })),
  };

  return (
    <main className="wc-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="wc-hero">
        <div className="wc-hero-inner">
          <div className="wc-kicker">Cobertura especial · Acontecer.co.cr</div>
          <div className="wc-hero-grid">
            <div>
              <h1 className="wc-title">Mundial 2026</h1>
              <p className="wc-subtitle">
                Calendario, grupos, selecciones, sedes y páginas individuales de los 104 partidos. La base queda lista para
                conectar goles, estadísticas, alineaciones, crónica y minuto a minuto durante los juegos.
              </p>
              <div className="wc-hero-actions">
                <Link className="wc-btn wc-btn--primary" href="/mundial-2026/calendario">Ver calendario</Link>
                <Link className="wc-btn" href="#selecciones">Ver selecciones</Link>
                <Link className="wc-btn" href="#grupos">Ver grupos</Link>
              </div>
            </div>
            <aside className="wc-hero-panel">
              <div className="wc-stat-grid">
                <div className="wc-stat"><span>Partidos</span><strong>{MUNDIAL_MATCHES.length}</strong></div>
                <div className="wc-stat"><span>Grupos</span><strong>{groupCount}</strong></div>
                <div className="wc-stat"><span>Selecciones</span><strong>48</strong></div>
                <div className="wc-stat"><span>Sedes</span><strong>16</strong></div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <nav className="wc-nav" aria-label="Navegación Mundial 2026">
        <div className="wc-nav-inner">
          <Link className="is-active" href="/mundial-2026">Portada</Link>
          <Link href="/mundial-2026/calendario">Calendario</Link>
          <a href="#selecciones">Selecciones</a>
          <a href="#grupos">Grupos</a>
          <a href="#fuente">Datos y actualización</a>
        </div>
      </nav>

      <div className="wc-wrap">
        <section className="wc-layout">
          <div>
            <div className="wc-section-head">
              <div>
                <h2>Próximos partidos</h2>
                <p>Fixtures con banderas, marcador base y enlaces al centro de partido.</p>
              </div>
              <Link className="wc-pill" href="/mundial-2026/calendario">104 partidos</Link>
            </div>
            <div className="wc-fixture-card-list">
              {upcoming.map((match) => <MatchCard key={match.id} match={match} />)}
            </div>
          </div>

          <aside className="wc-card" id="fuente">
            <h2 style={{ marginTop: 0 }}>Motor en vivo</h2>
            <p className="wc-source">
              La sección guarda calendario, grupos, selecciones y contrato de datos para eventos en vivo: goles, tarjetas,
              cambios, faltas, VAR, estadísticas, alineaciones, crónica e historial entre equipos.
            </p>
            <p className="wc-source">
              Fuente base: <a href={MUNDIAL_SOURCE.url} target="_blank" rel="noopener noreferrer">FourFourTwo</a> y referencia oficial FIFA: <a href={MUNDIAL_SOURCE.officialUrl} target="_blank" rel="noopener noreferrer">calendario FIFA</a>.
            </p>
          </aside>
        </section>

        <section style={{ marginTop: 28 }}>
          <div className="wc-section-head">
            <div>
              <h2>Primeras fechas</h2>
              <p>Vista editorial por día, pensada para navegación rápida tipo calendario.</p>
            </div>
            <Link className="wc-pill" href="/mundial-2026/calendario">Abrir calendario completo</Link>
          </div>
          {dates.map((day) => (
            <div className="wc-date-block" key={day.dateLabel}>
              <h3 className="wc-date-title">{day.dateLabel}</h3>
              <div className="wc-fixture-card-list">
                {day.matches.map((match) => <MatchCard key={match.id} match={match} />)}
              </div>
            </div>
          ))}
        </section>

        <section id="selecciones" style={{ marginTop: 30 }}>
          <div className="wc-section-head">
            <div>
              <h2>Selecciones</h2>
              <p>Perfiles por país con grupo, calendario, convocados, ranking FIFA e historial mundialista listos para alimentar.</p>
            </div>
          </div>
          <div className="wc-team-grid">
            {teams.map((team) => (
              <Link className="wc-team-card" href={`/mundial-2026/seleccion/${team.slug}`} key={team.slug}>
                <img src={team.flag.url} alt={`Bandera de ${team.name}`} loading="lazy" />
                <div>
                  <strong>{team.name}</strong>
                  <span>
                    Grupo {team.group} · {team.fifaRanking ? `Ranking FIFA #${team.fifaRanking}` : `${team.matches.length} partidos`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="grupos" style={{ marginTop: 30 }}>
          <div className="wc-section-head">
            <div>
              <h2>Tablas de grupos del Mundial 2026</h2>
              <p>Posiciones con banderas, puntos, partidos jugados, goles a favor, goles en contra y diferencia de gol.</p>
            </div>
          </div>
          <MundialGroupsTable initialGroups={standings} />
        </section>
      </div>
    </main>
  );
}
