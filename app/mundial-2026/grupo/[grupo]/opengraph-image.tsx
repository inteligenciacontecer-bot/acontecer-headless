import { BRAND_OG_SIZE, makeBrandOgImage } from '@/lib/brand-og-image';
import { MUNDIAL_GROUPS } from '@/lib/mundial-2026';

export const runtime = 'nodejs';
export const alt = 'Grupo del Mundial 2026 | Acontecer.co.cr';
export const size = BRAND_OG_SIZE;
export const contentType = 'image/png';

type Props = { params: Promise<{ grupo: string }> };

export default async function Image({ params }: Props) {
  const { grupo } = await params;
  const group = grupo.replace(/^grupo-?/i, '').toUpperCase();
  const teams = MUNDIAL_GROUPS[group] || [];

  return makeBrandOgImage({
    kicker: 'Mundial 2026',
    title: `Grupo ${group}`,
    subtitle: teams.length
      ? `Tabla, partidos y selecciones: ${teams.join(', ')}.`
      : 'Tabla, partidos y selecciones del Mundial 2026.',
    accentColor: '#49b7ff',
    variant: 'servicios',
    footer: 'Acontecer.co.cr · Mundial 2026',
    cards: [
      { label: 'Tabla', value: 'En vivo' },
      { label: 'Partidos', value: `${teams.length ? 6 : 104} juegos` },
      { label: 'Selecciones', value: teams.length ? `${teams.length}` : '48' },
    ],
  });
}
