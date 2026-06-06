import { makeSectionOgImage, OG_SIZE } from '@/lib/og-image';
import { getProvincia } from '@/lib/clima';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Clima en Costa Rica — Pronóstico del tiempo | Acontecer.co.cr';

export default function Image({ params }: { params: { provincia: string } }) {
  const prov = getProvincia(params.provincia);
  return makeSectionOgImage({
    emoji: '⛅',
    titulo: prov?.provincia ?? 'Costa Rica',
    subtitulo: 'Clima y pronóstico por hora',
    accentColor: '#0a73ce',
  });
}
