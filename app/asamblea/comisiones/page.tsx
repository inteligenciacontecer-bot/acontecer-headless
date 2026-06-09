import type { Metadata } from 'next';
import Link from 'next/link';
import { fotoDiputadoUrl } from '@/lib/diputado-foto';

export const metadata: Metadata = {
  title: 'Comisiones Legislativas — Asamblea de Costa Rica',
  description: 'Composición de las comisiones permanentes y especiales de la Asamblea Legislativa de Costa Rica: presidencia, secretaría y diputados miembros de cada comisión.',
  alternates: { canonical: 'https://acontecer.co.cr/asamblea/comisiones' },
  openGraph: { url: 'https://acontecer.co.cr/asamblea/comisiones' },
};

export const revalidate = 3600;

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
  return '#94A3B8';
}

interface Miembro {
  diputado_id: number; nombre_completo: string; slug: string;
  foto_url: string; fraccion: string; provincia: string; rol: string;
}
interface Comision { comision: string; tipo: string; slug: string; miembros: Miembro[]; }

async function getComisiones(): Promise<Comision[]> {
  try {
    const r = await fetch(`${API}/comisiones`, { next: { revalidate: 3600 } });
    if (!r.ok) return [];
    const d = await r.json();
    return Array.isArray(d.comisiones) ? d.comisiones : [];
  } catch { return []; }
}

const ROL_LABEL: Record<string, string> = { presidente: 'Presidencia', secretario: 'Secretaría' };

export default async function ComisionesPage() {
  const comisiones = await getComisiones();
  const hayDatos = comisiones.length > 0;
  const totalDiputados = new Set(
    comisiones.flatMap((c) => c.miembros.map((m) => m.diputado_id))
  ).size;

  comisiones.sort((a, b) => {
    const aPerm = a.comision.toLowerCase().includes('permanente');
    const bPerm = b.comision.toLowerCase().includes('permanente');
    if (aPerm && !bPerm) return -1;
    if (!aPerm && bPerm) return 1;
    return a.comision.localeCompare(b.comision, 'es');
  });

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(150deg, #00007a 0%, #0000C8 60%, #0a73ce 100%)', padding: '28px 16px 22px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{width:28,height:28,flexShrink:0}}>
              <path d="M3 22V10M12 22V10M21 22V10M1 10h22M12 2L1 10h22L12 2z"/>
            </svg>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>
                Monitor Legislativo
              </div>
              <h1 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 'clamp(20px,5vw,32px)', fontWeight: 900, color: 'white', margin: 0 }}>
                Comisiones Legislativas
              </h1>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0, maxWidth: 560 }}>
            Composición de las comisiones permanentes y especiales de la Asamblea Legislativa de Costa Rica — período 2026–2030. Presidencia y secretaría de cada comisión señaladas.
          </p>
        </div>
      </div>

      {/* ── Navbar ────────────────────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderBottom: '2px solid #f0f0f0', overflowX: 'auto', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', padding: '0 8px' }}>
          {[
            { href: '/asamblea',             label: 'Dashboard',   active: false },
            { href: '/asamblea/diputados',   label: 'Diputados',   active: false },
            { href: '/asamblea/comisiones',  label: 'Comisiones',  active: true  },
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

      {/* ── Contenido ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '20px 16px 56px' }}>
        {!hayDatos ? (
          <div style={{ background: 'white', borderRadius: 16, padding: '48px 24px', textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
            <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 20, fontWeight: 800, color: '#0000A2', margin: '0 0 10px' }}>
              Sincronizando datos de comisiones
            </h2>
            <p style={{ color: '#64748b', fontSize: 14, maxWidth: 420, margin: '0 auto 20px' }}>
              Los datos de comisiones están siendo sincronizados desde la Asamblea Legislativa.
            </p>
            <Link href="/asamblea" style={{ background: '#0000A2', color: 'white', padding: '10px 20px', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              ← Volver al Dashboard
            </Link>
          </div>
        ) : (
          <>
            {/* Resumen */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ background: 'white', borderRadius: 12, padding: '12px 20px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#0000A2" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}>
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <div>
                  <div style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 24, fontWeight: 900, color: '#0000A2', lineHeight: 1 }}>{comisiones.length}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>Comisiones activas</div>
                </div>
              </div>
              <div style={{ background: 'white', borderRadius: 12, padding: '12px 20px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#0000A2" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22}}>
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                <div>
                  <div style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 24, fontWeight: 900, color: '#0000A2', lineHeight: 1 }}>{totalDiputados}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>Diputados con curul en comisión</div>
                </div>
              </div>
            </div>

            {/* Lista de comisiones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {comisiones.map((com) => (
                <div key={com.comision} style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                  {/* Cabecera */}
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid #f5f5f5', background: '#f8f9ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <Link href={com.slug ? `/asamblea/comisiones/${com.slug}` : '#'} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', minWidth: 0 }}>
                      <div style={{ width: 3, height: 28, background: '#0000A2', borderRadius: 2, flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 15, fontWeight: 800, color: '#0000A2', margin: 0, lineHeight: 1.3, display: 'flex', alignItems: 'center', gap: 6 }}>
                          {com.comision}
                          <svg viewBox="0 0 24 24" fill="none" stroke="#0a73ce" strokeWidth={2.4} style={{ width: 14, height: 14, flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
                        </h2>
                        {com.tipo && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#059669', background: '#dcfce7', padding: '1px 6px', borderRadius: 8 }}>
                            {com.tipo.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </Link>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: 20, flexShrink: 0 }}>
                      {com.miembros.length} {com.miembros.length === 1 ? 'miembro' : 'miembros'}
                    </span>
                  </div>

                  {/* Grid de miembros */}
                  <div className="com-grid" style={{ padding: '14px 16px' }}>
                    {com.miembros.map((d) => {
                      const color = partidoColor(d.fraccion);
                      const partes: string[] = (d.nombre_completo || '').split(' ');
                      const nombreCorto = partes.length >= 3 ? `${partes[0]} ${partes[1]}` : d.nombre_completo;
                      const esDirectiva = d.rol === 'presidente' || d.rol === 'secretario';
                      const rolColor = d.rol === 'presidente' ? '#b45309' : '#1d4ed8';
                      const rolBg = d.rol === 'presidente' ? '#fef3c7' : '#dbeafe';
                      return (
                        <Link key={`${com.comision}-${d.diputado_id}`} href={`/asamblea/${d.slug}`} style={{ textDecoration: 'none' }}>
                          <div style={{
                            display: 'flex', gap: 10, padding: '8px 10px', borderRadius: 10,
                            border: esDirectiva ? `1.5px solid ${rolColor}66` : `1px solid ${color}22`,
                            background: esDirectiva ? `${rolBg}` : `${color}07`,
                            alignItems: 'center', cursor: 'pointer',
                          }}>
                            <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${color}55`, background: `${color}33`, position: 'relative' }}>
                              {d.foto_url
                                ? <img src={fotoDiputadoUrl(d.foto_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color, fontWeight: 800 }}>
                                    {partes[0]?.[0]}{partes[1]?.[0]}
                                  </div>}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {nombreCorto}
                              </div>
                              {esDirectiva ? (
                                <div style={{ fontSize: 9.5, color: rolColor, fontWeight: 800, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: 3 }}>
                                  {d.rol === 'presidente' && (
                                    <svg viewBox="0 0 24 24" fill={rolColor} style={{ width: 10, height: 10 }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                  )}
                                  {ROL_LABEL[d.rol]}
                                </div>
                              ) : (
                                <div style={{ fontSize: 10, color, fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {(d.fraccion || '').split(' ').filter((w: string, i: number) => i < 2 || w.length > 3).join(' ')}
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
          </>
        )}
      </div>

      <style>{`
        .com-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        @media (max-width: 1000px) { .com-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 700px)  { .com-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 400px)  { .com-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
