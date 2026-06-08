import { BRAND_OG_SIZE, makeBrandOgImage } from '@/lib/brand-og-image';

export const runtime = 'nodejs';
export const alt = 'Votaciones del Plenario | Monitor Legislativo de Acontecer.co.cr';
export const size = BRAND_OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return makeBrandOgImage({
    kicker: 'Monitor Legislativo',
    title: 'Votaciones del Plenario',
    subtitle: 'Registro de votaciones legislativas y posiciones de las fracciones.',
    accentColor: '#49b7ff',
    variant: 'asamblea',
    footer: 'Asamblea Legislativa de Costa Rica 2026-2030',
    cards: [
      { label: 'Plenario', value: 'Votos registrados' },
      { label: 'Detalle', value: 'Resultado y fracción' },
      { label: 'Actualización', value: 'Seguimiento continuo' },
    ],
  });
}
