import { BRAND_OG_SIZE, makeBrandOgImage } from '@/lib/brand-og-image';

export const runtime = 'nodejs';
export const alt = 'Diputados de Costa Rica 2026-2030 | Monitor Legislativo de Acontecer.co.cr';
export const size = BRAND_OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return makeBrandOgImage({
    kicker: 'Monitor Legislativo',
    title: 'Diputados de Costa Rica',
    subtitle: 'Directorio de legisladores, fracciones, asistencia, votos y gastos reportados.',
    accentColor: '#49b7ff',
    variant: 'asamblea',
    footer: 'Asamblea Legislativa de Costa Rica 2026-2030',
    cards: [
      { label: 'Directorio', value: '57 diputados' },
      { label: 'Datos', value: 'Asistencia y gastos' },
      { label: 'Seguimiento', value: 'Perfiles actualizados' },
    ],
  });
}
