import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getFuncionario } from '@/lib/gobierno';

export const runtime = 'nodejs';
export const alt = 'Perfil del Gobierno de Costa Rica en Acontecer.co.cr';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

async function getImageDataUrl(foto?: string): Promise<string | null> {
  if (!foto?.startsWith('/gobierno/fotos/')) return null;

  const recorte = foto.replace('/gobierno/fotos/', '/gobierno/recortes/').replace(/\.jpe?g$/i, '.png');
  const relativePath = recorte.replace(/^\//, '');

  try {
    const data = await readFile(join(process.cwd(), 'public', relativePath), 'base64');
    return `data:image/png;base64,${data}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const funcionario = getFuncionario(slug);
  const nombre = funcionario?.nombre || 'Gobierno de Costa Rica';
  const cargo = funcionario?.cargo || 'Poder Ejecutivo';
  const institucion = funcionario?.institucion || 'Acontecer.co.cr';
  const recorteSrc = await getImageDataUrl(funcionario?.foto);
  const nombreLines = wrapText(nombre, 23).slice(0, 3);
  const cargoLines = wrapText(cargo, 28).slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: '#0000A2',
          color: '#ffffff',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: 'linear-gradient(115deg, #0000A2 0%, #0000A2 55%, #07145f 55%, #07145f 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: 18,
            display: 'flex',
            background: '#d71920',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 18,
            width: '100%',
            height: 10,
            display: 'flex',
            background: '#ffffff',
            opacity: 0.92,
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: 720,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '56px 42px 56px 64px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255,255,255,0.85)',
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              A
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: 0 }}>Acontecer.co.cr</div>
              <div style={{ fontSize: 15, opacity: 0.78 }}>Gobierno de Costa Rica 2026-2030</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', fontSize: 24, fontWeight: 700, color: '#ffffff', opacity: 0.86 }}>
              Perfil y currículo
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {nombreLines.map((line) => (
                <div key={line} style={{ display: 'flex', fontSize: 68, lineHeight: 1.02, fontWeight: 900 }}>
                  {line}
                </div>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                borderLeft: '8px solid #d71920',
                paddingLeft: 18,
              }}
            >
              {cargoLines.map((line) => (
                <div key={line} style={{ display: 'flex', fontSize: 31, lineHeight: 1.12, fontWeight: 800 }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', fontSize: 18, opacity: 0.76, maxWidth: 620 }}>
            {institucion}
          </div>
        </div>

        {recorteSrc && (
          <img
            src={recorteSrc}
            alt=""
            style={{
              position: 'absolute',
              zIndex: 3,
              right: 22,
              bottom: 18,
              width: 470,
              height: 620,
              objectFit: 'contain',
              objectPosition: 'bottom right',
            }}
          />
        )}
      </div>
    ),
    size,
  );
}
