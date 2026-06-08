import { BRAND_OG_SIZE, makeBrandOgImage } from '@/lib/brand-og-image';

export const runtime = 'nodejs';
export const alt = 'Expedientes Legislativos | Monitor Legislativo de Acontecer.co.cr';
export const size = BRAND_OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return makeBrandOgImage({
    kicker: 'Monitor Legislativo',
    title: 'Expedientes Legislativos',
    subtitle: 'Proyectos de ley, estado del trámite, comisiones y proponentes.',
    accentColor: '#49b7ff',
    variant: 'asamblea',
    footer: 'Asamblea Legislativa de Costa Rica 2026-2030',
    cards: [
      { label: 'Proyectos', value: 'Ley y trámite' },
      { label: 'Estados', value: 'Avance legislativo' },
      { label: 'Consulta', value: 'Buscador público' },
    ],
  });
}
