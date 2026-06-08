import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MundialLivePanel from '@/components/MundialLivePanel';
import '../../mundial.css';
import {
  MUNDIAL_MATCHES,
  formatCostaRicaDateTime,
  getMundialMatch,
  getMundialMatchCenter,
  getMundialTeamFlag,
  getMundialTeamProfile,
} from '@/lib/mundial-2026';

type Props = { params: Promise<{ slug: string }> };
type Match = (typeof MUNDIAL_MATCHES)[number];

const SITE_URL = 'https://acontecer.co.cr';

function getMatchUrl(slug: string) {
  return `${SITE_URL}/mundial-2026/partido/${slug}`;
}

function getMatchTitle(match: Match) {
  return `${match.home} vs ${match.away}: marcador, hora y minuto a minuto | Mundial 2026`;
}

function getMatchDescription(match: Match) {
  return `${match.home} vs ${match.away} en el Mundial 2026: marcador, fecha, horario de Costa Rica, sede, grupo, ficha del partido, estadísticas y cobertura minuto a minuto en Acontecer.co.cr.`;
}

function getMatchKeywords(match: Match) {
  return [
    `${match.home} vs ${match.away}`,
    `${match.home} ${match.away} Mundial 2026`,
    `marcador ${match.home} vs ${match.away}`,
    `partido ${match.matchNumber} Mundial 2026`,
    `hora ${match.home} vs ${match.away}`,
    `minuto a minuto ${match.home} vs ${match.away}`,
    `resultado ${match.home} vs ${match.away}`,
    `alineaciones ${match.home} vs ${match.away}`,
    `estadísticas ${match.home} vs ${match.away}`,
    `ranking FIFA ${match.home}`,
    `ranking FIFA ${match.away}`,
    `historial ${match.home} vs ${match.away}`,
    'calendario Mundial 2026',
    match.phaseEs,
    match.group ? `Grupo ${match.group} Mundial 2026` : match.phaseEs,
    match.venue,
  ];
}

function getMatchStatusLabel(match: Match) {
  if (match.status === 'live') return 'En vivo';
  if (match.status === 'finished') return 'Finalizado';
  return 'Programado';
}

function getScoreValue(score?: number | null) {
  return score ?? 0;
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
  const homeFlag = getMundialTeamFlag(match.home);
  const awayFlag = getMundialTeamFlag(match.away);
  const homeProfile = getMundialTeamProfile(match.home);
  const awayProfile = getMundialTeamProfile(match.away);
  const homeRanking = homeProfile?.fifaRanking ? `Ranking FIFA #${homeProfile.fifaRanking}` : 'Ranking FIFA por conectar';
  const awayRanking = awayProfile?.fifaRanking ? `Ranking FIFA #${awayProfile.fifaRanking}` : 'Ranking FIFA por conectar';
  const statusLabel = getMatchStatusLabel(match);
  const homeScore = getScoreValue(match.homeScore);
  const awayScore = getScoreValue(match.awayScore);
  const center = getMundialMatchCenter(match);
  const matchStats = center.statistics;
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
      answer: `Acontecer.co.cr mantiene esta página preparada para el marcador, eventos, goles, tarjetas, cambios, faltas, estadísticas y actualizaciones en vivo del partido.`,
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

      <section className="wc-match-hero wc-match-hero--center">
        <div className="wc-match-hero-inner">
          <div className="wc-match-topline">
            <span>Partido #{match.matchNumber}</span>
            <span>{phaseLine}</span>
            <span>{statusLabel}</span>
          </div>

          <div className="wc-match-scorecard" aria-label={`Marcador ${match.home} contra ${match.away}`}>
            <div className="wc-match-team wc-match-team--home">
              <img src={homeFlag.url} alt={`Bandera de ${match.home}`} />
              <strong>{match.home}</strong>
              <small>{match.homeRaw}</small>
              <small>{homeRanking}</small>
            </div>

            <div className="wc-match-scorebox">
              <div className="wc-match-status">{statusLabel}</div>
              <div className="wc-match-score">
                <span>{homeScore}</span>
                <b>-</b>
                <span>{awayScore}</span>
              </div>
              <div className="wc-match-vs">VS</div>
            </div>

            <div className="wc-match-team wc-match-team--away">
              <img src={awayFlag.url} alt={`Bandera de ${match.away}`} />
              <strong>{match.away}</strong>
              <small>{match.awayRaw}</small>
              <small>{awayRanking}</small>
            </div>
          </div>

          <div className="wc-match-meta-strip">
            <div>
              <span>Hora Costa Rica</span>
              <strong>{formattedTime}</strong>
            </div>
            <div>
              <span>Sede</span>
              <strong>{match.venue}</strong>
            </div>
            <div>
              <span>Competencia</span>
              <strong>Copa Mundial de la FIFA 2026</strong>
            </div>
          </div>
        </div>
      </section>

      <nav className="wc-nav">
        <div className="wc-nav-inner">
          <Link href="/mundial-2026">Portada</Link>
          <Link href="/mundial-2026/calendario">Calendario</Link>
          <a className="is-active" href="#resumen">Resumen</a>
          <a href="#cronica">Crónica</a>
          <a href="#estadisticas">Estadísticas</a>
          <a href="#alineaciones">Alineaciones</a>
          <a href="#duelos-previos">Duelos previos</a>
          <a href="#publico">Público</a>
          <a href="#minuto-a-minuto">Minuto a minuto</a>
        </div>
      </nav>

      <div className="wc-wrap">
        <section className="wc-layout">
          <div className="wc-match-main-column">
            <section className="wc-match-module wc-match-summary" id="resumen">
              <div className="wc-module-head">
                <div>
                  <p className="wc-kicker">Centro de partido</p>
                  <h2>{match.home} vs {match.away}</h2>
                </div>
                <span className="wc-match-chip">{statusLabel}</span>
              </div>
              <div className="wc-summary-grid">
                <div>
                  <span>Marcador</span>
                  <strong>{homeScore} - {awayScore}</strong>
                </div>
                <div>
                  <span>Fase</span>
                  <strong>{phaseLine}</strong>
                </div>
                <div>
                  <span>Partido</span>
                  <strong>#{match.matchNumber}</strong>
                </div>
              </div>
              <p>
                Esta página queda lista como ficha viva del partido: marcador, eventos, estadísticas, alineaciones,
                sede, horario y cobertura minuto a minuto se integrarán aquí conforme exista información confirmada.
              </p>
            </section>

            <section className="wc-match-module" id="cronica">
              <div className="wc-module-head">
                <div>
                  <p className="wc-kicker">Crónica</p>
                  <h2>{center.chronicle.headline}</h2>
                </div>
                <span className="wc-match-chip">{center.dataStatus === 'scheduled-shell' ? 'Lista' : center.dataStatus}</span>
              </div>
              <p className="wc-chronicle-lead">{center.chronicle.lead}</p>
              <div className="wc-chronicle-points">
                {center.chronicle.keyPoints.map((point) => (
                  <div key={point}>
                    <span aria-hidden="true" />
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="wc-match-module" id="estadisticas">
              <div className="wc-module-head">
                <div>
                  <p className="wc-kicker">Datos del juego</p>
                  <h2>Estadísticas</h2>
                </div>
                <span className="wc-match-chip">Por conectar</span>
              </div>
              <div className="wc-stats-board">
                {matchStats.map((stat) => (
                  <div className="wc-stat-row" key={stat.label}>
                    <strong>{stat.home}</strong>
                    <span>{stat.label}</span>
                    <strong>{stat.away}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="wc-match-module" id="alineaciones">
              <div className="wc-module-head">
                <div>
                  <p className="wc-kicker">Equipos</p>
                  <h2>Alineaciones</h2>
                </div>
                <span className="wc-match-chip">Pendiente</span>
              </div>
              <div className="wc-lineups">
                <div>
                  <img src={homeFlag.url} alt="" />
                  <strong>{match.home}</strong>
                  <span>{center.lineups.home.formation || 'Formación por confirmar'}</span>
                  <div className="wc-mini-pitch" aria-hidden="true">
                    <i /><i /><i /><i /><i /><i /><i />
                  </div>
                  <p>La formación titular, suplentes y entrenador aparecerán aquí cuando el proveedor confirme la información.</p>
                </div>
                <div>
                  <img src={awayFlag.url} alt="" />
                  <strong>{match.away}</strong>
                  <span>{center.lineups.away.formation || 'Formación por confirmar'}</span>
                  <div className="wc-mini-pitch" aria-hidden="true">
                    <i /><i /><i /><i /><i /><i /><i />
                  </div>
                  <p>Este espacio queda preparado para alineaciones, sustituciones y novedades previas al inicio del partido.</p>
                </div>
              </div>
            </section>

            <section className="wc-match-module" id="duelos-previos">
              <div className="wc-module-head">
                <div>
                  <p className="wc-kicker">Historial</p>
                  <h2>Duelos previos</h2>
                </div>
                <span className="wc-match-chip">Scraping / proveedor</span>
              </div>
              {center.headToHead.length > 0 ? (
                <div className="wc-h2h-list">
                  {center.headToHead.map((duel) => (
                    <div className="wc-h2h-row" key={`${duel.date}-${duel.home}-${duel.away}`}>
                      <span>{duel.date}</span>
                      <strong>{duel.home} {duel.score} {duel.away}</strong>
                      <em>{duel.competition}</em>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="wc-empty-module">
                  <strong>Historial listo para alimentar</strong>
                  <p>
                    Este bloque queda preparado para duelos directos, últimos resultados entre selecciones y contexto histórico
                    obtenido desde una fuente externa verificada.
                  </p>
                </div>
              )}
            </section>

            <section className="wc-match-module" id="publico">
              <div className="wc-module-head">
                <div>
                  <p className="wc-kicker">Pulso del público</p>
                  <h2>¿Cómo llega la conversación?</h2>
                </div>
                <span className="wc-match-chip">Próximo</span>
              </div>
              <div className="wc-public-pulse">
                {[
                  { label: match.home, value: center.publicPulse.home },
                  { label: 'Empate', value: center.publicPulse.draw },
                  { label: match.away, value: center.publicPulse.away },
                ].map((item) => (
                  <div key={item.label}>
                    <div>
                      <span>{item.label}</span>
                      <strong>{item.value == null ? '-' : `${item.value}%`}</strong>
                    </div>
                    <i style={{ width: `${item.value ?? 0}%` }} />
                  </div>
                ))}
              </div>
              <p className="wc-source">
                Espacio listo para incorporar encuesta propia, señales sociales o tendencias de audiencia cuando se active la cobertura en vivo.
              </p>
            </section>

            <div id="minuto-a-minuto">
              <MundialLivePanel match={match} />
            </div>
          </div>

          <aside className="wc-card wc-match-side-card">
            <h2>Ficha del partido</h2>
            <div className="wc-side-score">
              <span>{match.home}</span>
              <strong>{homeScore} - {awayScore}</strong>
              <span>{match.away}</span>
            </div>
            <dl className="wc-fixture-list">
              <div><dt>Fase</dt><dd>{phaseLine}</dd></div>
              {match.group && <div><dt>Grupo</dt><dd>{match.group}</dd></div>}
              <div><dt>Partido</dt><dd>#{match.matchNumber}</dd></div>
              <div><dt>Sede</dt><dd>{match.venue}</dd></div>
              <div><dt>Hora CR</dt><dd>{formattedTime}</dd></div>
              <div><dt>Estado</dt><dd>{statusLabel}</dd></div>
              <div><dt>{match.home}</dt><dd>{homeRanking}</dd></div>
              <div><dt>{match.away}</dt><dd>{awayRanking}</dd></div>
            </dl>
            <p className="wc-source">
              Panel preparado para goles, tarjetas, cambios, faltas, VAR, marcador, alineaciones y estadísticas del partido. Ranking FIFA con fuente oficial FIFA/Coca-Cola.
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
              está preparada para incorporar marcador, goles, tarjetas, cambios, faltas, revisiones VAR, alineaciones,
              estadísticas y actualizaciones relevantes antes, durante y después del encuentro.
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
                <li>Alineaciones, estadísticas y contexto previo cuando esté disponible.</li>
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
