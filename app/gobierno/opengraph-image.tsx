import { BRAND_OG_SIZE, makeBrandOgImage } from '@/lib/brand-og-image';

export const runtime = 'nodejs';
export const alt = 'Gobierno de Costa Rica 2026-2030 | Acontecer.co.cr';
export const size = BRAND_OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return makeBrandOgImage({
    kicker: 'Directorio oficial',
    title: 'Gobierno de Costa Rica',
    subtitle: 'Ministros, presidencias ejecutivas y perfiles del Poder Ejecutivo 2026-2030.',
    accentColor: '#49b7ff',
    variant: 'gobierno',
    cards: [
      { label: 'Periodo', value: '2026-2030' },
      { label: 'Gabinete', value: '19 ministros' },
      { label: 'Instituciones', value: '21 presidencias' },
    ],
    footer: 'Perfiles, cargos, currículos y fuentes oficiales',
  });
}
