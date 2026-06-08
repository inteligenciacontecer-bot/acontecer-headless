import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MundialLivePanel from '@/components/MundialLivePanel';
import '../../mundial.css';
import { MUNDIAL_MATCHES, formatCostaRicaDateTime, getMundialMatch } from '@/lib/mundial-2026';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return MUNDIAL_MATCHES.map((match) => ({ slug: match.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const match = getMundialMatch(slug);
  if (!match) return { title: 'Partido Mundial 2026' };

  const title = `${match.home} vs ${match.away} | Mundial 2026`;
  const description = `${match.home} vs ${match.away}: fecha, sede, horario de Costa Rica y minuto a minuto del partido ${match.matchNumber} del Mundial 2026.`;

  return {
    title,
    description,
    alternates: { canonical: `https://acontecer.co.cr/mundial-2026/partido/${match.slug}` },
    openGraph: {
      type: 'article',
      url: `https://acontecer.co.cr/mundial-2026/partido/${match.slug}`,
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

export const revalidate = 60;

export default async function MundialPartidoPage({ params }: Props) {
  const { slug } = await params;
  const match = getMundialMatch(slug);
  if (!match) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.home} vs ${match.away}`,
    startDate: match.kickoffUtc || undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    sport: 'Soccer',
    location: {
      '@type': 'Place',
      name: match.venue,
    },
    competitor: [
      { '@type': 'SportsTeam', name: match.home },
      { '@type': 'SportsTeam', name: match.away },
    ],
    organizer: { '@type': 'Organization', name: 'FIFA' },
    url: `https://acontecer.co.cr/mundial-2026/partido/${match.slug}`,
  };

  return (
    <main className="wc-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="wc-match-hero">
        <div className="wc-match-hero-inner">
          <div className="wc-kicker">Partido #{match.matchNumber} · {match.phaseEs}</div>
          <div className="wc-score-title">
            <strong>{match.home}</strong>
            <span>vs</span>
            <strong>{match.away}</strong>
          </div>
          <p className="wc-subtitle" style={{ marginTop: 18 }}>
            {formatCostaRicaDateTime(match.kickoffUtc)} · {match.venue}
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
            <p><strong>Fase:</strong> {match.phaseEs}</p>
            {match.group && <p><strong>Grupo:</strong> {match.group}</p>}
            <p><strong>Partido:</strong> #{match.matchNumber}</p>
            <p><strong>Sede:</strong> {match.venue}</p>
            <p><strong>Hora CR:</strong> {formatCostaRicaDateTime(match.kickoffUtc)}</p>
            <p className="wc-source">
              La página queda preparada para actualización en vivo. El panel recibirá eventos desde el proveedor de datos:
              goles, tarjetas, cambios, faltas, VAR y estado del marcador.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
