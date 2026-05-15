'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function YoutubeEmbed({ id, title }: { id: string; title: string }) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
        title={title}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      onClick={() => setActive(true)}
      aria-label={`Reproducir: ${title}`}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', cursor: 'pointer', padding: 0, background: '#000' }}
    >
      <Image
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt={title}
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 768px) 100vw, 400px"
      />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 68, height: 48, background: '#ff0000', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
          <svg viewBox="0 0 24 24" width={28} height={28} fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
