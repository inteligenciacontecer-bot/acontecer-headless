import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fotoDiputadoUrl } from '@/lib/diputado-foto';

const API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';

interface Prop { nombre_completo: string; slug: string; foto_url: string; fraccion: string; partido: string; }
interface Exp { numero: string; titulo: string; estado: string; tipo: string; comision: string; proponente: string; fecha_presentacion: string; fecha_agenda: string; explicacion: string; }
interface Detalle { expediente: Exp; proponentes: Prop[]; }

async function getExp(numero: string): Promise<Detalle | null> {
  try {
    const r = await fetch(`${API}/expedientes/${numero}`, { next: { revalidate: 3600 } });
    return r.ok ? r.json() : null;
  } catch { return null; }
}

export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() { return []; }

export async function generateMetadata({ params }: { params: Promise<{ numero: string }> }): Promise<Metadata> {
  const { numero } = await params;
  const d = await getExp(numero);
  if (!d) return { title: `Expediente ${numero} — Acontecer.co.cr` };
  const t = d.expediente.titulo || `Expediente ${numero}`;
  const titulo = `Expediente ${numero}: ${t.slice(0, 85)} | Acontecer.co.cr`;
  const desc = (d.expediente.explicacion
    ? d.expediente.explicacion
    : `Proyecto de ley N.° ${numero} de la Asamblea Legislativa de Costa Rica: ${t.slice(0, 150)}.`).slice(0, 200);
  const url = `https://acontecer.co.cr/asamblea/expedientes/${numero}`;
  return {
    title: titulo,
    description: desc,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title: `Expediente ${numero} — ${t.slice(0, 70)}`, description: desc, siteName: 'Acontecer.co.cr', images: [{ url: 'https://acontecer.co.cr/asamblea/opengraph-image', width: 1200, height: 630, alt: 'Monitor Legislativo — Acontecer.co.cr' }] },
    twitter: { card: 'summary_large_image', title: `Expediente ${numero}`, description: desc, images: ['https://acontecer.co.cr/asamblea/opengraph-image'] },
  };
}

function estadoColor(e = ''): [string, string] {
  const up = e.toUpperCase();
  if (up.includes('APROBA')) return ['#dcfce7', '#15803d'];
  if (up.includes('RECHAZ') || up.includes('ARCHIV') || up.includes('DESEST')) return ['#fee2e2', '#991b1b'];
  if (up.includes('COMISI')) return ['#fef9c3', '#854d0e'];
  if (up.includes('DEBATE')) return ['#e0f2fe', '#0369a1'];
  return ['#e0e7ff', '#3730a3'];
}

export default async function ExpedientePage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const d = await getExp(numero);
  if (!d) notFound();
  const e = d.expediente;
  const [eb, ef] = estadoColor(e.estado);
  const fechaP = e.fecha_presentacion ? new Date(e.fecha_presentacion + 'T12:00:00').toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  const schema = {
    '@context': 'https://schema.org', '@type': 'Legislation',
    legislationIdentifier: numero, name: e.titulo,
    legislationType: 'Proyecto de Ley',
    jurisdiction: 'Costa Rica',
    sponsor: d.proponentes.map((p) => ({ '@type': 'Person', name: p.nombre_completo })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div style={{ background: 'linear-gradient(150deg, #00007a 0%, #0000C8 60%, #0a73ce 100%)', padding: '22px 16px 20px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 12, flexWrap: 'wrap' }}>
            <Link href="/asamblea" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Monitor Legislativo</Link>
            <span>/</span>
            <Link href="/asamblea/expedientes" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Expedientes</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>N.° {numero}</span>
          </nav>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: '#fff', background: 'rgba(255,255,255,0.18)', padding: '3px 10px', borderRadius: 6 }}>Expediente N.° {numero}</span>
            {e.estado && <span style={{ fontSize: 11, fontWeight: 800, color: ef, background: eb, padding: '3px 10px', borderRadius: 6 }}>{e.estado}</span>}
          </div>
          <h1 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 'clamp(18px,4vw,26px)', fontWeight: 800, color: 'white', margin: 0, lineHeight: 1.3 }}>{e.titulo}</h1>
        </div>
      </div>

      <div style={{ background: '#f1f5f9', minHeight: '50vh' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '20px 16px 56px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Imagen destacada genérica del Monitor (temporal) */}
          <img src="/asamblea/opengraph-image" alt="Monitor Legislativo — Acontecer.co.cr"
            style={{ width: '100%', height: 'auto', aspectRatio: '1200 / 630', objectFit: 'cover', borderRadius: 16, boxShadow: '0 4px 18px rgba(0,0,0,0.10)', display: 'block', marginTop: -42, position: 'relative', zIndex: 2, border: '3px solid #fff' }} />

          {e.explicacion && (
            <section style={{ background: 'linear-gradient(135deg, #eef4ff 0%, #f8fbff 100%)', borderRadius: 16, boxShadow: '0 2px 16px rgba(10,115,206,0.10)', border: '1px solid #dbeafe', padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#0000A2,#0a73ce)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                </div>
                <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 17, fontWeight: 800, color: '#0000A2', margin: 0 }}>¿De qué trata?</h2>
              </div>
              <p style={{ fontSize: 15.5, lineHeight: 1.75, color: '#1e293b', margin: 0 }}>{e.explicacion}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, paddingTop: 12, borderTop: '1px solid #dbeafe' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.8} style={{ width: 12, height: 12, flexShrink: 0 }}><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5" /></svg>
                <span style={{ fontSize: 10.5, color: '#94a3b8' }}>Resumen generado con IA a partir de los datos oficiales de la Asamblea Legislativa.</span>
              </div>
            </section>
          )}

          <section style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 14px rgba(0,0,0,0.06)', padding: '18px' }}>
            <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>Información del proyecto</h2>
            <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px 12px', fontSize: 13.5, margin: 0 }}>
              {e.comision && (<><dt style={{ color: '#94a3b8', fontWeight: 600 }}>Comisión</dt><dd style={{ margin: 0, color: '#334155' }}>{e.comision}</dd></>)}
              {e.proponente && (<><dt style={{ color: '#94a3b8', fontWeight: 600 }}>Proponente</dt><dd style={{ margin: 0, color: '#334155' }}>{e.proponente}</dd></>)}
              {fechaP && (<><dt style={{ color: '#94a3b8', fontWeight: 600 }}>Presentado</dt><dd style={{ margin: 0, color: '#334155' }}>{fechaP}</dd></>)}
              <dt style={{ color: '#94a3b8', fontWeight: 600 }}>Estado</dt><dd style={{ margin: 0, color: '#334155' }}>{e.estado || '—'}</dd>
            </dl>
          </section>

          {d.proponentes.length > 0 && (
            <section style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 14px rgba(0,0,0,0.06)', padding: '18px' }}>
              <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>Diputados proponentes</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {d.proponentes.map((p) => {
                  const partes = (p.nombre_completo || '').split(' ');
                  return (
                    <Link key={p.slug} href={`/asamblea/${p.slug}`} style={{ display: 'flex', gap: 9, alignItems: 'center', textDecoration: 'none', background: '#f8fafc', border: '1px solid #eef2f7', borderRadius: 10, padding: '7px 12px 7px 7px' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#e2e8f0' }}>
                        {p.foto_url && <img src={fotoDiputadoUrl(p.foto_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />}
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{p.nombre_completo}</div>
                        <div style={{ fontSize: 10.5, color: '#64748b' }}>{(p.fraccion || p.partido || '').replace('Partido ', '').replace('Coalición ', '')}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <a href={`https://www.asamblea.go.cr/Centro_de_informacion/Consultas_SIL/SitePages/ConsultaProyectos.aspx`} target="_blank" rel="noopener" style={{ fontSize: 13, fontWeight: 700, color: '#0000A2', textDecoration: 'none' }}>
            Ver expediente oficial en la Asamblea Legislativa →
          </a>
          <Link href="/asamblea/expedientes" style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textDecoration: 'none' }}>← Todos los expedientes</Link>
        </div>
      </div>
    </>
  );
}
