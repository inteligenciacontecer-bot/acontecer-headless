'use client';
import { useEffect, useRef, useState } from 'react';

interface Evento {
  tipo: 'votacion' | 'telegram' | 'expediente_nuevo';
  ts: string;
  id: number;
  titulo: string;
  texto_corto?: string;
  expediente?: string;
  estado?: string;
  proponente?: string;
  votos_si?: number;
  votos_no?: number;
  votos_abs?: number;
  resultado?: string;
  es_votacion?: boolean;
}

interface Stats {
  votaciones_hoy: number;
  expedientes_nuevos: number;
  telegram_total: number;
}

const POLL_MS = 30_000; // 30 segundos

function tiempoRelativo(ts: string) {
  if (!ts) return '';
  const d = new Date(ts.includes('T') ? ts : ts.replace(' ', 'T') + '-06:00');
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'Ahora mismo';
  if (m < 60) return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
}

function ResultadoBadge({ resultado }: { resultado?: string }) {
  if (!resultado) return null;
  const map: Record<string, [string, string, string]> = {
    APROBADO:  ['#dcfce7', '#15803d', '✓ APROBADO'],
    RECHAZADO: ['#fee2e2', '#991b1b', '✗ RECHAZADO'],
    VOTACION:  ['#dbeafe', '#1e40af', '● VOTACIÓN'],
  };
  const r = resultado.toUpperCase();
  const [bg, color, label] = map[r] ?? map['VOTACION'];
  return (
    <span style={{ background: bg, color, padding: '1px 7px', borderRadius: 10, fontSize: 10, fontWeight: 700 }}>
      {label}
    </span>
  );
}

function VotBar({ si, no, abs }: { si: number; no: number; abs: number }) {
  const total = si + no + abs;
  if (!total) return null;
  return (
    <div style={{ display: 'flex', height: 5, borderRadius: 3, overflow: 'hidden', gap: 1, marginTop: 4 }}>
      <div style={{ flex: si, background: '#22c55e', minWidth: si > 0 ? 3 : 0 }} />
      <div style={{ flex: no, background: '#ef4444', minWidth: no > 0 ? 3 : 0 }} />
      <div style={{ flex: abs, background: '#fbbf24', minWidth: abs > 0 ? 2 : 0 }} />
    </div>
  );
}

function IconTipo({ tipo }: { tipo: string }) {
  if (tipo === 'votacion') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
      <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  );
  if (tipo === 'telegram') return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.069l-2.04 9.612c-.153.686-.554.855-1.123.531l-3.1-2.284-1.496 1.44c-.165.165-.304.304-.624.304l.224-3.168 5.77-5.212c.251-.224-.055-.348-.389-.124L6.97 14.08l-3.042-.952c-.661-.207-.673-.661.137-.977l11.906-4.593c.55-.2 1.031.136.591.511z"/>
    </svg>
  );
  // expediente_nuevo
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
    </svg>
  );
}

function coloresTipo(tipo: string): [string, string, string] {
  // [bg, color, dot]
  if (tipo === 'votacion')       return ['#eff6ff', '#1d4ed8', '#3b82f6'];
  if (tipo === 'telegram')       return ['#f0fdf4', '#15803d', '#22c55e'];
  return                                ['#fef9c3', '#92400e', '#f59e0b'];
}

function labelTipo(tipo: string) {
  if (tipo === 'votacion')       return 'Votación';
  if (tipo === 'telegram')       return 'Telegram';
  return 'Nuevo exp.';
}

export default function UltimaHoraAsamblea() {
  const [timeline, setTimeline] = useState<Evento[]>([]);
  const [stats, setStats]       = useState<Stats | null>(null);
  const [ultima, setUltima]     = useState<string>('');
  const [loading, setLoading]   = useState(true);
  const [pulso, setPulso]       = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function fetchData() {
    try {
      const r = await fetch('/api/asamblea/ultima-hora', { cache: 'no-store' });
      if (!r.ok) return;
      const data = await r.json();
      setTimeline(data.timeline ?? []);
      setStats(data.stats ?? null);
      setUltima(data.ultima_actualizacion ?? '');
      setPulso(p => !p); // trigger pulso visual
    } catch { /* silencioso */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, POLL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  if (loading) return (
    <div style={{ background: 'white', borderRadius: 16, padding: '32px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
      <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Cargando datos en vivo...
    </div>
  );

  return (
    <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1 }}>
          <span style={{
            width: 9, height: 9, borderRadius: '50%', background: '#ef4444', flexShrink: 0,
            boxShadow: pulso ? '0 0 0 4px #fee2e2' : '0 0 0 0px #fee2e2',
            transition: 'box-shadow 0.4s',
          }} />
          <h2 style={{ fontFamily: 'var(--font-lora), serif', fontSize: 16, fontWeight: 800, color: '#0000A2', margin: 0 }}>
            Última Hora — Asamblea
          </h2>
        </div>
        {stats && (
          <div style={{ display: 'flex', gap: 8 }}>
            {stats.votaciones_hoy > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: 10 }}>
                {stats.votaciones_hoy} vot. hoy
              </span>
            )}
            {stats.expedientes_nuevos > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, background: '#fef9c3', color: '#92400e', padding: '3px 8px', borderRadius: 10 }}>
                +{stats.expedientes_nuevos} exp. nuevos
              </span>
            )}
          </div>
        )}
        {ultima && (
          <span style={{ fontSize: 10, color: '#bbb', flexShrink: 0 }}>
            {tiempoRelativo(ultima)}
          </span>
        )}
      </div>

      {/* Leyenda de tipos */}
      <div style={{ padding: '8px 20px', borderBottom: '1px solid #f8f9fa', display: 'flex', gap: 12 }}>
        {[
          { tipo: 'votacion',        label: 'Votaciones' },
          { tipo: 'telegram',        label: 'Telegram oficial' },
          { tipo: 'expediente_nuevo', label: 'Nuevos proyectos' },
        ].map(({ tipo, label }) => {
          const [bg, color, dot] = coloresTipo(tipo);
          return (
            <span key={tipo} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: dot, flexShrink: 0 }} />
              {label}
            </span>
          );
        })}
      </div>

      {/* Timeline */}
      {timeline.length === 0 ? (
        <div style={{ padding: '32px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
          No hay eventos recientes registrados.
        </div>
      ) : (
        <div style={{ maxHeight: 520, overflowY: 'auto' }}>
          {timeline.slice(0, 25).map((ev, idx) => {
            const [bg, color, dot] = coloresTipo(ev.tipo);
            return (
              <div key={`${ev.tipo}-${ev.id}-${idx}`} style={{
                padding: '12px 20px',
                borderBottom: idx < Math.min(24, timeline.length - 1) ? '1px solid #f8f9fa' : 'none',
                display: 'flex', gap: 12, alignItems: 'flex-start',
                background: idx === 0 ? bg + '66' : 'white',
              }}>
                {/* Dot + línea */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 1, flexShrink: 0, width: 16 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', background: bg,
                    border: `2px solid ${dot}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color, flexShrink: 0,
                  }}>
                    <IconTipo tipo={ev.tipo} />
                  </div>
                  {idx < Math.min(24, timeline.length - 1) && (
                    <div style={{ width: 2, flex: 1, minHeight: 16, background: '#f0f0f0', marginTop: 3 }} />
                  )}
                </div>

                {/* Contenido */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap', marginBottom: 3 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, background: bg, color, padding: '1px 6px', borderRadius: 8, letterSpacing: 0.5 }}>
                          {labelTipo(ev.tipo)}
                        </span>
                        {ev.expediente && (
                          <span style={{ fontSize: 10, color: '#0a73ce', fontWeight: 600 }}>
                            Exp. {ev.expediente}
                          </span>
                        )}
                        {ev.es_votacion && ev.tipo === 'telegram' && (
                          <span style={{ fontSize: 9, fontWeight: 700, background: '#fff7ed', color: '#c2410c', padding: '1px 6px', borderRadius: 8 }}>
                            VOTACIÓN
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', lineHeight: 1.5 }}>
                        {(ev.titulo ?? '').replace(/​/g, '').trim()}
                      </div>
                      {ev.tipo === 'telegram' && ev.texto_corto && ev.texto_corto !== ev.titulo && (
                        <div style={{ fontSize: 11, color: '#475569', marginTop: 4, lineHeight: 1.55,
                          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                          background: '#f8fafc', borderRadius: 6, padding: '6px 8px',
                          borderLeft: '2px solid #e2e8f0' }}>
                          {ev.texto_corto}
                        </div>
                      )}
                      {ev.tipo === 'expediente_nuevo' && ev.estado && (
                        <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                          {ev.estado} {ev.proponente ? `· ${ev.proponente.slice(0, 40)}` : ''}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                      {ev.resultado && <ResultadoBadge resultado={ev.resultado} />}
                      <span style={{ fontSize: 10, color: '#bbb', whiteSpace: 'nowrap' }}>
                        {tiempoRelativo(ev.ts)}
                      </span>
                    </div>
                  </div>
                  {ev.tipo !== 'expediente_nuevo' && (
                    <>
                      <VotBar si={ev.votos_si ?? 0} no={ev.votos_no ?? 0} abs={ev.votos_abs ?? 0} />
                      {((ev.votos_si ?? 0) + (ev.votos_no ?? 0)) > 0 && (
                        <div style={{ display: 'flex', gap: 10, fontSize: 10, marginTop: 3 }}>
                          <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ {ev.votos_si} a favor</span>
                          <span style={{ color: '#dc2626', fontWeight: 700 }}>✗ {ev.votos_no} en contra</span>
                          {(ev.votos_abs ?? 0) > 0 && <span style={{ color: '#d97706' }}>○ {ev.votos_abs} abs.</span>}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pie */}
      <div style={{ padding: '10px 20px', borderTop: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#bbb' }}>
          Actualiza cada 30s · Telegram + SharePoint oficial
        </span>
        <button
          onClick={fetchData}
          style={{ fontSize: 10, color: '#0a73ce', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}
        >
          ↺ Actualizar ahora
        </button>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
