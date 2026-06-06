import { makeSectionOgImage, OG_SIZE } from '@/lib/og-image';
import { getCanton } from '@/lib/clima';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Clima por cantón en Costa Rica — Pronóstico del tiempo | Acontecer.co.cr';

export default function Image({ params }: { params: { provincia: string; canton: string } }) {
  const cant = getCanton(params.provincia, params.canton);
  return makeSectionOgImage({
    emoji: '⛅',
    titulo: cant?.nombre ?? 'Costa Rica',
    subtitulo: 'Clima y pronóstico del tiempo',
    accentColor: '#0a73ce',
  });
}
