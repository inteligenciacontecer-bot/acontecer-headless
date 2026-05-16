'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface HeroSlide {
  id: number;
  href: string;
  title: string;
  catName: string;
  catSlug: string;
  date: string;         // formatted, e.g. "15 MAY 2026"
  dateIso: string;      // ISO para timeAgo
  imgUrl: string | null;
  focalPoint: { x: number; y: number };  // detectado automáticamente con sharp
  lede: string;
  authorName: string;
  authorAvatar: string | null;  // URL del avatar (Gravatar 96px)
  authorSlug: string;           // Slug del autor para enlace a /autor/{slug}
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
}

function timeAgo(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return 'Hace un momento';
  if (m < 60)  return `Hace ${m} minuto${m > 1 ? 's' : ''}`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `Hace ${h} hora${h > 1 ? 's' : ''}`;
  const d = Math.floor(h / 24);
  return `Hace ${d} día${d > 1 ? 's' : ''}`;
}

function AuthorAvatar({ name, avatar, initials }: { name: string; avatar: string | null; initials: string }) {
  const [imgOk, setImgOk] = useState(true);

  if (avatar && imgOk) {
    return (
      <img
        src={avatar}
        alt={name}
        className="p-hero-avatar"
        style={{ objectFit: 'cover' }}
        onError={() => setImgOk(false)}
      />
    );
  }
  return <div className="p-hero-avatar">{initials}</div>;
}

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = slides.length;

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 6000);
  }, [next]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetTimer(); }
  };
  const goTo = (i: number) => { setCurrent(i); resetTimer(); };

  const slide = slides[current];
  if (!slide) return null;

  const catLabel = slide.catName.toUpperCase();
  const topicLabel = 'ACTUALIDAD';
  const dateLabel = slide.date.toUpperCase();
  const initials = getInitials(slide.authorName);

  return (
    <section
      className="p-hero"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Noticias destacadas"
    >
      {/* Background layers */}
      <div className="p-hero-bg" />
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="p-hero-photo"
          aria-hidden={i !== current}
          style={{ opacity: i === current ? 1 : 0 }}
        >
          {s.imgUrl && (
            <img
              src={s.imgUrl}
              alt=""
              aria-hidden="true"
              fetchPriority={i === 0 ? 'high' : 'low'}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding={i === 0 ? 'sync' : 'async'}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: `${s.focalPoint.x}% ${s.focalPoint.y}%`,
              }}
            />
          )}
        </div>
      ))}
      <div className="p-hero-grid" />
      <div className="p-hero-overlay" />
      <span className="p-hero-photo-tag">FOTO · {catLabel}</span>

      {/* Content */}
      <div className="p-hero-content">
        <div className="p-hero-breadcrumb">
          <strong>{catLabel}</strong>
          <span className="sep">·</span>
          <span>{topicLabel}</span>
          <span className="sep">·</span>
          <span>{dateLabel}</span>
        </div>

        <span className="p-hero-eyebrow">
          <span className="dot" />
          {slide.catName}
        </span>

        <a href={slide.href} style={{ display: 'block', textDecoration: 'none' }}>
          <h1 className="p-hero-title" dangerouslySetInnerHTML={{ __html: slide.title }} />
        </a>
        <p className="p-hero-lede">{slide.lede}</p>

        <div className="p-hero-foot">
          <div className="p-hero-meta">
            <a
              href={`/autor/${slide.authorSlug}`}
              className="p-hero-author"
              style={{ textDecoration: 'none' }}
            >
              <AuthorAvatar name={slide.authorName} avatar={slide.authorAvatar} initials={initials} />
              <div>
                <div className="p-hero-author-name">{slide.authorName}</div>
                <div className="p-hero-author-role">REDACCIÓN</div>
              </div>
            </a>
            <div className="p-hero-divider" />
            <div className="p-hero-time">
              <div className="p-hero-time-l">PUBLICADO</div>
              <div className="p-hero-time-v">{timeAgo(slide.dateIso)}</div>
            </div>
          </div>

          <div className="p-hero-actions">
            <button
              className="p-hero-arrow"
              onClick={() => { prev(); resetTimer(); }}
              aria-label="Noticia anterior"
            >
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <a href={slide.href} className="p-hero-cta">
              Leer nota
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <button
              className="p-hero-arrow"
              onClick={() => { next(); resetTimer(); }}
              aria-label="Noticia siguiente"
            >
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="p-hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`p-hero-dot${i === current ? ' is-current' : ''}`}
            style={{ width: i === current ? 32 : 8 }}
            onClick={() => goTo(i)}
            aria-label={`Ir a noticia ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="p-hero-counter">
        <b>{String(current + 1).padStart(2, '0')}</b> / <span>{String(total).padStart(2, '0')}</span>
      </div>
    </section>
  );
}
