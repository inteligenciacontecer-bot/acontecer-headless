/**
 * Función compartida para generar imágenes OG de páginas estáticas.
 * Uso: importar en cada opengraph-image.tsx de sección.
 */
import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const OG_SIZE = { width: 1200, height: 630 };

export function getIconBase64(): string {
  try {
    const buf = readFileSync(join(process.cwd(), 'public/icon.png'));
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch {
    return '';
  }
}

export function makeSectionOgImage(opts: {
  emoji: string;
  titulo: string;
  subtitulo?: string;
  accentColor?: string;
}): ImageResponse {
  const { emoji, titulo, subtitulo, accentColor = '#0072ff' } = opts;
  const icon = getIconBase64();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(145deg, #03031a 0%, #00007a 55%, #0a73ce 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Banda superior de color */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 8,
          background: accentColor, display: 'flex',
        }} />

        {/* Glow de fondo */}
        <div style={{
          position: 'absolute',
          width: 550, height: 550, borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}28 0%, transparent 65%)`,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
        }} />

        {/* Contenido */}
        <div style={{
          flex: 1, display: 'flex',
          flexDirection: 'row', alignItems: 'center',
          justifyContent: 'center', gap: 56, padding: '0 80px',
        }}>
          {/* Logo + nombre sitio */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            {icon && (
              <img src={icon} width={110} height={110}
                style={{ borderRadius: 20, boxShadow: '0 0 40px rgba(0,198,255,0.35)' }}
              />
            )}
            <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.55)', fontWeight: 600, display: 'flex' }}>
              acontecer.co.cr
            </div>
          </div>

          {/* Divider */}
          <div style={{
            width: 2, height: 200,
            background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.2), transparent)',
            display: 'flex',
          }} />

          {/* Sección */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 70, display: 'flex' }}>{emoji}</div>
            <div style={{
              fontSize: 62, fontWeight: 800, color: 'white',
              lineHeight: 1.05, letterSpacing: '-1px', display: 'flex',
            }}>
              {titulo}
            </div>
            {subtitulo && (
              <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.5)', display: 'flex' }}>
                {subtitulo}
              </div>
            )}
          </div>
        </div>

        {/* Línea inferior degradado */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 6,
          background: 'linear-gradient(90deg, #00c6ff, #0072ff, #00c6ff)',
          display: 'flex',
        }} />
      </div>
    ),
    { ...OG_SIZE }
  );
}
