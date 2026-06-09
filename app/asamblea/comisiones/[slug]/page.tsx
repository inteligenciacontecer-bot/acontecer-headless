import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fotoDiputadoUrl } from '@/lib/diputado-foto';

const API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';

const FRACCION_COLOR: Record<string, string> = {
  'Partido Pueblo Soberano': '#0EA5E9', 'Partido Liberación Nacional': '#00AA44',
  'Partido Frente Amplio': '#EAB308', 'Partido Unidad Social Cristiana': '#2563EB',
  'Partido Agenda Ciudadana': '#DC2626', 'Coalición Agenda Ciudadana': '#DC2626',
  'Partido Acción Ciudadana': '#10B981', 'Partido Nueva República': '#1D4ED8',
  'Partido Nacional Democrático': '#0EA5E9', 'Partido Liberal Progresista': '#7C3AED',
  'Fuerza Democrática': '#EF4444', 'Partido Restauración Nacional': '#1D4ED8',
};
function partidoColor(f = ''): string {
  if (!f) return '#94A3B8';
  if (FRACCION_COLOR[f]) return FRACCION_COLOR[f];
  const up = f.toUpperCase();
  if (up.includes('SOBERANO')) return '#0EA5E9';
  if (up.includes('LIBERACI')) return '#00AA44';
  if (up.includes('FRENTE AMP')) return '#EAB308';
  if (up.includes('CRISTIANA')) return '#2563EB';
  if (up.includes('AGENDA')) return '#DC2626';
  return '#94A3B8';
}

interface Miembro { rol: string; diputado_id: number; nombre_completo: string; slug: string; foto_url: string; fraccion: string; partido: string; provincia: string; }
interface Acta { titulo: string; resumen: string; fecha: string; url_archivo: string; }
interface Expediente { numero: string; titulo: string; estado: string; fecha_presentacion: string; }
interface Detalle { comision: string; slug: string; tipo: string; acta_url: string; miembros: Miembro[]; acta: Acta | null; expedientes: Expediente[]; }

async function getDetalle(slug: string): Promise<Detalle | null> {
  try { const r = await fetch(`${API}/comisiones/${slug}`, { next: { revalidate: 3600 } }); return r.ok ? r.json() : null; } catch { return null; }
}

export async function generateStaticParams() {
  try {
    const r = await fetch(`${API}/comisiones`, { cache: 'no-store' });
    const d = await r.json();
    return (d.comisiones || []).filter((c: any) => c.slug).map((c: any) => ({ slug: c.slug }));
  } catch { return []; }
}

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDetalle(slug);
  if (!d) return { title: 'Comisión Legislativa — Acontecer.co.cr' };
  const desc = `Integrantes, presidencia, secretaría y proyectos de ley de la ${d.comision} de la Asamblea Legislativa de Costa Rica, período 2026-2030.`;
  return {
    title: `${d.comision} — Miembros y Proyectos | Acontecer.co.cr`,
    description: desc,
    alternates: { canonical: `https://acontecer.co.cr/asamblea/comisiones/${slug}` },
    openGraph: { title: d.comision, description: desc, url: `https://acontecer.co.cr/asamblea/comisiones/${slug}`, type: 'website' },
  };
}

const ROL_LABEL: Record<string, string> = { presidente: 'Presidencia', secretario: 'Secretaría' };

function MiembroCard({ d }: { d: Miembro }) {
  const color = partidoColor(d.fraccion || d.partido);
  const partes = (d.nombre_completo || '').split(' ');
  const corto = partes.length >= 3 ? `${partes[0]} ${partes[1]}` : d.nombre_completo;
  const dir = d.rol === 'presidente' || d.rol === 'secretario';
  const rc = d.rol === 'presidente' ? '#b45309' : '#1d4ed8';
  const rb = d.rol === 'presidente' ? '#fef3c7' : '#dbeafe';
  return (
    <Link href={`/asamblea/${d.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{ display: 'flex', gap: 10, padding: '8px 10px', borderRadius: 10, border: dir ? `1.5px solid ${rc}66` : `1px solid ${color}22`, background: dir ? rb : `${color}07`, alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${color}55`, background: `${color}33` }}>
          {d.foto_url
            ? <img src={fotoDiputadoUrl(d.foto_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color, fontWeight: 800 }}>{partes[0]?.[0]}{partes[1]?.[0]}</div>}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{corto}</div>
          {dir
            ? <div style={{ fontSize: 9.5, color: rc, fontWeight: 800, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.03em' }}>★ {ROL_LABEL[d.rol]}</div>
            : <div style={{ fontSize: 10, color, fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{(d.fraccion || d.partido || '').replace('Partido ', '').replace('Coalición ', '')}</div>}
        </div>
      </div>
    </Link>
  );
}

export default async function ComisionDetalle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getDetalle(slug);
  if (!d) notFound();

  const fechaActa = d.acta?.fecha ? new Date(d.acta.fecha + 'T12:00:00').toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  const schema = {
    '@context': 'https://schema.org', '@type': 'GovernmentOrganization',
    name: d.comision, parentOrganization: { '@type': 'GovernmentOrganization', name: 'Asamblea Legislativa de Costa Rica' },
    member: d.miembros.map((m) => ({ '@type': 'Person', name: m.nombre_completo, url: `https://acontecer.co.cr/asamblea/${m.slug}` })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* Hero */}
      <div style={{ background: 'linear-gradient(150deg, #00007a 0%, #0000C8 60%, #0a73ce 100%)', padding: '24px 16px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 12, flexWrap: 'wrap' }}>
            <Link href="/asamblea" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Monitor Legislativo</Link>
            <span>/</span>
            <Link href="/asamblea/comisiones" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Comisiones</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>{d.comision}</span>
          </nav>
          {d.tipo && <span style={{ fontSize: 10, fontWeight: 800, color: '#bbf7d0', background: 'rgba(5,150,105,0.35)', padding: '3px 9px', borderRadius: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{d.tipo}</span>}
          <h1 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 'clamp(20px,4.5vw,30px)', fontWeight: 900, color: 'white', margin: '10px 0 6px', lineHeight: 1.2 }}>{d.comision}</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>{d.miembros.length} diputados integran esta comisión · Asamblea Legislativa 2026–2030</p>
        </div>
      </div>

      <div style={{ background: '#f1f5f9', minHeight: '50vh' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 16px 56px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Miembros */}
          <section style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 14px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 18, background: '#0000A2', borderRadius: 2 }} />
              <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Integrantes</h2>
            </div>
            <div className="cd-grid" style={{ padding: '14px 16px' }}>
              {d.miembros.map((m) => <MiembroCard key={m.diputado_id} d={m} />)}
            </div>
          </section>

          {/* Expedientes */}
          <section style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 14px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 18, background: '#0000A2', borderRadius: 2 }} />
              <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0, flex: 1 }}>Proyectos asignados a esta comisión</h2>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 10, background: d.expedientes.length ? '#e0e7ff' : '#f1f5f9', color: d.expedientes.length ? '#0000A2' : '#94a3b8' }}>{d.expedientes.length || '—'}</span>
            </div>
            {d.expedientes.length === 0
              ? <p style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: 13, margin: 0 }}>Aún no hay proyectos de ley registrados con asignación a esta comisión.</p>
              : <div>
                  {d.expedientes.map((e, i) => (
                    <div key={e.numero} style={{ padding: '12px 18px', borderBottom: i < d.expedientes.length - 1 ? '1px solid #f1f5f9' : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#0000A2', background: '#e0e7ff', padding: '2px 7px', borderRadius: 4, flexShrink: 0, marginTop: 1 }}>Exp. {e.numero}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>{(e.titulo || '').slice(0, 160)}</div>
                        {e.estado && <span style={{ fontSize: 10.5, color: '#64748b' }}>{e.estado}</span>}
                      </div>
                    </div>
                  ))}
                </div>}
          </section>

          {/* Acta de instalación */}
          {d.acta && (d.acta.resumen || d.acta.url_archivo) && (
            <section style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 14px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 3, height: 18, background: '#0000A2', borderRadius: 2 }} />
                <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Acta de instalación</h2>
              </div>
              <div style={{ padding: '16px 18px' }}>
                {fechaActa && <div style={{ fontSize: 11.5, color: '#94a3b8', marginBottom: 8 }}>Instalada el {fechaActa}</div>}
                {d.acta.resumen && <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.7, margin: '0 0 14px' }}>{d.acta.resumen}</p>}
                {(d.acta.url_archivo || d.acta_url) && (
                  <a href={d.acta.url_archivo || d.acta_url} target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 700, color: '#0000A2', textDecoration: 'none', background: '#eef2ff', padding: '8px 14px', borderRadius: 9 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 14, height: 14 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                    Ver acta oficial (PDF)
                  </a>
                )}
              </div>
            </section>
          )}

          <Link href="/asamblea/comisiones" style={{ fontSize: 13, fontWeight: 700, color: '#0000A2', textDecoration: 'none' }}>← Todas las comisiones</Link>
        </div>
      </div>

      <style>{`
        .cd-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; }
        @media (max-width: 760px) { .cd-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 420px) { .cd-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
