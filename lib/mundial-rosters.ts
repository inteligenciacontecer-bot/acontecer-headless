export type MundialRosterPosition = 'GK' | 'DF' | 'MF' | 'FW';

export type MundialRosterPlayer = {
  number: number;
  position: MundialRosterPosition;
  name: string;
  club: string;
  photoUrl: string | null;
  sourceUrl: string;
};

export const MUNDIAL_ROSTER_SOURCE = {
  name: 'FIFA squad list published 2026-06-03 via World Cup Ranking mirror',
  url: 'https://worldcupranking.com/world-cup-2026/squads/',
  officialUrl: 'https://www.fifa.com/en/articles/fifa-world-cup-2026-squads-confirmed',
  importedAt: '2026-06-08T21:59:02.516Z',
};

export const MUNDIAL_TEAM_ROSTERS: Record<string, MundialRosterPlayer[]> = {
  "alemania": [
    {
      "number": 1,
      "position": "GK",
      "name": "NEUER",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "RUDIGER",
      "club": "Real Madrid C. F. (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "ANTON",
      "club": "Borussia Dortmund (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "TAH",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 5,
      "position": "MF",
      "name": "PAVLOVIC",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "KIMMICH",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "HAVERTZ",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "GORETZKA",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 9,
      "position": "MF",
      "name": "LEWELING",
      "club": "VfB Stuttgart (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "MUSIALA",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "WOLTEMADE",
      "club": "Newcastle United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "BAUMANN",
      "club": "TSG Hoffenheim (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 13,
      "position": "MF",
      "name": "GROß",
      "club": "Brighton & Hove Albion FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 14,
      "position": "FW",
      "name": "BEIER",
      "club": "Borussia Dortmund (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "SCHLOTTERBECK",
      "club": "Borussia Dortmund (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "STILLER",
      "club": "VfB Stuttgart (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "WIRTZ",
      "club": "Liverpool FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 18,
      "position": "DF",
      "name": "BROWN",
      "club": "Eintracht Frankfurt (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "SANÉ",
      "club": "Galatasaray SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "AMIRI",
      "club": "1. FSV Mainz 05 (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 21,
      "position": "GK",
      "name": "NÜBEL",
      "club": "VfB Stuttgart (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 22,
      "position": "DF",
      "name": "RAUM",
      "club": "RB Leipzig (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 23,
      "position": "MF",
      "name": "NMECHA",
      "club": "Borussia Dortmund (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "THIAW",
      "club": "Newcastle United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 25,
      "position": "MF",
      "name": "KARL",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "UNDAV",
      "club": "VfB Stuttgart (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/germany/"
    }
  ],
  "arabia-saudita": [
    {
      "number": 1,
      "position": "GK",
      "name": "ALAQIDI",
      "club": "Al Nassr FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "MAJRASHI",
      "club": "Al Ahli FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "LAJAMI",
      "club": "Al Hilal SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "ALAMRI",
      "club": "Al Nassr FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "ALTAMBAKTI",
      "club": "Al Hilal SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "NASSER",
      "club": "Al Hilal SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "MUSAB",
      "club": "Al Qadsiah FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 8,
      "position": "FW",
      "name": "AIMAN",
      "club": "Al Nassr FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "FERAS",
      "club": "Al Ahli FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "SALEM",
      "club": "Al Hilal SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "ALSHEHRI",
      "club": "Al Ittihad (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 12,
      "position": "DF",
      "name": "SAUD",
      "club": "RC Lens (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "NAWAF",
      "club": "Al Nassr FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "KADISH",
      "club": "Al Ittihad (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "ALKHAIBARI",
      "club": "Al Nassr FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "ZIYAD",
      "club": "Al Ahli FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "KHALID",
      "club": "Al Ettifaq FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 18,
      "position": "MF",
      "name": "ALHAJJI",
      "club": "Neom SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "ALHAMDDAN",
      "club": "Al Nassr FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "MANDASH",
      "club": "Al Hilal SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 21,
      "position": "GK",
      "name": "ALOWAIS",
      "club": "Al Ula Saudi FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 22,
      "position": "GK",
      "name": "ALKASSAR",
      "club": "Al Qadsiah FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 23,
      "position": "MF",
      "name": "KANNO",
      "club": "Al Hilal SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "MOTEB",
      "club": "Al Hilal SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "JEHAD",
      "club": "Al Qadsiah FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "MOHAMMED",
      "club": "Al Qadsiah FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/saudi-arabia/"
    }
  ],
  "argelia": [
    {
      "number": 1,
      "position": "GK",
      "name": "MASTIL",
      "club": "FC Stade Nyonnais (SUI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "MANDI",
      "club": "Lille OSC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "ABADA",
      "club": "USM Alger (ALG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "TOUGAI",
      "club": "Espérance De Tunisie (TUN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "BELAID",
      "club": "JS Kabylie (ALG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "ZERROUKI",
      "club": "FC Twente (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "MAHREZ",
      "club": "Al Ahli FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "AOUAR",
      "club": "Al Ittihad (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "GHOURI",
      "club": "Olympique Marseille (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "CHAIBI",
      "club": "Eintracht Frankfurt (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "HADJ MOUSSA",
      "club": "Feyenoord Rotterdam (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 12,
      "position": "FW",
      "name": "BENBOUALI",
      "club": "Györi ETO FC (HUN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "HADJAM",
      "club": "BSC Young Boys (SUI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "BOUDAOUI",
      "club": "OGC Nice (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "AIT NOURI",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 16,
      "position": "GK",
      "name": "BENBOT",
      "club": "USM Alger (ALG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 17,
      "position": "DF",
      "name": "BELGHALI",
      "club": "Hellas Verona FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "AMOURA",
      "club": "VfL Wolfsburg (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "BENTALEB",
      "club": "Lille OSC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "BOULBINA",
      "club": "Al Duhail SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 21,
      "position": "DF",
      "name": "BENSEBAINI",
      "club": "Borussia Dortmund (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 22,
      "position": "MF",
      "name": "MAZA",
      "club": "Bayer Leverkusen (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "ZIDANE",
      "club": "Granada CF (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 24,
      "position": "MF",
      "name": "TITRAOUI",
      "club": "Sporting Charleroi (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 25,
      "position": "FW",
      "name": "GHEDJEMIS",
      "club": "Frosinone (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "CHERGUI",
      "club": "Paris FC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/algeria/"
    }
  ],
  "argentina": [
    {
      "number": 1,
      "position": "GK",
      "name": "MUSSO",
      "club": "Atlético De Madrid (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "BALERDI",
      "club": "Olympique Marseille (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "TAGLIAFICO",
      "club": "Olympique Lyonnais (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "MONTIEL",
      "club": "CA River Plate (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 5,
      "position": "MF",
      "name": "PAREDES",
      "club": "CA Boca Juniors (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "MARTÍNEZ",
      "club": "Manchester United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "DE PAUL",
      "club": "Inter Miami CF (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "BARCO",
      "club": "RC Strasbourg (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "J. ALVAREZ",
      "club": "Atlético De Madrid (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "MESSI",
      "club": "Inter Miami CF (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "LO CELSO",
      "club": "Real Betis (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "RULLI",
      "club": "Olympique Marseille (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "ROMERO",
      "club": "Tottenham Hotspur FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "PALACIOS",
      "club": "Bayer Leverkusen (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "N. GONZÁLEZ",
      "club": "Atlético De Madrid (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 16,
      "position": "FW",
      "name": "ALMADA",
      "club": "Atlético De Madrid (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "SIMEONE",
      "club": "Atlético De Madrid (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "NICO PAZ",
      "club": "Como (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 19,
      "position": "DF",
      "name": "OTAMENDI",
      "club": "SL Ben\u0000ca (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "MAC ALLISTER",
      "club": "Liverpool FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "LOPEZ",
      "club": "SE Palmeiras (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 22,
      "position": "FW",
      "name": "L. MARTÍNEZ",
      "club": "FC Internazionale Milano (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "E. MARTÍNEZ",
      "club": "Aston Villa FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 24,
      "position": "MF",
      "name": "E. FERNÁNDEZ",
      "club": "Chelsea FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "MEDINA",
      "club": "Olympique Marseille (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "MOLINA",
      "club": "Atlético De Madrid (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/argentina/"
    }
  ],
  "australia": [
    {
      "number": 1,
      "position": "GK",
      "name": "RYAN",
      "club": "Levante UD (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "DEGENEK",
      "club": "APOEL FC (CYP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "CIRCATI",
      "club": "Parma (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "ITALIANO",
      "club": "Grazer AK (AUT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "BOS",
      "club": "Feyenoord Rotterdam (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "GERIA",
      "club": "Albirex Niigata (JPN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "LECKIE",
      "club": "Melbourne City FC (AUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "METCALFE",
      "club": "FC St. Pauli (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "TOURE",
      "club": "Norwich City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "HRUSTIC",
      "club": "SC Heracles Almelo (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "MABIL",
      "club": "CD Castellón (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "IZZO",
      "club": "Randers FC (DEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 13,
      "position": "MF",
      "name": "O'NEILL",
      "club": "New York City FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "DEVLIN",
      "club": "Heart Of Midlothian FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "TREWIN",
      "club": "New York City FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 16,
      "position": "DF",
      "name": "BEHICH",
      "club": "Melbourne City FC (AUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "IRANKUNDA",
      "club": "Watford FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 18,
      "position": "GK",
      "name": "BEACH",
      "club": "Melbourne City FC (AUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 19,
      "position": "DF",
      "name": "SOUTTAR",
      "club": "Leicester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "VOLPATO",
      "club": "US Sassuolo (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 21,
      "position": "DF",
      "name": "BURGESS",
      "club": "Swansea City AFC (WAL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 22,
      "position": "MF",
      "name": "IRVINE",
      "club": "FC St. Pauli (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 23,
      "position": "FW",
      "name": "VELUPILLAY",
      "club": "Melbourne Victory FC (AUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 24,
      "position": "MF",
      "name": "OKON-ENGSTLER",
      "club": "Sydney FC (AUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "HERRINGTON",
      "club": "Colorado Rapids (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "YENGI",
      "club": "FC Machida Zelvia (JPN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/australia/"
    }
  ],
  "austria": [
    {
      "number": 1,
      "position": "GK",
      "name": "SCHLAGER",
      "club": "FC Red Bull Salzburg (AUT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "AFFENGRUBER",
      "club": "Elche CF (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "DANSO",
      "club": "Tottenham Hotspur FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 4,
      "position": "MF",
      "name": "XAVER",
      "club": "RB Leipzig (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "POSCH",
      "club": "1. FSV Mainz 05 (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "SEIWALD",
      "club": "RB Leipzig (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "ARNAUTOVIC",
      "club": "FK Crvena Zvezda (SRB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 8,
      "position": "DF",
      "name": "ALABA",
      "club": "Real Madrid C. F. (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 9,
      "position": "MF",
      "name": "SABITZER",
      "club": "Borussia Dortmund (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "GRILLITSCH",
      "club": "SC Braga (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "GREGORITSCH",
      "club": "FC Augsburg (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "WIEGELE",
      "club": "FC Viktoria Plze ň (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 13,
      "position": "GK",
      "name": "PENTZ",
      "club": "Brøndby IF (DEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 14,
      "position": "FW",
      "name": "KALAJDZIC",
      "club": "LASK Linz (AUT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "LIENHART",
      "club": "SC Freiburg (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 16,
      "position": "DF",
      "name": "MWENE",
      "club": "1. FSV Mainz 05 (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "CHUKWUEMEKA",
      "club": "Borussia Dortmund (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 18,
      "position": "MF",
      "name": "SCHMID",
      "club": "SV Werder Bremen (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "BAUMGARTNER",
      "club": "RB Leipzig (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "LAIMER",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "WIMMER",
      "club": "VfL Wolfsburg (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 22,
      "position": "MF",
      "name": "PRASS",
      "club": "TSG Hoffenheim (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 23,
      "position": "DF",
      "name": "FRIEDL",
      "club": "SV Werder Bremen (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 24,
      "position": "MF",
      "name": "WANNER",
      "club": "PSV Eindhoven (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "SVOBODA",
      "club": "Venezia FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    },
    {
      "number": 26,
      "position": "MF",
      "name": "SCHÖPF",
      "club": "Wolfsberger AC (AUT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/austria/"
    }
  ],
  "belgica": [
    {
      "number": 1,
      "position": "GK",
      "name": "COURTOIS",
      "club": "Real Madrid C. F. (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "DEBAST",
      "club": "Sporting CP (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "THIATE",
      "club": "Eintracht Frankfurt (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "MECHELE",
      "club": "Club Brugge (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "DE CUYPER",
      "club": "Brighton & Hove Albion FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "WITSEL",
      "club": "Girona FC (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "DE BRUYNE",
      "club": "SSC Napoli (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "TIELEMANS",
      "club": "Aston Villa FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "LUKAKU",
      "club": "SSC Napoli (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "TROSSARD",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "DOKU",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "LAMMENS",
      "club": "Manchester United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 13,
      "position": "GK",
      "name": "PENDERS",
      "club": "RC Strasbourg (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 14,
      "position": "FW",
      "name": "LUKEBAKIO",
      "club": "SL Ben\u0000ca (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "MEUNIER",
      "club": "Lille OSC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 16,
      "position": "DF",
      "name": "DE WINTER",
      "club": "AC Milan (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "DE KETELAERE",
      "club": "Atalanta Bergamo (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 18,
      "position": "DF",
      "name": "SEYS",
      "club": "Club Brugge (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "MOREIRA",
      "club": "RC Strasbourg (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "VANAKEN",
      "club": "Club Brugge (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 21,
      "position": "DF",
      "name": "CASTAGNE",
      "club": "Fulham FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 22,
      "position": "MF",
      "name": "SAELEMAEKERS",
      "club": "AC Milan (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 23,
      "position": "MF",
      "name": "RASKIN",
      "club": "Rangers FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 24,
      "position": "MF",
      "name": "ONANA",
      "club": "Aston Villa FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "NGOY",
      "club": "Lille OSC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "FERNANDEZ-PARDO",
      "club": "Lille OSC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/belgium/"
    }
  ],
  "bosnia-y-herzegovina": [
    {
      "number": 1,
      "position": "GK",
      "name": "VASILJ",
      "club": "FC St. Pauli (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "MUJAKIC",
      "club": "Gaziantep FK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "HADZIKADUNIC",
      "club": "UC Sampdoria (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "MUHAREMOVIC",
      "club": "US Sassuolo (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "KOLASINAC",
      "club": "Atalanta Bergamo (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "TAHIROVIC",
      "club": "Brøndby IF (DEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 7,
      "position": "DF",
      "name": "DEDIC",
      "club": "SL Ben\u0000ca (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "GIGOVIC",
      "club": "BSC Young Boys (SUI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "BAZDAR",
      "club": "Jagiellonia Bia ł ystok (POL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "DEMIROVIC",
      "club": "VfB Stuttgart (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "DZEKO",
      "club": "FC Schalke 04 (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "JURKAS",
      "club": "FK Borac Banja Luka (BIH)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 13,
      "position": "MF",
      "name": "BASIC",
      "club": "FC Astana (KAZ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "SUNJIC",
      "club": "Pafos FC (CYP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "MEMIC",
      "club": "FC Viktoria Plze ň (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "HADZIAHMETOVIC",
      "club": "Hull City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "BURNIC",
      "club": "Karlsruher SC (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 18,
      "position": "DF",
      "name": "KATIC",
      "club": "FC Schalke 04 (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "ALAJBEGOVIC",
      "club": "FC Red Bull Salzburg (AUT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "BAJRAKTAREVIC",
      "club": "PSV Eindhoven (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 21,
      "position": "DF",
      "name": "RADELJIC",
      "club": "HNK Rijeka (CRO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 22,
      "position": "GK",
      "name": "ZLOMISLIC",
      "club": "HNK Rijeka (CRO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 23,
      "position": "FW",
      "name": "TABAKOVIC",
      "club": "Borussia Mönchengladbach (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "CELIK",
      "club": "RC Lens (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 25,
      "position": "FW",
      "name": "LUKIC",
      "club": "Universitatea Cluj (ROU)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    },
    {
      "number": 26,
      "position": "MF",
      "name": "MAHMIC",
      "club": "FC Slovan Liberec (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/bosnia-and-herzegovina/"
    }
  ],
  "brasil": [
    {
      "number": 1,
      "position": "GK",
      "name": "A. BECKER",
      "club": "Liverpool FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "WESLEY",
      "club": "AS Roma (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "GABRIEL",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "MARQUINHOS",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 5,
      "position": "MF",
      "name": "CASEMIRO",
      "club": "Manchester United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "ALEX SANDRO",
      "club": "CR Flamengo (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "VINI JR.",
      "club": "Real Madrid C. F. (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "BRUNO G.",
      "club": "Newcastle United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "CUNHA",
      "club": "Manchester United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "NEYMAR JR",
      "club": "Santos FC (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "RAPHINHA",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "WEVERTON",
      "club": "Grêmio FBPA (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "DANILO",
      "club": "CR Flamengo (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "BREMER",
      "club": "Juventus FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "LEO PEREIRA",
      "club": "CR Flamengo (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 16,
      "position": "DF",
      "name": "DOUGLAS SANTOS",
      "club": "FC Zenit St. Petersburg (RUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "FABINHO",
      "club": "Al Ittihad (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 18,
      "position": "MF",
      "name": "DANILO S.",
      "club": "Botafogo (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "ENDRICK",
      "club": "Olympique Lyonnais (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "L. PAQUETA",
      "club": "CR Flamengo (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "L. HENRIQUE",
      "club": "FC Zenit St. Petersburg (RUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 22,
      "position": "FW",
      "name": "MARTINELLI",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "EDERSON",
      "club": "Fenerbahçe SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "IBANEZ",
      "club": "Al Ahli FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 25,
      "position": "FW",
      "name": "THIAGO",
      "club": "Brentford FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "RAYAN",
      "club": "AFC Bournemouth (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/brazil/"
    }
  ],
  "cabo-verde": [
    {
      "number": 1,
      "position": "GK",
      "name": "VOZINHA",
      "club": "GD Chaves (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "STOPIRA",
      "club": "SCU Torreense (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "BORGES",
      "club": "Al Bataeh Club (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "LOPES",
      "club": "Shamrock Rovers FC (IRL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "LOGAN",
      "club": "Villarreal CF (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "KEVIN L.",
      "club": "FC Krasnodar (RUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "JOVANE",
      "club": "CF Estrela Da Amadora (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "JOAO PAULO",
      "club": "FC FCSB (ROU)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "BENCHIMOL",
      "club": "FC Akron Tolyatti (RUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "MONTEIRO",
      "club": "PEC Zwolle (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "RODRIGUES",
      "club": "Apollon Limassol (CYP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "MARCIO",
      "club": "PFC Montana (BUL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "LOPES CABRAL",
      "club": "SL Ben\u0000ca (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "D. DUARTE",
      "club": "PFC Ludogorets Razgrad (BUL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "DUARTE",
      "club": "Puskás Akadémia FC (HUN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "Y. SEMEDO",
      "club": "SC Farense (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "SEMEDO",
      "club": "AC Omonia (CYP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 18,
      "position": "MF",
      "name": "ARCANJO",
      "club": "Vitória SC (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "LIVRAMENTO",
      "club": "Casa Pia AC (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "RYAN",
      "club": "I ğ dır FK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 21,
      "position": "MF",
      "name": "DA COSTA",
      "club": "Ba ş ak ş ehir FK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 22,
      "position": "DF",
      "name": "MOREIRA",
      "club": "Columbus Crew (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "DOS SANTOS",
      "club": "San Diego FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "WAGNER P.",
      "club": "Trabzonspor (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "KELVIN",
      "club": "SJK (FIN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    },
    {
      "number": 26,
      "position": "MF",
      "name": "HÉLIO",
      "club": "Maccabi Tel-Aviv FC (ISR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/cape-verde/"
    }
  ],
  "canada": [
    {
      "number": 1,
      "position": "GK",
      "name": "ST. CLAIR",
      "club": "Inter Miami CF (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "JOHNSTON",
      "club": "Celtic FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "JONES",
      "club": "Middlesbrough FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "DE FOUGEROLLES",
      "club": "FCV Dender EH (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "WATERMAN",
      "club": "Chicago Fire FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "CHOINIÈRE",
      "club": "LAFC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "EUSTAQUIO",
      "club": "LAFC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "KONÉ",
      "club": "US Sassuolo (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "LARIN",
      "club": "Southampton FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "J. DAVID",
      "club": "Juventus FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "MILLAR",
      "club": "Hull City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 12,
      "position": "FW",
      "name": "OLUWASEYI",
      "club": "Villarreal CF (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "CORNELIUS",
      "club": "Rangers FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "SHAFFELBURG",
      "club": "LAFC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "BOMBITO",
      "club": "OGC Nice (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 16,
      "position": "GK",
      "name": "CREPEAU",
      "club": "Orlando City SC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "BUCHANAN",
      "club": "Villarreal CF (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 18,
      "position": "GK",
      "name": "GOODMAN",
      "club": "Barnsley (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 19,
      "position": "DF",
      "name": "DAVIES",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "AHMED",
      "club": "Norwich City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 21,
      "position": "MF",
      "name": "OSORIO",
      "club": "Toronto FC (CAN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 22,
      "position": "DF",
      "name": "LARYEA",
      "club": "Toronto FC (CAN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 23,
      "position": "DF",
      "name": "SIGUR",
      "club": "HNK Hajduk Split (CRO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 24,
      "position": "FW",
      "name": "PROMISE",
      "club": "Royale Union Saint-Gilloise (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 25,
      "position": "MF",
      "name": "SALIBA",
      "club": "RSC Anderlecht (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    },
    {
      "number": 26,
      "position": "MF",
      "name": "MARCELO",
      "club": "Tigres UANL (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/canada/"
    }
  ],
  "chequia": [
    {
      "number": 1,
      "position": "GK",
      "name": "KOVAR",
      "club": "PSV Eindhoven (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "ZIMA",
      "club": "SK Slavia Praha (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "HOLES",
      "club": "SK Slavia Praha (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "HRANAC",
      "club": "TSG Hoffenheim (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "COUFAL",
      "club": "TSG Hoffenheim (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "CHALOUPEK",
      "club": "SK Slavia Praha (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 7,
      "position": "DF",
      "name": "KREJCI",
      "club": "Wolverhampton Wanderers FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "DARIDA",
      "club": "FC Hradec Králové (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "HLOZEK",
      "club": "TSG Hoffenheim (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "SCHICK",
      "club": "Bayer Leverkusen (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "KUCHTA",
      "club": "AC Sparta Praha (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 12,
      "position": "MF",
      "name": "CERV",
      "club": "FC Viktoria Plze ň (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 13,
      "position": "FW",
      "name": "CHYTIL",
      "club": "SK Slavia Praha (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "JURASEK",
      "club": "SK Slavia Praha (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 15,
      "position": "FW",
      "name": "SULC",
      "club": "Olympique Lyonnais (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 16,
      "position": "GK",
      "name": "STANEK",
      "club": "SK Slavia Praha (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "PROVOD",
      "club": "SK Slavia Praha (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 18,
      "position": "MF",
      "name": "SADILEK",
      "club": "SK Slavia Praha (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "CHORY",
      "club": "SK Slavia Praha (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 20,
      "position": "DF",
      "name": "ZELENY",
      "club": "AC Sparta Praha (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 21,
      "position": "DF",
      "name": "DOUDERA",
      "club": "SK Slavia Praha (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 22,
      "position": "MF",
      "name": "SOUCEK",
      "club": "West Ham United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "HORNICEK",
      "club": "SC Braga (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 24,
      "position": "MF",
      "name": "SOJKA",
      "club": "FC Viktoria Plze ň (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 25,
      "position": "MF",
      "name": "SOCHUREK",
      "club": "AC Sparta Praha (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "VISINSKY",
      "club": "FC Viktoria Plze ň (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/czech-republic/"
    }
  ],
  "colombia": [
    {
      "number": 1,
      "position": "GK",
      "name": "OSPINA",
      "club": "Atlético Nacional (COL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "D. MUÑOZ",
      "club": "Crystal Palace FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "J. LUCUMI",
      "club": "Bologna FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "ARIAS",
      "club": "CA Independiente (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 5,
      "position": "MF",
      "name": "K. CASTAÑO",
      "club": "CA River Plate (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "RICHARD RIOS",
      "club": "SL Ben\u0000ca (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "LUIS DIAZ",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "CARRASCAL",
      "club": "CR Flamengo (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "CORDOBA",
      "club": "FC Krasnodar (RUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "JAMES",
      "club": "Minnesota United FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "J. ARIAS",
      "club": "SE Palmeiras (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "C. VARGAS",
      "club": "Atlas FC (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "Y. MINA",
      "club": "Cagliari (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "PUERTA",
      "club": "Racing Santander (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "PORTILLA",
      "club": "Athletico Paranaense (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "J. LERMA",
      "club": "Crystal Palace FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 17,
      "position": "DF",
      "name": "J. MOJICA",
      "club": "RCD Mallorca (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 18,
      "position": "DF",
      "name": "W. DITTA",
      "club": "CF Cruz Azul (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "C. HERNANDEZ",
      "club": "Real Betis (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "QUINTERO",
      "club": "CA River Plate (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "CAMPAZ",
      "club": "CA Rosario Central (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 22,
      "position": "DF",
      "name": "MACHADO",
      "club": "FC Nantes (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 23,
      "position": "DF",
      "name": "SANCHEZ",
      "club": "Galatasaray SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 24,
      "position": "GK",
      "name": "MONTERO",
      "club": "CA Vélez Sars\u0000eld (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 25,
      "position": "FW",
      "name": "SUAREZ",
      "club": "Sporting CP (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "A. GOMEZ",
      "club": "CR Vasco Da Gama (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/colombia/"
    }
  ],
  "corea-del-sur": [
    {
      "number": 1,
      "position": "GK",
      "name": "SEUNGGYU",
      "club": "FC Tokyo (JPN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "HANBEOM",
      "club": "FC Midtjylland (DEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 3,
      "position": "MF",
      "name": "GIHYUK",
      "club": "Gangwon FC (KOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "MINJAE",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "TAEHYEON",
      "club": "Kashima Antlers (JPN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "INBEOM",
      "club": "Feyenoord Rotterdam (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "HEUNGMIN",
      "club": "LAFC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "SEUNGHO",
      "club": "Birmingham City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "GUSEUNG",
      "club": "FC Midtjylland (DEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "JAESUNG",
      "club": "1. FSV Mainz 05 (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "HEECHAN",
      "club": "Wolverhampton Wanderers FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "BUMKEUN",
      "club": "Jeonbuk Hyundai Motors FC (KOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "TAESEOK",
      "club": "FK Austria Wien (AUT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "WIJE",
      "club": "Jeonbuk Hyundai Motors FC (KOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "MOONHWAN",
      "club": "Daejeon Hana Citizen FC (KOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 16,
      "position": "DF",
      "name": "JINSEOB",
      "club": "Zhejiang FC (CHN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "JUNHO",
      "club": "Stoke City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "HYEONGYU",
      "club": "Be ş ikta ş  JK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "KANGIN",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "HYUNJUN",
      "club": "Celtic FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 21,
      "position": "GK",
      "name": "HYEONWOO",
      "club": "Ulsan HD (KOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 22,
      "position": "DF",
      "name": "YOUNGWOO",
      "club": "FK Crvena Zvezda (SRB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 23,
      "position": "DF",
      "name": "JENS",
      "club": "Borussia Mönchengladbach (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 24,
      "position": "MF",
      "name": "JINGYU",
      "club": "Jeonbuk Hyundai Motors FC (KOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 25,
      "position": "MF",
      "name": "JISUNG",
      "club": "Swansea City AFC (WAL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    },
    {
      "number": 26,
      "position": "MF",
      "name": "DONGGYEONG",
      "club": "Ulsan HD (KOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-korea/"
    }
  ],
  "costa-de-marfil": [
    {
      "number": 1,
      "position": "GK",
      "name": "Y. FOFANA",
      "club": "Çaykur Rizespor (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "O. DIOMANDE",
      "club": "Sporting CP (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "G. KONAN",
      "club": "Gil Vicente FC (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 4,
      "position": "MF",
      "name": "SERI",
      "club": "NK Maribor (SVN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "SINGO",
      "club": "Galatasaray SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "FOFANA",
      "club": "FC Porto (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 7,
      "position": "DF",
      "name": "KOSSOUNOU",
      "club": "Atalanta Bergamo (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "KESSIE",
      "club": "Al Ahli FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "BONNY",
      "club": "FC Internazionale Milano (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "ADINGRA",
      "club": "AS Monaco (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "YAN DIOMANDE",
      "club": "RB Leipzig (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 12,
      "position": "FW",
      "name": "WAHI",
      "club": "OGC Nice (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "OPERI",
      "club": "Ba ş ak ş ehir FK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 14,
      "position": "FW",
      "name": "DIAKITE",
      "club": "Cercle Brugge (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 15,
      "position": "FW",
      "name": "AMAD",
      "club": "Manchester United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 16,
      "position": "GK",
      "name": "KONE",
      "club": "Sporting Charleroi (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 17,
      "position": "DF",
      "name": "G. DOUE",
      "club": "RC Strasbourg (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 18,
      "position": "MF",
      "name": "SANGARE",
      "club": "Nottingham Forest FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "PEPE",
      "club": "Villarreal CF (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 20,
      "position": "DF",
      "name": "AGBADOU",
      "club": "Be ş ikta ş  JK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 21,
      "position": "DF",
      "name": "NDICKA",
      "club": "AS Roma (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 22,
      "position": "FW",
      "name": "GUESSAND",
      "club": "Crystal Palace FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "LAFONT",
      "club": "Panathinaikos FC (GRE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 24,
      "position": "FW",
      "name": "TOURE",
      "club": "TSG Hoffenheim (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 25,
      "position": "MF",
      "name": "GUIAGON",
      "club": "Sporting Charleroi (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    },
    {
      "number": 26,
      "position": "MF",
      "name": "INAO",
      "club": "Trabzonspor (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ivory-coast/"
    }
  ],
  "croacia": [
    {
      "number": 1,
      "position": "GK",
      "name": "LIVAKOVIC",
      "club": "GNK Dinamo Zagreb (CRO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "STANISIC",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "PONGRACIC",
      "club": "ACF Fiorentina (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "GVARDIOL",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "CALETA-CAR",
      "club": "Real Sociedad (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "SUTALO",
      "club": "AFC Ajax (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "MORO",
      "club": "Bologna FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "KOVACIC",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "KRAMARIC",
      "club": "TSG Hoffenheim (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "MODRIC",
      "club": "AC Milan (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "BUDIMIR",
      "club": "CA Osasuna (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "PANDUR",
      "club": "Hull City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 13,
      "position": "MF",
      "name": "VLASIC",
      "club": "Torino FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 14,
      "position": "FW",
      "name": "PERISIC",
      "club": "PSV Eindhoven (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "PASALIC",
      "club": "Atalanta Bergamo (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "BATURINA",
      "club": "Como (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "P. SUCIC",
      "club": "FC Internazionale Milano (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 18,
      "position": "DF",
      "name": "JAKIC",
      "club": "FC Augsburg (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "FRUK",
      "club": "HNK Rijeka (CRO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "MATANOVIC",
      "club": "SC Freiburg (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 21,
      "position": "MF",
      "name": "SUCIC",
      "club": "Real Sociedad (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 22,
      "position": "DF",
      "name": "VUSKOVIC",
      "club": "Hamburger SV (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "KOTARSKI",
      "club": "FC København (DEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 24,
      "position": "FW",
      "name": "M. PASALIC",
      "club": "Orlando City SC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "ERLIC",
      "club": "FC Midtjylland (DEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "MUSA",
      "club": "FC Dallas (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/croatia/"
    }
  ],
  "curazao": [
    {
      "number": 1,
      "position": "GK",
      "name": "ROOM",
      "club": "Miami FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "SAMBO",
      "club": "Sparta Rotterdam (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "GAARI",
      "club": "Abha Club (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "VAN EIJMA",
      "club": "RKC Waalwijk (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "FLORANUS",
      "club": "PEC Zwolle (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "ROEMERATOE",
      "club": "RKC Waalwijk (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "J. BACUNA",
      "club": "FC Volendam (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "COMENENCIA",
      "club": "FC Zürich (SUI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "LOCADIA",
      "club": "Miami FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "L. BACUNA",
      "club": "I ğ dır FK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "ANTONISSE",
      "club": "AE Ki\u0000sia FC (GRE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 12,
      "position": "FW",
      "name": "HANSEN",
      "club": "Middlesbrough FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 13,
      "position": "FW",
      "name": "NOSLIN",
      "club": "SC Telstar (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 14,
      "position": "FW",
      "name": "GORRE",
      "club": "Maccabi Haifa FC (ISR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "MARTHA",
      "club": "Rotherham United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 16,
      "position": "FW",
      "name": "MARGARITHA",
      "club": "SK Beveren (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "KUWAS",
      "club": "FC Volendam (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 18,
      "position": "DF",
      "name": "OBISPO",
      "club": "PSV Eindhoven (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "KASTANEER",
      "club": "Terengganu FC (MAS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 20,
      "position": "DF",
      "name": "BRENET",
      "club": "Kayserispor (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 21,
      "position": "MF",
      "name": "CHONG",
      "club": "She\u0000eld United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 22,
      "position": "MF",
      "name": "FELIDA",
      "club": "FC Den Bosch (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 23,
      "position": "DF",
      "name": "BAZOER",
      "club": "Konyaspor (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "FONVILLE",
      "club": "NEC Nijmegen (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 25,
      "position": "GK",
      "name": "BODAK",
      "club": "SC Telstar (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    },
    {
      "number": 26,
      "position": "GK",
      "name": "DOORNBUSCH",
      "club": "VVV Venlo (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/curacao/"
    }
  ],
  "ecuador": [
    {
      "number": 1,
      "position": "GK",
      "name": "GALINDEZ",
      "club": "CA Huracán (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "TORRES",
      "club": "SC Internacional (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "HINCAPIE",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "ORDOÑEZ",
      "club": "Club Brugge (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 5,
      "position": "MF",
      "name": "ALCIVAR",
      "club": "Independiente Del Valle (ECU)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "PACHO",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 7,
      "position": "DF",
      "name": "ESTUPIÑAN",
      "club": "AC Milan (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "A. VALENCIA",
      "club": "Royal Antwerp FC (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "YEBOAH ZAMORA",
      "club": "Venezia FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "PAEZ",
      "club": "CA River Plate (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "RODRIGUEZ",
      "club": "Royale Union Saint-Gilloise (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "RAMIREZ",
      "club": "AE Ki\u0000sia FC (GRE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 13,
      "position": "FW",
      "name": "E. VALENCIA",
      "club": "CF Pachuca (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "MINDA",
      "club": "Atlético Mineiro (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "VITE",
      "club": "Pumas UNAM (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 16,
      "position": "FW",
      "name": "J. CAICEDO",
      "club": "CA Huracán (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 17,
      "position": "DF",
      "name": "PRECIADO",
      "club": "Atlético Mineiro (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 18,
      "position": "MF",
      "name": "CASTILLO",
      "club": "FC Midtjylland (DEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "PLATA",
      "club": "CR Flamengo (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "ANGULO",
      "club": "Sunderland AFC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 21,
      "position": "MF",
      "name": "FRANCO",
      "club": "Atlético Mineiro (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 22,
      "position": "GK",
      "name": "VALLE",
      "club": "LDU Quito (ECU)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 23,
      "position": "MF",
      "name": "M. CAICEDO",
      "club": "Chelsea FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 24,
      "position": "FW",
      "name": "AREVALO",
      "club": "VfB Stuttgart (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "POROZO",
      "club": "Club Tijuana (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "MEDINA",
      "club": "KRC Genk (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ecuador/"
    }
  ],
  "egipto": [
    {
      "number": 1,
      "position": "GK",
      "name": "M. ELSHENAWY",
      "club": "Al Ahly FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "YASSER",
      "club": "Al Ahly FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "M. HANY",
      "club": "Al Ahly FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "HOSSAM",
      "club": "Zamalek SC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "R. RABIAA",
      "club": "Al Ain FC (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "M. ABDELMONEIM",
      "club": "OGC Nice (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "M. TREZEGUET",
      "club": "Al Ahly FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "E. ASHOUR",
      "club": "Al Ahly FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "ABDELKARIM",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "M. SALAH",
      "club": "Liverpool FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "ZICO",
      "club": "Pyramids FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 12,
      "position": "FW",
      "name": "H. HASSAN",
      "club": "Real Oviedo (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "A. FATOUH",
      "club": "Zamalek SC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "H. FATHY",
      "club": "Al Wakrah SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "K. HAFEZ",
      "club": "Pyramids FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 16,
      "position": "GK",
      "name": "M. SOLIMAN",
      "club": "Zamalek SC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "M. LASHIN",
      "club": "Pyramids FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 18,
      "position": "MF",
      "name": "DONGA",
      "club": "Al Najmah SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "M. ATTIA",
      "club": "Al Ahly FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "I. ADEL",
      "club": "FC Nordsjælland (DEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 21,
      "position": "MF",
      "name": "M. SABER",
      "club": "ZED FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 22,
      "position": "FW",
      "name": "MARMOUSH",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "SHOUBIR",
      "club": "Al Ahly FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "T. ALAA",
      "club": "ZED FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 25,
      "position": "FW",
      "name": "ZIZO",
      "club": "Al Ahly FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    },
    {
      "number": 26,
      "position": "GK",
      "name": "M. ALAA",
      "club": "El Gouna FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/egypt/"
    }
  ],
  "escocia": [
    {
      "number": 1,
      "position": "GK",
      "name": "GUNN",
      "club": "Nottingham Forest FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "HICKEY",
      "club": "Brentford FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "ROBERTSON",
      "club": "Liverpool FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 4,
      "position": "MF",
      "name": "MCTOMINAY",
      "club": "SSC Napoli (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "HANLEY",
      "club": "Hibernian FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "TIERNEY",
      "club": "Celtic FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "MCGINN",
      "club": "Aston Villa FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "FLETCHER",
      "club": "Manchester United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "DYKES",
      "club": "Charlton Athletic FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "ADAMS",
      "club": "Torino FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "CHRISTIE",
      "club": "AFC Bournemouth (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "KELLY",
      "club": "Rangers FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "HENDRY",
      "club": "Al Ettifaq FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 14,
      "position": "FW",
      "name": "STEWART",
      "club": "Southampton FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "SOUTTAR",
      "club": "Rangers FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 16,
      "position": "DF",
      "name": "HYAM",
      "club": "Wrexham AFC (WAL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "GANNON DOAK",
      "club": "AFC Bournemouth (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "HIRST",
      "club": "Ipswich Town FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "FERGUSON",
      "club": "Bologna FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "SHANKLAND",
      "club": "Heart Of Midlothian FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 21,
      "position": "GK",
      "name": "GORDON",
      "club": "Heart Of Midlothian FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 22,
      "position": "DF",
      "name": "PATTERSON",
      "club": "Everton FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 23,
      "position": "MF",
      "name": "MCLEAN",
      "club": "Norwich City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "RALSTON",
      "club": "Celtic FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 25,
      "position": "FW",
      "name": "CURTIS",
      "club": "Kilmarnock FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "MCKENNA",
      "club": "GNK Dinamo Zagreb (CRO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/scotland/"
    }
  ],
  "espana": [
    {
      "number": 1,
      "position": "GK",
      "name": "RAYA",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "MARC PUBILL",
      "club": "Atlético De Madrid (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "GRIMALDO",
      "club": "Bayer Leverkusen (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "ERIC",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "M. LLORENTE",
      "club": "Atlético De Madrid (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "MERINO",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "FERRAN",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "FABIÁN",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 9,
      "position": "MF",
      "name": "GAVI",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "OLMO",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "JEREMY",
      "club": "Crystal Palace FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 12,
      "position": "DF",
      "name": "PEDRO PORRO",
      "club": "Tottenham Hotspur FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 13,
      "position": "GK",
      "name": "JOAN GARCÍA",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "LAPORTE",
      "club": "Athletic Club (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "ALEX B.",
      "club": "Atlético De Madrid (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "RODRIGO",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "WILLIAMS JR",
      "club": "Athletic Club (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 18,
      "position": "MF",
      "name": "ZUBIMENDI",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "LAMINE YAMAL",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "PEDRI",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "OYARZABAL",
      "club": "Real Sociedad (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 22,
      "position": "DF",
      "name": "CUBARSI",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "UNAI SIMÓN",
      "club": "Athletic Club (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "CUCURELLA",
      "club": "Chelsea FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 25,
      "position": "FW",
      "name": "VICTOR M.V.",
      "club": "CA Osasuna (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "B. IGLESIAS",
      "club": "RC Celta Vigo (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/spain/"
    }
  ],
  "estados-unidos": [
    {
      "number": 1,
      "position": "GK",
      "name": "TURNER",
      "club": "New England Revolution (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "DEST",
      "club": "PSV Eindhoven (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "RICHARDS",
      "club": "Crystal Palace FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 4,
      "position": "MF",
      "name": "ADAMS",
      "club": "AFC Bournemouth (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "A. ROBINSON",
      "club": "Fulham FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "TRUSTY",
      "club": "Celtic FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "REYNA",
      "club": "Borussia Mönchengladbach (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "MCKENNIE",
      "club": "Juventus FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "PEPI",
      "club": "PSV Eindhoven (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "PULISIC",
      "club": "AC Milan (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "AARONSON",
      "club": "Leeds United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 12,
      "position": "DF",
      "name": "M. ROBINSON",
      "club": "FC Cincinnatti (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "REAM",
      "club": "Charlotte FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "BERHALTER",
      "club": "Vancouver Whitecaps FC (CAN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "ROLDAN",
      "club": "Seattle Sounders FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 16,
      "position": "DF",
      "name": "FREEMAN",
      "club": "Villarreal CF (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "TILLMAN",
      "club": "Bayer Leverkusen (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 18,
      "position": "DF",
      "name": "ARFSTEN",
      "club": "Columbus Crew (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "WRIGHT",
      "club": "Coventry City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "BALOGUN",
      "club": "AS Monaco (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "WEAH",
      "club": "Olympique Marseille (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 22,
      "position": "DF",
      "name": "MCKENZIE",
      "club": "Toulouse FC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 23,
      "position": "DF",
      "name": "SCALLY",
      "club": "Borussia Mönchengladbach (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 24,
      "position": "GK",
      "name": "FREESE",
      "club": "New York City FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 25,
      "position": "GK",
      "name": "BRADY",
      "club": "Chicago Fire FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "ZENDEJAS",
      "club": "Club América (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/united-states/"
    }
  ],
  "francia": [
    {
      "number": 1,
      "position": "GK",
      "name": "SAMBA",
      "club": "Stade Rennais FC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "GUSTO",
      "club": "Chelsea FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "DIGNE",
      "club": "Aston Villa FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "UPAMECANO",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "KOUNDE",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "KONE",
      "club": "AS Roma (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "DEMBELE",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "TCHOUAMENI",
      "club": "Real Madrid C. F. (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "THURAM",
      "club": "FC Internazionale Milano (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "MBAPPE",
      "club": "Real Madrid C. F. (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "OLISE",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 12,
      "position": "FW",
      "name": "BARCOLA",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 13,
      "position": "MF",
      "name": "KANTE",
      "club": "Fenerbahçe SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "RABIOT",
      "club": "AC Milan (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "KONATE",
      "club": "Liverpool FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 16,
      "position": "GK",
      "name": "MAIGNAN",
      "club": "AC Milan (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 17,
      "position": "DF",
      "name": "SALIBA",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 18,
      "position": "MF",
      "name": "ZAIRE EMERY",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 19,
      "position": "DF",
      "name": "T. HERNANDEZ",
      "club": "Al Hilal SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "DOUE",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 21,
      "position": "DF",
      "name": "L. HERNANDEZ",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 22,
      "position": "FW",
      "name": "MATETA",
      "club": "Crystal Palace FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "RISSER",
      "club": "RC Lens (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 24,
      "position": "MF",
      "name": "CHERKI",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 25,
      "position": "MF",
      "name": "AKLIOUCHE",
      "club": "AS Monaco (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "LACROIX",
      "club": "Crystal Palace FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/france/"
    }
  ],
  "ghana": [
    {
      "number": 1,
      "position": "GK",
      "name": "ZIGI",
      "club": "FC St. Gallen (SUI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "SEIDU",
      "club": "Stade Rennais FC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 3,
      "position": "MF",
      "name": "CALEB",
      "club": "FC Nordsjælland (DEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "ADJETEY",
      "club": "VfL Wolfsburg (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 5,
      "position": "MF",
      "name": "THOMAS",
      "club": "Villarreal CF (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "SULEMAN",
      "club": "Rayo Vallecano (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "FATAWU",
      "club": "Leicester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "SIBO",
      "club": "Real Oviedo (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "AYEW",
      "club": "Leicester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "ASANTE",
      "club": "Coventry City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "SEMENYO",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "ANANG",
      "club": "St Patrick's Athletic FC (IRL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 13,
      "position": "FW",
      "name": "BAAH",
      "club": "Al Qadsiah FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "MENSAH",
      "club": "AJ Auxerre (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "OWUSU",
      "club": "AJ Auxerre (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 16,
      "position": "GK",
      "name": "ASARE",
      "club": "Hearts Of Oak SC (GHA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 17,
      "position": "DF",
      "name": "BABA",
      "club": "PAOK Saloniki (GRE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 18,
      "position": "DF",
      "name": "OPOKU",
      "club": "Ba ş ak ş ehir FK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "WILLIAMS",
      "club": "Athletic Club (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "BOAKYE",
      "club": "AS Saint-Etienne (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 21,
      "position": "DF",
      "name": "PEPRAH",
      "club": "OGC Nice (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 22,
      "position": "FW",
      "name": "KAMALDEEN",
      "club": "Atalanta Bergamo (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 23,
      "position": "DF",
      "name": "LUCKASSEN",
      "club": "Pafos FC (CYP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 24,
      "position": "FW",
      "name": "NUAMAH",
      "club": "Olympique Lyonnais (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 25,
      "position": "FW",
      "name": "ADU",
      "club": "FC Viktoria Plze ň (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "SENEYA",
      "club": "AJ Auxerre (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/ghana/"
    }
  ],
  "haiti": [
    {
      "number": 1,
      "position": "GK",
      "name": "PLACIDE",
      "club": "SC Bastia (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "ARCUS",
      "club": "Angers SCO (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "THERMONCY",
      "club": "BSC Young Boys (SUI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "ADE",
      "club": "LDU Quito (ECU)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "DELCROIX",
      "club": "FC Lugano (SUI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "SAINTE",
      "club": "El Paso Locomotive FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "ETIENNE JR",
      "club": "Toronto FC (CAN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 8,
      "position": "DF",
      "name": "EXPERIENCE",
      "club": "AS Nancy (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "NAZON",
      "club": "Esteghlal Tehran FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "BELLEGARDE",
      "club": "Wolverhampton Wanderers FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "DEEDSON",
      "club": "FC Dallas (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "A. PIERRE",
      "club": "FC Sochaux-Montbéliard (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "LACROIX",
      "club": "Colorado Springs Switchbacks FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "L. PIERRE",
      "club": "FC Vizela (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 15,
      "position": "FW",
      "name": "PROVIDENCE",
      "club": "Almere City FC (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 16,
      "position": "FW",
      "name": "JOSEPH",
      "club": "Ferencvárosi TC (HUN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "JEAN JACQUES",
      "club": "Philadelphia Union (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "ISIDOR",
      "club": "Sunderland AFC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "FORTUNE",
      "club": "FC Vizela (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "PIERROT",
      "club": "Çaykur Rizespor (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "CASIMIR",
      "club": "AJ Auxerre (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 22,
      "position": "DF",
      "name": "DUVERNE",
      "club": "KAA Gent (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "DUVERGER",
      "club": "FC Cosmos Koblenz (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "PAUGIN",
      "club": "SV Zulte Waregem (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 25,
      "position": "MF",
      "name": "SIMON",
      "club": "FC Tatran Pre š ov (SVK)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    },
    {
      "number": 26,
      "position": "MF",
      "name": "W. PIERRE",
      "club": "Violette AC (HAI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/haiti/"
    }
  ],
  "inglaterra": [
    {
      "number": 1,
      "position": "GK",
      "name": "PICKFORD",
      "club": "Everton FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "KONSA",
      "club": "Aston Villa FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "O'REILLY",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 4,
      "position": "MF",
      "name": "RICE",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "STONES",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "GUEHI",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "SAKA",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "ANDERSON",
      "club": "Nottingham Forest FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "KANE",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "BELLINGHAM",
      "club": "Real Madrid C. F. (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "RASHFORD",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 12,
      "position": "DF",
      "name": "LIVRAMENTO",
      "club": "Newcastle United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 13,
      "position": "GK",
      "name": "D. HENDERSON",
      "club": "Crystal Palace FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "J. HENDERSON",
      "club": "Brentford FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "BURN",
      "club": "Newcastle United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "MAINOO",
      "club": "Manchester United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "ROGERS",
      "club": "Aston Villa FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "GORDON",
      "club": "Newcastle United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "WATKINS",
      "club": "Aston Villa FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "MADUEKE",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 21,
      "position": "MF",
      "name": "EZE",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 22,
      "position": "FW",
      "name": "TONEY",
      "club": "Al Ahli FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "TRAFFORD",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "JAMES",
      "club": "Chelsea FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "SPENCE",
      "club": "Tottenham Hotspur FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "QUANSAH",
      "club": "Bayer Leverkusen (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/england/"
    }
  ],
  "irak": [
    {
      "number": 1,
      "position": "GK",
      "name": "FAHAD",
      "club": "Al Talaba SC (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "REBIN",
      "club": "Port FC (THA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "HUSSEIN",
      "club": "Pogo ń  Szczecin (POL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "ZAID T.",
      "club": "Pakhtakor Tashkent FK (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "AKAM",
      "club": "Al Zawra'a SC (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "MUNAF",
      "club": "Al Shorta SC (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "YOUSSEF",
      "club": "AEK Larnaca FC (CYP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "IBRAHIM",
      "club": "Al Dhafra SCC (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "AL-HAMADI",
      "club": "Luton Town FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "MOHANAD",
      "club": "Dibba FC (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "AHMED Q.",
      "club": "Nashville SC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "JALAL",
      "club": "Al Zawra'a SC (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 13,
      "position": "FW",
      "name": "ALI Y.",
      "club": "Al Talaba SC (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "Z. IQBAL",
      "club": "FC Utrecht (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "AHMED",
      "club": "Al Shorta SC (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "AL-AMMARI",
      "club": "KS Cracovia (POL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "ALI J.",
      "club": "Al Najmah SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "AYMEN",
      "club": "Al Karma SC (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "K. YAKOB",
      "club": "Aarhus GF (DEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "AIMAR",
      "club": "Sarpsborg 08 FF (NOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "MARKO",
      "club": "Venezia FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 22,
      "position": "GK",
      "name": "AHMED B.",
      "club": "Al Shorta SC (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 23,
      "position": "DF",
      "name": "DOSKI",
      "club": "FC Viktoria Plze ň (CZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 24,
      "position": "MF",
      "name": "ZAID I.",
      "club": "Al Talaba SC (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "MUSTAFA",
      "club": "Al Shorta SC (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "FRANS",
      "club": "Persib Bandung (IDN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iraq/"
    }
  ],
  "iran": [
    {
      "number": 1,
      "position": "GK",
      "name": "BEIRANVAND",
      "club": "Tractor Sazi Tabriz FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "SALEH",
      "club": "Esteghlal Tehran FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "E. HAJISAFI",
      "club": "Sepahan SC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "SHOJA",
      "club": "Tractor Sazi Tabriz FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "M. MOHAMMADI",
      "club": "Persepolis FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "S. EZATOLAHI",
      "club": "Shabab Al Ahli Club (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "A. JAHANBAKHSH",
      "club": "FCV Dender EH (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "M. MOHEBI",
      "club": "FC Rostov (RUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "TAREMI",
      "club": "Olympiacos FC (GRE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "MEHDI GHAYEDI",
      "club": "Al Nasr SC (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "A. ALIPOUR",
      "club": "Persepolis FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "PAYAM",
      "club": "Persepolis FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "KANANI",
      "club": "Persepolis FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "GHODDOOS",
      "club": "Al Ittihad Kalba SCC (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "ROOZBEH",
      "club": "Esteghlal Tehran FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "M. TORABI",
      "club": "Tractor Sazi Tabriz FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 17,
      "position": "DF",
      "name": "ARYA",
      "club": "Sepahan SC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "AMIRHOSSEIN",
      "club": "Tractor Sazi Tabriz FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 19,
      "position": "DF",
      "name": "ALI",
      "club": "Foolad Khuzestan FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "SHAHRIYAR",
      "club": "Al Ittihad Kalba SCC (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 21,
      "position": "MF",
      "name": "MOHAMMAD",
      "club": "Al Wahda SC (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 22,
      "position": "GK",
      "name": "HOSSEINI",
      "club": "Sepahan SC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 23,
      "position": "DF",
      "name": "RAMIN",
      "club": "Foolad Khuzestan FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 24,
      "position": "FW",
      "name": "DARGAHI",
      "club": "Standard Liège (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "DANIAL",
      "club": "Malavan Anzali FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    },
    {
      "number": 26,
      "position": "MF",
      "name": "RAZAGH",
      "club": "Esteghlal Tehran FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/iran/"
    }
  ],
  "japon": [
    {
      "number": 1,
      "position": "GK",
      "name": "SUZUKI",
      "club": "Parma (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "SUGAWARA",
      "club": "SV Werder Bremen (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "TANIGUCHI",
      "club": "Sint-Truiden VV (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "ITAKURA",
      "club": "AFC Ajax (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "NAGATOMO",
      "club": "FC Tokyo (JPN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "ENDO",
      "club": "Liverpool FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "TANAKA",
      "club": "Leeds United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "KUBO",
      "club": "Real Sociedad (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "GOTO",
      "club": "Sint-Truiden VV (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "DOAN",
      "club": "Eintracht Frankfurt (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "DAIZEN",
      "club": "Celtic FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "OSAKO",
      "club": "Sanfrecce Hiroshima (JPN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 13,
      "position": "MF",
      "name": "NAKAMURA",
      "club": "Stade Reims (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "ITO",
      "club": "KRC Genk (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "KAMADA",
      "club": "Crystal Palace FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 16,
      "position": "DF",
      "name": "WATANABE",
      "club": "Feyenoord Rotterdam (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "Y. SUZUKI",
      "club": "SC Freiburg (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "AYASE",
      "club": "Feyenoord Rotterdam (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "OGAWA",
      "club": "NEC Nijmegen (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 20,
      "position": "DF",
      "name": "SEKO",
      "club": "Le Havre AC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 21,
      "position": "DF",
      "name": "H. ITO",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 22,
      "position": "DF",
      "name": "TOMIYASU",
      "club": "AFC Ajax (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "HAYAKAWA",
      "club": "Kashima Antlers (JPN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 24,
      "position": "MF",
      "name": "SANO",
      "club": "1. FSV Mainz 05 (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "J. SUZUKI",
      "club": "FC København (DEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "SHIOGAI",
      "club": "VfL Wolfsburg (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/japan/"
    }
  ],
  "jordania": [
    {
      "number": 1,
      "position": "GK",
      "name": "YAZEED",
      "club": "Al Hussein SC (JOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "ABU HASHEESH",
      "club": "Al Karma SC (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "NASIB",
      "club": "Al Zawra'a SC (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "ABU DHAB",
      "club": "Al Faisaly SC (JOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "ALARAB",
      "club": "FC Seoul (KOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "JAMOUS",
      "club": "Al Zawra'a SC (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "ABU ZRAIQ",
      "club": "Raja Casablanca (MAR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "ALRAWABDEH",
      "club": "Selangor FC (MAS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "OLWAN",
      "club": "Al Sailiya SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "ALTAMARI",
      "club": "Stade Rennais FC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "ODEH",
      "club": "Pyramids FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "BANI ATEYAH",
      "club": "Al Faisaly SC (JOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 13,
      "position": "FW",
      "name": "ALMARDI",
      "club": "Al Hussein SC (JOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "RAJAEI",
      "club": "Al Hussein SC (JOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "SADEH",
      "club": "Al Karma SC (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 16,
      "position": "DF",
      "name": "ABULNADI",
      "club": "Selangor FC (MAS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 17,
      "position": "DF",
      "name": "SALEM",
      "club": "Al Hussein SC (JOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "SABRA",
      "club": "NK Lokomotiva Zagreb (CRO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 19,
      "position": "DF",
      "name": "SAEED",
      "club": "Al Hussein SC (JOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "ABU TAHA",
      "club": "Al-Quwa Al-Jawiya (IRQ)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 21,
      "position": "MF",
      "name": "NIZAR",
      "club": "Qatar SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 22,
      "position": "GK",
      "name": "ALFAKHORI",
      "club": "Al Wahdat SC (JOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 23,
      "position": "DF",
      "name": "EHSAN",
      "club": "Al Hussein SC (JOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 24,
      "position": "FW",
      "name": "AZAIZEH",
      "club": "Al Shabab FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 25,
      "position": "MF",
      "name": "ALDAOUD",
      "club": "Al Wahdat SC (JOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "BADAWI",
      "club": "Al Faisaly SC (JOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/jordan/"
    }
  ],
  "marruecos": [
    {
      "number": 1,
      "position": "GK",
      "name": "BONO",
      "club": "Al Hilal SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "HAKIMI",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "MAZRAOUI",
      "club": "Manchester United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 4,
      "position": "MF",
      "name": "AMRABAT",
      "club": "Real Betis (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "AGUERD",
      "club": "Olympique Marseille (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "BOUADDI",
      "club": "Lille OSC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "TALBI",
      "club": "Sunderland AFC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "OUAHI",
      "club": "Girona FC (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "RAHIMI",
      "club": "Al Ain FC (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "BRAHIM",
      "club": "Real Madrid C. F. (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "SAIBARI",
      "club": "PSV Eindhoven (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "EL KAJOUI",
      "club": "RS Berkane (MAR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "EL OUAHDI",
      "club": "KRC Genk (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "ISSA",
      "club": "Fulham FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "EL MOURABET",
      "club": "RC Strasbourg (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "YASSINE",
      "club": "RC Strasbourg (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "EZZALZOULI",
      "club": "Real Betis (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 18,
      "position": "DF",
      "name": "RIAD",
      "club": "Crystal Palace FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 19,
      "position": "DF",
      "name": "BELAMMARI",
      "club": "Al Ahly FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "EL KAABI",
      "club": "Olympiacos FC (GRE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "AMAIMOUNI",
      "club": "Eintracht Frankfurt (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 22,
      "position": "GK",
      "name": "TAGNAOUTI",
      "club": "ASFAR (MAR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 23,
      "position": "MF",
      "name": "EL KHANNOUSS",
      "club": "VfB Stuttgart (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 24,
      "position": "MF",
      "name": "EL AYNAOUI",
      "club": "AS Roma (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "HALHAL",
      "club": "KV Mechelen (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "SALAH-EDDINE",
      "club": "PSV Eindhoven (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/morocco/"
    }
  ],
  "mexico": [
    {
      "number": 1,
      "position": "GK",
      "name": "R. RANGEL",
      "club": "CD Guadalajara (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "J. SÁNCHEZ",
      "club": "PAOK Saloniki (GRE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "C. MONTES",
      "club": "FC Lokomotiv Moscow (RUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "E. ÁLVAREZ",
      "club": "Fenerbahçe SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "J. VÁSQUEZ",
      "club": "Genoa CFC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "E. LIRA",
      "club": "CF Cruz Azul (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "L. ROMO",
      "club": "CD Guadalajara (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "FIDALGO",
      "club": "Real Betis (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "RAÚL",
      "club": "Fulham FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "A. VEGA",
      "club": "Deportivo Toluca FC (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "S. GIMÉNEZ",
      "club": "AC Milan (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "C. ACEVEDO",
      "club": "Club Santos Laguna (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 13,
      "position": "GK",
      "name": "G. OCHOA",
      "club": "AEL Limassol (CYP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 14,
      "position": "FW",
      "name": "A. GONZÁLEZ",
      "club": "CD Guadalajara (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "I. REYES",
      "club": "Club América (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 16,
      "position": "FW",
      "name": "J. QUIÑONES",
      "club": "Al Qadsiah FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "ORBELÍN",
      "club": "AEK Athens (GRE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 18,
      "position": "MF",
      "name": "O. VARGAS",
      "club": "Atlético De Madrid (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "G. MORA",
      "club": "Club Tijuana (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 20,
      "position": "DF",
      "name": "M. CHÁVEZ",
      "club": "AZ Alkmaar (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "C. HUERTA",
      "club": "RSC Anderlecht (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 22,
      "position": "FW",
      "name": "G. MARTÍNEZ",
      "club": "Pumas UNAM (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 23,
      "position": "DF",
      "name": "J. GALLARDO",
      "club": "Deportivo Toluca FC (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 24,
      "position": "MF",
      "name": "L. CHÁVEZ",
      "club": "FC Dynamo Moscow (RUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 25,
      "position": "FW",
      "name": "R. ALVARADO",
      "club": "CD Guadalajara (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    },
    {
      "number": 26,
      "position": "MF",
      "name": "B. GUTIÉRREZ",
      "club": "CD Guadalajara (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/mexico/"
    }
  ],
  "noruega": [
    {
      "number": 1,
      "position": "GK",
      "name": "NYLAND",
      "club": "Sevilla FC (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 2,
      "position": "MF",
      "name": "THORSBY",
      "club": "US Cremonese (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "VASSBAKK AJER",
      "club": "Brentford FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "ØSTIGÅRD",
      "club": "Genoa CFC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "MØLLER WOLFE",
      "club": "Wolverhampton Wanderers FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "BERG",
      "club": "FK Bodø/Glimt (NOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "SØRLOTH",
      "club": "Atlético De Madrid (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "BERGE",
      "club": "Fulham FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "BRAUT HAALAND",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "ØDEGAARD",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "STRAND LARSEN",
      "club": "Crystal Palace FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "TANGVIK",
      "club": "Hamburger SV (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 13,
      "position": "GK",
      "name": "SELVIK",
      "club": "Watford FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "AURSNES",
      "club": "SL Ben\u0000ca (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "BJØRKAN",
      "club": "FK Bodø/Glimt (NOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 16,
      "position": "DF",
      "name": "HOLMGREN",
      "club": "Torino FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 17,
      "position": "DF",
      "name": "HEGGEM",
      "club": "Bologna FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 18,
      "position": "MF",
      "name": "THORSTVEDT",
      "club": "US Sassuolo (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "AASGAARD",
      "club": "Rangers FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "NUSA",
      "club": "RB Leipzig (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 21,
      "position": "MF",
      "name": "SCHJELDERUP",
      "club": "SL Ben\u0000ca (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 22,
      "position": "MF",
      "name": "BOBB",
      "club": "Fulham FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 23,
      "position": "MF",
      "name": "HAUGE",
      "club": "FK Bodø/Glimt (NOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "LANGÅS",
      "club": "Derby County FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "FALCHENER",
      "club": "Viking Stavanger (NOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "RYERSON",
      "club": "Borussia Dortmund (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/norway/"
    }
  ],
  "nueva-zelanda": [
    {
      "number": 1,
      "position": "GK",
      "name": "CROCOMBE",
      "club": "Millwall FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "PAYNE",
      "club": "Wellington Phoenix FC (NZL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "DE VRIES",
      "club": "Auckland FC (NZL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "BINDON",
      "club": "She\u0000eld United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "BOXALL",
      "club": "Minnesota United FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "BELL",
      "club": "Viking Stavanger (NOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "GARBETT",
      "club": "Peterborough United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "STAMENIC",
      "club": "Swansea City AFC (WAL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "WOOD",
      "club": "Nottingham Forest FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "SINGH",
      "club": "Wellington Phoenix FC (NZL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "JUST",
      "club": "Motherwell FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "PAULSEN",
      "club": "Lechia Gda ń sk (POL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "CACACE",
      "club": "Wrexham AFC (WAL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "RUFER",
      "club": "Wellington Phoenix FC (NZL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "PIJNAKER",
      "club": "Auckland FC (NZL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 16,
      "position": "DF",
      "name": "SURMAN",
      "club": "Portland Timbers (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "BARBAROUSES",
      "club": "WS Wanderers FC (AUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "WAINE",
      "club": "Port Vale FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "OLD",
      "club": "AS Saint-Etienne (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "MCCOWATT",
      "club": "Silkeborg IF (DEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "RANDALL",
      "club": "Auckland FC (NZL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 22,
      "position": "GK",
      "name": "WOUD",
      "club": "Auckland FC (NZL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 23,
      "position": "MF",
      "name": "THOMAS",
      "club": "PEC Zwolle (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "ELLIOT",
      "club": "Auckland FC (NZL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 25,
      "position": "MF",
      "name": "BAYLISS",
      "club": "Newcastle United Jets FC (AUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "SMITH",
      "club": "Braintree Town FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/new-zealand/"
    }
  ],
  "paises-bajos": [
    {
      "number": 1,
      "position": "GK",
      "name": "VERBRUGGEN",
      "club": "Brighton & Hove Albion FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "J. TIMBER",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 3,
      "position": "MF",
      "name": "DE ROON",
      "club": "Atalanta Bergamo (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "VIRGIL",
      "club": "Liverpool FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "AKÉ",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "VAN HECKE",
      "club": "Brighton & Hove Albion FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "KLUIVERT",
      "club": "AFC Bournemouth (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "GRAVENBERCH",
      "club": "Liverpool FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "WEGHORST",
      "club": "AFC Ajax (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "MEMPHIS",
      "club": "SC Corinthians (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "GAKPO",
      "club": "Liverpool FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 12,
      "position": "DF",
      "name": "WIEFFER",
      "club": "Brighton & Hove Albion FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 13,
      "position": "GK",
      "name": "ROEFS",
      "club": "Sunderland AFC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "REIJNDERS",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "VAN DE VEN",
      "club": "Tottenham Hotspur FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "TIL",
      "club": "PSV Eindhoven (NED)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "LANG",
      "club": "Galatasaray SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "MALEN",
      "club": "AS Roma (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "BROBBEY",
      "club": "Sunderland AFC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "KOOPMEINERS",
      "club": "Juventus FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 21,
      "position": "MF",
      "name": "F. DE JONG",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 22,
      "position": "DF",
      "name": "DUMFRIES",
      "club": "FC Internazionale Milano (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "FLEKKEN",
      "club": "Bayer Leverkusen (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 24,
      "position": "FW",
      "name": "SUMMERVILLE",
      "club": "West Ham United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "HATO",
      "club": "Chelsea FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    },
    {
      "number": 26,
      "position": "MF",
      "name": "Q. TIMBER",
      "club": "Olympique Marseille (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/netherlands/"
    }
  ],
  "panama": [
    {
      "number": 1,
      "position": "GK",
      "name": "MEJÍA",
      "club": "Club Nacional (URU)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "BLACKMAN",
      "club": "Š K Slovan Bratislava (SVK)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "CORDOBA",
      "club": "Norwich City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "F. ESCOBAR",
      "club": "Deportivo Saprissa (CRC)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "FARIÑA",
      "club": "FC Pari Nizhny Novgorod (RUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "MARTÍNEZ",
      "club": "Hapoel Kiryat Shmona FC (ISR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "J.L. RODRÍGUEZ",
      "club": "FC Juárez (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "CARRASQUILLA",
      "club": "Pumas UNAM (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "T. RODRÍGUEZ",
      "club": "Deportivo Saprissa (CRC)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "ISMAEL",
      "club": "Club León (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "BÁRCENAS",
      "club": "Mazatlán FC (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "SAMUDIO",
      "club": "CD Marathón (HON)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "RAMOS",
      "club": "Puerto Cabello CF (VEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "HARVEY",
      "club": "Minnesota United FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "DAVIS",
      "club": "CD Plaza Amador (PAN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 16,
      "position": "DF",
      "name": "ANDRADE",
      "club": "LASK Linz (AUT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "FAJARDO",
      "club": "CD Universidad Católica (ECU)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "WATERMAN",
      "club": "CD Universidad De Concepción (CHI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "QUINTERO",
      "club": "CD Plaza Amador (PAN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "GODOY",
      "club": "San Diego FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 21,
      "position": "MF",
      "name": "YANIS",
      "club": "CD Cobresal (CHI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 22,
      "position": "GK",
      "name": "MOSQUERA",
      "club": "Al Fayha FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 23,
      "position": "DF",
      "name": "A. MURILLO",
      "club": "Be ş ikta ş  JK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 24,
      "position": "FW",
      "name": "LONDONO",
      "club": "CD Universidad Católica (ECU)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "MILLER",
      "club": "Turan Tovuz (AZE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "GUTIÉRREZ",
      "club": "Deportivo La Guaira (VEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/panama/"
    }
  ],
  "paraguay": [
    {
      "number": 1,
      "position": "GK",
      "name": "FERNANDEZ",
      "club": "Cerro Porteño (PAR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "VELÁZQUEZ",
      "club": "Cerro Porteño (PAR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "ALDERETE",
      "club": "Sunderland AFC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "CÁCERES",
      "club": "FC Dynamo Moscow (RUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "BALBUENA",
      "club": "Grêmio FBPA (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "ALONSO",
      "club": "Atlético Mineiro (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "SOSA",
      "club": "SE Palmeiras (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "D. GOMEZ",
      "club": "Brighton & Hove Albion FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "SANABRIA",
      "club": "US Cremonese (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "M. ALMIRÓN",
      "club": "Atlanta United FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "MAURICIO",
      "club": "SE Palmeiras (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "O. GILL",
      "club": "CA San Lorenzo (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "CANALE",
      "club": "CA Lanús (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "CUBAS",
      "club": "Vancouver Whitecaps FC (CAN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "G. GOMEZ",
      "club": "SE Palmeiras (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "BOBADILLA",
      "club": "São Paulo FC (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "R. GAMARRA",
      "club": "Al Ain FC (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "ARCE",
      "club": "CS Independiente Rivadavia (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "ENCISO",
      "club": "RC Strasbourg (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "OJEDA",
      "club": "Orlando City SC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "AVALOS",
      "club": "CA Independiente (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 22,
      "position": "GK",
      "name": "OLIVEIRA",
      "club": "Club Olimpia (PAR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 23,
      "position": "MF",
      "name": "GALARZA",
      "club": "Atlanta United FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 24,
      "position": "MF",
      "name": "CABALLERO",
      "club": "Portsmouth FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 25,
      "position": "FW",
      "name": "PITTA",
      "club": "Red Bull Bragantino (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "MAIDANA",
      "club": "CA Talleres (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/paraguay/"
    }
  ],
  "portugal": [
    {
      "number": 1,
      "position": "GK",
      "name": "DIOGO COSTA",
      "club": "FC Porto (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "N. SEMEDO",
      "club": "Fenerbahçe SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "RÚBEN DIAS",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "TOMAS A.",
      "club": "SL Ben\u0000ca (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "DALOT",
      "club": "Manchester United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "MATHEUS N.",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "RONALDO",
      "club": "Al Nassr FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "B. FERNANDES",
      "club": "Manchester United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "G. RAMOS",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "BERNARDO",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "JOÃO FÉLIX",
      "club": "Al Nassr FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "JOSÉ SÁ",
      "club": "Wolverhampton Wanderers FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "RENATO VEIGA",
      "club": "Villarreal CF (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "G. INÁCIO",
      "club": "Sporting CP (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "JOÃO NEVES",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 16,
      "position": "FW",
      "name": "TRINCÃO",
      "club": "Sporting CP (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "RAFA LEÃO",
      "club": "AC Milan (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "NETO",
      "club": "Chelsea FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "G. GUEDES",
      "club": "Real Sociedad (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 20,
      "position": "DF",
      "name": "JOÃO CANCELO",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 21,
      "position": "MF",
      "name": "R. NEVES",
      "club": "Al Hilal SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 22,
      "position": "GK",
      "name": "RUI SILVA",
      "club": "Sporting CP (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 23,
      "position": "MF",
      "name": "VITINHA",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "SAMU",
      "club": "RCD Mallorca (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "N. MENDES",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "F. CONCEIÇÃO",
      "club": "Juventus FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/portugal/"
    }
  ],
  "qatar": [
    {
      "number": 1,
      "position": "GK",
      "name": "ABUNADA",
      "club": "Al Rayyan SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "PEDRO",
      "club": "Al Sadd SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "L. MENDES",
      "club": "Al Wakrah SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "GUEYE",
      "club": "Al Arabi SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "JASSEM",
      "club": "Al Rayyan SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "A. AZIZ",
      "club": "Al Rayyan SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "ALAEDDIN",
      "club": "Al Rayyan SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 8,
      "position": "FW",
      "name": "EDMILSON JR.",
      "club": "Al Duhail SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "MUNTARI",
      "club": "Al Gharafa SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "ALHAYDOS",
      "club": "Al Sadd SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "AFIF",
      "club": "Al Sadd SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 12,
      "position": "MF",
      "name": "KARIM",
      "club": "Al Duhail SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "AYOUB",
      "club": "Al Gharafa SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "HOMAM",
      "club": "Cultural Leonesa (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 15,
      "position": "FW",
      "name": "YUSUF",
      "club": "Al Wakrah SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 16,
      "position": "DF",
      "name": "KHOUKHI",
      "club": "Al Sadd SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "A. ALGANEHI",
      "club": "Al Gharafa SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 18,
      "position": "DF",
      "name": "SULTAN",
      "club": "Al Duhail SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "ALMOEZ",
      "club": "Al Duhail SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "A. FATHY",
      "club": "Al Arabi SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 21,
      "position": "GK",
      "name": "SALAH",
      "club": "Al Duhail SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 22,
      "position": "GK",
      "name": "BARSHAM",
      "club": "Al Sadd SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 23,
      "position": "MF",
      "name": "MADIBO",
      "club": "Al Wakrah SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 24,
      "position": "FW",
      "name": "TAHSIN",
      "club": "Al Duhail SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "ALHASHMI",
      "club": "Al Arabi SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "MANAI",
      "club": "Al Shamal SC (QAT)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/qatar/"
    }
  ],
  "rd-congo": [
    {
      "number": 1,
      "position": "GK",
      "name": "MPASI",
      "club": "Le Havre AC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "WAN BISSAKA",
      "club": "West Ham United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "KAPUADI",
      "club": "Widzew Ł ód ź (POL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "TUANZEBE",
      "club": "Burnley FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "BATUBINSIKA",
      "club": "AEL FC (GRE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "MUKAU",
      "club": "Lille OSC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "MBUKU",
      "club": "Montpellier HSC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "MOUTOUSSAMY",
      "club": "Atromitos FC (GRE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "CIPENGA",
      "club": "CD Castellón (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "BONGONDA",
      "club": "FC Spartak Moscow (RUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "KAKUTA",
      "club": "AEL FC (GRE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 12,
      "position": "DF",
      "name": "J. KAYEMBE",
      "club": "KRC Genk (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 13,
      "position": "FW",
      "name": "ELIA",
      "club": "Alanyaspor (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "SADIKI",
      "club": "Sunderland AFC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "TSHIBOLA",
      "club": "Kilmarnock FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 16,
      "position": "GK",
      "name": "FAYULU",
      "club": "FC Noah (ARM)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "BAKAMBU",
      "club": "Real Betis (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 18,
      "position": "MF",
      "name": "PICKEL",
      "club": "RCD Espanyol (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "MAYELE",
      "club": "Pyramids FC (EGY)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "WISSA",
      "club": "Newcastle United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 21,
      "position": "GK",
      "name": "EPOLO",
      "club": "Standard Liège (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 22,
      "position": "DF",
      "name": "MBEMBA",
      "club": "Lille OSC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 23,
      "position": "FW",
      "name": "BANZA",
      "club": "Al Jazira (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "G. KALULU",
      "club": "Aris Limassol FC (CYP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 25,
      "position": "MF",
      "name": "KAYEMBE",
      "club": "Watford FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "MASUAKU",
      "club": "RC Lens (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/dr-congo/"
    }
  ],
  "senegal": [
    {
      "number": 1,
      "position": "GK",
      "name": "Y. DIOUF",
      "club": "OGC Nice (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "SARR",
      "club": "Chelsea FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "KOULIBALY",
      "club": "Al Hilal SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "SECK",
      "club": "Maccabi Haifa FC (ISR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 5,
      "position": "MF",
      "name": "GANA",
      "club": "Everton FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "P.I. CISS",
      "club": "Rayo Vallecano (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "DIAO",
      "club": "Como (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "LAMINE",
      "club": "AS Monaco (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "B. DIENG",
      "club": "FC Lorient (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "MANÉ",
      "club": "Al Nassr FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "JACKSON",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 12,
      "position": "FW",
      "name": "CHERIF",
      "club": "Samsunspor (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 13,
      "position": "FW",
      "name": "NDIAYE",
      "club": "Everton FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "JAKOBS",
      "club": "Galatasaray SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "KRÉPIN",
      "club": "AS Monaco (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 16,
      "position": "GK",
      "name": "MENDY",
      "club": "Al Ahli FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "P.M. SARR",
      "club": "Tottenham Hotspur FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "SARR",
      "club": "Crystal Palace FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 19,
      "position": "DF",
      "name": "NIAKHATE",
      "club": "Olympique Lyonnais (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "MBAYE",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 21,
      "position": "MF",
      "name": "H. DIARRA",
      "club": "Sunderland AFC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 22,
      "position": "MF",
      "name": "BARA",
      "club": "FC Bayern München (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "DIAW",
      "club": "Le Havre AC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "A. MENDY",
      "club": "OGC Nice (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "DIOUF",
      "club": "West Ham United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    },
    {
      "number": 26,
      "position": "MF",
      "name": "GUEYE",
      "club": "Villarreal CF (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/senegal/"
    }
  ],
  "sudafrica": [
    {
      "number": 1,
      "position": "GK",
      "name": "WILLIAMS",
      "club": "Mamelodi Sundowns FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "MATULUDI",
      "club": "Polokwane City FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "NDAMANE",
      "club": "Mamelodi Sundowns FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 4,
      "position": "MF",
      "name": "MOKOENA",
      "club": "Mamelodi Sundowns FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 5,
      "position": "MF",
      "name": "MBATHA",
      "club": "Orlando Pirates FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "MODIBA",
      "club": "Mamelodi Sundowns FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "APPOLLIS",
      "club": "Orlando Pirates FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 8,
      "position": "FW",
      "name": "MOREMI",
      "club": "Orlando Pirates FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "FOSTER",
      "club": "Burnley FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 10,
      "position": "FW",
      "name": "MOFOKENG",
      "club": "Orlando Pirates FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "ZWANE",
      "club": "Mamelodi Sundowns FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 12,
      "position": "FW",
      "name": "MASEKO",
      "club": "AEL Limassol (CYP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 13,
      "position": "MF",
      "name": "SITHOLE",
      "club": "CD Tondela (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "MBOKAZI",
      "club": "Chicago Fire FC (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 15,
      "position": "FW",
      "name": "RAYNERS",
      "club": "Mamelodi Sundowns FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 16,
      "position": "GK",
      "name": "CHAINE",
      "club": "Orlando Pirates FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "MAKGOPA",
      "club": "Orlando Pirates FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 18,
      "position": "DF",
      "name": "KABINI",
      "club": "Molde FK (NOR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 19,
      "position": "DF",
      "name": "SIBISI",
      "club": "Orlando Pirates FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 20,
      "position": "DF",
      "name": "MUDAU",
      "club": "Mamelodi Sundowns FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 21,
      "position": "DF",
      "name": "OKON",
      "club": "Hannover 96 (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 22,
      "position": "GK",
      "name": "GOSS",
      "club": "Siwelele FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 23,
      "position": "MF",
      "name": "ADAMS",
      "club": "Mamelodi Sundowns FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "MAKHANYA",
      "club": "Philadelphia Union (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 25,
      "position": "FW",
      "name": "SEBELEBELE",
      "club": "Orlando Pirates FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "CROSS",
      "club": "Kaizer Chiefs FC (RSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/south-africa/"
    }
  ],
  "suecia": [
    {
      "number": 1,
      "position": "GK",
      "name": "ZETTERSTRÖM",
      "club": "Derby County FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "LAGERBIELKE",
      "club": "SC Braga (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "LINDELÖF",
      "club": "Aston Villa FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "HIEN",
      "club": "Atalanta Bergamo (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "GUDMUNDSSON",
      "club": "Leeds United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "H. JOHANSSON",
      "club": "FC Dallas (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "BERGVALL",
      "club": "Tottenham Hotspur FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 8,
      "position": "DF",
      "name": "SVENSSON",
      "club": "Borussia Dortmund (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "ISAK",
      "club": "Liverpool FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "NYGREN",
      "club": "Celtic FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "ELANGA",
      "club": "Newcastle United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "V. JOHANSSON",
      "club": "Stoke City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 13,
      "position": "MF",
      "name": "SEMA",
      "club": "Pafos FC (CYP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "EKDAL",
      "club": "Burnley FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "STARFELT",
      "club": "RC Celta Vigo (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "KARLSTRÖM",
      "club": "Udinese (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "GYÖKERES",
      "club": "Arsenal FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 18,
      "position": "MF",
      "name": "AYARI",
      "club": "Brighton & Hove Albion FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "SVANBERG",
      "club": "VfL Wolfsburg (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 20,
      "position": "DF",
      "name": "SMITH",
      "club": "FC St. Pauli (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 21,
      "position": "DF",
      "name": "BERNHARDSSON",
      "club": "Holstein Kiel (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 22,
      "position": "MF",
      "name": "ZENELI",
      "club": "Royale Union Saint-Gilloise (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "NORDFELDT",
      "club": "AIK Stockholm (SWE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "STROUD",
      "club": "Mjällby AIF (SWE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 25,
      "position": "FW",
      "name": "NILSSON",
      "club": "Club Brugge (BEL)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "ALI",
      "club": "Malmö FF (SWE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/sweden/"
    }
  ],
  "suiza": [
    {
      "number": 1,
      "position": "GK",
      "name": "KOBEL",
      "club": "Borussia Dortmund (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "MUHEIM",
      "club": "Hamburger SV (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "WIDMER",
      "club": "1. FSV Mainz 05 (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "ELVEDI",
      "club": "Borussia Mönchengladbach (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "AKANJI",
      "club": "FC Internazionale Milano (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "ZAKARIA",
      "club": "AS Monaco (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "EMBOLO",
      "club": "Stade Rennais FC (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "FREULER",
      "club": "Bologna FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 9,
      "position": "MF",
      "name": "MANZAMBI",
      "club": "SC Freiburg (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "XHAKA",
      "club": "Sunderland AFC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "NDOYE",
      "club": "Nottingham Forest FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "MVOGO",
      "club": "FC Lorient (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "RODRÍGUEZ",
      "club": "Real Betis (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "JASHARI",
      "club": "AC Milan (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "SOW",
      "club": "Sevilla FC (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 16,
      "position": "FW",
      "name": "FASSNACHT",
      "club": "BSC Young Boys (SUI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "VARGAS",
      "club": "Sevilla FC (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 18,
      "position": "DF",
      "name": "COMERT",
      "club": "Valencia CF (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "OKAFOR",
      "club": "Leeds United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "AEBISCHER",
      "club": "Pisa SC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 21,
      "position": "GK",
      "name": "KELLER",
      "club": "BSC Young Boys (SUI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 22,
      "position": "MF",
      "name": "RIEDER",
      "club": "FC Augsburg (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 23,
      "position": "FW",
      "name": "AMDOUNI",
      "club": "Burnley FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "AMENDA",
      "club": "Eintracht Frankfurt (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "JAQUEZ",
      "club": "VfB Stuttgart (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "ITTEN",
      "club": "Fortuna Düsseldorf (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/switzerland/"
    }
  ],
  "tunez": [
    {
      "number": 1,
      "position": "GK",
      "name": "CHAMAKH",
      "club": "Club Africain (TUN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "ABDI",
      "club": "OGC Nice (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "TALBI",
      "club": "FC Lorient (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "REKIK",
      "club": "NK Maribor (SVN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "AROUS",
      "club": "Kasımpa ş a SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 6,
      "position": "DF",
      "name": "BRONN",
      "club": "Servette FC (SUI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "ACHOURI",
      "club": "FC København (DEN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 8,
      "position": "FW",
      "name": "SAAD",
      "club": "Hannover 96 (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "MASTOURI",
      "club": "FC Dynamo Makhachkala (RUS)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "MEJBRI",
      "club": "Burnley FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "GHARBI",
      "club": "FC Augsburg (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 12,
      "position": "DF",
      "name": "BEN OUANES",
      "club": "Kasımpa ş a SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 13,
      "position": "MF",
      "name": "KHEDIRA",
      "club": "1. FC Union Berlin (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "AYARI",
      "club": "Paris Saint-Germain (FRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "BELHADJ MAHMOUD",
      "club": "FC Lugano (SUI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 16,
      "position": "GK",
      "name": "DAHMEN",
      "club": "CS Sfaxien (TUN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "SKHIRI",
      "club": "Eintracht Frankfurt (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "ELLOUMI",
      "club": "Vancouver Whitecaps FC (CAN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "CHAOUAT",
      "club": "Club Africain (TUN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 20,
      "position": "DF",
      "name": "VALERY",
      "club": "BSC Young Boys (SUI)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 21,
      "position": "DF",
      "name": "BEN HMIDA",
      "club": "Espérance De Tunisie (TUN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 22,
      "position": "GK",
      "name": "BEN HSAN",
      "club": "Étoile Du Sahel (TUN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 23,
      "position": "DF",
      "name": "NEFFATI",
      "club": "IFK Norrköping FK (SWE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "CHIKHAOUI",
      "club": "US Monastir (TUN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 25,
      "position": "MF",
      "name": "SLIMANE",
      "club": "Norwich City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    },
    {
      "number": 26,
      "position": "MF",
      "name": "TOUNEKTI",
      "club": "Celtic FC (SCO)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/tunisia/"
    }
  ],
  "turquia": [
    {
      "number": 1,
      "position": "GK",
      "name": "MERT",
      "club": "Fenerbahçe SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "ZEKI ÇELIK",
      "club": "AS Roma (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "DEMIRAL",
      "club": "Al Ahli FC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "ÇAĞLAR",
      "club": "Fenerbahçe SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 5,
      "position": "MF",
      "name": "OZCAN",
      "club": "Borussia Dortmund (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "ORKUN KÖKÇÜ",
      "club": "Be ş ikta ş  JK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 7,
      "position": "FW",
      "name": "AKTÜRKOĞLU",
      "club": "Fenerbahçe SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 8,
      "position": "FW",
      "name": "ARDA GÜLER",
      "club": "Real Madrid C. F. (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "DENIZ GÜL",
      "club": "FC Porto (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "ÇALHANOĞLU",
      "club": "FC Internazionale Milano (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "YILDIZ",
      "club": "Juventus FC (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "ALTAY",
      "club": "Manchester United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "EREN ELMALI",
      "club": "Galatasaray SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 14,
      "position": "DF",
      "name": "ABDÜLKERIM",
      "club": "Galatasaray SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "OZAN KABAK",
      "club": "TSG Hoffenheim (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 16,
      "position": "MF",
      "name": "ISMAIL",
      "club": "Fenerbahçe SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 17,
      "position": "FW",
      "name": "KAHVECI",
      "club": "Kasımpa ş a SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 18,
      "position": "DF",
      "name": "MERT MULDUR",
      "club": "Fenerbahçe SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "YUNUS",
      "club": "Galatasaray SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 20,
      "position": "DF",
      "name": "F. KADIOĞLU",
      "club": "Brighton & Hove Albion FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "BARIŞ",
      "club": "Galatasaray SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 22,
      "position": "MF",
      "name": "KAAN",
      "club": "Galatasaray SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "UGURCAN",
      "club": "Galatasaray SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 24,
      "position": "FW",
      "name": "OGUZ",
      "club": "Fenerbahçe SK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "SAMET AKAYDIN",
      "club": "Çaykur Rizespor (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    },
    {
      "number": 26,
      "position": "FW",
      "name": "CAN UZUN",
      "club": "Eintracht Frankfurt (GER)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/turkey/"
    }
  ],
  "uruguay": [
    {
      "number": 1,
      "position": "GK",
      "name": "S. ROCHET",
      "club": "SC Internacional (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "J.M. GIMÉNEZ",
      "club": "Atlético De Madrid (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "S. CÁCERES",
      "club": "Club América (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "R. ARAUJO",
      "club": "FC Barcelona (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 5,
      "position": "MF",
      "name": "M. UGARTE",
      "club": "Manchester United FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "R. BENTANCUR",
      "club": "Tottenham Hotspur FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "N. DE LA CRUZ",
      "club": "CR Flamengo (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "F. VALVERDE",
      "club": "Real Madrid C. F. (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 9,
      "position": "FW",
      "name": "D. NÚÑEZ",
      "club": "Al Hilal SC (KSA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "G. DE ARRASCAETA",
      "club": "CR Flamengo (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 11,
      "position": "FW",
      "name": "F. PELLISTRI",
      "club": "Panathinaikos FC (GRE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "S. MELE",
      "club": "CF Monterrey (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "G. VARELA",
      "club": "CR Flamengo (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 14,
      "position": "MF",
      "name": "A. CANOBBIO",
      "club": "Fluminense FC (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 15,
      "position": "MF",
      "name": "E. MARTÍNEZ",
      "club": "SE Palmeiras (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 16,
      "position": "DF",
      "name": "M. OLIVERA",
      "club": "SSC Napoli (ITA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 17,
      "position": "DF",
      "name": "M. VIÑA",
      "club": "CA River Plate (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 18,
      "position": "FW",
      "name": "B. RODRÍGUEZ",
      "club": "Club América (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 19,
      "position": "FW",
      "name": "R. AGUIRRE",
      "club": "Tigres UANL (MEX)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 20,
      "position": "MF",
      "name": "M. ARAUJO",
      "club": "Sporting CP (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "F. VIÑAS",
      "club": "Real Oviedo (ESP)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 22,
      "position": "MF",
      "name": "J. PIQUEREZ",
      "club": "SE Palmeiras (BRA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 23,
      "position": "GK",
      "name": "F. MUSLERA",
      "club": "Estudiantes LP (ARG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "S. BUENO",
      "club": "Wolverhampton Wanderers FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 25,
      "position": "MF",
      "name": "J.M. SANABRIA",
      "club": "Real Salt Lake (USA)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    },
    {
      "number": 26,
      "position": "MF",
      "name": "R. ZALAZAR",
      "club": "SC Braga (POR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uruguay/"
    }
  ],
  "uzbekistan": [
    {
      "number": 1,
      "position": "GK",
      "name": "YUSUPOV",
      "club": "PFC Navbahor Namangan (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 2,
      "position": "DF",
      "name": "KHUSANOV",
      "club": "Manchester City FC (ENG)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 3,
      "position": "DF",
      "name": "ALIJONOV",
      "club": "Pakhtakor Tashkent FK (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 4,
      "position": "DF",
      "name": "SAYFIEV",
      "club": "FK Neftchi Farg'ona (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 5,
      "position": "DF",
      "name": "ASHURMATOV",
      "club": "Esteghlal Tehran FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 6,
      "position": "MF",
      "name": "MOZGOVOY",
      "club": "Pakhtakor Tashkent FK (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 7,
      "position": "MF",
      "name": "SHUKUROV",
      "club": "Baniyas Club (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 8,
      "position": "MF",
      "name": "ISKANDEROV",
      "club": "FK Neftchi Farg'ona (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 9,
      "position": "MF",
      "name": "XAMROBEKOV",
      "club": "Tractor Sazi Tabriz FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 10,
      "position": "MF",
      "name": "MASHARIPOV",
      "club": "Esteghlal Tehran FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 11,
      "position": "MF",
      "name": "URUNOV",
      "club": "Persepolis FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 12,
      "position": "GK",
      "name": "NEMATOV",
      "club": "Nasaf Qarshi FC (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 13,
      "position": "DF",
      "name": "NASRULLAEV",
      "club": "Pakhtakor Tashkent FK (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 14,
      "position": "FW",
      "name": "SHOMURODOV",
      "club": "Ba ş ak ş ehir FK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 15,
      "position": "DF",
      "name": "ESHMURODOV",
      "club": "Nasaf Qarshi FC (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 16,
      "position": "GK",
      "name": "ERGASHEV",
      "club": "FK Neftchi Farg'ona (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 17,
      "position": "MF",
      "name": "KHAMDAMOV",
      "club": "Pakhtakor Tashkent FK (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 18,
      "position": "DF",
      "name": "ABDULLAEV",
      "club": "Dibba FC (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 19,
      "position": "MF",
      "name": "GANIEV",
      "club": "Al Bataeh Club (UAE)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 20,
      "position": "FW",
      "name": "AMONOV",
      "club": "FK Dinamo Samarkand (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 21,
      "position": "FW",
      "name": "SERGEEV",
      "club": "Persepolis FC (IRN)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 22,
      "position": "MF",
      "name": "FAYZULLAEV",
      "club": "Ba ş ak ş ehir FK (TUR)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 23,
      "position": "MF",
      "name": "ESANOV",
      "club": "FK Buxoro (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 24,
      "position": "DF",
      "name": "KARIMOV",
      "club": "Surkhon FK (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 25,
      "position": "DF",
      "name": "ULMASALIYEV",
      "club": "OKMK FK (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    },
    {
      "number": 26,
      "position": "DF",
      "name": "UROZOV",
      "club": "FK Dinamo Samarkand (UZB)",
      "photoUrl": null,
      "sourceUrl": "https://worldcupranking.com/world-cup-2026/squads/uzbekistan/"
    }
  ]
};
