import { makeSectionOgImage, OG_SIZE } from '@/lib/og-image';
export const runtime = 'nodejs';
export const alt = 'Precio de la Gasolina y el Diésel Hoy en Costa Rica | Acontecer.co.cr';
export const size = OG_SIZE;
export const contentType = 'image/png';
export default function Image() {
  return makeSectionOgImage({ emoji: '⛽', titulo: 'Precio de Combustibles', subtitulo: 'Gasolina y diésel hoy en Costa Rica', accentColor: '#b45309' });
}
