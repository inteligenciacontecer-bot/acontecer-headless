'use client';
import { useState, useEffect } from 'react';

const API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';
const SECRET = process.env.NEXT_PUBLIC_ASAMBLEA_SECRET || 'changeme';

interface Votacion {
  id: number;
  titulo: string;
  fecha: string;
  resultado: string;
  votos_si: number;
  votos_no: number;
}

interface ResultadoCarga {
  ok: boolean;
  votacion_id: number;
  parseados: number;
  guardados: number;
  sin_match: string[];
}

export default function CargarVotosPage() {
  const [votaciones, setVotaciones] = useState<Votacion[]>([]);
  const [votacionId, setVotacionId] = useState('');
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState('');
  const [cargando, setCargando] = useState(false);
  const [respuesta, setRespuesta] = useState<ResultadoCarga | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/votaciones?per_page=50`)
      .then(r => r.json())
      .then(data => setVotaciones(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  async function handleEnviar() {
    if (!votacionId || !texto.trim()) {
      setError('Seleccioná una votación y pegá el texto');
      return;
    }
    setCargando(true);
    setError('');
    setRespuesta(null);
    try {
      const res = await fetch(`${API}/votaciones/${votacionId}/cargar-votos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Asamblea-Secret': SECRET,
        },
        body: JSON.stringify({ texto, resultado }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Error del servidor');
      setRespuesta(data);
      if (data.guardados > 0) setTexto('');
    } catch (e: any) {
      setError(e.message || 'Error al enviar');
    } finally {
      setCargando(false);
    }
  }

  const PLACEHOLDER = `Pegá el texto en cualquier formato. Ejemplos:

--- Formato con secciones ---
A FAVOR (32):
Juan Carlos Mendoza Oreamuno
María Fernanda Pérez Castro
...

EN CONTRA (18):
Carlos López Rodríguez
...

AUSENTES:
Ana Sofía Jiménez Mora

--- Formato con dos puntos ---
Mendoza Oreamuno: SÍ
Pérez Castro: NO
López Rodríguez: ABSTENCIÓN

--- Texto libre del Acta ---
Los diputados que votaron a favor fueron: Mendoza, Pérez, López...`;

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <a href="/asamblea" style={{ color: '#0a73ce', fontSize: '13px' }}>← Volver al Monitor</a>
      </div>

      <h1 style={{ fontFamily: 'var(--font-lora), Georgia, serif', fontSize: '28px', color: '#0000A2', marginBottom: '8px' }}>
        Cargar votos individuales
      </h1>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>
        Pegá el texto de la votación (del acta oficial, de Telegram o de cualquier fuente) y el sistema
        identificará automáticamente cómo votó cada diputado y lo guardará en el mapa de curules.
      </p>

      {/* Selector de votación */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#333', marginBottom: '6px' }}>
          1. Seleccioná la votación
        </label>
        <select
          value={votacionId}
          onChange={e => setVotacionId(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', background: 'white' }}
        >
          <option value="">-- Elegir votación --</option>
          {votaciones.map(v => (
            <option key={v.id} value={v.id}>
              #{v.id} — {v.titulo?.slice(0, 80)} {v.fecha ? `(${v.fecha.slice(0,10)})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Resultado */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#333', marginBottom: '6px' }}>
          2. Resultado de la votación (opcional)
        </label>
        <select
          value={resultado}
          onChange={e => setResultado(e.target.value)}
          style={{ width: '200px', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', background: 'white' }}
        >
          <option value="">Sin cambiar</option>
          <option value="APROBADO">APROBADO</option>
          <option value="RECHAZADO">RECHAZADO</option>
          <option value="VOTACION">VOTACIÓN (sin resultado)</option>
        </select>
      </div>

      {/* Área de texto */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#333', marginBottom: '6px' }}>
          3. Pegá el texto de la votación
        </label>
        <textarea
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={18}
          style={{
            width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px',
            fontSize: '13px', fontFamily: 'monospace', lineHeight: '1.6', resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
          El sistema acepta cualquier formato: por secciones (A FAVOR / EN CONTRA / AUSENTES),
          con dos puntos (NOMBRE: SÍ), o texto libre del acta.
        </div>
      </div>

      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffcdd2', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#c62828', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={handleEnviar}
        disabled={cargando || !votacionId || !texto.trim()}
        style={{
          background: cargando ? '#999' : '#0000A2',
          color: 'white', padding: '12px 28px', borderRadius: '8px',
          border: 'none', fontWeight: '700', fontSize: '15px',
          cursor: cargando || !votacionId || !texto.trim() ? 'not-allowed' : 'pointer',
          marginBottom: '24px',
        }}
      >
        {cargando ? 'Procesando...' : 'Cargar votos'}
      </button>

      {respuesta && (
        <div style={{ background: '#f0fff4', border: '1px solid #c8e6c9', borderRadius: '12px', padding: '20px 24px' }}>
          <div style={{ fontWeight: '700', color: '#2e7d32', fontSize: '16px', marginBottom: '12px' }}>
            ✅ Votos cargados correctamente
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'white', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#0000A2' }}>{respuesta.parseados}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Nombres detectados</div>
            </div>
            <div style={{ background: 'white', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#2e7d32' }}>{respuesta.guardados}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Diputados guardados</div>
            </div>
            <div style={{ background: 'white', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: respuesta.sin_match.length > 0 ? '#e65100' : '#999' }}>
                {respuesta.sin_match.length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Sin coincidencia</div>
            </div>
          </div>

          {respuesta.sin_match.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#e65100', marginBottom: '6px' }}>
                Nombres que no se pudieron identificar:
              </div>
              <div style={{ background: 'white', borderRadius: '6px', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', color: '#555', lineHeight: '1.8' }}>
                {respuesta.sin_match.join('\n')}
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>
                Revisá la ortografía o agregá estos nombres manualmente.
              </div>
            </div>
          )}

          <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
            <a
              href={`/asamblea/votaciones`}
              style={{ background: '#0000A2', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}
            >
              Ver mapa de votaciones
            </a>
            <button
              onClick={() => { setRespuesta(null); setTexto(''); }}
              style={{ background: 'white', color: '#0000A2', border: '1px solid #0000A2', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              Cargar otra votación
            </button>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div style={{ marginTop: '32px', background: '#f8f9ff', borderRadius: '12px', padding: '20px 24px', border: '1px solid #e8f0fe' }}>
        <div style={{ fontWeight: '700', color: '#0000A2', marginBottom: '12px', fontSize: '14px' }}>
          ¿De dónde puedo sacar el texto?
        </div>
        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#555', lineHeight: '2' }}>
          <li><strong>Telegram (Prensa Asamblea):</strong> Cuando publican el resultado de una votación, copiá el mensaje completo</li>
          <li><strong>Actas del Plenario:</strong> Buscá en <a href="https://www.asamblea.go.cr" target="_blank" rel="noopener" style={{ color: '#0a73ce' }}>asamblea.go.cr</a> el acta de la sesión y copiá la sección de votación</li>
          <li><strong>PDFs oficiales:</strong> Abrí el PDF en el navegador, seleccioná el texto de los nombres y pegalo acá</li>
          <li><strong>Cualquier formato:</strong> El sistema identifica nombres aunque estén en listas, con guiones, numerados, etc.</li>
        </ul>
      </div>
    </div>
  );
}
