export const TROPHY_META = {
  league: { name: 'Campionato', category: 'Campionati', asset: '/Trophys/Campionati/Meisterschale.png' },
  cup: { name: 'Coppa Nazionale', category: 'Coppe-Nazionali', asset: '/Trophys/Coppe-Nazionali/FA_Cup.png' },
  continental_primary: { name: 'Coppa Continentale', category: 'Internazionali', asset: '/Trophys/Internazionali/Champions_league.svg' },
  continental_secondary: { name: 'Coppa Continentale Secondaria', category: 'Internazionali', asset: '/Trophys/Internazionali/Champions_league.svg' },
  club_world_cup: { name: 'Mondiale per Club', category: 'Internazionali', asset: '/Trophys/Internazionali/club_world_Trophy_2025.png' },
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

export const pickTrophies = (params) => {
  const {
    overall,
    age,
    requirement,
    tier,
    domesticRep,
    continentalRep,
    confederation,
    multipliers,
  } = params

  const mult = { league: 1, cup: 1, continental_primary: 1, continental_secondary: 1, club_world_cup: 1, ...(multipliers || {}) }
  const p = deltaFactor(overall - requirement)
  const won = []

  const roll = (type, table, rep) => {
    if (Math.random() < tableAt(table, rep) * p * mult[type]) won.push(type)
  }

  roll('league', TABLES.league, domesticRep)
  roll('cup', TABLES.cup, domesticRep)

  const inTier1 = Number(tier) === 1
  const continental = inTier1 && continentalRep >= 1
  if (continental) {
    roll('continental_primary', TABLES.continental_primary, continentalRep)
    roll('continental_secondary', TABLES.continental_secondary, continentalRep)
  }

  const cwc = CLUB_WORLD_TABLES[(confederation || '').toLowerCase()] || CLUB_WORLD_TABLES.uefa
  if (continental && age >= 33) roll('club_world_cup', cwc, continentalRep)

  return won
}

export const trophyLabel = (type) => TROPHY_META[type]?.name ?? type
