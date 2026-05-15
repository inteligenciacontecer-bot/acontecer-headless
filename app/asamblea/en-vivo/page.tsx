import Link from 'next/link';

const API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';
const YOUTUBE_CHANNEL = 'https://www.youtube.com/@AsambleaCRC';

async function getSesiones() {
  try {
    const r = await fetch(
      `https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea/sesiones`,
      { next: { revalidate: 120 } }
    );
    return r.ok ? r.json() : [];
  } catch { return []; }
}

export const revalidate = 120;

export default async function EnVivoPage() {
  const sesiones = await getSesiones();
  const sesionLive = sesiones.find((s: any) => s.tipo === 'live');
  const grabaciones = sesiones.filter((s: any) => s.tipo !== 'live').slice(0, 6);

  return (
    <>
      <div style={{ background: 'linear-gradient(135deg, #7f1d1d, #dc2626)', padding: '30px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link href="/asamblea" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none' }}>← Monitor Legislativo</Link>
          <h1 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 28, fontWeight: 900, color: 'white', marginTop: 8, marginBottom: 4 }}>
            📺 Sesiones en Vivo
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0 }}>
            Canal oficial: <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener" style={{ color: 'white', fontWeight: 700 }}>@AsambleaCRC</a> en YouTube
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>

        {/* Player en vivo o placeholder */}
        <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: 24 }}>
          {sesionLive ? (
            <>
              <div style={{ background: '#dc2626', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: 'white', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>EN VIVO — {sesionLive.titulo}</span>
              </div>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={`https://www.youtube.com/embed/${sesionLive.youtube_id}?autoplay=0`}
                  title={sesionLive.titulo}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </>
          ) : (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📺</div>
              <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 22, color: '#333', marginBottom: 8 }}>
                No hay sesión en vivo ahora
              </h2>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>
                Las sesiones plenarias se realizan normalmente de lunes a jueves.<br />
                Cuando inicie una sesión, aparecerá aquí automáticamente.
              </p>
              <a href={`${YOUTUBE_CHANNEL}/live`} target="_blank" rel="noopener"
                style={{ background: '#dc2626', color: 'white', padding: '10px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>
                ▶ Ir al canal de YouTube
              </a>
            </div>
          )}
        </div>

        {/* Grabaciones recientes */}
        {grabaciones.length > 0 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-Lora), serif', fontSize: 20, color: '#0000A2', marginBottom: 16 }}>
              Sesiones Recientes
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
              {grabaciones.map((s: any) => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener"
                  style={{ textDecoration: 'none', background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'block' }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#111' }}>
                    {/* Thumbnail via yt-dlp no tiene imagen estática sin API, usamos genérico */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 52, height: 36, background: '#ff0000', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111', lineHeight: 1.4, marginBottom: 4 }}>
                      {s.titulo?.slice(0, 80)}
                    </div>
                    <div style={{ fontSize: 11, color: '#888' }}>
                      {s.fecha ? new Date(s.fecha).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </>
  );
}
