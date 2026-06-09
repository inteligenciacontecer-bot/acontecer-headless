import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Expedientes Legislativos — Asamblea de Costa Rica',
  description: 'Consulta proyectos de ley, su estado en el proceso legislativo, comisión asignada y proponentes en la Asamblea Legislativa de Costa Rica.',
  alternates: { canonical: 'https://acontecer.co.cr/asamblea/expedientes' },
  openGraph: {
    url: 'https://acontecer.co.cr/asamblea/expedientes',
    title: 'Expedientes Legislativos — Asamblea de Costa Rica',
    description: 'Consulta proyectos de ley, su estado en el proceso legislativo, comisión asignada y proponentes.',
    images: [{ url: 'https://acontecer.co.cr/asamblea/expedientes/opengraph-image', width: 1200, height: 630, alt: 'Expedientes Legislativos' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expedientes Legislativos — Asamblea de Costa Rica',
    description: 'Proyectos de ley, trámite legislativo, comisiones y proponentes.',
    images: ['https://acontecer.co.cr/asamblea/expedientes/opengraph-image'],
  },
};

export const revalidate = 1800;

const API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';

const ESTADO_META: Record<string, { bg: string; color: string; dot: string }> = {
  'APROBADO':       { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
  'PRIMER DEBATE':  { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  'SEGUNDO DEBATE': { bg: '#e0e7ff', color: '#4338ca', dot: '#6366f1' },
  'EN TRÁMITE':     { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  'DICTAMINADO':    { bg: '#f0fdf4', color: '#166534', dot: '#4ade80' },
  'ARCHIVADO':      { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8' },
  'VETADO':         { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
  'DICTÁMEN AFIRMATIVO UNÁNIME':  { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
  'DICTÁMEN AFIRMATIVO DE MAYORÍA': { bg: '#d1fae5', color: '#065f46', dot: '#34d399' },
  'DICTÁMEN NEGATIVO': { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
};

function estadoMeta(estado: string) {
  if (!estado) return { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8' };
  const key = Object.keys(ESTADO_META).find(k => estado.toUpperCase().includes(k));
  return key ? ESTADO_META[key] : { bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8' };
}

async function getExpedientes(params: { search?: string; estado?: string }) {
  const qs = new URLSearchParams();
  qs.set('per_page', '200');
  if (params.search) qs.set('search', params.search);
  if (params.estado) qs.set('estado', params.estado);
  try {
    qs.set('orderby', 'numero_desc');
    const r = await fetch(`${API}/expedientes?${qs}`, { next: { revalidate: 900 } });
    return r.ok ? (await r.json() as any[]) : [];
  } catch { return []; }
}

async function getResumen() {
  try {
    const r = await fetch(`${API}/resumen`, { next: { revalidate: 60 } });
    return r.ok ? r.json() : {};
  } catch { return {}; }
}

const ESTADOS_FILTER = [
  'PRIMER DEBATE',
  'SEGUNDO DEBATE',
  'DICTAMINADO',
  'APROBADO',
  'ARCHIVADO',
];

export default async function ExpedientesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; estado?: string }>;
}) {
  const sp = await searchParams;
  const [expedientes, resumen] = await Promise.all([
    getExpedientes({ search: sp.search, estado: sp.estado }),
    getResumen(),
  ]);

  // Agrupar por estado para estadísticas
  const porEstado = expedientes.reduce((acc: Record<string, number>, e: any) => {
    const k = (e.estado || 'Sin estado').toUpperCase();
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0000A2 0%, #1a1aff 60%, #0000A2 100%)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '22px 20px 28px' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 18, flexWrap: 'wrap' }}>
            <Link href="/asamblea" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Monitor Legislativo</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Expedientes</span>
          </nav>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 'clamp(22px,4vw,34px)', fontWeight: 900, color: 'white', margin: '0 0 8px', lineHeight: 1.1 }}>
                Expedientes Legislativos
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>
                Proyectos de ley en trámite y estado de avance en la Asamblea Legislativa
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { val: resumen?.expedientes ?? expedientes.length, label: 'Proyectos' },
                { val: porEstado['PRIMER DEBATE'] || 0,   label: 'Primer Debate' },
                { val: porEstado['APROBADO'] || 0,        label: 'Aprobados' },
              ].map((s, i) => (
                <div key={i} style={{
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 10, padding: '10px 16px', minWidth: 70,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'white', fontFamily: 'var(--font-Lora), serif' }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────────────────── */}
      <div style={{ background: '#f1f5f9', minHeight: '70vh' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 20px 56px' }}>

          {/* Filtros */}
          <form method="GET" style={{ marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 280px', position: 'relative' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                name="search"
                defaultValue={sp.search || ''}
                placeholder="Buscar por título, número o proponente…"
                style={{
                  width: '100%', padding: '9px 12px 9px 32px', borderRadius: 8,
                  border: '1px solid #e2e8f0', background: 'white', fontSize: 13,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <select name="estado" defaultValue={sp.estado || ''}
              style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', fontSize: 13, color: '#334155' }}>
              <option value="">Todos los estados</option>
              {ESTADOS_FILTER.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>

            <button type="submit" style={{
              padding: '9px 18px', borderRadius: 8, background: '#0000A2',
              color: 'white', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
              Filtrar
            </button>

            {(sp.search || sp.estado) && (
              <Link href="/asamblea/expedientes" style={{
                padding: '9px 14px', borderRadius: 8, background: '#f1f5f9',
                border: '1px solid #e2e8f0', color: '#64748b', fontSize: 12,
                textDecoration: 'none', fontWeight: 500,
              }}>
                Limpiar ×
              </Link>
            )}
          </form>

          {/* Chips de estado */}
          {!sp.estado && !sp.search && Object.entries(porEstado).length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
              {Object.entries(porEstado).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([estado, cnt]) => {
                const m = estadoMeta(estado);
                return (
                  <Link key={estado} href={`/asamblea/expedientes?estado=${encodeURIComponent(estado)}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: m.bg, color: m.color,
                      padding: '4px 10px', borderRadius: 20,
                      fontSize: 11, fontWeight: 700, textDecoration: 'none',
                    }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.dot, flexShrink: 0 }} />
                    {estado} ({cnt})
                  </Link>
                );
              })}
            </div>
          )}

          {/* Resultados */}
          <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '14px 20px 13px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 18, background: '#0000A2', borderRadius: 2 }} />
              <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0, flex: 1 }}>
                {sp.search ? `Resultados para "${sp.search}"` : sp.estado ? `Estado: ${sp.estado}` : 'Proyectos de Ley'}
              </h2>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 10,
                background: expedientes.length > 0 ? '#e0e7ff' : '#f1f5f9',
                color: expedientes.length > 0 ? '#0000A2' : '#94a3b8',
              }}>
                {expedientes.length}
              </span>
            </div>

            {/* Lista */}
            {expedientes.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <p style={{ color: '#94a3b8', fontSize: 14, margin: 0, lineHeight: 1.7 }}>
                  {sp.search || sp.estado
                    ? 'No se encontraron expedientes con ese criterio.'
                    : 'Los expedientes se sincronizarán en el próximo ciclo del monitor.'}
                </p>
              </div>
            ) : (
              <div>
                {expedientes.map((e: any, i: number) => {
                  const m = estadoMeta(e.estado || '');
                  const asambleaUrl = e.numero
                    ? `/asamblea/expedientes/${e.numero}`
                    : null;
                  return (
                    <div key={e.id || i} style={{
                      padding: '16px 20px',
                      borderBottom: i < expedientes.length - 1 ? '1px solid #f1f5f9' : 'none',
                      display: 'flex', gap: 16, alignItems: 'flex-start',
                    }}>
                      {/* Número */}
                      <div style={{
                        flexShrink: 0,
                        background: '#f8fafc', border: '1px solid #e2e8f0',
                        borderRadius: 7, padding: '6px 10px',
                        textAlign: 'center', minWidth: 58,
                      }}>
                        <div style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                          Exp.
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: '#0000A2', letterSpacing: '-0.02em' }}>
                          {(e.numero || '').replace(/^0+/, '')}
                        </div>
                      </div>

                      {/* Contenido */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link href={asambleaUrl || '#'} style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', lineHeight: 1.5, marginBottom: 6, textDecoration: 'none', display: 'block' }}>
                          {e.titulo?.slice(0, 200)}{(e.titulo?.length || 0) > 200 ? '…' : ''}
                        </Link>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', fontSize: 11 }}>
                          {e.estado && (
                            <span style={{
                              background: m.bg, color: m.color,
                              padding: '2px 8px', borderRadius: 4, fontWeight: 700,
                            }}>
                              {e.estado.slice(0, 40)}
                            </span>
                          )}
                          {e.proponente && (
                            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 11, height: 11 }}>
                                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                              </svg>
                              {e.proponente.slice(0, 60)}
                            </span>
                          )}
                          {e.comision && (
                            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 11, height: 11 }}>
                                <path d="M3 22V3h18v19"/><path d="M9 22V12h6v10"/>
                              </svg>
                              {e.comision.slice(0, 60)}
                            </span>
                          )}
                          {(e.fecha_presentacion || e.fecha_agenda) && (
                            <span style={{ color: '#94a3b8', marginLeft: 'auto' }}>
                              {new Date((e.fecha_presentacion || e.fecha_agenda) + 'T12:00:00').toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Link a Asamblea */}
                      {asambleaUrl && (
                        <a href={asambleaUrl} target="_blank" rel="noopener"
                          title="Ver en la Asamblea Legislativa"
                          style={{
                            flexShrink: 0, width: 28, height: 28,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: '#f8fafc', border: '1px solid #e2e8f0',
                            borderRadius: 6, color: '#94a3b8', textDecoration: 'none',
                          }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 12, height: 12 }}>
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Nota de actualización */}
          <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 20, lineHeight: 1.6 }}>
            Datos sincronizados desde el sitio oficial de la Asamblea Legislativa de Costa Rica.
            Se actualizan automáticamente cada 30 minutos en días hábiles.
          </p>
        </div>
      </div>
    </>
  );
}
