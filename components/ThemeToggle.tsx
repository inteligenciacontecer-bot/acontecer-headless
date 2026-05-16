'use client';

import { useEffect, useState } from 'react';

/**
 * ThemeToggle — botón sol/luna para activar dark mode en el cuerpo del artículo.
 * - Persiste preferencia en localStorage
 * - NO respeta prefers-color-scheme del sistema (solo el botón controla)
 * - El script anti-FOUC en layout.tsx aplica data-theme ANTES del primer paint
 * - Se renderiza solo en cliente (mounted check) para evitar hydration mismatch
 */
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = (typeof window !== 'undefined') ? localStorage.getItem('theme') : null;
    setIsDark(stored === 'dark');
  }, []);

  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    if (next === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try { localStorage.setItem('theme', next); } catch {}
    setIsDark(!isDark);
  };

  if (!mounted) {
    // Placeholder con mismas dimensiones para evitar layout shift
    return <span className="nv2-theme-toggle-placeholder" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="nv2-theme-toggle"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-pressed={isDark}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? (
        // Sol (modo actual = dark, click cambia a light)
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }} aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Luna (modo actual = light, click cambia a dark)
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }} aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
      <span>{isDark ? 'Claro' : 'Oscuro'}</span>
    </button>
  );
}
