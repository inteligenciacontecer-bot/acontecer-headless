import { BRAND_OG_SIZE, makeBrandOgImage } from '@/lib/brand-og-image';
import { formatCostaRicaDateTime, getMundialMatch } from '@/lib/mundial-2026';

export const runtime = 'nodejs';
export const alt = 'Partido del Mundial 2026 | Acontecer.co.cr';
export const size = BRAND_OG_SIZE;
export const contentType = 'image/png';

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const match = getMundialMatch(slug);

  if (!match) {
    return makeBrandOgImage({
      kicker: 'Mundial 2026',
      title: 'Partido del Mundial 2026',
      subtitle: 'Calendario, sedes y minuto a minuto en Acontecer.co.cr.',
      accentColor: '#49b7ff',
      variant: 'servicios',
      footer: 'Acontecer.co.cr · Mundial 2026',
      cards: [
        { label: 'Cobertura', value: 'En vivo' },
        { label: 'Calendario', value: '104 juegos' },
      ],
    });
  }

  return makeBrandOgImage({
    kicker: `Partido #${match.matchNumber} · ${match.phaseEs}`,
    title: `${match.home} vs ${match.away}`,
    subtitle: `${formatCostaRicaDateTime(match.kickoffUtc)} · ${match.venue}`,
    accentColor: '#49b7ff',
    variant: 'servicios',
    footer: 'Acontecer.co.cr · Mundial 2026',
    cards: [
      { label: 'Fase', value: match.group ? `Grupo ${match.group}` : match.phaseEs },
      { label: 'Cobertura', value: 'Minuto a minuto' },
      { label: 'SEO', value: 'Ficha del partido' },
    ],
  });
}
