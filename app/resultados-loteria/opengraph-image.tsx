import { BRAND_OG_SIZE, makeBrandOgImage } from '@/lib/brand-og-image';

export const runtime = 'nodejs';
export const alt = 'Resultados de la Lotería de Costa Rica | Acontecer.co.cr';
export const size = BRAND_OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return makeBrandOgImage({
    kicker: 'Resultados JPS',
    title: 'Lotería de Costa Rica',
    subtitle: 'Nuevos Tiempos, 3 Monazos, Lotto, Chances y Lotería Nacional.',
    accentColor: '#ff8ac2',
    variant: 'loteria',
    cards: [
      { label: 'Juegos', value: 'JPS en tiempo real' },
      { label: 'Sorteos', value: 'día / tarde / noche' },
      { label: 'Cobertura', value: 'Costa Rica' },
    ],
    footer: 'Resultados actualizados después de cada sorteo',
  });
}
