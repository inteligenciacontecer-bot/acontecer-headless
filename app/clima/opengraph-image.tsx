import { makeSectionOgImage, OG_SIZE } from '@/lib/og-image';
export const runtime = 'nodejs';
export const alt = 'Clima en Costa Rica Hoy — Pronóstico por hora y 7 días | Acontecer.co.cr';
export const size = OG_SIZE;
export const contentType = 'image/png';
export default function Image() {
  return makeSectionOgImage({ emoji: '⛅', titulo: 'Clima en Costa Rica', subtitulo: 'Pronóstico por hora y de 7 días', accentColor: '#0a73ce' });
}
