import type { Metadata } from 'next';
import Link from 'next/link';
import HemicicloClient from '@/components/HemicicloClient';
import UltimaHoraAsamblea from '@/components/UltimaHoraAsamblea';
import { fotoDiputadoUrl } from '@/lib/diputado-foto';

export const metadata: Metadata = {
  title: 'Monitor Legislativo — Asamblea de Costa Rica',
  description: 'Seguimiento en tiempo real de proyectos de ley, votaciones y diputados de la Asamblea Legislativa de Costa Rica.',
  alternates: { canonical: 'https://acontecer.co.cr/asamblea' },
  openGraph: { url: 'https://acontecer.co.cr/asamblea', images: [{ url: 'https://acontecer.co.cr/wp-content/uploads/2026/06/MONITOR-LEGISLATIVO-PORTADA.webp', alt: 'Monitor Legislativo Asamblea Costa Rica — Acontecer' }] },
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

// ── Página principal ───────────────────────────────────────────────────────────

export default async function AsambleaPage() {
  const [resumen, diputados] = await Promise.all([
    getResumen(), getDiputados(),
  ]);

  // Agrupar por fracción (orden: mayor a menor)
  const grupoMap: Record<string, { fraccion: string; color: string; dips: any[] }> = {};
  for (const d of (diputados as any[])) {
    const f = d.fraccion || d.partido || 'Independiente';
    if (!grupoMap[f]) grupoMap[f] = { fraccion: f, color: partidoColor(f), dips: [] };
    grupoMap[f].dips.push(d);
  }
  const gruposFraccion = Object.values(grupoMap).sort((a, b) => b.dips.length - a.dips.length);

  return (
    <>
      {/* ── Hero — Rediseño 2026 ─────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', overflow: 'hidden', color: '#fff',
        background: 'linear-gradient(135deg, #00006e 0%, #00009e 50%, #0a73ce 100%)',
      }}>
        {/* Grid overlay decorativo */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        {/* Blob decorativo */}
        <div style={{ position: 'absolute', top: -80, left: '25%', width: 360, height: 360, borderRadius: '50%', background: '#0a73ce', filter: 'blur(80px)', opacity: 0.35, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 1140, margin: '0 auto', padding: '44px 20px 56px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.14em', fontFamily: 'var(--font-mono)', marginBottom: 28, alignItems: 'center', flexWrap: 'wrap' }}>
            <span>ACONTECER</span><span style={{ opacity: 0.4 }}>/</span>
            <span>HERRAMIENTAS</span><span style={{ opacity: 0.4 }}>/</span>
            <span style={{ color: '#fff' }}>MONITOR LEGISLATIVO</span>
          </div>

          <div className="ml-hero-2col">
            {/* Columna izquierda: título + lede + CTAs */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
                <span style={{
                  background: '#dc2626', color: '#fff',
                  padding: '6px 14px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
                  display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)',
                }}>
                  <span className="ml-live-dot" />
                  EN VIVO
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                  Monitoreo activo
                </span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-lora), Georgia, serif',
                fontSize: 'clamp(44px, 6vw, 80px)',
                fontWeight: 500, lineHeight: 0.95,
                letterSpacing: '-0.025em', margin: '0 0 22px', color: '#fff',
              }}>
                Monitor<br />Legislativo
              </h1>

              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,0.85)', maxWidth: 520, margin: '0 0 32px' }}>
                Seguí la actividad de la Asamblea en tiempo real: votaciones, expedientes y rendición de cuentas de los{' '}
                <strong style={{ color: '#fff' }}>57 diputados</strong> del período <strong style={{ color: '#fff' }}>2026-2030</strong>.
              </p>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href="https://www.asamblea.go.cr" target="_blank" rel="noopener noreferrer" style={{
                  background: '#dc2626', color: '#fff', textDecoration: 'none',
                  padding: '11px 22px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 6px 20px rgba(220,38,38,0.4)',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>
                  Ver transmisión en vivo
                </a>
                <Link href="/asamblea/votaciones" style={{
                  background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.22)',
                  padding: '11px 20px', borderRadius: 999, fontSize: 13, fontWeight: 500,
                  backdropFilter: 'blur(8px)', display: 'inline-flex', alignItems: 'center', gap: 8,
                }}>
                  Ver historial de votaciones →
                </Link>
              </div>
            </div>

            {/* Columna derecha: stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                {
                  label: 'DIPUTADOS',
                  value: 57,
                  sub: 'en el plenario',
                },
                {
                  label: 'EXPEDIENTES',
                  value: resumen?.expedientes ?? '—',
                  sub: 'en trámite',
                },
              ].map((s: any, i: number) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: 14, padding: '18px 16px',
                  backdropFilter: 'blur(8px)',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>
                    {s.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-lora), Georgia, serif',
                    fontSize: s.valSize ?? 38, fontWeight: 500, lineHeight: 1,
                    color: s.valColor ?? '#fff', marginBottom: 8,
                  }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.35 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Subnav sticky ──────────────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 54, gap: 12 }}>
          <div style={{ display: 'flex', gap: 2, overflowX: 'auto', scrollbarWidth: 'none' as const }}>
            {[
              { href: '/asamblea',             label: 'Dashboard',   active: true },
              { href: '/asamblea/diputados',   label: 'Diputados',   badge: '57' },
              { href: '/asamblea/votaciones',  label: 'Votaciones' },
              { href: '/asamblea/expedientes', label: 'Expedientes' },
              { href: '/asamblea/comisiones',  label: 'Comisiones' },
              { href: '/asamblea/actas',       label: 'Actas' },
              { href: '/asamblea/en-vivo',     label: 'En Vivo' },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{
                padding: '7px 13px', fontSize: 13,
                fontWeight: ('active' in item && item.active) ? 600 : 500,
                color: ('active' in item && item.active) ? '#fff' : '#555',
                textDecoration: 'none',
                background: ('active' in item && item.active) ? '#0000A2' : 'transparent',
                borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
                whiteSpace: 'nowrap' as const, flexShrink: 0,
                transition: 'all 0.15s',
              }}>
                {item.label}
                {'badge' in item && item.badge && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
                    background: '#e0e7ff', color: '#0000A2',
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'mlPulse 2s infinite' }} />
            <span style={{ fontSize: 10, color: '#666', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', whiteSpace: 'nowrap' as const }}>
              ACTIVO
            </span>
          </div>
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
                Coloreado por fracción parlamentaria
              </p>
            </div>
            <Link href="/asamblea/diputados" style={{ fontSize: 12, color: '#0a73ce', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Ver todos →
            </Link>
          </div>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            {diputados.length > 0 ? (
              <HemicicloClient diputados={diputados} />
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: '#aaa', fontSize: 14 }}>
                ⏳ Cargando datos de diputados...
              </div>
            )}
          </div>
        </div>

        {/* ── Panel Última Hora (tiempo real) ───────────────────────────────────── */}
        <div style={{ marginTop: 20 }}>
          <UltimaHoraAsamblea />
        </div>

        {/* ── Ranking: Diputados — Directorio ──────────────────────────────────── */}
        {diputados.length > 0 && (
          <div style={{ marginTop: 20, background: 'white', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-lora), serif', fontSize: 16, fontWeight: 800, color: '#0000A2', margin: 0 }}>
                Diputados — Directorio
              </h2>
              <Link href="/asamblea/diputados" style={{ fontSize: 12, color: '#0a73ce', fontWeight: 600, textDecoration: 'none' }}>
                Ver todos →
              </Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#94a3b8', letterSpacing: '0.10em' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600 }}>#</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600 }}>DIPUTADO</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600 }}>FRACCIÓN</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600 }}>PROVINCIA</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600 }}>PERFIL</th>
                  </tr>
                </thead>
                <tbody>
                  {(diputados as any[]).slice(0, 12).map((d: any, i: number) => {
                    const color = partidoColor(d.fraccion);
                    const partes: string[] = (d.nombre_completo || '').split(' ');
                    const nombreCorto = partes.length >= 3 ? partes.slice(0, 2).join(' ') : d.nombre_completo;
                    return (
                      <tr key={d.slug} style={{ borderTop: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                        <td style={{ padding: '11px 16px', fontFamily: 'var(--font-lora), serif', fontSize: 18, fontWeight: 500, color: '#0a73ce', letterSpacing: '-0.01em' }}>
                          {i + 1}
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${color}44`, background: `${color}22` }}>
                              {d.foto_url
                                ? <img src={fotoDiputadoUrl(d.foto_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color, fontWeight: 800 }}>
                                    {partes[0]?.[0]}{partes[1]?.[0]}
                                  </div>
                              }
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{nombreCorto}</span>
                          </div>
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`, padding: '3px 8px', borderRadius: 4 }}>
                            {(d.fraccion || d.partido || '').replace(/^Partido /, '').slice(0, 22)}
                          </span>
                        </td>
                        <td style={{ padding: '11px 16px', fontSize: 12, color: '#64748b' }}>
                          {d.provincia || '—'}
                        </td>
                        <td style={{ padding: '11px 16px', textAlign: 'right' }}>
                          <Link href={`/asamblea/${d.slug}`} style={{ fontSize: 12, color: '#0000A2', fontWeight: 600, textDecoration: 'none', padding: '5px 12px', background: '#e0e7ff', borderRadius: 6 }}>
                            Ver →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {diputados.length > 12 && (
              <div style={{ padding: '12px 20px', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
                <Link href="/asamblea/diputados" style={{ fontSize: 12, color: '#0a73ce', fontWeight: 600, textDecoration: 'none' }}>
                  Ver los {diputados.length} diputados →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Diputados: Comisiones ─────────────────────────────────────────────── */}
        {gruposFraccion.length > 0 && (
          <div style={{ marginTop: 20, background: 'white', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5' }}>
              <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 16, fontWeight: 800, color: '#0000A2', margin: 0 }}>
                Diputados — Comisiones
              </h2>
            </div>
            <div style={{ padding: '16px 20px' }}>
              {gruposFraccion.map(({ fraccion, color, dips }) => (
                <div key={fraccion} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 6, borderBottom: `2px solid ${color}22` }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color }}>{fraccion}</span>
                    <span style={{ fontSize: 11, color: '#aaa', fontWeight: 500 }}>{dips.length} diputados</span>
                  </div>
                  <div className="dips-grid">
                    {dips.map((d: any) => {
                      const comisiones: string[] = d.comisiones
                        ? d.comisiones.split(/[,;|\n]/).map((c: string) => c.trim()).filter(Boolean)
                        : [];
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
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ marginBottom: 3 }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                                  {nombreCorto}
                                </span>
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
            <strong>Cerebro Activo:</strong> El sistema monitorea expedientes cada 30 min
            y el canal de Telegram en tiempo real. Cambios en perfiles de diputados se detectan cada lunes.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes mlPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .ml-live-dot {
          width: 6px; height: 6px; background: #fff; border-radius: 50%;
          display: inline-block; animation: mlPulse 1.4s infinite;
        }
        .ml-hero-2col {
          display: grid; grid-template-columns: 1fr 440px;
          gap: 44px; align-items: center;
        }
        .dips-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        @media (max-width: 1100px) {
          .dips-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .ml-hero-2col { grid-template-columns: 1fr !important; gap: 24px !important; }
          .ml-hero-2col > div:last-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 860px) {
          .dips-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .dips-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
