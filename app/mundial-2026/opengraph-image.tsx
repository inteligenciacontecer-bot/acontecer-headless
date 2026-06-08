import { BRAND_OG_SIZE, makeBrandOgImage } from '@/lib/brand-og-image';

export const runtime = 'nodejs';
export const alt = 'Mundial 2026 | Acontecer.co.cr';
export const size = BRAND_OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return makeBrandOgImage({
    kicker: 'Cobertura especial',
    title: 'Mundial 2026',
    subtitle: 'Calendario, grupos, sedes, partidos y minuto a minuto en Acontecer.co.cr.',
    accentColor: '#49b7ff',
    variant: 'servicios',
    footer: 'Acontecer.co.cr · Mundial 2026',
    cards: [
      { label: 'Partidos', value: '104 juegos' },
      { label: 'Formato', value: '48 selecciones' },
      { label: 'Cobertura', value: 'En vivo' },
    ],
  });
}
