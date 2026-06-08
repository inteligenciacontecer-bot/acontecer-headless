import { BRAND_OG_SIZE, makeBrandOgImage } from '@/lib/brand-og-image';

export const runtime = 'nodejs';
export const alt = 'Acontecer Matutino | Acontecer.co.cr';
export const size = BRAND_OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return makeBrandOgImage({
    kicker: 'Acontecer.co.cr',
    title: 'Acontecer Matutino',
    subtitle: 'El resumen diario para empezar informado: noticias clave, contexto y agenda del día.',
    accentColor: '#49b7ff',
    variant: 'matutino',
    footer: 'Resumen informativo de la mañana',
    cards: [
      { label: 'Formato', value: 'Resumen diario' },
      { label: 'Enfoque', value: 'Noticias clave' },
      { label: 'Horario', value: 'Edición matutina' },
    ],
  });
}
