'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { fotoDiputadoUrl } from '@/lib/diputado-foto';

interface Diputado {
  id: number;
  slug: string;
  nombre_completo: string;
  partido: string;
  fraccion: string;
  provincia: string;
  foto_url?: string;
  cargo?: string;
  asistencia_porcentaje?: number | null;
  gasto_gasolina_promedio?: number;
}

interface Props {
  diputados: Diputado[];
  promedioGasolina: number;
  promedioAsistencia: number;
}

const COLORES: Record<string, string> = {
  'PLN':    '#00AA44',
  'PUSC':   '#6366F1',
  'FUERZA': '#EF4444',
  'FA':     '#DC2626',
  'PNG':    '#0EA5E9',
  'PLP':    '#7C3AED',
  'PNP':    '#F97316',
  'PRN':    '#1D4ED8',
  'DEFAULT':'#64748B',
};
function getColor(fraccion: string): string {
  const k = Object.keys(COLORES).find(k => fraccion?.toUpperCase().includes(k));
  return k ? COLORES[k] : COLORES.DEFAULT;
}

const PROVINCIAS = ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'];

export default function DiputadosClient({ diputados, promedioGasolina, promedioAsistencia }: Props) {
  const [provincia, setProvincia] = useState('');
  const [fraccion, setFraccion]   = useState('');
  const [search, setSearch]       = useState('');

  // Fracciones ordenadas por tamaño (mayor a menor)
  const fracciones = useMemo(() => {
    const counts = diputados.reduce((acc, d) => {
      if (d.fraccion) acc[d.fraccion] = (acc[d.fraccion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([f]) => f);
  }, [diputados]);

  // Aplicar filtros
  const filtrados = useMemo(() => {
    return diputados.filter(d => {
      if (provincia && d.provincia !== provincia) return false;
      if (fraccion  && d.fraccion  !== fraccion)  return false;
      if (search) {
        const q = search.toLowerCase();
        return d.nombre_completo.toLowerCase().includes(q) ||
               d.partido?.toLowerCase().includes(q) ||
               d.fraccion?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [diputados, provincia, fraccion, search]);

  // Agrupar por fracción (respetando orden por tamaño)
  const grupos = useMemo(() => {
    const grupos: { fraccion: string; diputados: Diputado[] }[] = [];
    for (const f of fracciones) {
      const miembros = filtrados.filter(d => d.fraccion === f);
      if (miembros.length > 0) grupos.push({ fraccion: f, diputados: miembros });
    }
    // Diputados sin fracción
    const sinFraccion = filtrados.filter(d => !d.fraccion);
    if (sinFraccion.length > 0) grupos.push({ fraccion: 'Sin fracción', diputados: sinFraccion });
    return grupos;
  }, [filtrados, fracciones]);

  return (
    <div>
      {/* Filtros rápidos */}
      <div style={{ background: 'white', borderRadius: 10, padding: '12px 14px', marginBottom: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
        {/* Búsqueda */}
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 14 }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar diputado, partido..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '8px 10px 8px 32px',
              border: '1px solid #e2e8f0', borderRadius: 8,
              fontSize: 13, outline: 'none', boxSizing: 'border-box',
              color: '#333',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 16 }}>×</button>
          )}
        </div>

        {/* Filtro provincia */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#999', alignSelf: 'center', marginRight: 2, textTransform: 'uppercase' }}>Provincia:</span>
          <button onClick={() => setProvincia('')} style={{
            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            border: '1px solid #e2e8f0', cursor: 'pointer',
            background: !provincia ? '#0000A2' : 'white',
            color: !provincia ? 'white' : '#555',
          }}>Todas</button>
          {PROVINCIAS.map(p => (
            <button key={p} onClick={() => setProvincia(prev => prev === p ? '' : p)} style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
              border: '1px solid #e2e8f0', cursor: 'pointer',
              background: provincia === p ? '#0000A2' : 'white',
              color: provincia === p ? 'white' : '#555',
            }}>{p}</button>
          ))}
        </div>

        {/* Filtro fracción */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#999', alignSelf: 'center', marginRight: 2, textTransform: 'uppercase' }}>Fracción:</span>
          <button onClick={() => setFraccion('')} style={{
            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            border: '1px solid #e2e8f0', cursor: 'pointer',
            background: !fraccion ? '#0000A2' : 'white',
            color: !fraccion ? 'white' : '#555',
          }}>Todas</button>
          {fracciones.map(f => (
            <button key={f} onClick={() => setFraccion(prev => prev === f ? '' : f)} style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
              cursor: 'pointer',
              border: `1px solid ${getColor(f)}`,
              background: fraccion === f ? getColor(f) : getColor(f) + '15',
              color: fraccion === f ? 'white' : getColor(f),
            }}>
              {f} ({diputados.filter(d => d.fraccion === f).length})
            </button>
          ))}
        </div>

        {/* Contador de resultados */}
        <div style={{ marginTop: 8, fontSize: 11, color: '#999' }}>
          {filtrados.length === diputados.length
            ? `${diputados.length} diputados`
            : `${filtrados.length} de ${diputados.length} diputados`}
        </div>
      </div>

      {/* Grupos por fracción */}
      {grupos.length === 0
        ? <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
            <p>No hay diputados con los filtros seleccionados.</p>
          </div>
        : grupos.map(({ fraccion: f, diputados: miembros }) => (
          <div key={f} style={{ marginBottom: 24 }}>
            {/* Encabezado de fracción */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
              borderLeft: `4px solid ${getColor(f)}`, paddingLeft: 12,
            }}>
              <span style={{
                fontFamily: 'var(--font-Lora), serif',
                fontSize: 16, fontWeight: 900, color: '#111',
              }}>{f}</span>
              <span style={{
                fontSize: 12, color: getColor(f), fontWeight: 700,
                background: getColor(f) + '18', padding: '1px 8px', borderRadius: 10,
              }}>{miembros.length} escaños</span>
            </div>

            {/* Grid de diputados */}
            <div className="diputados-grid">
              {miembros.map(d => {
                const sobreGasolina = promedioGasolina > 0 && d.gasto_gasolina_promedio != null
                  && d.gasto_gasolina_promedio > promedioGasolina * 1.1;
                const bajaAsistencia = d.asistencia_porcentaje != null
                  && d.asistencia_porcentaje < 70;
                return (
                  <Link key={d.id} href={`/asamblea/${d.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'white', borderRadius: 10, overflow: 'hidden',
                      boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
                      borderTop: `3px solid ${getColor(f)}`,
                      transition: 'box-shadow 0.15s',
                    }}>
                      {/* Foto */}
                      <div style={{ height: 120, background: getColor(f) + '12', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {d.foto_url
                          ? <img
                              src={fotoDiputadoUrl(d.foto_url)}
                              alt={d.nombre_completo}
                              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                              loading="lazy"
                              decoding="async"
                            />
                          : <span style={{ fontSize: 48 }}>👤</span>
                        }
                        {/* Badges de alerta */}
                        {(sobreGasolina || bajaAsistencia) && (
                          <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {sobreGasolina && (
                              <span style={{ background: '#FEE2E2', color: '#991B1B', fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 4 }}>
                                ⛽ +gasto
                              </span>
                            )}
                            {bajaAsistencia && (
                              <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 4 }}>
                                ⚠ ausente
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div style={{ padding: '9px 11px 10px' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#111', lineHeight: 1.3, marginBottom: 2 }}>
                          {d.nombre_completo}
                        </div>
                        <div style={{ fontSize: 10, color: '#999' }}>{d.provincia}</div>
                        {d.asistencia_porcentaje != null && (
                          <div style={{ marginTop: 5, height: 3, background: '#f0f0f0', borderRadius: 2 }}>
                            <div style={{
                              height: '100%', borderRadius: 2,
                              width: `${d.asistencia_porcentaje}%`,
                              background: d.asistencia_porcentaje >= 80 ? '#22c55e' : d.asistencia_porcentaje >= 60 ? '#f59e0b' : '#ef4444',
                            }} title={`Asistencia: ${d.asistencia_porcentaje}%`} />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))
      }

      <style>{`
        .diputados-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
          gap: 10px;
        }
        @media (max-width: 480px) {
          .diputados-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
