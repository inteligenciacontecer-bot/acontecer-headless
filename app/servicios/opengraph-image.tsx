import { BRAND_OG_SIZE, makeBrandOgImage } from '@/lib/brand-og-image';

export const runtime = 'nodejs';
export const alt = 'Servicios de Costa Rica | Acontecer.co.cr';
export const size = BRAND_OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return makeBrandOgImage({
    kicker: 'Datos de Costa Rica',
    title: 'Servicios de Costa Rica',
    subtitle: 'Tipo de cambio, clima, combustibles, lotería, feriados y restricción vehicular.',
    accentColor: '#54d6a7',
    variant: 'servicios',
    cards: [
      { label: 'Actualización', value: 'datos diarios' },
      { label: 'Fuentes', value: 'BCCR / JPS / ARESEP' },
      { label: 'Acceso', value: 'en un solo lugar' },
    ],
    footer: 'Información útil actualizada automáticamente',
  });
}
