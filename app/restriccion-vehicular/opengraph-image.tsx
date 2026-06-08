import { BRAND_OG_SIZE, makeBrandOgImage } from '@/lib/brand-og-image';

export const runtime = 'nodejs';
export const alt = 'Restricción vehicular en San José | Acontecer.co.cr';
export const size = BRAND_OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return makeBrandOgImage({
    kicker: 'Tránsito en San José',
    title: 'Restricción Vehicular',
    subtitle: 'Placas, horario y zona de aplicación en el centro de San José.',
    accentColor: '#ff6b5f',
    variant: 'restriccion',
    cards: [
      { label: 'Horario', value: '6 a. m. - 7 p. m.' },
      { label: 'Zona', value: 'centro de San José' },
      { label: 'Consulta', value: 'placas de hoy' },
    ],
    footer: 'Calendario semanal por último dígito de placa',
  });
}
