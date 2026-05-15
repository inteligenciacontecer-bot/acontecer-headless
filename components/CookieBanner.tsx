'use client';
import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Solo mostrar si no ha dado consentimiento antes
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem('cookie_consent', 'granted');
    // Actualizar Consent Mode v2 con consentimiento completo
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
      });
    }
    setVisible(false);
  }

  function reject() {
    localStorage.setItem('cookie_consent', 'denied');
    // Solo analytics básico, sin publicidad ni personalización
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted', // medición anónima permitida
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
      });
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: '#0000A2',
      color: 'white',
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
      boxShadow: '0 -2px 16px rgba(0,0,0,0.2)',
      fontSize: '13px',
      lineHeight: 1.5,
    }}>
      <p style={{ margin: 0, maxWidth: '680px', opacity: 0.92 }}>
        Usamos cookies para analizar el tráfico y mejorar tu experiencia.{' '}
        <a href="/privacidad" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'underline' }}>
          Política de privacidad
        </a>
      </p>
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <button
          onClick={reject}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.4)',
            color: 'rgba(255,255,255,0.85)',
            padding: '7px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
          }}
        >
          Solo esenciales
        </button>
        <button
          onClick={accept}
          style={{
            background: 'white',
            border: 'none',
            color: '#0000A2',
            padding: '7px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '700',
          }}
        >
          Aceptar todo
        </button>
      </div>
    </div>
  );
}
