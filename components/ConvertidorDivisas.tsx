'use client';

import { useState } from 'react';

interface Props {
  compra: number;
  venta: number;
}

const nf = new Intl.NumberFormat('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Convertidor dólar ⇄ colón en vivo.
 * - Campos enlazados bidireccionales (editar uno recalcula el otro).
 * - Toggle Comprar (tipo venta) / Vender (tipo compra) — usa la tarifa correcta.
 * Captura búsquedas tipo "cuánto son 100 dólares en colones".
 */
export default function ConvertidorDivisas({ compra, venta }: Props) {
  const [modo, setModo] = useState<'venta' | 'compra'>('venta');
  const rate = modo === 'venta' ? venta : compra;

  const [usd, setUsd] = useState('1');
  const [crc, setCrc] = useState((1 * venta).toFixed(2));

  const parse = (v: string) => parseFloat(v.replace(/\s/g, '').replace(',', '.'));

  const onUsd = (v: string) => {
    setUsd(v);
    const n = parse(v);
    setCrc(Number.isFinite(n) ? (n * rate).toFixed(2) : '');
  };
  const onCrc = (v: string) => {
    setCrc(v);
    const n = parse(v);
    setUsd(Number.isFinite(n) ? (n / rate).toFixed(2) : '');
  };
  const cambiarModo = (m: 'venta' | 'compra') => {
    if (m === modo) return;
    setModo(m);
    const r = m === 'venta' ? venta : compra;
    const n = parse(usd);
    setCrc(Number.isFinite(n) ? (n * r).toFixed(2) : '');
  };

  return (
    <div className="tc-conv">
      <div className="tc-conv-head">
        <h2 className="tc-conv-title">Convertidor de dólares a colones</h2>
        <div className="tc-conv-modes" role="tablist" aria-label="Tipo de operación">
          <button
            type="button"
            role="tab"
            aria-selected={modo === 'venta'}
            className={`tc-mode ${modo === 'venta' ? 'is-on' : ''}`}
            onClick={() => cambiarModo('venta')}
          >
            Comprar dólares
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={modo === 'compra'}
            className={`tc-mode ${modo === 'compra' ? 'is-on' : ''}`}
            onClick={() => cambiarModo('compra')}
          >
            Vender dólares
          </button>
        </div>
      </div>

      <div className="tc-conv-fields">
        <div className="tc-field">
          <label htmlFor="tc-usd" className="tc-field-lbl">Dólares · USD</label>
          <div className="tc-field-box">
            <span className="tc-field-sym">$</span>
            <input
              id="tc-usd"
              className="tc-input"
              inputMode="decimal"
              type="text"
              value={usd}
              onChange={(e) => onUsd(e.target.value)}
              aria-label="Monto en dólares"
            />
          </div>
        </div>

        <div className="tc-conv-eq" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="7 4 3 8 7 12" />
            <line x1="3" y1="8" x2="21" y2="8" />
            <polyline points="17 12 21 16 17 20" />
            <line x1="21" y1="16" x2="3" y2="16" />
          </svg>
        </div>

        <div className="tc-field">
          <label htmlFor="tc-crc" className="tc-field-lbl">Colones · CRC</label>
          <div className="tc-field-box">
            <span className="tc-field-sym">₡</span>
            <input
              id="tc-crc"
              className="tc-input"
              inputMode="decimal"
              type="text"
              value={crc}
              onChange={(e) => onCrc(e.target.value)}
              aria-label="Monto en colones"
            />
          </div>
        </div>
      </div>

      <p className="tc-conv-note">
        Cálculo al tipo de <strong>{modo === 'venta' ? 'venta' : 'compra'}</strong> de referencia:{' '}
        <strong>₡{nf.format(rate)}</strong> por dólar. Los bancos y casas de cambio aplican su propio margen.
      </p>
    </div>
  );
}
