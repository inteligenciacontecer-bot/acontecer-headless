'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Diputado {
  id: number;
  slug: string;
  nombre_completo: string;
  nombre_corto?: string;
  partido?: string;
  fraccion?: string;
  provincia?: string;
  foto_url?: string;
  curule_num?: number | string;
  fila_curule?: number | string;
  voto?: string; // SI | NO | ABSTENCION | AUSENTE (viene inline desde /mapa)
}

interface Props {
  diputados: Diputado[];
  votoActual?: Record<string, string>; // slug → 'si'|'no'|... (fallback si no hay voto inline)
}

// Mapa de color por nombre completo de fracción (2026-2030)
const FRACCION_COLOR: Record<string, string> = {
  'Partido Pueblo Soberano':          '#0EA5E9',  // PPS — celeste
  'Partido Liberación Nacional':      '#00AA44',  // PLN — verde
  'Partido Frente Amplio':            '#EAB308',  // FA  — amarillo
  'Partido Unidad Social Cristiana':  '#2563EB',  // PUSC — azul
  'Partido Agenda Ciudadana':         '#DC2626',  // PAC — rojo
  'Coalición Agenda Ciudadana':       '#DC2626',  // CAC — rojo
  'Partido Acción Ciudadana':         '#10B981',  // PAC alt
  'Partido Nueva República':          '#1D4ED8',  // PRN — azul
  'Partido Nacional Democrático':     '#0EA5E9',  // PNG — celeste
  'Partido Liberal Progresista':      '#7C3AED',  // PLP — violeta
  'Fuerza Democrática':               '#EF4444',  // FUERZA — naranja-rojo
  'Partido Restauración Nacional':    '#1D4ED8',  // PRN — azul
};

function getPartidoColor(fraccion = ''): string {
  if (!fraccion) return '#94A3B8';
  // Intento exacto primero
  if (FRACCION_COLOR[fraccion]) return FRACCION_COLOR[fraccion];
  // Coincidencia parcial por palabras clave
  const up = fraccion.toUpperCase();
  if (up.includes('SOBERANO'))   return '#0EA5E9';
  if (up.includes('LIBERACI'))   return '#00AA44';
  if (up.includes('FRENTE AMP')) return '#EAB308';
  if (up.includes('CRISTIANA'))  return '#2563EB';
  if (up.includes('AGENDA'))     return '#DC2626';
  if (up.includes('NUEVA REP'))  return '#1D4ED8';
  if (up.includes('DEMOCR'))     return '#EF4444';
  if (up.includes('RESTAURAC'))  return '#1D4ED8';
  if (up.includes('PLN'))        return '#00AA44';
  if (up.includes('PUSC'))       return '#2563EB';
  if (up.includes(' FA') || up === 'FA') return '#EAB308';
  return '#94A3B8';
}

const VOTO_META: Record<string, { color: string; label: string; icon: string }> = {
  si:         { color: '#22c55e', label: 'Votó a favor',    icon: '✓' },
  SI:         { color: '#22c55e', label: 'Votó a favor',    icon: '✓' },
  no:         { color: '#ef4444', label: 'Votó en contra',  icon: '✗' },
  NO:         { color: '#ef4444', label: 'Votó en contra',  icon: '✗' },
  abs:        { color: '#f59e0b', label: 'Se abstuvo',      icon: '○' },
  abstencion: { color: '#f59e0b', label: 'Se abstuvo',      icon: '○' },
  ABSTENCION: { color: '#f59e0b', label: 'Se abstuvo',      icon: '○' },
  ausente:    { color: '#94a3b8', label: 'Ausente',         icon: '—' },
  AUSENTE:    { color: '#94a3b8', label: 'Ausente',         icon: '—' },
};

function votoColor(voto: string | undefined, fraccion: string): string {
  if (voto && VOTO_META[voto]) return VOTO_META[voto].color;
  return getPartidoColor(fraccion);
}

function calcularPosiciones(): { x: number; y: number }[] {
  const rows = [
    { n: 8,  r: 122 },
    { n: 10, r: 158 },
    { n: 12, r: 194 },
    { n: 13, r: 230 },
    { n: 14, r: 266 },
  ];
  const cx = 300, cy = 308;
  const positions: { x: number; y: number }[] = [];
  for (const { n, r } of rows) {
    for (let i = 0; i < n; i++) {
      const deg = n === 1 ? 90 : 15 + (i / (n - 1)) * 150;
      const rad = (deg * Math.PI) / 180;
      positions.push({
        x: Math.round(cx + r * Math.cos(Math.PI - rad)),
        y: Math.round(cy - r * Math.sin(rad)),
      });
    }
  }
  return positions;
}

const POSICIONES = calcularPosiciones();

export default function Hemiciclo({ diputados, votoActual }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const router = useRouter();

  // Ordenar por curule_num cuando está disponible; si no, por fracción
  const hasCuruleNum = diputados.some(d => d.curule_num != null);
  const ordenados = [...diputados].sort((a, b) => {
    if (hasCuruleNum) {
      return (Number(a.curule_num) || 99) - (Number(b.curule_num) || 99);
    }
    return (a.fraccion || 'Z').localeCompare(b.fraccion || 'Z');
  });

  const handleEnter = useCallback((i: number) => setActive(i), []);
  const handleLeave = useCallback(() => setActive(null), []);
  const handleTap   = useCallback((slug: string, i: number) => {
    if (active === i) router.push(`/asamblea/${slug}`);
    else setActive(i);
  }, [active, router]);

  // Conteo de votos para leyenda — usa voto inline cuando está disponible
  const conteo = (() => {
    const hasInlineVotos = ordenados.some(d => d.voto);
    const src = hasInlineVotos
      ? ordenados.reduce((acc, d) => { if (d.voto) { const k = d.voto.toLowerCase(); acc[k] = (acc[k] || 0) + 1; } return acc; }, {} as Record<string, number>)
      : votoActual
        ? Object.values(votoActual).reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {} as Record<string, number>)
        : null;
    return src;
  })();

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', paddingBottom: `${(320 / 600) * 100}%` }}>

        {/* Arco SVG */}
        <svg
          viewBox="0 0 600 320"
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          {/* Arcos de filas */}
          {[122, 158, 194, 230, 266].map(r => (
            <path key={r}
              d={`M ${300 - r * Math.sin(15 * Math.PI / 180)} ${308 - r * Math.cos(15 * Math.PI / 180)} A ${r} ${r} 0 0 1 ${300 + r * Math.sin(15 * Math.PI / 180)} ${308 - r * Math.cos(15 * Math.PI / 180)}`}
              fill="none" stroke="#f1f5f9" strokeWidth="1.5"
            />
          ))}
          {/* Podio presidencia */}
          <rect x="264" y="292" width="72" height="22" rx="6" fill="#0000A2" />
          <text x="300" y="307" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">
            PRESIDENCIA
          </text>
          {/* Línea base */}
          <line x1="30" y1="308" x2="570" y2="308" stroke="#e2e8f0" strokeWidth="1" />
        </svg>

        {/* Curules */}
        {POSICIONES.map((pos, i) => {
          const d = ordenados[i];
          // voto inline (del endpoint /mapa) tiene prioridad sobre votoActual externo
          const voto = d ? (d.voto || votoActual?.[d.slug]) : undefined;
          const color = d ? votoColor(voto, d.fraccion || '') : '#e2e8f0';
          const isActive = active === i;
          const hasFoto = !!d?.foto_url;

          return (
            <div
              key={i}
              onClick={() => d && handleTap(d.slug, i)}
              onMouseEnter={() => d && handleEnter(i)}
              onMouseLeave={handleLeave}
              aria-label={d?.nombre_completo}
              style={{
                position: 'absolute',
                left: `${(pos.x / 600) * 100}%`,
                top:  `${(pos.y / 320) * 100}%`,
                transform: `translate(-50%, -50%) scale(${isActive ? 1.35 : 1})`,
                width: '4.0%',
                aspectRatio: '1',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `2.5px solid ${color}`,
                background: hasFoto ? '#e2e8f0' : color,
                cursor: d ? 'pointer' : 'default',
                zIndex: isActive ? 20 : 1,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                boxShadow: isActive ? `0 0 0 3px ${color}55, 0 4px 12px rgba(0,0,0,0.2)` : '0 1px 3px rgba(0,0,0,0.1)',
                flexShrink: 0,
              }}
            >
              {d && (hasFoto ? (
                <img
                  src={d.foto_url!}
                  alt={d.nombre_completo}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
              ) : (
                <span style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '100%', height: '100%',
                  fontSize: '38%', color: 'white', fontWeight: 800, lineHeight: 1,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}>
                  {(d.nombre_corto || d.nombre_completo).split(' ').pop()?.slice(0, 3).toUpperCase()}
                </span>
              ))}

              {/* Indicador de voto en franja inferior */}
              {voto && VOTO_META[voto] && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: '34%',
                  background: VOTO_META[voto].color + 'dd',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '48%', color: 'white', fontWeight: 900,
                }}>
                  {VOTO_META[voto].icon}
                </div>
              )}
            </div>
          );
        })}

        {/* Tooltip enriquecido */}
        {active !== null && ordenados[active] && (() => {
          const d = ordenados[active];
          const voto = d.voto || votoActual?.[d.slug];
          const color = votoColor(voto, d.fraccion || '');
          const meta = voto ? VOTO_META[voto] : null;
          const pctX = (POSICIONES[active].x / 600) * 100;
          const pctY = (POSICIONES[active].y / 320) * 100;
          const flipLeft = pctX > 75;
          const flipTop  = pctY < 35;

          return (
            <div style={{
              position: 'absolute',
              top: flipTop ? `${pctY + 7}%` : `${Math.max(2, pctY - 38)}%`,
              left: flipLeft ? 'auto' : pctX < 22 ? '1%' : `${pctX - 14}%`,
              right: flipLeft ? '1%' : 'auto',
              background: 'white',
              borderRadius: 14,
              padding: '12px 14px',
              minWidth: 190,
              maxWidth: 240,
              boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
              border: `2px solid ${color}`,
              zIndex: 40,
              pointerEvents: 'none',
            }}>
              {/* Cabecera: foto + nombre + partido */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  overflow: 'hidden', border: `3px solid ${color}`,
                  background: color,
                }}>
                  {d.foto_url ? (
                    <img src={d.foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white', fontWeight: 800 }}>
                      {(d.nombre_corto || d.nombre_completo).split(' ').pop()?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 12.5, color: '#111', lineHeight: 1.3, marginBottom: 2 }}>
                    {d.nombre_completo}
                  </div>
                  <span style={{
                    display: 'inline-block', fontSize: 10, fontWeight: 700,
                    color: 'white', background: color,
                    padding: '1px 7px', borderRadius: 10,
                  }}>
                    {d.fraccion || d.partido}
                  </span>
                </div>
              </div>

              {/* Provincia */}
              <div style={{ fontSize: 11, color: '#888', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>📍</span> {d.provincia}
              </div>

              {/* Voto */}
              {meta ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: color + '18', borderRadius: 8, padding: '7px 10px',
                  marginBottom: 10,
                }}>
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{meta.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: color }}>{meta.label}</span>
                </div>
              ) : (
                <div style={{ fontSize: 11, color: '#bbb', marginBottom: 10, fontStyle: 'italic' }}>
                  Sin voto registrado
                </div>
              )}

              {/* CTA */}
              <button
                onClick={() => router.push(`/asamblea/${d.slug}`)}
                style={{
                  width: '100%', background: color, color: 'white', border: 'none',
                  borderRadius: 8, padding: '6px 12px',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  pointerEvents: 'all',
                }}
              >
                Ver perfil completo →
              </button>
            </div>
          );
        })()}
      </div>

      {/* ── Leyenda dinámica ───────────────────────────────────────────────────── */}
      <div style={{ marginTop: 14 }}>
        {conteo ? (
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', fontSize: 11, color: '#555' }}>
            {[
              { color: '#22c55e', label: 'A favor',    n: (conteo.si   || 0) + (conteo.SI   || 0) },
              { color: '#ef4444', label: 'En contra',  n: (conteo.no   || 0) + (conteo.NO   || 0) },
              { color: '#f59e0b', label: 'Abstención', n: (conteo.abs  || 0) + (conteo.abstencion || 0) + (conteo.ABSTENCION || 0) },
              { color: '#94a3b8', label: 'Ausente',    n: (conteo.ausente || 0) + (conteo.AUSENTE || 0) },
            ].map(({ color, label, n }) => n > 0 ? (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
                <span style={{ width: 10, height: 10, background: color, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                {label} <span style={{ color: '#999', fontWeight: 400 }}>({n})</span>
              </span>
            ) : null)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center' }}>
            {Object.entries(
              ordenados.reduce((acc, d) => {
                if (d.fraccion) acc[d.fraccion] = (acc[d.fraccion] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).sort((a, b) => b[1] - a[1]).map(([fraccion, count]) => (
              <span key={fraccion} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: getPartidoColor(fraccion) + '1a',
                border: `1px solid ${getPartidoColor(fraccion)}55`,
                borderRadius: 20, padding: '2px 8px',
                fontSize: 10.5, fontWeight: 700, color: getPartidoColor(fraccion),
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: getPartidoColor(fraccion), flexShrink: 0 }} />
                {fraccion} ({count})
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
