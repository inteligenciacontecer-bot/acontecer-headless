'use client';

import { useState } from 'react';

interface Combustible {
  nombre: string;
  precio: number;
}

const nf = new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 });

/**
 * Calculadora de combustible: litros × precio del tipo seleccionado.
 * Captura búsquedas tipo "cuánto cuesta llenar el tanque" / "X litros de gasolina".
 */
export default function CalculadoraCombustible({ combustibles }: { combustibles: Combustible[] }) {
  const [sel, setSel] = useState(0);
  const [litros, setLitros] = useState('40');

  const precio = combustibles[sel]?.precio ?? 0;
  const n = parseFloat(litros.replace(',', '.'));
  const total = Number.isFinite(n) ? Math.round(n * precio) : 0;

  return (
    <div className="cb-calc">
      <div className="cb-calc-head">
        <h2 className="cb-calc-title">¿Cuánto cuesta llenar el tanque?</h2>
        <div className="cb-calc-modes" role="tablist" aria-label="Tipo de combustible">
          {combustibles.map((c, i) => (
            <button
              key={c.nombre}
              type="button"
              role="tab"
              aria-selected={sel === i}
              className={`cb-mode ${sel === i ? 'is-on' : ''}`}
              onClick={() => setSel(i)}
            >
              {c.nombre.replace('Gasolina ', '')}
            </button>
          ))}
        </div>
      </div>

      <div className="cb-calc-body">
        <div className="cb-field">
          <label htmlFor="cb-litros" className="cb-field-lbl">Litros</label>
          <div className="cb-field-box">
            <input
              id="cb-litros"
              className="cb-input"
              inputMode="decimal"
              type="text"
              value={litros}
              onChange={(e) => setLitros(e.target.value)}
              aria-label="Cantidad de litros"
            />
            <span className="cb-field-unit">L</span>
          </div>
          <div className="cb-presets">
            {[10, 20, 40].map((p) => (
              <button key={p} type="button" className="cb-preset" onClick={() => setLitros(String(p))}>{p} L</button>
            ))}
          </div>
        </div>

        <div className="cb-calc-result">
          <span className="cb-calc-result-lbl">Total aproximado</span>
          <span className="cb-calc-result-val">₡{nf.format(total)}</span>
        </div>
      </div>

      <p className="cb-calc-note">
        Cálculo a ₡{nf.format(precio)} por litro de <strong>{combustibles[sel]?.nombre}</strong>. Precio al consumidor de referencia; el monto final depende de la estación.
      </p>
    </div>
  );
}
