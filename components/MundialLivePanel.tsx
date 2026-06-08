'use client';

import { useEffect, useMemo, useState } from 'react';
import type { MundialEvent, MundialMatch } from '@/lib/mundial-2026';

function getClock(match: MundialMatch, now: Date) {
  if (!match.kickoffUtc) return { label: 'Horario por confirmar', state: 'scheduled' as const, minute: null };

  const start = new Date(match.kickoffUtc).getTime();
  const elapsed = now.getTime() - start;
  const minute = Math.max(0, Math.floor(elapsed / 60000) + 1);

  if (elapsed < 0) {
    const diff = start - now.getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return { label: `Faltan ${days} d ${hours} h`, state: 'scheduled' as const, minute: null };
    return { label: `Faltan ${hours || 0} h`, state: 'scheduled' as const, minute: null };
  }

  if (minute <= 45) return { label: `${minute}'`, state: 'live' as const, minute };
  if (minute <= 60) return { label: 'Descanso', state: 'live' as const, minute };
  if (minute <= 105) return { label: `${Math.min(90, minute - 15)}'`, state: 'live' as const, minute };
  return { label: 'Finalizado', state: 'finished' as const, minute: 90 };
}

function eventLabel(type: MundialEvent['type']) {
  return {
    goal: 'Gol',
    'yellow-card': 'Amarilla',
    'red-card': 'Roja',
    substitution: 'Cambio',
    foul: 'Falta',
    var: 'VAR',
    info: 'Info',
  }[type];
}

export default function MundialLivePanel({ match }: { match: MundialMatch }) {
  const [now, setNow] = useState(() => new Date());
  const clock = useMemo(() => getClock(match, now), [match, now]);
  const events = match.events || [];

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="wc-live-panel" aria-label="Estado en vivo del partido">
      <div className="wc-live-head">
        <div>
          <span className={`wc-live-dot wc-live-dot--${clock.state}`} />
          <span>{clock.state === 'live' ? 'En vivo' : clock.state === 'finished' ? 'Finalizado' : 'Programado'}</span>
        </div>
        <strong>{clock.label}</strong>
      </div>

      <div className="wc-scoreboard">
        <div className="wc-score-team">
          <span>{match.home}</span>
          <strong>{match.homeScore ?? 0}</strong>
        </div>
        <div className="wc-score-sep">vs</div>
        <div className="wc-score-team wc-score-team--right">
          <strong>{match.awayScore ?? 0}</strong>
          <span>{match.away}</span>
        </div>
      </div>

      <div className="wc-timeline">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div className="wc-event" key={`${event.minute}-${event.type}-${index}`}>
              <span className="wc-event-minute">{event.minute}'</span>
              <span className={`wc-event-type wc-event-type--${event.type}`}>{eventLabel(event.type)}</span>
              <span className="wc-event-detail">{event.detail}</span>
            </div>
          ))
        ) : (
          <div className="wc-empty-events">
            <strong>Minuto a minuto listo</strong>
            <span>Cuando se conecte el proveedor en vivo, aquí entrarán goles, tarjetas, cambios, faltas, VAR y notas del partido.</span>
          </div>
        )}
      </div>
    </section>
  );
}
