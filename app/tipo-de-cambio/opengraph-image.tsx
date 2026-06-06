import { makeSectionOgImage, OG_SIZE } from '@/lib/og-image';
export const runtime = 'nodejs';
export const alt = 'Tipo de Cambio del Dólar Hoy en Costa Rica | Acontecer.co.cr';
export const size = OG_SIZE;
export const contentType = 'image/png';
export default function Image() {
  return makeSectionOgImage({ emoji: '💵', titulo: 'Tipo de Cambio', subtitulo: 'Dólar hoy: compra y venta', accentColor: '#15803d' });
}
