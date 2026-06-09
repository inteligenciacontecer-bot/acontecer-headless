import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../../mundial.css';
import {
  MUNDIAL_GROUPS,
  formatCostaRicaDateTime,
  getMundialTeamFlag,
  getMundialTeamSlug,
} from '@/lib/mundial-2026';
import { getMundialGroupData } from '@/lib/mundial-data';

type Props = { params: Promise<{ grupo: string }> };

const SITE_URL = 'https://acontecer.co.cr';

function normalizeGroupParam(value: string) {
  return value.replace(/^grupo-?/i, '').toUpperCase();
}

function getGroupUrl(group: string) {
  return `${SITE_URL}/mundial-2026/grupo/${group.toLowerCase()}`;
}

function groupTitle(group: string) {
  return `Grupo ${group} Mundial 2026: tabla, partidos y selecciones`;
}

function groupDescription(group: string) {
  return `Tabla de posiciones del Grupo ${group} del Mundial 2026, selecciones, partidos, fechas, sedes, horarios de Costa Rica y resultados actualizados.`;
}

export function generateStaticParams() {
  return Object.keys(MUNDIAL_GROUPS).map((grupo) => ({ grupo: grupo.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grupo } = await params;
  const group = normalizeGroupParam(grupo);
  if (!MUNDIAL_GROUPS[group]) return { title: 'Grupo Mundial 2026' };

  const url = getGroupUrl(group);
  const title = groupTitle(group);
  const description = groupDescription(group);

  return {
    title,
    description,
    keywords: [
      `Grupo ${group} Mundial 2026`,
      `tabla Grupo ${group} Mundial 2026`,
      `partidos Grupo ${group} Mundial 2026`,
      `selecciones Grupo ${group} Mundial 2026`,
      `posiciones Grupo ${group} Mundial 2026`,
      'calendario Mundial 2026',
    ],
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'es_CR',
      siteName: 'Acontecer.co.cr',
      url,
      title,
      description,
      images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${url}/opengraph-image`],
    },
  };
}

export const revalidate = 300;

export default async function MundialGroupPage({ params }: Props) {
  const { grupo } = await params;
  const groupName = normalizeGroupParam(grupo);
  const { group } = await getMundialGroupData(groupName);
  if (!group) notFound();

  const url = getGroupUrl(group.name);
  const title = groupTitle(group.name);
  const description = groupDescription(group.name);
  const faq = [
    {
      question: `¿Qué selecciones están en el Grupo ${group.name} del Mundial 2026?`,
      answer: `El Grupo ${group.name} está integrado por ${group.teams.map((team) => team.team).join(', ')}.`,
    },
    {
      question: `¿Dónde ver la tabla del Grupo ${group.name} del Mundial 2026?`,
      answer: `Acontecer.co.cr mantiene esta página con posiciones, puntos, diferencia de gol, goles a favor, goles en contra y partidos del Grupo ${group.name}.`,
    },
    {
      question: `¿Cuántos partidos tiene el Grupo ${group.name}?`,
      answer: `El Grupo ${group.name} tiene ${group.matches.length} partidos programados en la fase de grupos del Mundial 2026.`,
    },
  ];
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Portada', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Mundial 2026', item: `${SITE_URL}/mundial-2026` },
      { '@type': 'ListItem', position: 3, name: `Grupo ${group.name}`, item: url },
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
    mainEntity: {
      '@type': 'SportsOrganization',
      name: `Grupo ${group.name} - Mundial 2026`,
      sport: 'Soccer',
      member: group.teams.map((team) => ({ '@type': 'SportsTeam', name: team.team, image: team.flag.url })),
    },
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Partidos del Grupo ${group.name} del Mundial 2026`,
    itemListElement: group.matches.map((match, index) => ({
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
      {[breadcrumbSchema, webpageSchema, itemListSchema, faqSchema].map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <section className="wc-hero">
        <div className="wc-hero-inner">
          <div className="wc-kicker">Mundial 2026</div>
          <h1 className="wc-title">Grupo {group.name}</h1>
          <p className="wc-subtitle">
            Tabla, selecciones, calendario, sedes, horarios de Costa Rica y resultados del Grupo {group.name} del Mundial 2026.
          </p>
        </div>
      </section>

      <nav className="wc-nav" aria-label="Navegación del Grupo Mundial 2026">
        <div className="wc-nav-inner">
          <Link href="/mundial-2026">Portada</Link>
          <Link href="/mundial-2026/calendario">Calendario</Link>
          <a className="is-active" href="#tabla">Tabla</a>
          <a href="#partidos">Partidos</a>
          <a href="#faq">Preguntas</a>
        </div>
      </nav>

      <div className="wc-wrap">
        <section className="wc-layout">
          <div className="wc-match-main-column">
            <section className="wc-match-module" id="tabla">
              <div className="wc-module-head">
                <div>
                  <p className="wc-kicker">Posiciones</p>
                  <h2>Tabla del Grupo {group.name}</h2>
                </div>
                <span className="wc-match-chip">En vivo</span>
              </div>
              <div className="wc-standings-table" role="table" aria-label={`Tabla del Grupo ${group.name}`}>
                <div className="wc-standings-row wc-standings-row--head" role="row">
                  <span>Selección</span>
                  <span>PJ</span>
                  <span>PG</span>
                  <span>PE</span>
                  <span>PP</span>
                  <span>GF</span>
                  <span>GC</span>
                  <span>DG</span>
                  <span>Pts</span>
                </div>
                {group.teams.map((team, index) => (
                  <div className="wc-standings-row" role="row" key={team.team}>
                    <Link className="wc-team-cell" href={`/mundial-2026/seleccion/${getMundialTeamSlug(team.team)}`}>
                      <b>{index + 1}</b>
                      <img src={team.flag.url} alt={`Bandera de ${team.team}`} loading="lazy" />
                      <strong>{team.team}</strong>
                    </Link>
                    <span>{team.played}</span>
                    <span>{team.won}</span>
                    <span>{team.drawn}</span>
                    <span>{team.lost}</span>
                    <span>{team.goalsFor}</span>
                    <span>{team.goalsAgainst}</span>
                    <span>{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</span>
                    <span className="wc-points">{team.points}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="wc-match-module" id="partidos">
              <div className="wc-module-head">
                <div>
                  <p className="wc-kicker">Calendario</p>
                  <h2>Partidos del Grupo {group.name}</h2>
                </div>
                <span className="wc-match-chip">{group.matches.length} juegos</span>
              </div>
              <div className="wc-team-match-list">
                {group.matches.map((match) => {
                  const homeFlag = getMundialTeamFlag(match.home);
                  const awayFlag = getMundialTeamFlag(match.away);

                  return (
                    <Link href={`/mundial-2026/partido/${match.slug}`} key={match.id}>
                      <span>{formatCostaRicaDateTime(match.kickoffUtc)}</span>
                      <strong>
                        <img src={homeFlag.url} alt="" loading="lazy" />
                        {match.home} vs {match.away}
                        <img src={awayFlag.url} alt="" loading="lazy" />
                      </strong>
                      <em>{match.venue}</em>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="wc-card wc-match-side-card">
            <h2>Selecciones</h2>
            <div className="wc-team-grid wc-team-grid--compact">
              {group.teams.map((team) => (
                <Link className="wc-team-card" href={`/mundial-2026/seleccion/${getMundialTeamSlug(team.team)}`} key={team.team}>
                  <img src={team.flag.url} alt={`Bandera de ${team.team}`} loading="lazy" />
                  <div>
                    <strong>{team.team}</strong>
                    <span>{team.points} pts · DG {team.goalDifference}</span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section className="wc-match-module" id="faq" style={{ marginTop: 28 }}>
          <div className="wc-module-head">
            <div>
              <p className="wc-kicker">SEO</p>
              <h2>Preguntas frecuentes del Grupo {group.name}</h2>
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
