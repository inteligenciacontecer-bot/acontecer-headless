import {
  MUNDIAL_GROUPS,
  MUNDIAL_MATCHES,
  MUNDIAL_SOURCE,
  getMatchesByDate,
  getMatchesByPhase,
  getMundialGroupStandings,
  getMundialMatchCenter,
  getMundialTeamProfile,
  getMundialTeams,
  type MundialMatch,
  type MundialMatchCenter,
} from './mundial-2026';

type MundialLiveMatchPatch = Partial<Pick<MundialMatch, 'status' | 'homeScore' | 'awayScore' | 'events' | 'kickoffUtc'>> & {
  id?: string;
  slug?: string;
};

type MundialLivePayload = {
  provider?: string;
  updatedAt?: string;
  matches?: MundialLiveMatchPatch[];
  centers?: Record<string, Partial<MundialMatchCenter>>;
};

export type MundialProviderMeta = {
  mode: 'static-shell' | 'external-live';
  name: string;
  enabled: boolean;
  updatedAt: string;
  refreshSeconds: number;
};

const LIVE_API_BASE_URL = process.env.MUNDIAL_LIVE_API_BASE_URL?.replace(/\/+$/, '') || '';
const LIVE_API_ENDPOINT = process.env.MUNDIAL_LIVE_API_ENDPOINT || '/mundial-2026/live';
const LIVE_API_KEY = process.env.MUNDIAL_LIVE_API_KEY || '';
const LIVE_PROVIDER_NAME = process.env.MUNDIAL_LIVE_PROVIDER || 'static-shell';
const LIVE_REFRESH_SECONDS = Number(process.env.MUNDIAL_LIVE_REFRESH_SECONDS || 15);

let livePayloadCache: { expiresAt: number; payload: Promise<MundialLivePayload | null> } | null = null;

export function getMundialProviderMeta(updatedAt = new Date().toISOString()): MundialProviderMeta {
  const enabled = Boolean(LIVE_API_BASE_URL);

  return {
    mode: enabled ? 'external-live' : 'static-shell',
    name: enabled ? LIVE_PROVIDER_NAME : 'Acontecer static shell',
    enabled,
    updatedAt,
    refreshSeconds: Number.isFinite(LIVE_REFRESH_SECONDS) ? LIVE_REFRESH_SECONDS : 15,
  };
}

async function fetchLivePayload(): Promise<MundialLivePayload | null> {
  if (!LIVE_API_BASE_URL) return null;

  try {
    const response = await fetch(`${LIVE_API_BASE_URL}${LIVE_API_ENDPOINT}`, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...(LIVE_API_KEY ? { Authorization: `Bearer ${LIVE_API_KEY}` } : {}),
      },
      signal: AbortSignal.timeout(4500),
    });

    if (!response.ok) return null;
    return (await response.json()) as MundialLivePayload;
  } catch {
    return null;
  }
}

async function getLivePayload(): Promise<MundialLivePayload | null> {
  const now = Date.now();
  const ttl = Math.max(5, Number.isFinite(LIVE_REFRESH_SECONDS) ? LIVE_REFRESH_SECONDS : 15) * 1000;

  if (!livePayloadCache || livePayloadCache.expiresAt <= now) {
    livePayloadCache = {
      expiresAt: now + ttl,
      payload: fetchLivePayload(),
    };
  }

  return livePayloadCache.payload;
}

function patchMatches(matches: MundialMatch[], payload: MundialLivePayload | null): MundialMatch[] {
  if (!payload?.matches?.length) return matches;

  const patches = new Map<string, MundialLiveMatchPatch>();
  for (const patch of payload.matches) {
    if (patch.id) patches.set(patch.id, patch);
    if (patch.slug) patches.set(patch.slug, patch);
  }

  return matches.map((match) => {
    const patch = patches.get(match.id) || patches.get(match.slug);
    if (!patch) return match;

    return {
      ...match,
      status: patch.status ?? match.status,
      homeScore: patch.homeScore ?? match.homeScore,
      awayScore: patch.awayScore ?? match.awayScore,
      events: patch.events ?? match.events,
      kickoffUtc: patch.kickoffUtc ?? match.kickoffUtc,
    };
  });
}

function mergeCenter(center: MundialMatchCenter, payload: MundialLivePayload | null, match: MundialMatch): MundialMatchCenter {
  const patch = payload?.centers?.[match.id] || payload?.centers?.[match.slug];
  if (!patch) return center;

  return {
    ...center,
    ...patch,
    updatedAt: patch.updatedAt || payload?.updatedAt || center.updatedAt,
    chronicle: {
      ...center.chronicle,
      ...patch.chronicle,
    },
    lineups: {
      ...center.lineups,
      ...patch.lineups,
    },
    publicPulse: {
      ...center.publicPulse,
      ...patch.publicPulse,
    },
    statistics: patch.statistics || center.statistics,
    headToHead: patch.headToHead || center.headToHead,
  };
}

export async function getMundialMatchesData() {
  const payload = await getLivePayload();
  const updatedAt = payload?.updatedAt || new Date().toISOString();
  const matches = patchMatches(MUNDIAL_MATCHES, payload);

  return {
    provider: getMundialProviderMeta(updatedAt),
    source: MUNDIAL_SOURCE,
    count: matches.length,
    matches,
  };
}

export async function getMundialMatchData(slugOrId: string) {
  const payload = await getLivePayload();
  const matches = patchMatches(MUNDIAL_MATCHES, payload);
  const match = matches.find((item) => item.slug === slugOrId || item.id === slugOrId);

  return {
    provider: getMundialProviderMeta(payload?.updatedAt),
    source: MUNDIAL_SOURCE,
    match,
  };
}

export async function getMundialGroupsData() {
  const { matches, provider, source } = await getMundialMatchesData();

  return {
    provider,
    source,
    updatedAt: provider.updatedAt,
    groups: getMundialGroupStandings(matches),
  };
}

export async function getMundialGroupData(groupSlugOrName: string) {
  const groupName = groupSlugOrName.replace(/^grupo-?/i, '').toUpperCase();
  const groupTeams = MUNDIAL_GROUPS[groupName];
  const { matches, provider, source } = await getMundialMatchesData();
  const standings = getMundialGroupStandings(matches).find((group) => group.group === groupName);

  return {
    provider,
    source,
    group: groupTeams
      ? {
          name: groupName,
          teams: standings?.teams || [],
          matches: matches.filter((match) => match.group === groupName),
        }
      : undefined,
  };
}

export async function getMundialMatchCenterData(slugOrId: string) {
  const payload = await getLivePayload();
  const matches = patchMatches(MUNDIAL_MATCHES, payload);
  const match = matches.find((item) => item.slug === slugOrId || item.id === slugOrId);

  if (!match) {
    return {
      provider: getMundialProviderMeta(payload?.updatedAt),
      source: MUNDIAL_SOURCE,
      match: undefined,
      center: undefined,
    };
  }

  return {
    provider: getMundialProviderMeta(payload?.updatedAt),
    source: MUNDIAL_SOURCE,
    match,
    center: mergeCenter(getMundialMatchCenter(match), payload, match),
  };
}

export async function getMundialTeamsData() {
  const { matches, provider, source } = await getMundialMatchesData();
  const teams = getMundialTeams().map((team) => ({
    ...team,
    matches: matches.filter((match) => match.home === team.name || match.away === team.name),
  }));

  return {
    provider,
    source,
    teams,
  };
}

export async function getMundialTeamData(slugOrName: string) {
  const { matches, provider, source } = await getMundialMatchesData();
  const team = getMundialTeamProfile(slugOrName);

  return {
    provider,
    source,
    team: team
      ? {
          ...team,
          matches: matches.filter((match) => match.home === team.name || match.away === team.name),
        }
      : undefined,
  };
}

export async function getMundialHomeData() {
  const { matches, provider, source } = await getMundialMatchesData();
  const teams = await getMundialTeamsData();
  const nowMs = Date.now();

  return {
    provider,
    source,
    matches,
    upcoming: matches
      .filter((match) => !match.kickoffUtc || new Date(match.kickoffUtc).getTime() >= nowMs - 2 * 60 * 60 * 1000)
      .slice(0, 6),
    dates: getMatchesByDate().slice(0, 6).map((day) => ({
      ...day,
      matches: day.matches.map((match) => matches.find((item) => item.id === match.id) || match),
    })),
    groupCount: Object.keys(MUNDIAL_GROUPS).length,
    standings: getMundialGroupStandings(matches),
    teams: teams.teams,
  };
}

export async function getMundialCalendarData() {
  const { matches, provider, source } = await getMundialMatchesData();

  return {
    provider,
    source,
    matches,
    byDate: getMatchesByDate().map((day) => ({
      ...day,
      matches: day.matches.map((match) => matches.find((item) => item.id === match.id) || match),
    })),
    byPhase: getMatchesByPhase().map((phase) => ({
      ...phase,
      matches: phase.matches.map((match) => matches.find((item) => item.id === match.id) || match),
    })),
  };
}
