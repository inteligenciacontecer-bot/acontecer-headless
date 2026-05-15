import { makeSectionOgImage, OG_SIZE } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Monitor Legislativo — Asamblea de Costa Rica | Acontecer.co.cr';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return makeSectionOgImage({
    emoji: '🏛️',
    titulo: 'Monitor Legislativo',
    subtitulo: 'Asamblea de Costa Rica',
    accentColor: '#0055b3',
  });
}
