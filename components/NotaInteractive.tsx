'use client';
import { useEffect } from 'react';

/**
 * NotaInteractive — client component para nota interior V2
 * Maneja: barra de progreso fija, minibar, progreso en sidebar, TOC scroll-spy
 */
export default function NotaInteractive() {
  useEffect(() => {
    const bar      = document.getElementById('nv2-bar');
    const sideBar  = document.getElementById('nv2-sidebar-bar');
    const sidePct  = document.getElementById('nv2-sidebar-pct');
    const minibar  = document.getElementById('nv2-minibar');
    const article  = document.getElementById('nv2-main-article');
    const title    = document.getElementById('nv2-article-title');

    function update() {
      if (!article) return;
      const rect   = article.getBoundingClientRect();
      const pctVal = Math.max(0, Math.min(100,
        (Math.max(0, window.innerHeight - rect.top) / rect.height) * 100
      ));
      const w = pctVal.toFixed(1) + '%';
      if (bar)     bar.style.width     = w;
      if (sideBar) sideBar.style.width = w;
      if (sidePct) sidePct.textContent = Math.round(pctVal) + '%';

      // Minibar: mostrar cuando el título ya no es visible
      if (minibar && title) {
        const titleBottom = title.getBoundingClientRect().bottom;
        minibar.classList.toggle('is-shown', titleBottom < 60);
      }
    }

    // TOC scroll-spy — sólo dentro del artículo principal
    const mainEl   = document.getElementById('nv2-main-article');
    const sections = (mainEl
      ? [...mainEl.querySelectorAll('h2[id], h3[id]')]
      : []) as HTMLElement[];
    const tocLinks = [...document.querySelectorAll('.nv2-toc a')];

    function spy() {
      let active: HTMLElement | null = sections[0] ?? null;
      for (const s of sections) {
        if (s.getBoundingClientRect().top < 180) active = s;
      }
      if (!active) return;
      tocLinks.forEach(a =>
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + active!.id)
      );
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('scroll', spy,    { passive: true });
    window.addEventListener('resize', update);
    update();
    spy();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('scroll', spy);
      window.removeEventListener('resize', update);
    };
  }, []);

  return null;
}
