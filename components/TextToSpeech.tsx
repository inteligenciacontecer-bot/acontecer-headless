'use client';
import { useState, useRef } from 'react';

interface Props {
  slug: string;
  readingTime?: number;
}

export default function TextToSpeech({ slug, readingTime }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Sin verificación previa — el botón siempre se muestra

  const handlePlay = async () => {
    if (state === 'playing') {
      audioRef.current?.pause();
      setState('paused');
      return;
    }
    if (state === 'paused') {
      audioRef.current?.play();
      setState('playing');
      return;
    }
    if (state === 'loading') return;

    setState('loading');
    try {
      const audio = new Audio(`/api/tts?slug=${encodeURIComponent(slug)}`);
      audioRef.current = audio;

      audio.addEventListener('timeupdate', () => {
        if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
      });
      audio.addEventListener('ended', () => { setState('idle'); setProgress(0); });
      audio.addEventListener('error', () => setState('error'));
      audio.addEventListener('canplaythrough', () => setState('playing'));

      await audio.play();
      setState('playing');
    } catch {
      setState('error');
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setState('idle');
    setProgress(0);
  };

  const isActive = state === 'playing' || state === 'paused' || state === 'loading';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: isActive ? '#f0f4ff' : '#f8f9fa',
      border: `1px solid ${isActive ? '#c7d5ff' : '#e9ecef'}`,
      borderRadius: 10, padding: '10px 14px',
      marginBottom: 20, transition: 'all 0.2s',
    }}>
      {/* Botón play/pause */}
      <button
        onClick={handlePlay}
        disabled={state === 'loading'}
        style={{
          width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: state === 'loading' ? 'wait' : 'pointer',
          background: '#0000A2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'background 0.15s',
        }}
        aria-label={state === 'playing' ? 'Pausar' : 'Escuchar nota'}
      >
        {state === 'loading' ? (
          <svg viewBox="0 0 24 24" style={{width:16,height:16,animation:'spin 1s linear infinite'}}>
            <circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="3" strokeDasharray="30 60"/>
          </svg>
        ) : state === 'playing' ? (
          <svg viewBox="0 0 24 24" fill="white" style={{width:14,height:14}}>
            <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="white" style={{width:14,height:14,marginLeft:2}}>
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        )}
      </button>

      {/* Info + barra de progreso */}
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:12, fontWeight:600, color: isActive ? '#0000A2' : '#555', marginBottom: isActive ? 4 : 0}}>
          {state === 'loading' ? 'Generando audio…' :
           state === 'error'   ? 'Error al generar audio' :
           state === 'playing' ? 'Reproduciendo' :
           state === 'paused'  ? 'En pausa' :
           'Escuchar esta nota'}
        </div>
        {readingTime && state === 'idle' && (
          <div style={{fontSize:11, color:'#888'}}>{readingTime} min de lectura</div>
        )}
        {isActive && (
          <div style={{height:3, background:'#dde3f0', borderRadius:2, overflow:'hidden'}}>
            <div style={{height:'100%', width:`${progress}%`, background:'#0000A2', borderRadius:2, transition:'width 0.5s'}}/>
          </div>
        )}
      </div>

      {/* Botón stop (solo cuando activo) */}
      {isActive && (
        <button
          onClick={handleStop}
          style={{width:30,height:30,borderRadius:'50%',border:'none',cursor:'pointer',background:'#e9ecef',color:'#555',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
          aria-label="Detener"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" style={{width:10,height:10}}>
            <rect x="4" y="4" width="16" height="16" rx="2"/>
          </svg>
        </button>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
