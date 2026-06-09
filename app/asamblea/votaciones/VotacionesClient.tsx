'use client';

import { useState, useEffect } from 'react';
import { fotoDiputadoUrl } from '@/lib/diputado-foto';

const API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';

// ── Colores de partidos ───────────────────────────────────────────────────────
const FRACCION_COLOR: Record<string, string> = {
  'Partido Pueblo Soberano':          '#F59E0B',
  'Partido Liberación Nacional':      '#00AA44',
  'Partido Frente Amplio':            '#DC2626',
  'Partido Unidad Social Cristiana':  '#6366F1',
  'Partido Agenda Ciudadana':         '#10B981',
  'Partido Acción Ciudadana':         '#10B981',
  'Partido Nueva República':          '#1D4ED8',
  'Partido Nacional Democrático':     '#0EA5E9',
  'Partido Liberal Progresista':      '#7C3AED',
  'Fuerza Democrática':               '#EF4444',
  'Partido Restauración Nacional':    '#1D4ED8',
};
function getPartidoColor(fraccion = ''): string {
  if (!fraccion) return '#94A3B8';
  if (FRACCION_COLOR[fraccion]) return FRACCION_COLOR[fraccion];
  const up = fraccion.toUpperCase();
  if (up.includes('SOBERANO'))   return '#F59E0B';
  if (up.includes('LIBERACI'))   return '#00AA44';
  if (up.includes('FRENTE AMP')) return '#DC2626';
  if (up.includes('CRISTIANA'))  return '#6366F1';
  if (up.includes('AGENDA'))     return '#10B981';
  if (up.includes('NUEVA REP'))  return '#1D4ED8';
  if (up.includes('DEMOCR'))     return '#EF4444';
  if (up.includes('PLN'))        return '#00AA44';
  if (up.includes('PUSC'))       return '#6366F1';
  return '#94A3B8';
}

// ── BancadaChart ──────────────────────────────────────────────────────────────
function BancadaChart({ mapaData }: { mapaData: any[] }) {
  if (!mapaData?.length) return null;

  // Agrupar por fracción
  const map: Record<string, { si: number; no: number; abs: number; aus: number; total: number }> = {};
  for (const d of mapaData) {
    const f = d.fraccion || d.partido || '?';
    if (!map[f]) map[f] = { si: 0, no: 0, abs: 0, aus: 0, total: 0 };
    map[f].total++;
    const v = (d.voto || '').toUpperCase();
    if (v === 'SI')          map[f].si++;
    else if (v === 'NO')     map[f].no++;
    else if (v === 'ABSTENCION') map[f].abs++;
    else                     map[f].aus++;
  }

  const bancadas = Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  const hayVotos = bancadas.some(([, b]) => b.si + b.no + b.abs > 0);
  if (!hayVotos) return null;

  return (
    <div style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0', background: '#fafafa' }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#64748b', marginBottom: 10 }}>
        Distribución por bancada
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px 16px' }}>
        {bancadas.map(([fraccion, b]) => {
          const total = b.si + b.no + b.abs + b.aus || 1;
          const pSi  = (b.si  / total) * 100;
          const pNo  = (b.no  / total) * 100;
          const pAbs = (b.abs / total) * 100;
          const pAus = (b.aus / total) * 100;
          const color = getPartidoColor(fraccion);
          return (
            <div key={fraccion}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color }}>{fraccion}</span>
                <span style={{ fontSize: 10, color: '#888' }}>
                  {b.si > 0 && <span style={{ color: '#22c55e', fontWeight: 700 }}>+{b.si} </span>}
                  {b.no > 0 && <span style={{ color: '#ef4444', fontWeight: 700 }}>−{b.no} </span>}
                  {b.abs > 0 && <span style={{ color: '#f59e0b' }}>○{b.abs}</span>}
                </span>
              </div>
              <div style={{ display: 'flex', height: 9, borderRadius: 5, overflow: 'hidden', background: '#e2e8f0', gap: '1px' }}>
                {pSi  > 0 && <div style={{ width: `${pSi}%`,  background: '#22c55e' }} />}
                {pNo  > 0 && <div style={{ width: `${pNo}%`,  background: '#ef4444' }} />}
                {pAbs > 0 && <div style={{ width: `${pAbs}%`, background: '#f59e0b' }} />}
                {pAus > 0 && <div style={{ width: `${pAus}%`, background: '#e2e8f0' }} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Vote colour helpers ───────────────────────────────────────────────────────
const VOTO_COLOR: Record<string, string> = {
  SI:         '#22c55e',
  NO:         '#ef4444',
  ABSTENCION: '#f59e0b',
  AUSENTE:    '#94a3b8',
};
const VOTO_BG: Record<string, string> = {
  SI:         '#dcfce7',
  NO:         '#fee2e2',
  ABSTENCION: '#fef3c7',
  AUSENTE:    '#f1f5f9',
};
const VOTO_FG: Record<string, string> = {
  SI:         '#166534',
  NO:         '#991b1b',
  ABSTENCION: '#92400e',
  AUSENTE:    '#475569',
};
const VOTO_BORDER: Record<string, string> = {
  SI:         '#86efac',
  NO:         '#fca5a5',
  ABSTENCION: '#fcd34d',
  AUSENTE:    '#cbd5e1',
};

// ── VotBadge ──────────────────────────────────────────────────────────────────
function VotBadge({ voto }: { voto: string }) {
  return (
    <span style={{
      background: VOTO_BG[voto] ?? VOTO_BG.AUSENTE,
      color:      VOTO_FG[voto] ?? VOTO_FG.AUSENTE,
      border:     `1px solid ${VOTO_BORDER[voto] ?? VOTO_BORDER.AUSENTE}`,
      padding: '2px 8px', borderRadius: 10,
      fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      {voto}
    </span>
  );
}

// ── Deputy card in mapa ───────────────────────────────────────────────────────
function DiputadoCard({ d }: { d: any }) {
  const [hovered, setHovered] = useState(false);
  const initials = (d.nombre_corto || d.nombre_completo || '')
    .split(' ').filter(Boolean).slice(0, 2)
    .map((w: string) => w[0]).join('').toUpperCase();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: 60, minHeight: 70,
        borderRadius: 8,
        overflow: 'hidden',
        background: 'white',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.16)' : '0 1px 4px rgba(0,0,0,0.08)',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'all 0.15s ease',
        cursor: 'pointer',
        flexShrink: 0,
      }}
      title={`${d.nombre_completo}: ${d.voto}`}
    >
      {/* Vote colour bar at top */}
      <div style={{ height: 4, background: VOTO_COLOR[d.voto] ?? VOTO_COLOR.AUSENTE }} />

      {/* Photo or initials */}
      <div style={{
        width: '100%', height: 36,
        background: '#e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {d.foto_url
          ? <img src={fotoDiputadoUrl(d.foto_url)} alt={d.nombre_completo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          : <span style={{ fontSize: 12, fontWeight: 800, color: '#64748b' }}>{initials}</span>
        }
      </div>

      {/* Name */}
      <div style={{ padding: '3px 4px 5px', fontSize: 8, color: '#334155', lineHeight: 1.3, textAlign: 'center', overflow: 'hidden' }}>
        {(d.nombre_corto || d.nombre_completo || '').slice(0, 22)}
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%',
          transform: 'translateX(-50%)',
          background: '#0f172a', color: 'white',
          padding: '6px 10px', borderRadius: 6,
          fontSize: 11, whiteSpace: 'nowrap',
          zIndex: 10, marginBottom: 4,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
        }}>
          {d.nombre_completo}
          <br />
          <span style={{ color: VOTO_COLOR[d.voto] ?? VOTO_COLOR.AUSENTE, fontWeight: 700 }}>{d.voto}</span>
          {d.fraccion && <span style={{ color: '#94a3b8', marginLeft: 6 }}>{d.fraccion}</span>}
        </div>
      )}
    </div>
  );
}

// ── Mapa Modal ────────────────────────────────────────────────────────────────
function MapaModal({ votacionId, onClose }: { votacionId: number; onClose: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/votaciones/${votacionId}/mapa`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [votacionId]);

  // Group deputies by fraccion
  const byFraccion: Record<string, any[]> = {};
  if (data?.mapa) {
    for (const d of data.mapa) {
      const k = d.fraccion || d.partido || 'Otros';
      if (!byFraccion[k]) byFraccion[k] = [];
      byFraccion[k].push(d);
    }
  }

  const t = data?.totales ?? {};

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        overflowY: 'auto', padding: '20px 12px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'white', borderRadius: 16,
        width: '100%', maxWidth: 860,
        boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #00007a, #0000A2)',
          padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Mapa de votación
              {data?.votacion?.expediente && ` · Exp. ${data.votacion.expediente}`}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white', lineHeight: 1.4 }}>
              {(data?.votacion?.titulo || '').slice(0, 100)}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
              color: 'white', width: 32, height: 32, cursor: 'pointer',
              fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Totals bar */}
        {data && (
          <div style={{
            background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
            padding: '10px 20px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
          }}>
            {[
              { votoKey: 'SI',         label: 'SI',         count: t.si },
              { votoKey: 'NO',         label: 'NO',         count: t.no },
              { votoKey: 'ABSTENCION', label: 'ABSTENCIÓN', count: t.abstencion },
              { votoKey: 'AUSENTE',    label: 'AUSENTE',    count: t.ausente },
            ].map(s => (
              <span key={s.votoKey} style={{
                background: VOTO_BG[s.votoKey] ?? VOTO_BG.AUSENTE,
                color:      VOTO_FG[s.votoKey] ?? VOTO_FG.AUSENTE,
                border:     `1px solid ${VOTO_BORDER[s.votoKey] ?? VOTO_BORDER.AUSENTE}`,
                padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
              }}>
                {s.label}: {s.count ?? 0}
              </span>
            ))}
            {data.votacion?.resultado && (
              <span style={{
                marginLeft: 'auto',
                background: data.votacion.resultado === 'APROBADO' ? '#dcfce7' : '#fee2e2',
                color:      data.votacion.resultado === 'APROBADO' ? '#15803d' : '#991b1b',
                padding: '4px 14px', borderRadius: 20, fontSize: 11, fontWeight: 800,
              }}>
                {data.votacion.resultado}
              </span>
            )}
            <a
              href={`/asamblea/votaciones/${votacionId}/imagen`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#0000A2',
                color: 'white',
                padding: '5px 12px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              Imagen 1000×1000
            </a>
          </div>
        )}

        {/* Bancada breakdown chart */}
        {data?.mapa && <BancadaChart mapaData={data.mapa} />}

        {/* Content */}
        <div style={{ padding: '16px 20px', maxHeight: '65vh', overflowY: 'auto' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              Cargando mapa...
            </div>
          )}
          {!loading && !data && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              No se pudo cargar el mapa de votación.
            </div>
          )}
          {!loading && data && Object.keys(byFraccion).length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              No hay datos de votos individuales para esta votación.
            </div>
          )}
          {!loading && data && Object.entries(byFraccion).map(([fraccion, diputados]) => (
            <div key={fraccion} style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: '#64748b',
                textTransform: 'uppercase', letterSpacing: '0.07em',
                marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>{fraccion}</span>
                <span style={{ background: '#e2e8f0', padding: '1px 7px', borderRadius: 10, fontSize: 10, fontWeight: 600 }}>
                  {diputados.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {diputados.map((d: any) => (
                  <DiputadoCard key={d.id} d={d} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── VotBar ────────────────────────────────────────────────────────────────────
function VotBar({ si, no, abst }: { si: number; no: number; abst: number }) {
  const total = si + no + abst || 57;
  return (
    <div style={{ display: 'flex', height: 7, borderRadius: 4, overflow: 'hidden', gap: 1, margin: '8px 0' }}>
      <div style={{ flex: si / total, background: '#22c55e', minWidth: si > 0 ? 4 : 0 }} title={`${si} a favor`} />
      <div style={{ flex: no / total, background: '#ef4444', minWidth: no > 0 ? 4 : 0 }} title={`${no} en contra`} />
      <div style={{ flex: abst / total, background: '#d1d5db', minWidth: abst > 0 ? 4 : 0 }} title={`${abst} abstención`} />
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ resultado }: { resultado: string }) {
  const map: Record<string, [string, string]> = {
    APROBADO:  ['#d1fae5', '#065f46'],
    RECHAZADO: ['#fee2e2', '#991b1b'],
    VOTACION:  ['#dbeafe', '#1e40af'],
  };
  const [bg, color] = map[resultado] || map.VOTACION;
  return (
    <span style={{ background: bg, color, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {resultado}
    </span>
  );
}

// ── Main client component ─────────────────────────────────────────────────────
export default function VotacionesClient({ votaciones }: { votaciones: any[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const aprobadas  = votaciones.filter(v => v.resultado === 'APROBADO').length;
  const rechazadas = votaciones.filter(v => v.resultado === 'RECHAZADO').length;

  return (
    <>
      {selectedId !== null && (
        <MapaModal votacionId={selectedId} onClose={() => setSelectedId(null)} />
      )}

      {/* Resumen rápido */}
      {votaciones.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'Total',      num: votaciones.length, bg: '#f8fafc', color: '#334155' },
            { label: 'Aprobadas',  num: aprobadas,         bg: '#f0fdf4', color: '#065f46' },
            { label: 'Rechazadas', num: rechazadas,        bg: '#fef2f2', color: '#991b1b' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '10px 16px', flex: 1, minWidth: 90, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.num}</div>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Lista completa */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 17, fontWeight: 700, color: '#0000A2', margin: 0 }}>
            Registro completo de votaciones
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
            Haz clic en cualquier votación para ver el mapa de votos individuales
          </p>
        </div>

        {votaciones.length === 0
          ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: '#888' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗳️</div>
              <p style={{ margin: 0 }}>No hay votaciones registradas aún.</p>
              <p style={{ fontSize: 12, marginTop: 6, color: '#aaa' }}>
                Se registran automáticamente cuando el scraper detecta nuevos PDFs.
              </p>
            </div>
          )
          : votaciones.map((v: any) => (
            <div
              key={v.id}
              onClick={() => setSelectedId(v.id)}
              style={{
                padding: '14px 16px', borderBottom: '1px solid #f5f5f5',
                cursor: 'pointer',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 4 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {v.expediente && (
                    <span
                      style={{ fontSize: 10, fontWeight: 700, color: '#0a73ce', background: '#eff6ff', padding: '2px 7px', borderRadius: 10, marginRight: 6, whiteSpace: 'nowrap' }}
                      onClick={e => e.stopPropagation()}
                    >
                      Exp. {v.expediente}
                    </span>
                  )}
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111', lineHeight: 1.4 }}>
                    {v.titulo?.slice(0, 160)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                  <Badge resultado={v.resultado} />
                  <span style={{
                    fontSize: 10, color: '#94a3b8', background: '#f1f5f9',
                    padding: '2px 7px', borderRadius: 6, whiteSpace: 'nowrap',
                  }}>
                    Ver mapa
                  </span>
                  <a
                    href={`/asamblea/votaciones/${v.id}/imagen`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 10,
                      color: '#fff',
                      background: '#0000A2',
                      padding: '2px 7px',
                      borderRadius: 6,
                      whiteSpace: 'nowrap',
                      textDecoration: 'none',
                      fontWeight: 800,
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    Imagen
                  </a>
                </div>
              </div>

              <VotBar si={v.votos_si} no={v.votos_no} abst={v.votos_abstencion} />

              <div style={{ display: 'flex', gap: 12, fontSize: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>✓ {v.votos_si} a favor</span>
                <span style={{ color: '#dc2626', fontWeight: 700 }}>✗ {v.votos_no} en contra</span>
                {v.votos_abstencion > 0 && (
                  <span style={{ color: '#888' }}>○ {v.votos_abstencion} abst.</span>
                )}
                <span style={{ color: '#bbb', marginLeft: 'auto', fontSize: 11 }}>
                  {new Date(v.created_at).toLocaleDateString('es-CR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
                {v.url_pdf && (
                  <a
                    href={v.url_pdf} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#0a73ce', fontSize: 11, textDecoration: 'none' }}
                    onClick={e => e.stopPropagation()}
                  >
                    📄 Acta PDF
                  </a>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
}
