import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CATEGORIAS: Record<string, { nombre: string; emoji: string; color: string }> = {
  nacionales:      { nombre: 'Nacionales',       emoji: '🇨🇷', color: '#0055b3' },
  deportes:        { nombre: 'Deportes',          emoji: '⚽',  color: '#007c34' },
  economia:        { nombre: 'Economía',          emoji: '📊',  color: '#b45309' },
  entretenimiento: { nombre: 'Entretenimiento',   emoji: '🎭',  color: '#7c3aed' },
  internacionales: { nombre: 'Internacionales',   emoji: '🌍',  color: '#0e7490' },
  opinion:         { nombre: 'Opinión',           emoji: '💬',  color: '#be185d' },
  tecnologia:      { nombre: 'Tecnología',        emoji: '💻',  color: '#0369a1' },
  tendencias:      { nombre: 'Tendencias',        emoji: '🔥',  color: '#b91c1c' },
  turismo:         { nombre: 'Turismo',           emoji: '✈️',  color: '#0f766e' },
};

function getIcon(): string {
  try {
    const buf = readFileSync(join(process.cwd(), 'public/icon.png'));
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch {
    return '';
  }
}

export default function Image({ params }: { params: { slug: string } }) {
  const cat = CATEGORIAS[params.slug] ?? { nombre: params.slug, emoji: '📰', color: '#0000A2' };
  const icon = getIcon();

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
        {/* Banda de color de categoría */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          background: cat.color,
          display: 'flex',
        }} />

        {/* Glow */}
        <div style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${cat.color}30 0%, transparent 65%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
        }} />

        {/* Contenido centrado */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 56,
          padding: '0 80px',
        }}>
          {/* Left: logo pequeño + site name */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}>
            {icon && (
              <img
                src={icon}
                width={110}
                height={110}
                style={{ borderRadius: 20, boxShadow: '0 0 40px rgba(0,198,255,0.35)' }}
              />
            )}
            <div style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.55)',
              fontWeight: 600,
              display: 'flex',
            }}>
              acontecer.co.cr
            </div>
          </div>

          {/* Divider */}
          <div style={{
            width: 2,
            height: 220,
            background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.2), transparent)',
            display: 'flex',
          }} />

          {/* Right: categoría */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            <div style={{ fontSize: 72, display: 'flex' }}>{cat.emoji}</div>
            <div style={{
              fontSize: 64,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.05,
              letterSpacing: '-1px',
              display: 'flex',
            }}>
              {cat.nombre}
            </div>
            <div style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.5)',
              display: 'flex',
            }}>
              Noticias de Costa Rica
            </div>
          </div>
        </div>

        {/* Línea inferior */}
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
