export const COMPETITIONS = {
  serie_a: {
    name: 'Serie A',
    country: 'Italia',
    tier: 1,
    domesticRep: 5,
    continentalRep: 5,
    confederation: 'UEFA'
  },
  premier_league: {
    name: 'Premier League',
    country: 'Inghilterra',
    tier: 1,
    domesticRep: 5,
    continentalRep: 5,
    confederation: 'UEFA'
  },
  la_liga: {
    name: 'La Liga',
    country: 'Spagna',
    tier: 1,
    domesticRep: 5,
    continentalRep: 5,
    confederation: 'UEFA'
  },
  bundesliga: {
    name: 'Bundesliga',
    country: 'Germania',
    tier: 1,
    domesticRep: 4,
    continentalRep: 4,
    confederation: 'UEFA'
  },
  ligue_1: {
    name: 'Ligue 1',
    country: 'Francia',
    tier: 1,
    domesticRep: 4,
    continentalRep: 4,
    confederation: 'UEFA'
  },
  serie_b: {
    name: 'Serie B',
    country: 'Italia',
    tier: 2,
    domesticRep: 1,
    continentalRep: 0,
    confederation: 'UEFA'
  },
  championship: {
    name: 'Championship',
    country: 'Inghilterra',
    tier: 2,
    domesticRep: 1,
    continentalRep: 0,
    confederation: 'UEFA'
  },
  la_liga_2: {
    name: 'La Liga 2',
    country: 'Spagna',
    tier: 2,
    domesticRep: 1,
    continentalRep: 0,
    confederation: 'UEFA'
  },
  zweite_bundesliga: {
    name: '2. Bundesliga',
    country: 'Germania',
    tier: 2,
    domesticRep: 1,
    continentalRep: 0,
    confederation: 'UEFA'
  },
  ligue_2: {
    name: 'Ligue 2',
    country: 'Francia',
    tier: 2,
    domesticRep: 1,
    continentalRep: 0,
    confederation: 'UEFA'
  }
}

export const getCompetitionForLeague = (leagueId) => {
  return COMPETITIONS[leagueId]
}

export const getCompetitionForTeam = (team) => {
  return team?.leagueId ? COMPETITIONS[team.leagueId] : undefined
}

export const getPromotionTarget = (leagueId) => {
  const league = COMPETITIONS[leagueId]
  if (!league || league.tier === 1) return undefined
  for (const id in COMPETITIONS) {
    const other = COMPETITIONS[id]
    if (other.country === league.country && other.tier === 1) {
      return id
    }
  }
  return undefined
}

export const getRelegationTarget = (leagueId) => {
  const league = COMPETITIONS[leagueId]
  if (!league || league.tier === 2) return undefined
  for (const id in COMPETITIONS) {
    const other = COMPETITIONS[id]
    if (other.country === league.country && other.tier === 2) {
      return id
    }
  }
  return undefined
}
