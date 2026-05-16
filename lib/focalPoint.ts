/**
 * focalPoint.ts
 * Detecta el sujeto principal de una imagen usando análisis de cuadrícula
 * con sharp (ya instalado por Next.js). Sin dependencias extra.
 *
 * Métrica por celda:
 *   - sharpness  (nitidez de Laplacian) → alto = sujeto en foco
 *   - entropy    (variación de píxeles)  → alto = área con detalle
 *   - stdev      (desviación estándar)   → complementario
 *
 * Resultado cacheado 7 días en el data-cache de Next.js.
 */

import { unstable_cache } from 'next/cache';

export interface FocalPoint { x: number; y: number }

// ─── Core analysis (runs server-side) ─────────────────────────────────────────

async function _analyze(imageUrl: string): Promise<FocalPoint> {
  // Fallback: ligeramente sobre el centro (típico en fotos de noticias)
  const FALLBACK: FocalPoint = { x: 50, y: 28 };

  try {
    // 1. Descargar imagen con timeout
    const res = await fetch(imageUrl, {
      signal: AbortSignal.timeout(9000),
      headers: { 'User-Agent': 'Acontecer/FocalDetect 1.0' },
    });
    if (!res.ok) return FALLBACK;
    const buf = Buffer.from(await res.arrayBuffer());

    // 2. Obtener dimensiones
    const sharp = (await import('sharp')).default;
    const meta  = await sharp(buf).metadata();
    const W = meta.width  ?? 800;
    const H = meta.height ?? 600;

    // 3. Grid 3×3 — analizar cada celda en paralelo
    const COLS = 3, ROWS = 3;
    const cW = Math.floor(W / COLS);
    const cH = Math.floor(H / ROWS);

    type Cell = { row: number; col: number; score: number };

    const cells: Cell[] = await Promise.all(
      Array.from({ length: ROWS }, (_, row) =>
        Array.from({ length: COLS }, (_, col) =>
          sharp(buf)
            .extract({ left: col * cW, top: row * cH, width: cW, height: cH })
            .greyscale()
            .stats()
            .then((s) => {
              const stdev    = s.channels[0]?.stdev  ?? 0;
              const entropy  = s.entropy             ?? 0;
              const sharp_   = (s as { sharpness?: number }).sharpness ?? 0;
              // Nitidez (foco) pesa más — identifica sujeto vs fondo borroso
              const score = sharp_ * 80 + entropy * 18 + stdev * 0.35;
              return { row, col, score };
            })
        )
      ).flat()
    );

    // 4. Celda con mayor puntuación
    const best = cells.reduce((a, b) => (b.score > a.score ? b : a));

    return {
      x: Math.round(((best.col + 0.5) / COLS) * 100),
      y: Math.round(((best.row + 0.5) / ROWS) * 100),
    };
  } catch {
    return FALLBACK;
  }
}

// ─── Cached export (7 días) ────────────────────────────────────────────────────

export const getFocalPoint = unstable_cache(
  _analyze,
  ['fp-v1'],
  { revalidate: 60 * 60 * 24 * 7 },
);
