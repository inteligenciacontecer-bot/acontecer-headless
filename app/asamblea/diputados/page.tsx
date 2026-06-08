import type { Metadata } from 'next';
import Link from 'next/link';
import DiputadosClient from '@/components/DiputadosClient';

export const metadata: Metadata = {
  title: 'Diputados de Costa Rica 2026-2030',
  description: 'Directorio completo de los 57 diputados de la Asamblea Legislativa de Costa Rica 2026-2030. Perfiles, fracciones, asistencia y gastos.',
  alternates: { canonical: 'https://acontecer.co.cr/asamblea/diputados' },
  openGraph: {
    url: 'https://acontecer.co.cr/asamblea/diputados',
    title: 'Diputados de Costa Rica 2026-2030',
    description: 'Directorio completo de los 57 diputados de la Asamblea Legislativa de Costa Rica 2026-2030. Perfiles, fracciones, asistencia y gastos.',
    images: [{ url: 'https://acontecer.co.cr/asamblea/diputados/opengraph-image', width: 1200, height: 630, alt: 'Diputados de Costa Rica 2026-2030' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diputados de Costa Rica 2026-2030',
    description: 'Directorio completo de diputados, fracciones, asistencia y gastos.',
    images: ['https://acontecer.co.cr/asamblea/diputados/opengraph-image'],
  },
};

const API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';

async function getDiputados() {
  try {
    const r = await fetch(`${API}/diputados`, { next: { revalidate: 3600 } });
    return r.ok ? r.json() : [];
  } catch { return []; }
}

async function getPromedios() {
  try {
    const r = await fetch(`${API}/promedios`, { next: { revalidate: 3600 } });
    return r.ok ? r.json() : {};
  } catch { return {}; }
}

export default async function DiputadosPage() {
  const [diputados, promedios] = await Promise.all([getDiputados(), getPromedios()]);

  return (
    <>
      <div style={{ background: 'linear-gradient(135deg, #00007a, #0000A2)', padding: '28px 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/asamblea" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, textDecoration: 'none' }}>
            ← Monitor Legislativo
          </Link>
          <h1 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 'clamp(20px,5vw,30px)', fontWeight: 900, color: 'white', marginTop: 6, marginBottom: 4 }}>
            👤 Diputados
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: 0 }}>
            {diputados.length} legisladores · Asamblea Legislativa 2026–2030 · Agrupados por fracción
          </p>
        </div>
      </div>

      {/* Navbar */}
      <div style={{ background: 'white', borderBottom: '1px solid #eee', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', padding: '0 8px' }}>
          {[
            { href: '/asamblea',             label: 'Dashboard'   },
            { href: '/asamblea/diputados',   label: 'Diputados',   active: true },
            { href: '/asamblea/comisiones',  label: 'Comisiones'  },
            { href: '/asamblea/votaciones',  label: 'Votaciones'  },
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

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
        {diputados.length === 0
          ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
              <p>Los datos de diputados se están cargando por primera vez.</p>
            </div>
          )
          : (
            <DiputadosClient
              diputados={diputados}
              promedioGasolina={promedios.gasolina_6m ?? 0}
              promedioAsistencia={promedios.asistencia ?? 0}
            />
          )
        }
      </div>
    </>
  );
}
