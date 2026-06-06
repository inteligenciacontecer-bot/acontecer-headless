'use client';

import { useState } from 'react';

export interface Moneda {
  code: string;     // ISO 4217: USD, EUR, CRC…
  nombre: string;   // Dólar estadounidense
  simbolo: string;  // $, €, ₡
  colones: number;  // cuántos colones vale 1 unidad de esta moneda
}

interface Props {
  monedas: Moneda[];
  /** code de la moneda origen por defecto */
  origen?: string;
  /** code de la moneda destino por defecto */
  destino?: string;
}

const nf = new Intl.NumberFormat('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Convertidor multi-moneda en vivo (colones, dólares, euros y +12 monedas).
 * Convierte vía colón: monto * colones[origen] / colones[destino].
 * Captura búsquedas tipo "colones a euros", "cuánto es un euro en colones",
 * "convertir dólares a euros", "100 euros en colones".
 */
export default function ConvertidorMonedas({ monedas, origen = 'USD', destino = 'CRC' }: Props) {
  const mapa = Object.fromEntries(monedas.map((m) => [m.code, m]));
  const [from, setFrom] = useState(origen);
  const [to, setTo] = useState(destino);
  const [monto, setMonto] = useState('1');

  const parse = (v: string) => parseFloat(v.replace(/\s/g, '').replace(',', '.'));

  const convertir = (cantidad: number, a: string, b: string): number => {
    const ca = mapa[a]?.colones, cb = mapa[b]?.colones;
    if (!ca || !cb) return 0;
    return (cantidad * ca) / cb;
  };

  const n = parse(monto);
  const resultado = Number.isFinite(n) ? convertir(n, from, to) : 0;

  const invertir = () => { setFrom(to); setTo(from); };

  const mFrom = mapa[from];
  const mTo = mapa[to];
  const unidad = mFrom && mTo ? convertir(1, from, to) : 0;

  return (
    <div className="tc-conv">
      <div className="tc-conv-head">
        <h2 className="tc-conv-title">Convertidor de monedas</h2>
        <p className="tc-conv-sub">Colones, dólares, euros y otras {monedas.length - 1} divisas</p>
      </div>

      <div className="tc-mc-row">
        <div className="tc-mc-field">
          <label htmlFor="tc-mc-monto" className="tc-field-lbl">Cantidad</label>
          <div className="tc-field-box">
            <span className="tc-field-sym">{mFrom?.simbolo}</span>
            <input
              id="tc-mc-monto"
              className="tc-input"
              inputMode="decimal"
              type="text"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              aria-label="Cantidad a convertir"
            />
          </div>
        </div>

        <div className="tc-mc-field">
          <label htmlFor="tc-mc-from" className="tc-field-lbl">De</label>
          <select
            id="tc-mc-from"
            className="tc-select"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            aria-label="Moneda de origen"
          >
            {monedas.map((m) => (
              <option key={m.code} value={m.code}>{m.code} · {m.nombre}</option>
            ))}
          </select>
        </div>

        <button type="button" className="tc-mc-swap" onClick={invertir} aria-label="Invertir monedas">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </button>

        <div className="tc-mc-field">
          <label htmlFor="tc-mc-to" className="tc-field-lbl">A</label>
          <select
            id="tc-mc-to"
            className="tc-select"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="Moneda de destino"
          >
            {monedas.map((m) => (
              <option key={m.code} value={m.code}>{m.code} · {m.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="tc-mc-result" aria-live="polite">
        <span className="tc-mc-result-from">
          {Number.isFinite(n) ? nf.format(n) : '0'} {from}
        </span>
        <span className="tc-mc-result-eq">=</span>
        <span className="tc-mc-result-to">
          {mTo?.simbolo}{nf.format(resultado)} <span className="tc-mc-result-code">{to}</span>
        </span>
      </div>

      {mFrom && mTo && (
        <p className="tc-conv-note">
          1 {mFrom.nombre} ({from}) = <strong>{nf.format(unidad)} {to}</strong>. Tipo de cambio de
          referencia; los bancos y casas de cambio aplican su propio margen.
        </p>
      )}
    </div>
  );
}
