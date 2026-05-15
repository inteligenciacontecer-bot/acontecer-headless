'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface HeroSlide {
  id: number;
  href: string;
  title: string;
  catName: string;
  date: string;
  imgUrl: string | null;
}

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = slides.length;

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);

  // Auto-avance cada 5 s
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5000);
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
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      resetTimer();
    }
  };

  const goTo = (i: number) => { setCurrent(i); resetTimer(); };

  return (
    <div
      className="hero-carousel-wrap"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <a
          key={slide.id}
          href={slide.href}
          className="hero-carousel-slide"
          style={{
            position: i === 0 ? 'relative' : 'absolute',
            opacity: i === current ? 1 : 0,
            pointerEvents: i === current ? 'auto' : 'none',
          }}
        >
          {slide.imgUrl
            ? <img
                src={slide.imgUrl}
                alt={slide.title.replace(/<[^>]+>/g, '')}
                className="hero-carousel-img"
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
                sizes="(max-width: 768px) 100vw, 800px"
              />
            : <div className="hero-carousel-img" style={{ background: 'linear-gradient(135deg,#0000A2,#0a73ce)' }} />
          }
          <div className="hero-carousel-overlay">
            <span className="hero-carousel-cat">{slide.catName}</span>
            <div
              className="hero-carousel-title"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />
            <div className="hero-carousel-date">{slide.date}</div>
          </div>
        </a>
      ))}

      {/* Dots de navegación */}
      <div className="hero-carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir a noticia ${i + 1}`}
            className="hero-carousel-dot"
            style={{
              width: i === current ? '22px' : '8px',
              background: i === current ? 'white' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
