import { BRAND_OG_SIZE, makeBrandOgImage } from '@/lib/brand-og-image';
import { getMundialTeamProfile } from '@/lib/mundial-2026';

export const runtime = 'nodejs';
export const alt = 'Selección del Mundial 2026 | Acontecer.co.cr';
export const size = BRAND_OG_SIZE;
export const contentType = 'image/png';

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const team = getMundialTeamProfile(slug);

  if (!team) {
    return makeBrandOgImage({
      kicker: 'Mundial 2026',
      title: 'Selección Mundial 2026',
      subtitle: 'Perfil, partidos, ranking FIFA y convocados en Acontecer.co.cr.',
      accentColor: '#49b7ff',
      variant: 'servicios',
      footer: 'Acontecer.co.cr · Mundial 2026',
      cards: [
        { label: 'Selecciones', value: '48' },
        { label: 'Calendario', value: '104 juegos' },
      ],
    });
  }

  return makeBrandOgImage({
    kicker: `Grupo ${team.group} · Mundial 2026`,
    title: team.name,
    subtitle: 'Partidos, convocados, ranking FIFA e historial mundialista.',
    accentColor: '#49b7ff',
    variant: 'servicios',
    footer: 'Acontecer.co.cr · Mundial 2026',
    cards: [
      { label: 'Grupo', value: team.group },
      { label: 'Ranking FIFA', value: team.fifaRanking ? `#${team.fifaRanking}` : 'Por confirmar' },
      { label: 'Convocados', value: `${team.roster.length || 0}` },
    ],
  });
}
