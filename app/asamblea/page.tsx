import type { Metadata } from 'next';
import Link from 'next/link';
import HemicicloClient from '@/components/HemicicloClient';
import UltimaHoraAsamblea from '@/components/UltimaHoraAsamblea';
import { fotoDiputadoUrl } from '@/lib/diputado-foto';

export const metadata: Metadata = {
  title: 'Monitor Legislativo — Asamblea de Costa Rica',
  description: 'Seguimiento en tiempo real de proyectos de ley, votaciones y diputados de la Asamblea Legislativa de Costa Rica.',
  alternates: { canonical: 'https://acontecer.co.cr/asamblea' },
  openGraph: { url: 'https://acontecer.co.cr/asamblea' },
};

const API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';

const FRACCION_COLOR: Record<string, string> = {
  'Partido Pueblo Soberano':          '#0EA5E9',
  'Partido Liberación Nacional':      '#00AA44',
  'Partido Frente Amplio':            '#EAB308',
  'Partido Unidad Social Cristiana':  '#2563EB',
  'Partido Agenda Ciudadana':         '#DC2626',
  'Coalición Agenda Ciudadana':       '#DC2626',
  'Partido Acción Ciudadana':         '#10B981',
  'Partido Nueva República':          '#1D4ED8',
  'Partido Nacional Democrático':     '#0EA5E9',
  'Partido Liberal Progresista':      '#7C3AED',
  'Fuerza Democrática':               '#EF4444',
  'Partido Restauración Nacional':    '#1D4ED8',
};
function partidoColor(fraccion = ''): string {
  if (!fraccion) return '#94A3B8';
  if (FRACCION_COLOR[fraccion]) return FRACCION_COLOR[fraccion];
  const up = fraccion.toUpperCase();
  if (up.includes('SOBERANO'))   return '#0EA5E9';
  if (up.includes('LIBERACI'))   return '#00AA44';
  if (up.includes('FRENTE AMP')) return '#EAB308';
  if (up.includes('CRISTIANA'))  return '#2563EB';
  if (up.includes('AGENDA'))     return '#DC2626';
  if (up.includes('NUEVA REP'))  return '#1D4ED8';
  if (up.includes('DEMOCR'))     return '#EF4444';
  if (up.includes('PLN'))        return '#00AA44';
  if (up.includes('PUSC'))       return '#2563EB';
  return '#94A3B8';
}

async function getResumen() {
  try { const r = await fetch(`${API}/resumen`, { next: { revalidate: 60 } }); return r.ok ? r.json() : null; }
  catch { return null; }
}
async function getDiputados() {
  try { const r = await fetch(`${API}/diputados`, { next: { revalidate: 3600 } }); return r.ok ? r.json() : []; }
  catch { return []; }
}
async function getVotaciones() {
  try { const r = await fetch(`${API}/votaciones?per_page=10`, { next: { revalidate: 30 } }); return r.ok ? r.json() : []; }
  catch { return []; }
}
async function getMapa(id: number) {
  try { const r = await fetch(`${API}/votaciones/${id}/mapa`, { next: { revalidate: 60 } }); return r.ok ? r.json() : null; }
  catch { return null; }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatFecha(s: string) {
  if (!s) return '';
  const d = new Date(s);
  return d.toLocaleDateString('es-CR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}
function formatHora(s: string) {
  if (!s) return '';
  const d = new Date(s);
  return d.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
}
function tiempoRelativo(s: string) {
  if (!s) return '';
  const diff = Date.now() - new Date(s).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 2)  return 'Hace un momento';
  if (m < 60) return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
}

// ── Calcula distribución de votos por bancada ─────────────────────────────────

interface BancadaStat {
  fraccion: string;
  color: string;
  si: number;
  no: number;
  abs: number;
  aus: number;
  total: number;
}

function calcularBancadas(mapaDisputados: any[]): BancadaStat[] {
  const map: Record<string, BancadaStat> = {};
  for (const d of mapaDisputados) {
    const f = d.fraccion || d.partido || '?';
    if (!map[f]) map[f] = { fraccion: f, color: partidoColor(f), si: 0, no: 0, abs: 0, aus: 0, total: 0 };
    map[f].total++;
    const v = (d.voto || '').toUpperCase();
    if (v === 'SI')          map[f].si++;
    else if (v === 'NO')     map[f].no++;
    else if (v === 'ABSTENCION') map[f].abs++;
    else                     map[f].aus++;
  }
  return Object.values(map).sort((a, b) => b.total - a.total);
}

// ── Sub-componentes (server) ───────────────────────────────────────────────────

function Badge({ resultado }: { resultado?: string }) {
  if (!resultado) return null;
  const map: Record<string, [string, string, string]> = {
    APROBADO:  ['#dcfce7', '#166534', '✓ APROBADO'],
    RECHAZADO: ['#fee2e2', '#991b1b', '✗ RECHAZADO'],
    VOTACION:  ['#dbeafe', '#1e40af', '⬤ VOTACIÓN'],
  };
  const [bg, color, label] = map[resultado] ?? map.VOTACION;
  return (
    <span style={{ background: bg, color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://acontecer.co.cr"},{"@type":"ListItem","position":2,"name":"Asamblea Legislativa","item":"https://acontecer.co.cr/asamblea"}]})}} />
      {label}
    </span>
  );
}

function VotBar({ si, no, abst }: { si: number; no: number; abst: number }) {
  const total = si + no + abst || 57;
  return (
    <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 1 }}>
      <div style={{ flex: si / total, background: '#22c55e', minWidth: si > 0 ? 4 : 0 }} />
      <div style={{ flex: no / total, background: '#ef4444', minWidth: no > 0 ? 4 : 0 }} />
      <div style={{ flex: abst / total, background: '#fbbf24', minWidth: abst > 0 ? 3 : 0 }} />
    </div>
  );
}

function BancadaChart({ bancadas, tieneVotos }: { bancadas: BancadaStat[]; tieneVotos: boolean }) {
  if (!bancadas.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {bancadas.map(b => {
        const vTotal = b.si + b.no + b.abs + b.aus;
        const pSi  = vTotal ? (b.si  / vTotal) * 100 : 0;
        const pNo  = vTotal ? (b.no  / vTotal) * 100 : 0;
        const pAbs = vTotal ? (b.abs / vTotal) * 100 : 0;
        const pAus = vTotal ? (b.aus / vTotal) * 100 : 0;
        return (
          <div key={b.fraccion}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: b.color }}>{b.fraccion}</span>
              {tieneVotos ? (
                <span style={{ fontSize: 11, color: '#888' }}>
                  {b.si > 0 && <span style={{ color: '#22c55e', fontWeight: 700 }}>+{b.si} </span>}
                  {b.no > 0 && <span style={{ color: '#ef4444', fontWeight: 700 }}>−{b.no} </span>}
                  {b.abs > 0 && <span style={{ color: '#f59e0b', fontWeight: 700 }}>○{b.abs}</span>}
                </span>
              ) : (
                <span style={{ fontSize: 11, color: '#aaa' }}>{b.total} dip.</span>
              )}
            </div>
            {tieneVotos ? (
              <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', background: '#f0f0f0', gap: 1 }}>
                {pSi  > 0 && <div style={{ width: `${pSi}%`,  background: '#22c55e', transition: 'width 0.6s' }} />}
                {pNo  > 0 && <div style={{ width: `${pNo}%`,  background: '#ef4444', transition: 'width 0.6s' }} />}
                {pAbs > 0 && <div style={{ width: `${pAbs}%`, background: '#fbbf24', transition: 'width 0.6s' }} />}
                {pAus > 0 && <div style={{ width: `${pAus}%`, background: '#e2e8f0', transition: 'width 0.6s' }} />}
              </div>
            ) : (
              <div style={{ height: 10, borderRadius: 5, background: b.color + '55', border: `1px solid ${b.color}44` }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ si, no, abs, aus }: { si: number; no: number; abs: number; aus: number }) {
  const total = si + no + abs + aus || 1;
  const r = 28, cx = 36, cy = 36, stroke = 10;
  const circ = 2 * Math.PI * r;
  const pSi  = (si  / total) * circ;
  const pNo  = (no  / total) * circ;
  const pAbs = (abs / total) * circ;
  const pAus = (aus / total) * circ;
  let offset = 0;
  const seg = (pct: number, color: string, off: number) => (
    <circle
      key={color} cx={cx} cy={cy} r={r} fill="none"
      stroke={color} strokeWidth={stroke}
      strokeDasharray={`${pct} ${circ - pct}`}
      strokeDashoffset={-off + circ / 4}
      style={{ transition: 'stroke-dasharray 0.6s' }}
    />
  );
  const segs: React.ReactNode[] = [];
  if (pSi  > 0) { segs.push(seg(pSi,  '#22c55e', offset)); offset += pSi;  }
  if (pNo  > 0) { segs.push(seg(pNo,  '#ef4444', offset)); offset += pNo;  }
  if (pAbs > 0) { segs.push(seg(pAbs, '#fbbf24', offset)); offset += pAbs; }
  if (pAus > 0) { segs.push(seg(pAus, '#e2e8f0', offset)); }
  return (
    <svg width={72} height={72} viewBox="0 0 72 72">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      {segs}
    </svg>
  );
}

// ── Página principal ───────────────────────────────────────────────────────────

export default async function AsambleaPage() {
  const [resumen, diputados, votaciones] = await Promise.all([
    getResumen(), getDiputados(), getVotaciones(),
  ]);

  // Mapa de la última votación para colorear el hemiciclo
  const ultimaId = votaciones[0]?.id;
  const mapa = ultimaId ? await getMapa(ultimaId) : null;

  // Construir votoActual (slug → 'si'|'no'|'abs'|'ausente')
  // La API devuelve { mapa: [...], totales: {}, votacion: {} }
  const mapaDisputados: any[] = mapa?.mapa ?? [];
  const tieneVotosReales = mapaDisputados.some((d: any) => d.voto && d.voto !== 'AUSENTE');

  const votoActual: Record<string, string> | undefined = (() => {
    if (!tieneVotosReales) return undefined;
    const m: Record<string, string> = {};
    for (const d of mapaDisputados) {
      if (d.voto) m[d.slug] = d.voto.toLowerCase();
    }
    return m;
  })();

  // Estadísticas por bancada de la última votación
  const bancadas = mapaDisputados.length
    ? calcularBancadas(mapaDisputados)
    : diputados.length
      ? calcularBancadas(diputados.map((d: any) => ({ ...d, voto: null })))
      : [];
  const tieneVotosIndividuales = tieneVotosReales;

  const votacionDestacada = mapa?.votacion || votaciones[0] || null;

  // Merge diputados con votos del mapa actual
  const votoMap: Record<string, string> = {};
  for (const d of mapaDisputados) {
    if (d.slug && d.voto) votoMap[d.slug] = d.voto;
  }
  const diputadosConVoto = (diputados as any[]).map((d: any) => ({
    ...d, votoActualDip: votoMap[d.slug] ?? null,
  }));

  // Agrupar por fracción (orden: mayor a menor)
  const grupoMap: Record<string, { fraccion: string; color: string; dips: any[] }> = {};
  for (const d of diputadosConVoto) {
    const f = d.fraccion || d.partido || 'Independiente';
    if (!grupoMap[f]) grupoMap[f] = { fraccion: f, color: partidoColor(f), dips: [] };
    grupoMap[f].dips.push(d);
  }
  const gruposFraccion = Object.values(grupoMap).sort((a, b) => b.dips.length - a.dips.length);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(150deg, #00007a 0%, #0000C8 60%, #0a73ce 100%)', padding: '28px 16px 22px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{width:32,height:32,flexShrink:0}}>
                  <path d="M3 22V10M12 22V10M21 22V10M1 10h22M12 2L1 10h22L12 2z"/>
                </svg>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>
                  Acontecer.co.cr
                </div>
                <h1 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 'clamp(22px,5vw,36px)', fontWeight: 900, color: 'white', margin: 0 }}>
                  Monitor Legislativo
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', lineHeight: 1.6, margin: '12px 0 0', maxWidth: 720 }}>
                  Cobertura periodística independiente de la Asamblea Legislativa de Costa Rica: seguimiento de los <strong style={{ color: 'white' }}>57 diputados</strong> que conforman el Congreso costarricense durante el período <strong style={{ color: 'white' }}>2026-2030</strong>, votaciones plenarias, comisiones legislativas, expedientes y proyectos de ley en trámite. Plataforma de transparencia legislativa que reúne en tiempo real datos oficiales del Parlamento, análisis editorial de Acontecer.co.cr y verificación de votos por fracción política (Pueblo Soberano, Liberación Nacional, Frente Amplio, Unidad Social Cristiana, Agenda Ciudadana y otros partidos representados). Información actualizada con cada sesión del plenario.
                </p>
              </div>
            </div>
            {/* Indicador de monitoreo activo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '6px 14px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: 600 }}>Cerebro Activo — monitoreando</span>
            </div>
          </div>

          {resumen && (
            <div className="stats-hero">
              {[
                { num: resumen.diputados,        label: 'Diputados',        icon: null },
                { num: resumen.votaciones_hoy,   label: 'Votaciones hoy',   icon: null },
                { num: resumen.votaciones_total, label: 'Total votaciones', icon: null },
                { num: resumen.expedientes,      label: 'Expedientes',      icon: null },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '12px 16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <div style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 28, fontWeight: 900, color: 'white', lineHeight: 1 }}>{s.num ?? '—'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Navbar ────────────────────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderBottom: '2px solid #f0f0f0', overflowX: 'auto', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', padding: '0 8px' }}>
          {[
            { href: '/asamblea',             label: 'Dashboard',   active: true  },
            { href: '/asamblea/diputados',   label: 'Diputados',   active: false },
            { href: '/asamblea/comisiones',  label: 'Comisiones',  active: false },
            { href: '/asamblea/votaciones',  label: 'Votaciones',  active: false },
            { href: '/asamblea/expedientes', label: 'Expedientes', active: false },
            { href: '/asamblea/en-vivo',     label: 'En Vivo',     active: false },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              padding: '12px 14px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
              color: item.active ? '#0000A2' : '#555', textDecoration: 'none',
              borderBottom: item.active ? '3px solid #0000A2' : '3px solid transparent',
              flexShrink: 0,
            }}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Grid principal ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '20px 16px' }}>

        {/* ── Hemiciclo full-width ───────────────────────────────────────────── */}
        <div style={{ background: 'white', borderRadius: 16, padding: '18px 20px 14px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 16, fontWeight: 800, color: '#0000A2', margin: 0 }}>
                Mapa de Curules
              </h2>
              <p style={{ fontSize: 11, color: '#999', margin: '2px 0 0' }}>
                {votoActual
                  ? `Coloreado por: ${votacionDestacada?.titulo?.slice(0, 70)}...`
                  : 'Coloreado por fracción parlamentaria'}
              </p>
            </div>
            <Link href="/asamblea/diputados" style={{ fontSize: 12, color: '#0a73ce', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Ver todos →
            </Link>
          </div>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            {(mapaDisputados.length > 0 || diputados.length > 0) ? (
              <HemicicloClient
                diputados={mapaDisputados.length > 0 ? mapaDisputados : diputados}
                votoActual={votoActual as any}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: '#aaa', fontSize: 14 }}>
                ⏳ Cargando datos de diputados...
              </div>
            )}
          </div>
        </div>

        {/* ── Info grid: Votación + Bancadas ────────────────────────────────── */}
        <div className="info-grid" style={{ marginBottom: 16 }}>

          {/* Card: Votación destacada */}
          {votacionDestacada && (
            <div style={{ background: 'white', borderRadius: 16, padding: '18px 20px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#0000A2', marginBottom: 8 }}>
                Última votación registrada
              </div>
              <h3 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 15, fontWeight: 800, color: '#111', lineHeight: 1.45, margin: '0 0 10px' }}>
                {votacionDestacada.titulo?.slice(0, 140)}
              </h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
                <Badge resultado={votacionDestacada.resultado} />
                {votacionDestacada.expediente && (
                  <span style={{ fontSize: 11, color: '#666', background: '#f5f5f5', padding: '2px 8px', borderRadius: 10 }}>
                    Exp. {votacionDestacada.expediente}
                  </span>
                )}
                {votacionDestacada.fecha && (
                  <span style={{ fontSize: 11, color: '#999' }}>{formatFecha(votacionDestacada.fecha)}</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                <DonutChart
                  si={votacionDestacada.votos_si || 0}
                  no={votacionDestacada.votos_no || 0}
                  abs={votacionDestacada.votos_abstencion || 0}
                  aus={Math.max(0, 57 - (votacionDestacada.votos_si || 0) - (votacionDestacada.votos_no || 0) - (votacionDestacada.votos_abstencion || 0))}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { label: 'A favor',    val: votacionDestacada.votos_si || 0,         color: '#22c55e' },
                    { label: 'En contra',  val: votacionDestacada.votos_no || 0,         color: '#ef4444' },
                    { label: 'Abstención', val: votacionDestacada.votos_abstencion || 0, color: '#f59e0b' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: '#666', width: 70, flexShrink: 0 }}>{row.label}</span>
                      <div style={{ flex: 1, height: 7, borderRadius: 4, background: '#f1f5f9', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(row.val / 57) * 100}%`, background: row.color, borderRadius: 4, transition: 'width 0.6s' }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: row.color, width: 24, textAlign: 'right' }}>{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/asamblea/votaciones" style={{
                display: 'block', textAlign: 'center', background: '#0000A2', color: 'white',
                padding: '9px', borderRadius: 10, fontSize: 12, fontWeight: 700, textDecoration: 'none',
              }}>
                Ver mapa de votación completo →
              </Link>
            </div>
          )}

          {/* Card: Distribución por bancada */}
          <div style={{ background: 'white', borderRadius: 16, padding: '18px 20px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#0000A2', marginBottom: 12 }}>
              {tieneVotosIndividuales ? 'Votos por bancada' : 'Bancadas parlamentarias'}
            </div>
            {tieneVotosIndividuales && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                {[
                  { color: '#22c55e', label: 'A favor' },
                  { color: '#ef4444', label: 'En contra' },
                  { color: '#fbbf24', label: 'Abstención' },
                  { color: '#e2e8f0', label: 'Ausente' },
                ].map(l => (
                  <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#666' }}>
                    <span style={{ width: 9, height: 9, borderRadius: 2, background: l.color, flexShrink: 0 }} />
                    {l.label}
                  </span>
                ))}
              </div>
            )}
            <BancadaChart bancadas={bancadas} tieneVotos={tieneVotosIndividuales} />
          </div>
        </div>

        {/* ── Panel Última Hora (tiempo real) ───────────────────────────────────── */}
        <div style={{ marginTop: 20 }}>
          <UltimaHoraAsamblea />
        </div>

        {/* ── Timeline de últimas votaciones ────────────────────────────────────── */}
        <div style={{ marginTop: 20, background: 'white', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 16, fontWeight: 800, color: '#0000A2', margin: 0 }}>
              Últimas votaciones
            </h2>
            <Link href="/asamblea/votaciones" style={{ fontSize: 12, color: '#0a73ce', fontWeight: 600, textDecoration: 'none' }}>
              Ver historial completo →
            </Link>
          </div>

          {votaciones.length === 0
            ? <p style={{ color: '#aaa', fontSize: 14, textAlign: 'center', padding: '32px' }}>No hay votaciones registradas aún</p>
            : votaciones.map((v: any, idx: number) => (
              <div key={v.id} style={{
                padding: '14px 20px', borderBottom: idx < votaciones.length - 1 ? '1px solid #f5f5f5' : 'none',
                display: 'flex', gap: 16, alignItems: 'flex-start',
                background: idx === 0 ? '#f8f9ff' : 'white',
              }}>
                {/* Línea de tiempo visual */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2, flexShrink: 0 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    background: v.resultado === 'APROBADO' ? '#22c55e' : v.resultado === 'RECHAZADO' ? '#ef4444' : '#94a3b8',
                    border: '2px solid white', boxShadow: '0 0 0 1px #e2e8f0',
                  }} />
                  {idx < votaciones.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 28, background: '#f0f0f0', marginTop: 3 }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {v.expediente && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#0a73ce', marginRight: 6 }}>
                          Exp. {v.expediente}
                        </span>
                      )}
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111', lineHeight: 1.4 }}>
                        {v.titulo?.slice(0, 120)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                      <Badge resultado={v.resultado} />
                      <span style={{ fontSize: 10, color: '#bbb' }}>{tiempoRelativo(v.created_at || v.fecha)}</span>
                    </div>
                  </div>
                  <VotBar si={v.votos_si} no={v.votos_no} abst={v.votos_abstencion} />
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, marginTop: 4 }}>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ {v.votos_si} a favor</span>
                    <span style={{ color: '#dc2626', fontWeight: 700 }}>✗ {v.votos_no} en contra</span>
                    {v.votos_abstencion > 0 && <span style={{ color: '#d97706' }}>○ {v.votos_abstencion} abs.</span>}
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        {/* ── Diputados: Votos y Comisiones ─────────────────────────────────────── */}
        {gruposFraccion.length > 0 && (
          <div style={{ marginTop: 20, background: 'white', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 16, fontWeight: 800, color: '#0000A2', margin: 0 }}>
                Diputados — {tieneVotosIndividuales ? 'Última votación y comisiones' : 'Comisiones'}
              </h2>
              {tieneVotosIndividuales && votacionDestacada && (
                <span style={{ fontSize: 11, color: '#888', maxWidth: 260, textAlign: 'right', lineHeight: 1.3 }}>
                  {votacionDestacada.titulo?.slice(0, 60)}…
                </span>
              )}
            </div>
            <div style={{ padding: '16px 20px' }}>
              {gruposFraccion.map(({ fraccion, color, dips }) => (
                <div key={fraccion} style={{ marginBottom: 20 }}>
                  {/* Cabecera de fracción */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 6, borderBottom: `2px solid ${color}22` }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color }}>{fraccion}</span>
                    <span style={{ fontSize: 11, color: '#aaa', fontWeight: 500 }}>{dips.length} diputados</span>
                  </div>
                  {/* Grid de diputados */}
                  <div className="dips-grid">
                    {dips.map((d: any) => {
                      const comisiones: string[] = d.comisiones
                        ? d.comisiones.split(/[,;|\n]/).map((c: string) => c.trim()).filter(Boolean)
                        : [];
                      const VBADGE: Record<string, [string, string, string]> = {
                        SI:         ['#dcfce7', '#166534', 'SÍ'],
                        NO:         ['#fee2e2', '#991b1b', 'NO'],
                        ABSTENCION: ['#fef3c7', '#92400e', 'ABS'],
                        AUSENTE:    ['#f1f5f9', '#64748b', 'AUS'],
                      };
                      const [vbg, vfg, vlabel] = d.votoActualDip ? (VBADGE[d.votoActualDip] ?? VBADGE.AUSENTE) : ['', '', ''];
                      const partes: string[] = (d.nombre_completo || '').split(' ');
                      const nombreCorto = partes.length >= 3
                        ? `${partes[0]} ${partes[1]}`
                        : d.nombre_completo;
                      return (
                        <Link key={d.slug} href={`/asamblea/${d.slug}`} style={{ textDecoration: 'none' }}>
                          <div style={{
                            display: 'flex', gap: 8, padding: '8px 10px', borderRadius: 10,
                            border: `1px solid ${color}22`, background: `${color}08`,
                            alignItems: 'flex-start', cursor: 'pointer', transition: 'background 0.15s',
                          }}>
                            {/* Foto */}
                            <div style={{
                              width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                              border: `2px solid ${color}55`, background: `${color}33`,
                            }}>
                              {d.foto_url
                                ? <img src={fotoDiputadoUrl(d.foto_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color, fontWeight: 800 }}>
                                    {partes[0]?.[0]}{partes[1]?.[0]}
                                  </div>
                              }
                            </div>
                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginBottom: 3, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                                  {nombreCorto}
                                </span>
                                {d.votoActualDip && (
                                  <span style={{ background: vbg, color: vfg, padding: '1px 6px', borderRadius: 8, fontSize: 9.5, fontWeight: 800, flexShrink: 0 }}>
                                    {vlabel}
                                  </span>
                                )}
                              </div>
                              {comisiones.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                  {comisiones.slice(0, 2).map((c: string, ci: number) => (
                                    <span key={ci} style={{ fontSize: 9, color: '#64748b', background: '#f1f5f9', padding: '1px 5px', borderRadius: 3, lineHeight: 1.4 }}>
                                      {c.replace(/^Comisi[oó]n\s+(Permanente\s+)?(de\s+|del?\s+)?/i, '').slice(0, 28)}
                                    </span>
                                  ))}
                                  {comisiones.length > 2 && (
                                    <span style={{ fontSize: 9, color: '#94a3b8' }}>+{comisiones.length - 2}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Info de monitoreo activo ───────────────────────────────────────────── */}
        <div style={{ marginTop: 16, background: '#f0f4ff', borderRadius: 12, padding: '12px 16px', border: '1px solid #c7d5ff', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#3b4a9b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}>
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/>
          </svg>
          <div style={{ fontSize: 12, color: '#3b4a9b', lineHeight: 1.6 }}>
            <strong>Cerebro Activo:</strong> El sistema monitorea votaciones cada 10 min (lun-jue 8am–10pm),
            expedientes cada 30 min, y el canal de Telegram en tiempo real. PDFs de votaciones son
            procesados automáticamente con OCR. Cambios en perfiles de diputados se detectan cada lunes.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .stats-hero {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          align-items: start;
        }
        .dips-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        @media (max-width: 1100px) {
          .dips-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 860px) {
          .info-grid { grid-template-columns: 1fr; }
          .stats-hero { grid-template-columns: repeat(2, 1fr); }
          .dips-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .stats-hero { grid-template-columns: repeat(2, 1fr); }
          .dips-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
