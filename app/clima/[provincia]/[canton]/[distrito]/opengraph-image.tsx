import { makeSectionOgImage, OG_SIZE } from '@/lib/og-image';
import { getDistrito } from '@/lib/clima';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Clima en Costa Rica — Pronóstico del tiempo | Acontecer.co.cr';

export default function Image({ params }: { params: { provincia: string; canton: string; distrito: string } }) {
  const d = getDistrito(params.provincia, params.canton, params.distrito);
  return makeSectionOgImage({
    emoji: '⛅',
    titulo: d?.nombre ?? 'Costa Rica',
    subtitulo: 'Clima y pronóstico del tiempo',
    accentColor: '#0a73ce',
  });
}
