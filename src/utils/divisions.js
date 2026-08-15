const wi = [
  [64, 0.03],
  [69, 0.04],
  [74, 0.06],
  [79, 0.09],
  [84, 0.13],
  [87, 0.18],
  [89, 0.25],
  [99, 0.30]
]

const Si = [
  [64, 0.04],
  [69, 0.05],
  [74, 0.07],
  [79, 0.11],
  [84, 0.15],
  [87, 0.21],
  [89, 0.28],
  [99, 0.35]
]

const Ri = [
  [64, 0.20],
  [69, 0.16],
  [74, 0.12],
  [79, 0.09],
  [84, 0.06],
  [87, 0.03],
  [89, 0.01],
  [99, 0.00]
]

const REP_PROMO = [1, 1.1, 1.2, 1.3, 1.5, 1.75, 2]
const REP_RELEG = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4]

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

export const tableAt = (table, overall) => {
  for (const [ovr, prob] of table) {
    if (overall <= ovr) return prob
  }
  return table[table.length - 1][1]
}

export const divisionOutcome = ({ tier, overall, reputation = 0 }) => {
  const rep = clamp(reputation, 0, 6)
  const roll = Math.random()
  if (tier === 1) {
    const r = clamp(0.6 + (overall - 65) * ((1.1 - 0.6) / (85 - 65)), 0.6, 1.1)
    const prob = clamp(0.05 + 0.1 * ((1.1 - r) / (1.1 - 0.6)), 0.05, 0.15)
    return roll < prob ? 'relegation' : 'stay'
  }
  if (tier === 3) {
    const promoProb = tableAt(Si, overall) * REP_PROMO[rep]
    return roll < promoProb ? 'promotion' : 'stay'
  }
  const promoProb = tableAt(wi, overall) * REP_PROMO[rep]
  const relegProb = tableAt(Ri, overall) * REP_RELEG[rep]
  if (roll < promoProb) return 'promotion'
  if (roll < promoProb + relegProb) return 'relegation'
  return 'stay'
}

export const getDivisionLabel = (tier) => {
  if (tier === 1) return 'Massima Serie'
  if (tier === 2) return 'Serie B'
  if (tier === 3) return 'Serie C'
  return 'Sconosciuta'
}
