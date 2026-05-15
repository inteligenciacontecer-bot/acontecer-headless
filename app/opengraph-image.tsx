import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';
export const alt = 'Acontecer.co.cr — El medio digital independiente de Costa Rica';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function getIcon(): string {
  try {
    const buf = readFileSync(join(process.cwd(), 'public/icon.png'));
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch {
    return '';
  }
}

export default function Image() {
  const icon = getIcon();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #03031a 0%, #00007a 55%, #0a73ce 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow de fondo */}
        <div style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,198,255,0.18) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
        }} />

        {/* Logo icon */}
        {icon && (
          <img
            src={icon}
            width={160}
            height={160}
            style={{ borderRadius: 28, marginBottom: 28, boxShadow: '0 0 60px rgba(0,198,255,0.4)' }}
          />
        )}

        {/* Nombre del sitio */}
        <div style={{
          fontSize: 68,
          fontWeight: 800,
          color: 'white',
          letterSpacing: '-1px',
          lineHeight: 1,
          marginBottom: 16,
          display: 'flex',
        }}>
          acontecer.co.cr
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 28,
          color: 'rgba(255,255,255,0.6)',
          fontWeight: 400,
          display: 'flex',
        }}>
          El medio digital independiente de Costa Rica
        </div>

        {/* Línea decorativa inferior */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: 'linear-gradient(90deg, #00c6ff, #0072ff, #00c6ff)',
          display: 'flex',
        }} />
      </div>
    ),
    { ...size }
  );
}
