export const TROPHY_META = {
  league: { name: 'Campionato', category: 'Campionati', asset: '/trophies/leagues/meisterschale.png' },
  cup: { name: 'Coppa Nazionale', category: 'Coppe-Nazionali', asset: '/trophies/national-cups/fa-cup.png' },
  continental_primary: { name: 'Champions League', category: 'Internazionali', asset: '/trophies/international/champions-league.svg' },
  continental_secondary: { name: 'Europa League', category: 'Internazionali', asset: '/trophies/international/champions-league.svg' },
  club_world_cup: { name: 'Mondiale per Club', category: 'Internazionali', asset: '/trophies/international/club-world-trophy-2025.png' },
}

// Country-specific trophies: a team only wins domestic trophies of its own
// country (e.g. a German team wins the DFB-Pokal, not the FA Cup).
const COUNTRY_TROPHY_META = {
  Italia: {
    league: { name: 'Campionato Italiano', asset: '/trophies/leagues/serie-b-trophy.svg' },
    cup: { name: 'Coppa Italia', asset: '/trophies/national-cups/coppa-italia.svg' },
  },
  Inghilterra: {
    league: { name: 'Premier League', asset: '/trophies/leagues/premier-league.png' },
    cup: { name: 'FA Cup', asset: '/trophies/national-cups/fa-cup.png' },
  },
  Spagna: {
    league: { name: 'La Liga', asset: '/trophies/leagues/la-liga.png' },
    cup: { name: 'Copa del Rey', asset: '/trophies/national-cups/copa-del-rey.svg' },
  },
  Germania: {
    league: { name: 'Bundesliga', asset: '/trophies/leagues/meisterschale.png' },
    cup: { name: 'DFB-Pokal', asset: '/trophies/national-cups/german-cup.svg' },
  },
  Francia: {
    league: { name: 'Ligue 1', asset: '/trophies/leagues/meisterschale.png' },
    cup: { name: 'Coupe de France', asset: '/trophies/national-cups/fa-cup.png' },
  },
}

// Per-competition trophy names (overrides country defaults): a Serie A win is
// the "Scudetto" but a Serie B one is the "Serie B" title, etc.
const LEAGUE_TROPHY_META = {
  serie_a: { league: { name: 'Scudetto', asset: '/trophies/leagues/serie-b-trophy.svg' } },
  serie_b: { league: { name: 'Serie B', asset: '/trophies/leagues/serie-b-trophy.svg' } },
  premier_league: { league: { name: 'Premier League', asset: '/trophies/leagues/premier-league.png' } },
  championship: { league: { name: 'Championship', asset: '/trophies/leagues/premier-league.png' } },
  la_liga: { league: { name: 'La Liga', asset: '/trophies/leagues/la-liga.png' } },
  la_liga_2: { league: { name: 'La Liga 2', asset: '/trophies/leagues/la-liga.png' } },
  bundesliga: { league: { name: 'Bundesliga', asset: '/trophies/leagues/meisterschale.png' } },
  zweite_bundesliga: { league: { name: '2. Bundesliga', asset: '/trophies/leagues/meisterschale.png' } },
  ligue_1: { league: { name: 'Ligue 1', asset: '/trophies/leagues/meisterschale.png' } },
  ligue_2: { league: { name: 'Ligue 2', asset: '/trophies/leagues/meisterschale.png' } },
}

const TABLES = {
  league: [0, 0.01, 0.05, 0.25, 0.45, 0.70],
  cup: [0.01, 0.04, 0.10, 0.25, 0.35, 0.40],
  continental_primary: [0, 0.00001, 0.03, 0.15, 0.20, 0.30],
  continental_secondary: [0, 0.04, 0.12, 0.02, 0, 0],
}

// club world cup tables keyed by confederation (UEFA for now)
const CLUB_WORLD_TABLES = {
  uefa: [0, 0, 0.005, 0.05, 0.1, 0.15],
}

export const tableAt = (table, index) => table[Math.max(0, Math.min(5, index))]

const deltaFactor = (delta) => {
  if (delta >= 30) return 1.2
  if (delta >= 15) return 1.1
  if (delta >= 5) return 1.0
  if (delta >= -5) return 0.7
  return 0.4
}

// Team strength modulates how easily a club wins trophies: promoted or small
// clubs rarely win continental silverware, top clubs contend every year.
const TEAM_FACTORS = {
  top: { league: 1.0, cup: 1.0, continental_primary: 1.0, continental_secondary: 0.5, club_world_cup: 1.0 },
  mid: { league: 0.5, cup: 0.7, continental_primary: 0.35, continental_secondary: 1.0, club_world_cup: 0.4 },
  small: { league: 0.15, cup: 0.5, continental_primary: 0.03, continental_secondary: 0.4, club_world_cup: 0.02 },
}

export const pickTrophies = (params) => {
  const {
    overall,
    requirement,
    tier,
    domesticRep,
    continentalRep,
    confederation,
    multipliers,
  } = params

  const mult = { league: 1, cup: 1, continental_primary: 1, continental_secondary: 1, club_world_cup: 1, ...(multipliers || {}) }
  const p = deltaFactor(overall - requirement)
  const strength = requirement >= 80 ? 'top' : requirement >= 70 ? 'mid' : 'small'
  const won = []

  const roll = (type, table, rep) => {
    if (Math.random() < tableAt(table, rep) * p * mult[type] * TEAM_FACTORS[strength][type]) won.push(type)
  }

  roll('league', TABLES.league, domesticRep)
  roll('cup', TABLES.cup, domesticRep)

  const inTier1 = Number(tier) === 1
  const continental = inTier1 && continentalRep >= 1
  if (continental) {
    roll('continental_primary', TABLES.continental_primary, continentalRep)
    roll('continental_secondary', TABLES.continental_secondary, continentalRep)
    // Only a club that wins the Champions League takes part in the Club World Cup.
    if (won.includes('continental_primary')) {
      const cwc = CLUB_WORLD_TABLES[(confederation || '').toLowerCase()] || CLUB_WORLD_TABLES.uefa
      roll('club_world_cup', cwc, continentalRep)
    }
  }

  return won
}

const trophyMeta = (type, leagueId, country) => {
  if (type === 'league') {
    const byLeague = (leagueId && LEAGUE_TROPHY_META[leagueId]?.league) || (country && COUNTRY_TROPHY_META[country]?.league)
    return byLeague || TROPHY_META.league
  }
  if (type === 'cup') {
    return (country && COUNTRY_TROPHY_META[country]?.cup) || TROPHY_META.cup
  }
  return TROPHY_META[type]
}

export const trophyLabel = (type, leagueId, country) => {
  const meta = trophyMeta(type, leagueId, country)
  return meta?.name ?? type
}

export const trophyAsset = (type, leagueId, country) => {
  const meta = trophyMeta(type, leagueId, country)
  return meta?.asset
}

// Backwards-compatible: older saves store plain type strings, newer ones store { type, leagueId, country }
export const normalizeTrophy = (t) => (typeof t === 'string' ? { type: t, leagueId: undefined, country: undefined } : t)
