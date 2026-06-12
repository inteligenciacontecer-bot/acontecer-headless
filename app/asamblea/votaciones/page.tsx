import Link from 'next/link';
import type { Metadata } from 'next';
import VotacionesClient from './VotacionesClient';

export const metadata: Metadata = {
  title: 'Votaciones del Plenario — Asamblea Legislativa de Costa Rica',
  description: 'Registro de todas las votaciones del Plenario de la Asamblea Legislativa de Costa Rica. Resultados, diputados y proyectos de ley.',
  alternates: { canonical: 'https://acontecer.co.cr/asamblea/votaciones' },
  openGraph: { url: 'https://acontecer.co.cr/asamblea/votaciones', images: [{ url: 'https://acontecer.co.cr/wp-content/uploads/2026/06/VOTACIONES-DEL-PLENARIO.webp', alt: 'Votaciones del Plenario Asamblea Legislativa Costa Rica' }] },
};

const API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';

async function getVotaciones() {
  try {
    const r = await fetch(`${API}/votaciones?per_page=200`, { next: { revalidate: 30 } });
    return r.ok ? r.json() : [];
  } catch { return []; }
}

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Votaciones del Plenario — Asamblea de Costa Rica',
  description: 'Registro de votaciones del Plenario Legislativo de Costa Rica, resultados y seguimiento de decisiones legislativas.',
  alternates: { canonical: 'https://acontecer.co.cr/asamblea/votaciones' },
  openGraph: {
    url: 'https://acontecer.co.cr/asamblea/votaciones',
    title: 'Votaciones del Plenario — Asamblea de Costa Rica',
    description: 'Registro de votaciones del Plenario Legislativo de Costa Rica, resultados y seguimiento de decisiones legislativas.',
    images: [{ url: 'https://acontecer.co.cr/asamblea/votaciones/opengraph-image', width: 1200, height: 630, alt: 'Votaciones del Plenario' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Votaciones del Plenario — Asamblea de Costa Rica',
    description: 'Resultados y seguimiento de votaciones legislativas.',
    images: ['https://acontecer.co.cr/asamblea/votaciones/opengraph-image'],
  },
};

export default async function VotacionesPage() {
  const votaciones = await getVotaciones();

  return (
    <>
      <div style={{ background: 'linear-gradient(135deg, #00007a, #0000A2)', padding: '28px 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/asamblea" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, textDecoration: 'none' }}>
            ← Monitor Legislativo
          </Link>
          <h1 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 'clamp(20px,5vw,30px)', fontWeight: 900, color: 'white', marginTop: 6, marginBottom: 4 }}>
            🗳️ Votaciones del Plenario
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: 0 }}>
            {votaciones.length > 0 ? `${votaciones.length} votaciones registradas` : 'Actualizado en tiempo real'}
          </p>
        </div>
      </div>

      {/* Navbar */}
      <div style={{ background: 'white', borderBottom: '1px solid #eee', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', padding: '0 8px' }}>
          {[
            { href: '/asamblea',             label: 'Dashboard'   },
            { href: '/asamblea/diputados',   label: 'Diputados'   },
            { href: '/asamblea/comisiones',  label: 'Comisiones'  },
            { href: '/asamblea/votaciones',  label: 'Votaciones', active: true },
            { href: '/asamblea/expedientes', label: 'Expedientes' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              padding: '11px 12px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
              color: item.active ? '#0000A2' : '#666', textDecoration: 'none',
              borderBottom: item.active ? '3px solid #0000A2' : '3px solid transparent',
              flexShrink: 0,
            }}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px' }}>
        <VotacionesClient votaciones={votaciones} />
      </div>
    </>
  );
}
