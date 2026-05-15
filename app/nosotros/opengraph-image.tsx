import { makeSectionOgImage, OG_SIZE } from '@/lib/og-image';
export const runtime = 'nodejs';
export const alt = 'Quiénes Somos | Acontecer.co.cr';
export const size = OG_SIZE;
export const contentType = 'image/png';
export default function Image() {
  return makeSectionOgImage({ emoji: '🇨🇷', titulo: 'Quiénes Somos', subtitulo: 'El medio digital de Costa Rica', accentColor: '#0055b3' });
}
