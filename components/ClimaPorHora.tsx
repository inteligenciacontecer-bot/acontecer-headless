'use client';

import { useState } from 'react';

interface Hora { hora: string; temp: number; icon: string; lluvia: number; }
interface Ciudad { nombre: string; horas: Hora[]; }

/**
 * Pronóstico por hora con selector de provincia.
 * Captura búsquedas tipo "clima por hora [provincia]" / "pronóstico por hora Costa Rica".
 */
export default function ClimaPorHora({ ciudades }: { ciudades: Ciudad[] }) {
  const [sel, setSel] = useState(0);
  const c = ciudades[sel];
  if (!c) return null;

  return (
    <div className="cl-hourly">
      <div className="cl-hourly-tabs" role="tablist" aria-label="Provincia">
        {ciudades.map((ci, i) => (
          <button
            key={ci.nombre}
            type="button"
            role="tab"
            aria-selected={sel === i}
            className={`cl-hourly-tab ${sel === i ? 'is-on' : ''}`}
            onClick={() => setSel(i)}
          >
            {ci.nombre}
          </button>
        ))}
      </div>

      <div className="cl-hourly-strip">
        {c.horas.map((h, i) => (
          <div key={i} className="cl-hour">
            <span className="cl-hour-time">{h.hora}</span>
            <span className="cl-hour-icon" aria-hidden="true">{h.icon}</span>
            <span className="cl-hour-temp">{h.temp}°</span>
            <span className="cl-hour-rain">💧 {h.lluvia}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
