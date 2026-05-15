'use client';

import { useEffect, useRef } from 'react';

interface Props {
  url: string;   // path relativo, ej: /nacionales/titulo-de-la-nota
  title: string; // título limpio (sin HTML)
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function ArticleScrollTracker({ url, title }: Props) {
  const fired = useRef(false);

  useEffect(() => {
    // El elemento sentinel es el div inmediatamente después de este componente.
    // Usamos el padre como target del observer.
    const sentinel = document.querySelector(`[data-tracker-url="${CSS.escape(url)}"]`);
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;

          // 1. Actualizar URL en la barra del navegador sin navegar
          window.history.replaceState({ url }, '', url);

          // 2. Disparar pageview en GA4
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'page_view', {
              page_path: url,
              page_title: title,
              page_location: window.location.origin + url,
            });
          }
        }
      },
      {
        // Dispara cuando el 30 % del artículo es visible
        threshold: 0.15,
        // Margen negativo: espera a que el artículo esté bien entrado en pantalla
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [url, title]);

  // Marcador invisible que sirve como target del IntersectionObserver
  return <div data-tracker-url={url} style={{ height: 0, visibility: 'hidden', pointerEvents: 'none' }} />;
}
