import { makeSectionOgImage, OG_SIZE } from '@/lib/og-image';
export const runtime = 'nodejs';
export const alt = 'Publicidad y Pauta | Acontecer.co.cr';
export const size = OG_SIZE;
export const contentType = 'image/png';
export default function Image() {
  return makeSectionOgImage({ emoji: '📢', titulo: 'Publicidad', subtitulo: 'Llegue a miles de lectores', accentColor: '#b45309' });
}
