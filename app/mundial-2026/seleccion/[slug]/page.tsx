import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../../mundial.css';
import {
  formatCostaRicaDateTime,
  getMundialTeams,
} from '@/lib/mundial-2026';
import { getMundialTeamData } from '@/lib/mundial-data';
import { MUNDIAL_ROSTER_SOURCE } from '@/lib/mundial-rosters';

type Props = { params: Promise<{ slug: string }> };

const SITE_URL = 'https://acontecer.co.cr';

function formatFifaRankingDate(date: string | null): string {
  if (!date) return 'Por confirmar';
  return new Intl.DateTimeFormat('es-CR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00.000Z`));
}

const ROSTER_POSITION_LABELS = {
  GK: 'Porteros',
  DF: 'Defensas',
  MF: 'Mediocampistas',
  FW: 'Delanteros',
} as const;

function getPlayerInitials(name: string) {
  return name
    .replace(/\./g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function generateStaticParams() {
  return getMundialTeams().map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { team } = await getMundialTeamData(slug);
  if (!team) return { title: 'Selección Mundial 2026' };

  const url = `${SITE_URL}/mundial-2026/seleccion/${team.slug}`;
  const image = `${url}/opengraph-image`;
  const title = `${team.name} en el Mundial 2026: grupo, partidos y plantilla`;
  const rankingText = team.fifaRanking ? ` ranking FIFA #${team.fifaRanking},` : ' ranking FIFA,';
  const description = `Perfil de ${team.name} en el Mundial 2026: grupo ${team.group}, próximos partidos, convocados,${rankingText} últimos resultados e historial mundialista.`;

  return {
    title,
    description,
    keywords: [
      `${team.name} Mundial 2026`,
      `${team.name} grupo ${team.group}`,
      `partidos de ${team.name} Mundial 2026`,
      `convocados ${team.name} Mundial 2026`,
      `ranking FIFA ${team.name}`,
      `historial mundialista ${team.name}`,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'es_CR',
      siteName: 'Acontecer.co.cr',
      url,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export const revalidate = 300;

export default async function MundialTeamPage({ params }: Props) {
  const { slug } = await params;
  const { team } = await getMundialTeamData(slug);
  if (!team) notFound();

  const url = `${SITE_URL}/mundial-2026/seleccion/${team.slug}`;
  const title = `${team.name} en el Mundial 2026: grupo, partidos y plantilla`;
  const description = `Perfil de ${team.name} en el Mundial 2026: grupo ${team.group}, partidos, convocados, ranking FIFA e historial mundialista.`;
  const faq = [
    {
      question: `¿En qué grupo está ${team.name} en el Mundial 2026?`,
      answer: `${team.name} está en el Grupo ${team.group} del Mundial 2026.`,
    },
    {
      question: `¿Cuándo juega ${team.name} en el Mundial 2026?`,
      answer: `El calendario de ${team.name} incluye ${team.matches.length} partidos registrados en esta página con fecha, horario de Costa Rica, rival y sede.`,
    },
    {
      question: `¿Dónde ver los convocados de ${team.name} para el Mundial 2026?`,
      answer: `Acontecer.co.cr muestra la plantilla de ${team.name} por posición, con dorsales, clubes y fotos de jugadores cuando están disponibles.`,
    },
  ];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    '@id': `${url}#team`,
    name: team.name,
    sport: 'Soccer',
    image: team.flag.url,
    memberOf: {
      '@type': 'SportsOrganization',
      name: 'FIFA World Cup 2026',
    },
    url,
    identifier: team.fifaCode || undefined,
    additionalProperty: team.fifaRanking ? [
      {
        '@type': 'PropertyValue',
        name: 'FIFA/Coca-Cola World Ranking',
        value: team.fifaRanking,
        dateModified: team.fifaRankingUpdatedAt || undefined,
        url: team.fifaRankingSourceUrl || undefined,
      },
    ] : undefined,
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Portada', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Mundial 2026', item: `${SITE_URL}/mundial-2026` },
      { '@type': 'ListItem', position: 3, name: `Grupo ${team.group}`, item: `${SITE_URL}/mundial-2026/grupo/${team.group.toLowerCase()}` },
      { '@type': 'ListItem', position: 4, name: team.name, item: url },
    ],
  };
  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: 'es-CR',
    isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: 'Acontecer.co.cr', url: SITE_URL },
    publisher: { '@type': 'NewsMediaOrganization', '@id': `${SITE_URL}/#organization`, name: 'Acontecer.co.cr', url: SITE_URL },
    mainEntity: { '@id': `${url}#team` },
  };
  const matchesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Partidos de ${team.name} en el Mundial 2026`,
    itemListElement: team.matches.map((match, index) => ({
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
  const rankingLabel = team.fifaRanking ? `#${team.fifaRanking}` : 'Por conectar';
  const rankingDate = formatFifaRankingDate(team.fifaRankingUpdatedAt);
  const rosterByPosition = Object.entries(ROSTER_POSITION_LABELS).map(([position, label]) => ({
    position,
    label,
    players: team.roster.filter((player) => player.position === position),
  }));

  return (
    <main className="wc-page">
      {[schema, breadcrumbSchema, webpageSchema, matchesSchema, faqSchema].map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}

      <section className="wc-team-hero">
        <div className="wc-match-hero-inner">
          <div className="wc-team-hero-grid">
            <div>
              <p className="wc-kicker">Selección · Mundial 2026</p>
              <h1>{team.name}</h1>
              <p>
                Perfil preparado para calendario, convocados, ranking FIFA, últimos resultados,
                historial en mundiales y cobertura editorial de Acontecer.co.cr.
              </p>
            </div>
            <div className="wc-team-flag-panel">
              <img src={team.flag.url} alt={`Bandera de ${team.name}`} />
              <strong>Grupo {team.group}</strong>
              <span>Ranking FIFA {rankingLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <nav className="wc-nav">
        <div className="wc-nav-inner">
          <Link href="/mundial-2026">Mundial 2026</Link>
          <Link href="/mundial-2026/calendario">Calendario</Link>
          <a className="is-active" href="#partidos">Partidos</a>
          <a href="#convocados">Convocados</a>
          <a href="#historial">Historial</a>
          <a href="#faq">Preguntas</a>
        </div>
      </nav>

      <div className="wc-wrap">
        <section className="wc-team-profile-grid">
          <div className="wc-match-main-column">
            <section className="wc-match-module">
              <div className="wc-module-head">
                <div>
                  <p className="wc-kicker">Ficha</p>
                  <h2>Datos de {team.name}</h2>
                </div>
                <span className="wc-match-chip">{team.fifaCode || 'FIFA'}</span>
              </div>
              <div className="wc-summary-grid">
                <div>
                  <span>Grupo</span>
                  <strong>{team.group}</strong>
                </div>
                <div>
                  <span>Ranking FIFA</span>
                  <strong>{rankingLabel}</strong>
                </div>
                <div>
                  <span>Partidos</span>
                  <strong>{team.matches.length}</strong>
                </div>
              </div>
              <p className="wc-source">
                Ranking FIFA/Coca-Cola masculino con última actualización oficial del {rankingDate}
                {team.fifaRankingSourceUrl && (
                  <>. Fuente: <a href={team.fifaRankingSourceUrl} target="_blank" rel="noopener noreferrer">FIFA</a></>
                )}.
              </p>
            </section>

            <section className="wc-match-module" id="partidos">
              <div className="wc-module-head">
                <div>
                  <p className="wc-kicker">Calendario</p>
                  <h2>Partidos de {team.name}</h2>
                </div>
                <span className="wc-match-chip">{team.matches.length} juegos</span>
              </div>
              <div className="wc-team-match-list">
                {team.matches.map((match) => {
                  const rival = match.home === team.name ? match.away : match.home;
                  return (
                    <Link href={`/mundial-2026/partido/${match.slug}`} key={match.id}>
                      <span>{formatCostaRicaDateTime(match.kickoffUtc)}</span>
                      <strong>{match.home} vs {match.away}</strong>
                      <em>{rival} · {match.venue}</em>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="wc-match-module" id="convocados">
              <div className="wc-module-head">
                <div>
                  <p className="wc-kicker">Plantilla</p>
                  <h2>Convocados</h2>
                </div>
                <span className="wc-match-chip">{team.roster.length} jugadores</span>
              </div>
              <div className="wc-roster-groups">
                {rosterByPosition.map((group) => (
                  <div className="wc-roster-group" key={group.position}>
                    <h3>{group.label}</h3>
                    <div className="wc-roster-grid">
                      {group.players.map((player) => (
                        <article className="wc-roster-card" key={`${player.number}-${player.name}`}>
                          <div className="wc-roster-avatar">
                            <span>{player.number}</span>
                            {player.photoUrl ? (
                              <img src={player.photoUrl} alt={player.name} loading="lazy" />
                            ) : (
                              <b>{getPlayerInitials(player.name)}</b>
                            )}
                          </div>
                          <div>
                            <strong>{player.name}</strong>
                            <em>{player.club}</em>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="wc-source">
                Convocatoria importada desde lista FIFA publicada el 3 de junio de 2026. Fuente espejo: <a href={MUNDIAL_ROSTER_SOURCE.url} target="_blank" rel="noopener noreferrer">World Cup Ranking</a>.
              </p>
            </section>

            <section className="wc-match-module" id="historial">
              <div className="wc-module-head">
                <div>
                  <p className="wc-kicker">Antecedentes</p>
                  <h2>Últimos partidos e historial mundialista</h2>
                </div>
                <span className="wc-match-chip">Scraping</span>
              </div>
              <div className="wc-team-history-grid">
                <div className="wc-empty-module">
                  <strong>Últimos resultados</strong>
                  <p>Bloque listo para cargar amistosos, eliminatoria, Nations League u otros partidos recientes.</p>
                </div>
                <div className="wc-empty-module">
                  <strong>Historial en mundiales</strong>
                  <p>Espacio para participaciones, mejores posiciones, goleadores históricos y registros relevantes.</p>
                </div>
              </div>
            </section>

            <section className="wc-match-module" id="faq">
              <div className="wc-module-head">
                <div>
                  <p className="wc-kicker">SEO</p>
                  <h2>Preguntas frecuentes sobre {team.name}</h2>
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

          <aside className="wc-card wc-match-side-card">
            <h2>{team.name}</h2>
            <div className="wc-team-side-flag">
              <img src={team.flag.url} alt="" />
              <strong>Grupo {team.group}</strong>
            </div>
            <dl className="wc-fixture-list">
              <div><dt>Ranking FIFA</dt><dd>{rankingLabel}</dd></div>
              <div><dt>Código FIFA</dt><dd>{team.fifaCode || 'Por confirmar'}</dd></div>
              <div><dt>Partidos</dt><dd>{team.matches.length}</dd></div>
              <div><dt>Convocados</dt><dd>{team.roster.length}</dd></div>
              <div><dt>Historial</dt><dd>Por alimentar</dd></div>
            </dl>
            <p className="wc-source">
              Ranking actualizado al {rankingDate}. Perfil listo para integrarse con nómina oficial, últimos resultados e historial mundialista.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
