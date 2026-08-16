export const AWARD_META = {
  ballon_dor: { name: 'Pallone d\'Oro', asset: '/trophies/individual/ballon-dor.svg' },
  golden_glove: { name: 'Guanto d\'Oro', asset: null },
  golden_boot: { name: 'Scarpa d\'Oro', asset: '/trophies/individual/golden-boot.svg' }
}

const ballonDorProb = (overall) => {
  if (overall >= 97) return 1.0
  if (overall >= 94) return 0.8
  if (overall >= 90) return 0.6
  if (overall >= 85) return 0.1
  return 0.0
}

const goldenBootProb = (goals) => {
  if (goals >= 50) return 1.0
  if (goals >= 40) return 0.5
  if (goals >= 30) return 0.25
  return 0.0
}

export const tableAt = (table, index) => table[Math.max(0, Math.min(table.length - 1, index))]

export const awardLabel = (type) => (AWARD_META[type] && AWARD_META[type].name) || type

export const pickAwards = ({ role, overall, goals, isStarter }) => {
  if (!isStarter) return []
  const awards = []
  if (role === 'GK') {
    if (Math.random() < ballonDorProb(overall)) awards.push('golden_glove')
    return awards
  }
  if (Math.random() < ballonDorProb(overall)) awards.push('ballon_dor')
  if (Math.random() < goldenBootProb(goals)) awards.push('golden_boot')
  return awards
}
