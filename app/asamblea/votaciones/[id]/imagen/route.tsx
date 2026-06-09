import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';
const SITE_URL = 'https://acontecer.co.cr';
const BLUE = '#0000A2';
const DARK_BLUE = '#07145f';
const CYAN = '#49b7ff';
const RED = '#d71920';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type DiputadoVoto = {
  id: number;
  nombre_completo?: string;
  nombre_corto?: string;
  partido?: string;
  fraccion?: string;
  foto_url?: string;
  slug?: string;
  voto?: string;
  imageSrc?: string;
};

type VotacionMapa = {
  votacion?: {
    id?: number;
    titulo?: string;
    expediente?: string;
    resultado?: string;
    votos_si?: number;
    votos_no?: number;
    votos_abstencion?: number;
    created_at?: string;
    fecha?: string;
  };
  mapa?: DiputadoVoto[];
  totales?: {
    si?: number;
    no?: number;
    abstencion?: number;
    ausente?: number;
  };
};

function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

async function assetDataUrl(path: string, mime: string): Promise<string> {
  try {
    const data = await readFile(join(process.cwd(), 'public', path), 'base64');
    return `data:${mime};base64,${data}`;
  } catch {
    return '';
  }
}

async function fontData(path: string): Promise<ArrayBuffer> {
  const data = await readFile(join(process.cwd(), 'public', path));
  return bufferToArrayBuffer(data);
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
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

function normalizeVote(vote = '') {
  const v = vote.toUpperCase();
  if (v === 'SI' || v === 'SÍ') return 'SI';
  if (v === 'NO') return 'NO';
  if (v.includes('ABST')) return 'ABSTENCION';
  return 'AUSENTE';
}

function voteMeta(vote = '') {
  const v = normalizeVote(vote);
  if (v === 'SI') return { label: 'A favor', short: 'SI', color: '#17c964', glow: 'rgba(23,201,100,0.38)', order: 1 };
  if (v === 'NO') return { label: 'En contra', short: 'NO', color: '#ff3b4e', glow: 'rgba(255,59,78,0.38)', order: 2 };
  if (v === 'ABSTENCION') return { label: 'Abstención', short: 'ABS', color: '#f59e0b', glow: 'rgba(245,158,11,0.34)', order: 3 };
  return { label: 'Ausente', short: 'AUS', color: '#94a3b8', glow: 'rgba(148,163,184,0.25)', order: 4 };
}

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'A';
}

function shortName(d: DiputadoVoto) {
  const raw = d.nombre_corto || d.nombre_completo || '';
  const parts = raw.split(/\s+/).filter(Boolean);
  if (parts.length <= 2) return raw;
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

function resultLabel(result = '') {
  const up = result.toUpperCase();
  if (up === 'APROBADO') return 'APROBADO';
  if (up === 'RECHAZADO') return 'RECHAZADO';
  return 'VOTACIÓN';
}

async function diputadoImageSrc(slug?: string): Promise<string> {
  if (!slug) return '';
  try {
    const data = await readFile(join(process.cwd(), 'public', 'asamblea', 'recortes', `${slug}.png`), 'base64');
    return `data:image/png;base64,${data}`;
  } catch {
    return '';
  }
}

async function getMapa(id: string): Promise<VotacionMapa | null> {
  try {
    const response = await fetch(`${API}/votaciones/${id}/mapa`, { cache: 'no-store' });
    if (!response.ok) return null;
    return (await response.json()) as VotacionMapa;
  } catch {
    return null;
  }
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: 168,
        height: 70,
        borderRadius: 18,
        background: 'rgba(255,255,255,0.13)',
        border: '1px solid rgba(255,255,255,0.22)',
        padding: '0 18px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.68)', fontSize: 15, fontWeight: 800, textTransform: 'uppercase' }}>
        <div style={{ display: 'flex', width: 10, height: 10, borderRadius: 99, background: color }} />
        {label}
      </div>
      <div style={{ display: 'flex', marginTop: 3, color: '#ffffff', fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function DeputyBubble({ diputado }: { diputado: DiputadoVoto }) {
  const meta = voteMeta(diputado.voto);
  const name = shortName(diputado);
  const lines = wrapText(name, 10).slice(0, 2);
  const photo = diputado.imageSrc || '';

  return (
    <div
      style={{
        width: 76,
        height: 74,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        color: '#ffffff',
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 999,
          background: meta.color,
          boxShadow: `0 0 0 3px rgba(255,255,255,0.74), 0 0 18px ${meta.glow}`,
          padding: 4,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 999,
            overflow: 'hidden',
            background: '#dbe4f0',
            color: BLUE,
            fontSize: 16,
            fontWeight: 800,
          }}
        >
          {photo ? (
            <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            initials(name)
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: '100%' }}>
        {lines.map((line) => (
          <div key={line} style={{ display: 'flex', fontSize: 7.5, lineHeight: 1.02, fontWeight: 800, textAlign: 'center', textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [data, logo, icon, metropolis600, metropolis800] = await Promise.all([
    getMapa(id),
    assetDataUrl('logo.png', 'image/png'),
    assetDataUrl('icon.png', 'image/png'),
    fontData('fonts/metropolis/metropolis-latin-600-normal.woff'),
    fontData('fonts/metropolis/metropolis-latin-800-normal.woff'),
  ]);

  const diputados = [...(data?.mapa || [])]
    .sort((a, b) => {
      const ao = voteMeta(a.voto).order;
      const bo = voteMeta(b.voto).order;
      if (ao !== bo) return ao - bo;
      return (a.fraccion || a.partido || '').localeCompare(b.fraccion || b.partido || '') || (a.nombre_completo || '').localeCompare(b.nombre_completo || '');
    })
    .slice(0, 57);
  const diputadosConImagen = await Promise.all(
    diputados.map(async (diputado) => ({
      ...diputado,
      imageSrc: await diputadoImageSrc(diputado.slug),
    })),
  );
  const votacion = data?.votacion;
  const title = votacion?.titulo || 'Votación del Plenario Legislativo';
  const titleLines = wrapText(title, 42).slice(0, 3);
  const expediente = votacion?.expediente ? `Expediente ${votacion.expediente}` : 'Monitor Legislativo';
  const si = Number(data?.totales?.si ?? votacion?.votos_si ?? 0);
  const no = Number(data?.totales?.no ?? votacion?.votos_no ?? 0);
  const abstencion = Number(data?.totales?.abstencion ?? votacion?.votos_abstencion ?? 0);
  const ausente = Number(data?.totales?.ausente ?? Math.max(0, 57 - si - no - abstencion));
  const estado = resultLabel(votacion?.resultado);
  const estadoColor = estado === 'APROBADO' ? '#17c964' : estado === 'RECHAZADO' ? '#ff3b4e' : CYAN;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: BLUE,
          color: '#ffffff',
          fontFamily: 'Metropolis',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, display: 'flex', background: `linear-gradient(137deg, ${BLUE} 0%, ${BLUE} 48%, ${DARK_BLUE} 48%, #020934 100%)` }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', background: 'radial-gradient(circle at 80% 16%, rgba(73,183,255,0.42) 0%, rgba(255,255,255,0) 34%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', background: 'radial-gradient(circle at 17% 72%, rgba(215,25,32,0.28) 0%, rgba(255,255,255,0) 32%)' }} />
        <div style={{ position: 'absolute', left: -110, top: 120, width: 330, height: 330, display: 'flex', borderRadius: '50%', border: '44px solid rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', right: -95, top: -80, width: 280, height: 280, display: 'flex', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

        <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 116, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 50px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {icon ? <img src={icon} alt="" style={{ width: 54, height: 54, objectFit: 'contain' }} /> : <div style={{ display: 'flex', fontSize: 42, fontWeight: 800 }}>A</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ display: 'flex', color: CYAN, fontSize: 15, fontWeight: 800, letterSpacing: 3.8, textTransform: 'uppercase' }}>Monitor Legislativo</div>
              <div style={{ display: 'flex', color: 'rgba(255,255,255,0.66)', fontSize: 14, fontWeight: 600 }}>{expediente}</div>
            </div>
          </div>
          {logo ? <img src={logo} alt="" style={{ width: 285, height: 46, objectFit: 'contain' }} /> : <div style={{ display: 'flex', fontSize: 31, fontWeight: 800 }}>acontecer.co.cr</div>}
        </div>

        <div style={{ position: 'absolute', top: 126, left: 50, right: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 660 }}>
            {titleLines.map((line) => (
              <div key={line} style={{ display: 'flex', fontSize: titleLines.length > 2 ? 35 : 42, lineHeight: 0.98, fontWeight: 800, letterSpacing: 0 }}>
                {line}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 190, height: 72, borderRadius: 20, background: estadoColor, color: '#ffffff', fontSize: 25, fontWeight: 800, letterSpacing: 1.2, boxShadow: `0 0 30px ${estadoColor}55` }}>
            {estado}
          </div>
        </div>

        <div style={{ position: 'absolute', top: 275, left: 50, right: 50, display: 'flex', justifyContent: 'space-between', gap: 14 }}>
          <StatPill label="A favor" value={si} color="#17c964" />
          <StatPill label="En contra" value={no} color="#ff3b4e" />
          <StatPill label="Ausente" value={ausente} color="#94a3b8" />
          {abstencion > 0 ? <StatPill label="Abst." value={abstencion} color="#f59e0b" /> : <StatPill label="Total" value={si + no + ausente} color={CYAN} />}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 45,
            right: 45,
            top: 374,
            height: 548,
            display: 'flex',
            alignContent: 'flex-start',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px 4px',
            borderRadius: 26,
            background: 'rgba(2,9,52,0.34)',
            border: '1px solid rgba(255,255,255,0.14)',
            padding: '18px 14px',
          }}
        >
          {diputados.length > 0 ? (
            diputadosConImagen.map((diputado) => <DeputyBubble key={`${diputado.id}-${diputado.voto}`} diputado={diputado} />)
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'rgba(255,255,255,0.72)', fontSize: 28, fontWeight: 800 }}>
              Sin votos individuales cargados para esta votación
            </div>
          )}
        </div>

        <div style={{ position: 'absolute', left: 50, right: 50, bottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgba(255,255,255,0.78)', fontSize: 15, fontWeight: 700 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ display: 'flex', width: 13, height: 13, borderRadius: 99, background: '#17c964' }} /> A favor</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ display: 'flex', width: 13, height: 13, borderRadius: 99, background: '#ff3b4e' }} /> En contra</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ display: 'flex', width: 13, height: 13, borderRadius: 99, background: '#94a3b8' }} /> Ausente</div>
          </div>
          <div style={{ display: 'flex' }}>acontecer.co.cr/asamblea</div>
        </div>

        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 18, display: 'flex', background: RED }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 18, height: 9, display: 'flex', background: '#ffffff', opacity: 0.95 }} />
      </div>
    ),
    {
      width: 1000,
      height: 1000,
      fonts: [
        {
          name: 'Metropolis',
          data: metropolis600,
          weight: 600,
          style: 'normal',
        },
        {
          name: 'Metropolis',
          data: metropolis800,
          weight: 800,
          style: 'normal',
        },
      ],
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
      },
    },
  );
}
