import { BRAND_OG_SIZE, makeBrandOgImage } from '@/lib/brand-og-image';

export const runtime = 'nodejs';
export const alt = 'Comisiones Legislativas | Monitor Legislativo de Acontecer.co.cr';
export const size = BRAND_OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return makeBrandOgImage({
    kicker: 'Monitor Legislativo',
    title: 'Comisiones Legislativas',
    subtitle: 'Integración de comisiones permanentes y especiales de la Asamblea Legislativa.',
    accentColor: '#49b7ff',
    variant: 'asamblea',
    footer: 'Asamblea Legislativa de Costa Rica 2026-2030',
    cards: [
      { label: 'Consulta', value: 'Comisiones' },
      { label: 'Integrantes', value: 'Diputados por órgano' },
      { label: 'Cobertura', value: 'Permanentes y especiales' },
    ],
  });
}
