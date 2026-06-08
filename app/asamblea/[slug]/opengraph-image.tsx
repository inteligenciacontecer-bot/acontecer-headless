import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';
const ACONTECER_BLUE = '#0000A2';
const DARK_BLUE = '#07145f';
const CR_RED = '#d71920';

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

function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

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

async function getAssetDataUrl(path: string, mime: string): Promise<string> {
  try {
    const data = await readFile(join(process.cwd(), 'public', path), 'base64');
    return `data:${mime};base64,${data}`;
  } catch {
    return '';
  }
}

async function getFontData(path: string): Promise<ArrayBuffer> {
  const data = await readFile(join(process.cwd(), 'public', path));
  return bufferToArrayBuffer(data);
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
  const [diputado, recorteSrc, logoSrc, metropolis600, metropolis800] = await Promise.all([
    getPerfil(slug),
    getRecorteDataUrl(slug),
    getAssetDataUrl('logo.png', 'image/png'),
    getFontData('fonts/metropolis/metropolis-latin-600-normal.woff'),
    getFontData('fonts/metropolis/metropolis-latin-800-normal.woff'),
  ]);

  const nombre = diputado?.nombre_completo || 'Monitor Legislativo';
  const partido = partidoLabel(diputado?.fraccion, diputado?.partido);
  const provincia = diputado?.provincia ? `Representación por ${diputado.provincia}` : 'Asamblea Legislativa';
  const nombreLines = wrapText(nombre, 17).slice(0, 4);
  const nombreMax = Math.max(...nombreLines.map((line) => line.length), 0);
  const nombreSize = nombreLines.length >= 4 || nombreMax > 17 ? 55 : nombreLines.length >= 3 ? 62 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: ACONTECER_BLUE,
          color: '#ffffff',
          fontFamily: 'Metropolis',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: `linear-gradient(122deg, ${ACONTECER_BLUE} 0%, ${ACONTECER_BLUE} 56%, ${DARK_BLUE} 56%, ${DARK_BLUE} 100%)`,
          }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', background: 'radial-gradient(circle at 79% 22%, rgba(73,183,255,0.36) 0%, rgba(255,255,255,0) 38%)' }} />
        <div
          style={{
            position: 'absolute',
            left: -120,
            top: 80,
            width: 320,
            height: 320,
            display: 'flex',
            borderRadius: '50%',
            border: '44px solid rgba(255,255,255,0.06)',
          }}
        />

        {recorteSrc ? (
          <img
            src={recorteSrc}
            alt=""
            style={{
              position: 'absolute',
              right: 10,
              bottom: 18,
              width: 515,
              height: 600,
              objectFit: 'contain',
              objectPosition: 'bottom right',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              right: 78,
              bottom: 124,
              width: 320,
              height: 320,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.14)',
              border: '2px solid rgba(255,255,255,0.3)',
              fontSize: 92,
              fontWeight: 800,
            }}
          >
            {initials(nombre)}
          </div>
        )}

        <div style={{ position: 'absolute', top: 46, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          {logoSrc ? (
            <img src={logoSrc} alt="" style={{ width: 315, height: 51, objectFit: 'contain' }} />
          ) : (
            <div style={{ display: 'flex', fontSize: 34, fontWeight: 800 }}>acontecer.co.cr</div>
          )}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: 18,
            display: 'flex',
            background: CR_RED,
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
            width: 690,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '96px 0 74px 72px',
          }}
        >
          <div style={{ display: 'flex', color: '#49b7ff', fontSize: 18, fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20 }}>
            Monitor Legislativo
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 24 }}>
            {nombreLines.map((line) => (
              <div key={line} style={{ display: 'flex', fontSize: nombreSize, lineHeight: 0.96, fontWeight: 800, letterSpacing: 0 }}>
                {line}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', width: 10, height: 42, borderRadius: 999, background: '#49b7ff' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ display: 'flex', fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Curul</div>
                <div style={{ display: 'flex', fontSize: 27, fontWeight: 800, lineHeight: 1.05 }}>{provincia}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', width: 10, height: 42, borderRadius: 999, background: CR_RED }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ display: 'flex', fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Fracción</div>
                <div style={{ display: 'flex', fontSize: 27, fontWeight: 800, lineHeight: 1.05 }}>{partido}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', left: 72, bottom: 44, display: 'flex', fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.72)' }}>
          Asamblea Legislativa de Costa Rica 2026-2030
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Metropolis', data: metropolis600, weight: 600, style: 'normal' },
        { name: 'Metropolis', data: metropolis800, weight: 800, style: 'normal' },
      ],
    },
  );
}
