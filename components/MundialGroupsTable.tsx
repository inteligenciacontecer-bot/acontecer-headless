'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { MundialGroupStanding } from '@/lib/mundial-2026';

type GroupStandings = Array<{ group: string; teams: MundialGroupStanding[] }>;

type Props = {
  initialGroups: GroupStandings;
};

function getUpdatedLabel(updatedAt: string | null) {
  if (!updatedAt) return 'Actualización automática';
  return new Intl.DateTimeFormat('es-CR', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'America/Costa_Rica',
  }).format(new Date(updatedAt));
}

function getTeamSlug(team: string): string {
  return team
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function MundialGroupsTable({ initialGroups }: Props) {
  const [groups, setGroups] = useState<GroupStandings>(initialGroups);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function refresh() {
      try {
        const response = await fetch('/api/mundial-2026/groups', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        if (!active) return;
        setGroups(data.groups || initialGroups);
        setUpdatedAt(data.updatedAt || new Date().toISOString());
      } catch {
        // Keep the initial server-rendered standings if the live refresh fails.
      }
    }

    refresh();
    const timer = window.setInterval(refresh, 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [initialGroups]);

  return (
    <div className="wc-standings">
      <div className="wc-standings-live">
        <span aria-hidden="true" />
        <strong>Tabla en vivo</strong>
        <em>Última revisión: {getUpdatedLabel(updatedAt)}</em>
      </div>

      <div className="wc-standings-grid">
        {groups.map((group) => (
          <article className="wc-standings-card" key={group.group}>
            <header>
              <div>
                <span>Grupo</span>
                <strong>{group.group}</strong>
              </div>
              <small>Pts · DG · GF</small>
            </header>

            <div className="wc-standings-table" role="table" aria-label={`Tabla de posiciones del Grupo ${group.group}`}>
              <div className="wc-standings-row wc-standings-row--head" role="row">
                <span>Selección</span>
                <span>PJ</span>
                <span>PG</span>
                <span>PE</span>
                <span>PP</span>
                <span>GF</span>
                <span>GC</span>
                <span>DG</span>
                <span>Pts</span>
              </div>

              {group.teams.map((team, index) => (
                <div className="wc-standings-row" role="row" key={team.team}>
                  <Link className="wc-team-cell" href={`/mundial-2026/seleccion/${getTeamSlug(team.team)}`}>
                    <b>{index + 1}</b>
                    <img src={team.flag.url} alt={`Bandera de ${team.team}`} loading="lazy" />
                    <strong>{team.team}</strong>
                  </Link>
                  <span>{team.played}</span>
                  <span>{team.won}</span>
                  <span>{team.drawn}</span>
                  <span>{team.lost}</span>
                  <span>{team.goalsFor}</span>
                  <span>{team.goalsAgainst}</span>
                  <span>{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</span>
                  <span className="wc-points">{team.points}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
