import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';

export const runtime = 'nodejs';
export const alt = 'Perfil legislativo en Monitor Legislativo | Acontecer.co.cr';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Diputado = {
  nombre_completo?: string;
  fraccion?: string;
  partido?: string;
  provincia?: string;
};

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

function partidoLabel(fraccion = '', partido = ''): string {
  const src = fraccion || partido || '';
  const up = src.toUpperCase();

  if (up.includes('SOBERANO')) return 'Pueblo Soberano';
  if (up.includes('LIBERACI')) return 'Liberación Nacional';
  if (up.includes('FRENTE AMP')) return 'Frente Amplio';
  if (up.includes('CRISTIANA')) return 'Unidad Social Cristiana';
  if (up.includes('AGENDA')) return 'Agenda Ciudadana';
  if (up.includes('NUEVA REP')) return 'Nueva República';
  if (up.includes('RESTAURAC')) return 'Restauración Nacional';
  if (up.includes('LIBERAL')) return 'Liberal Progresista';

  return src || 'Asamblea Legislativa';
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

async function getPerfil(slug: string): Promise<Diputado | null> {
  try {
    const res = await fetch(`${API}/diputados/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.diputado || null;
  } catch {
    return null;
  }
}

async function getRecorteDataUrl(slug: string): Promise<string | null> {
  try {
    const data = await readFile(join(process.cwd(), 'public', 'asamblea', 'recortes', `${slug}.png`), 'base64');
    return `data:image/png;base64,${data}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [diputado, recorteSrc] = await Promise.all([getPerfil(slug), getRecorteDataUrl(slug)]);

  const nombre = diputado?.nombre_completo || 'Monitor Legislativo';
  const partido = partidoLabel(diputado?.fraccion, diputado?.partido);
  const provincia = diputado?.provincia ? `Representación por ${diputado.provincia}` : 'Asamblea Legislativa 2026-2030';
  const nombreLines = wrapText(nombre, 24).slice(0, 3);
  const nombreMax = Math.max(...nombreLines.map((line) => line.length), 0);
  const nombreSize = nombreLines.length >= 3 || nombreMax > 26 ? 58 : 68;

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
            background: 'linear-gradient(115deg, #0000A2 0%, #0000A2 56%, #07145f 56%, #07145f 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 520,
            height: 630,
            display: 'flex',
            background: 'radial-gradient(circle at 52% 40%, rgba(255,255,255,0.2), rgba(255,255,255,0) 58%)',
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
            opacity: 0.94,
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
                border: '2px solid rgba(255,255,255,0.86)',
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              A
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 25, fontWeight: 800, letterSpacing: 0 }}>Acontecer.co.cr</div>
              <div style={{ display: 'flex', fontSize: 15, opacity: 0.78 }}>Monitor Legislativo</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', fontSize: 24, fontWeight: 700, color: '#ffffff', opacity: 0.86 }}>
              Perfil legislativo
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {nombreLines.map((line) => (
                <div key={line} style={{ display: 'flex', fontSize: nombreSize, lineHeight: 1.03, fontWeight: 900 }}>
                  {line}
                </div>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                borderLeft: '8px solid #d71920',
                paddingLeft: 18,
              }}
            >
              <div style={{ display: 'flex', fontSize: 31, lineHeight: 1.1, fontWeight: 800 }}>{provincia}</div>
              <div style={{ display: 'flex', fontSize: 22, lineHeight: 1.15, fontWeight: 700, opacity: 0.8 }}>{partido}</div>
            </div>
          </div>

          <div style={{ display: 'flex', fontSize: 18, opacity: 0.76, maxWidth: 620 }}>
            Asamblea Legislativa de Costa Rica 2026-2030
          </div>
        </div>

        {recorteSrc ? (
          <img
            src={recorteSrc}
            alt=""
            style={{
              position: 'absolute',
              zIndex: 3,
              right: 18,
              bottom: 18,
              width: 500,
              height: 600,
              objectFit: 'contain',
              objectPosition: 'bottom right',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              zIndex: 3,
              right: 72,
              bottom: 116,
              width: 330,
              height: 330,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.14)',
              border: '2px solid rgba(255,255,255,0.3)',
              fontSize: 96,
              fontWeight: 900,
            }}
          >
            {initials(nombre)}
          </div>
        )}
      </div>
    ),
    size,
  );
}
