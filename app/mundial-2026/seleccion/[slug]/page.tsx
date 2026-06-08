import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../../mundial.css';
import {
  formatCostaRicaDateTime,
  getMundialTeamProfile,
  getMundialTeams,
} from '@/lib/mundial-2026';

type Props = { params: Promise<{ slug: string }> };

const SITE_URL = 'https://acontecer.co.cr';

export function generateStaticParams() {
  return getMundialTeams().map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const team = getMundialTeamProfile(slug);
  if (!team) return { title: 'Selección Mundial 2026' };

  const url = `${SITE_URL}/mundial-2026/seleccion/${team.slug}`;
  const title = `${team.name} en el Mundial 2026: grupo, partidos y plantilla`;
  const description = `Perfil de ${team.name} en el Mundial 2026: grupo ${team.group}, próximos partidos, convocados, ranking FIFA, últimos resultados e historial mundialista.`;

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
      images: [{ url: 'https://acontecer.co.cr/mundial-2026/opengraph-image', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://acontecer.co.cr/mundial-2026/opengraph-image'],
    },
  };
}

export const revalidate = 300;

export default async function MundialTeamPage({ params }: Props) {
  const { slug } = await params;
  const team = getMundialTeamProfile(slug);
  if (!team) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: team.name,
    sport: 'Soccer',
    image: team.flag.url,
    memberOf: {
      '@type': 'SportsOrganization',
      name: 'FIFA World Cup 2026',
    },
    url: `${SITE_URL}/mundial-2026/seleccion/${team.slug}`,
  };

  return (
    <main className="wc-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

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
        </div>
      </nav>

      <div className="wc-wrap">
        <section className="wc-team-profile-grid">
          <div className="wc-match-main-column">
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
                <span className="wc-match-chip">Por confirmar</span>
              </div>
              <div className="wc-empty-module">
                <strong>Lista preparada para carga automática</strong>
                <p>
                  Aquí aparecerán porteros, defensas, mediocampistas, delanteros, entrenador y bajas cuando se conecte
                  una fuente oficial o scraper verificado.
                </p>
              </div>
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
          </div>

          <aside className="wc-card wc-match-side-card">
            <h2>{team.name}</h2>
            <div className="wc-team-side-flag">
              <img src={team.flag.url} alt="" />
              <strong>Grupo {team.group}</strong>
            </div>
            <dl className="wc-fixture-list">
              <div><dt>Ranking FIFA</dt><dd>{team.fifaRanking ?? 'Por conectar'}</dd></div>
              <div><dt>Partidos</dt><dd>{team.matches.length}</dd></div>
              <div><dt>Convocados</dt><dd>Por confirmar</dd></div>
              <div><dt>Historial</dt><dd>Por alimentar</dd></div>
            </dl>
            <p className="wc-source">
              Perfil listo para integrarse con ranking FIFA, nómina oficial, últimos resultados e historial mundialista.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
