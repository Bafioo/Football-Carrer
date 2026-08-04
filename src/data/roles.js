// Player roles with their primary stats
export const ROLES = {
  GK: {
    name: 'Portiere',
    color: 'from-yellow-500 to-amber-600',
    primaryStats: ['reflexes', 'handling', 'diving', 'positioning', 'composure'],
    description: 'L\'ultimo baluardo della difesa. Reattività e posizionamento sono tutto.'
  },
  CB: {
    name: 'Difensore Centrale',
    color: 'from-blue-500 to-blue-700',
    primaryStats: ['tackling', 'marking', 'heading', 'strength', 'composure'],
    description: 'Il muro della difesa. Duro, forte e con grande senso della posizione.'
  },
  LB: {
    name: 'Terzino Sinistro',
    color: 'from-blue-400 to-blue-600',
    primaryStats: ['pace', 'stamina', 'tackling', 'crossing', 'dribbling'],
    description: 'Spinta sulla fascia e copertura difensiva.'
  },
  RB: {
    name: 'Terzino Destro',
    color: 'from-blue-400 to-blue-600',
    primaryStats: ['pace', 'stamina', 'tackling', 'crossing', 'dribbling'],
    description: 'Spinta sulla fascia e copertura difensiva.'
  },
  CDM: {
    name: 'Mediano',
    color: 'from-indigo-500 to-indigo-700',
    primaryStats: ['tackling', 'passing', 'stamina', 'positioning', 'composure'],
    description: 'Il regista davanti alla difesa. Intercetta e detta i tempi.'
  },
  CM: {
    name: 'Centrocampista',
    color: 'from-emerald-500 to-emerald-700',
    primaryStats: ['passing', 'dribbling', 'stamina', 'vision', 'shooting'],
    description: 'Il motore della squadra. Corre, passa e finalizza.'
  },
  CAM: {
    name: 'Trequartista',
    color: 'from-emerald-400 to-teal-600',
    primaryStats: ['passing', 'dribbling', 'vision', 'shooting', 'composure'],
    description: 'Il creatore di gioco. Inventa assist e gol.'
  },
  LW: {
    name: 'Ala Sinistra',
    color: 'from-orange-500 to-red-600',
    primaryStats: ['pace', 'dribbling', 'crossing', 'shooting', 'agility'],
    description: 'Velocità e dribbling per saltare l\'uomo.'
  },
  RW: {
    name: 'Ala Destra',
    color: 'from-orange-500 to-red-600',
    primaryStats: ['pace', 'dribbling', 'crossing', 'shooting', 'agility'],
    description: 'Velocità e dribbling per saltare l\'uomo.'
  },
  ST: {
    name: 'Attaccante',
    color: 'from-red-500 to-red-700',
    primaryStats: ['shooting', 'finishing', 'pace', 'positioning', 'composure'],
    description: 'Il finalizzatore. Il gol è la sua ragione di vita.'
  },
};

export const ROLE_KEYS = Object.keys(ROLES);

// All stats used in the game
export const STATS = {
  pace: { name: 'Velocità', color: 'bg-yellow-400' },
  shooting: { name: 'Tiro', color: 'bg-red-500' },
  passing: { name: 'Passaggio', color: 'bg-blue-500' },
  dribbling: { name: 'Dribbling', color: 'bg-purple-500' },
  defending: { name: 'Difesa', color: 'bg-slate-500' },
  physical: { name: 'Fisico', color: 'bg-orange-500' },
  // Detailed stats
  finishing: { name: 'Finalizzazione', color: 'bg-red-600' },
  crossing: { name: 'Cross', color: 'bg-cyan-500' },
  tackling: { name: 'Contrasto', color: 'bg-slate-600' },
  marking: { name: 'Marcatura', color: 'bg-slate-700' },
  heading: { name: 'Colpo di Testa', color: 'bg-amber-600' },
  stamina: { name: 'Resistenza', color: 'bg-green-500' },
  strength: { name: 'Forza', color: 'bg-orange-600' },
  agility: { name: 'Agilità', color: 'bg-pink-500' },
  positioning: { name: 'Posizionamento', color: 'bg-indigo-500' },
  vision: { name: 'Visione', color: 'bg-violet-500' },
  composure: { name: 'Freddura', color: 'bg-sky-500' },
  reflexes: { name: 'Riflessi', color: 'bg-yellow-500' },
  handling: { name: 'Presa', color: 'bg-amber-500' },
  diving: { name: 'Tuffo', color: 'bg-cyan-600' },
};

export const STAT_KEYS = Object.keys(STATS);

// Generate initial stats based on role
export const generateInitialStats = (roleKey) => {
  const role = ROLES[roleKey];
  const baseStats = {};
  
  // All stats start at 30-50
  STAT_KEYS.forEach(key => {
    baseStats[key] = Math.floor(Math.random() * 21) + 30; // 30-50
  });
  
  // Boost primary stats
  role.primaryStats.forEach(stat => {
    baseStats[stat] = Math.min(99, baseStats[stat] + Math.floor(Math.random() * 25) + 20); // +20-45
  });
  
  // GK gets special handling
  if (roleKey === 'GK') {
    baseStats.reflexes = Math.min(99, baseStats.reflexes + 30);
    baseStats.handling = Math.min(99, baseStats.handling + 30);
    baseStats.diving = Math.min(99, baseStats.diving + 30);
    baseStats.positioning = Math.min(99, baseStats.positioning + 20);
    baseStats.pace = Math.max(20, baseStats.pace - 15);
    baseStats.dribbling = Math.max(20, baseStats.dribbling - 20);
    baseStats.shooting = Math.max(15, baseStats.shooting - 25);
  }
  
  // Calculate main 6 stats from detailed ones
  baseStats.pace = Math.round((baseStats.pace + baseStats.agility) / 2);
  baseStats.shooting = Math.round((baseStats.shooting + baseStats.finishing) / 2);
  baseStats.passing = Math.round((baseStats.passing + baseStats.vision) / 2);
  baseStats.dribbling = Math.round((baseStats.dribbling + baseStats.agility) / 2);
  baseStats.defending = Math.round((baseStats.tackling + baseStats.marking + baseStats.positioning) / 3);
  baseStats.physical = Math.round((baseStats.strength + baseStats.stamina) / 2);
  
  // Normalize to base overall of 50 (uniform shift, two passes for rounding/clamps)
  let diff = 50 - calculateOverall(baseStats, roleKey);
  STAT_KEYS.forEach(key => {
    baseStats[key] = Math.max(1, Math.min(99, baseStats[key] + diff));
  });
  diff = 50 - calculateOverall(baseStats, roleKey);
  STAT_KEYS.forEach(key => {
    baseStats[key] = Math.max(1, Math.min(99, baseStats[key] + diff));
  });
  
  return baseStats;
};

// Calculate overall rating based on role
export const calculateOverall = (stats, roleKey) => {
  const role = ROLES[roleKey];
  let total = 0;
  let weight = 0;
  
  // Primary stats have higher weight
  role.primaryStats.forEach(stat => {
    total += stats[stat] * 2;
    weight += 2;
  });
  
  // Other stats have normal weight
  STAT_KEYS.forEach(key => {
    if (!role.primaryStats.includes(key)) {
      total += stats[key];
      weight += 1;
    }
  });
  
  return Math.round(total / weight);
};
