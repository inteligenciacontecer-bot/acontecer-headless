import { BRAND_OG_SIZE, makeBrandOgImage } from '@/lib/brand-og-image';

export const runtime = 'nodejs';
export const alt = 'Feriados de Costa Rica | Acontecer.co.cr';
export const size = BRAND_OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return makeBrandOgImage({
    kicker: 'Calendario nacional',
    title: 'Feriados de Costa Rica',
    subtitle: 'Fechas oficiales, día de la semana y modalidad de pago obligatorio o no obligatorio.',
    accentColor: '#f6c453',
    variant: 'feriados',
    cards: [
      { label: 'Calendario', value: '2026' },
      { label: 'Consulta', value: 'próximo feriado' },
      { label: 'Detalle', value: 'pago obligatorio' },
    ],
    footer: 'Calendario laboral y fechas de disfrute nacional',
  });
}
