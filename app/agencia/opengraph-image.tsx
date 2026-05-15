import { makeSectionOgImage, OG_SIZE } from '@/lib/og-image';
export const runtime = 'nodejs';
export const alt = 'Agencia de Contenidos | Acontecer.co.cr';
export const size = OG_SIZE;
export const contentType = 'image/png';
export default function Image() {
  return makeSectionOgImage({ emoji: '✍️', titulo: 'Agencia', subtitulo: 'Contenidos digitales', accentColor: '#7c3aed' });
}
