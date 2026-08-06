// Random events that affect player stats
// Each event has: title, description, type (positive/negative/neutral), statChanges
// Events are split by role band: attacker (ST/LW/RW), midfielder (CAM/CM/CDM/CB/LB/RB), goalkeeper (GK)

const great_training = {
  id: 'great_training',
  type: 'positive',
  title: 'Allenamento Eccellente',
  description: 'Il tuo allenatore è entusiasta del tuo impegno in allenamento! Guadagni punti in più statistiche.',
  statChanges: { stamina: 3, strength: 2, pace: 2 }
};
const match_winner = {
  id: 'match_winner',
  type: 'positive',
  title: 'Gol della Vittoria!',
  description: 'Hai segnato il gol decisivo all\'ultimo minuto! I tifosi impazziscono per te.',
  statChanges: { finishing: 4, composure: 3, shooting: 2 }
};
const assist_master = {
  id: 'assist_master',
  type: 'positive',
  title: 'Assist Magico',
  description: 'Hai servito un assist delizioso che ha spaccato la partita. Il tecnico ti premia.',
  statChanges: { passing: 4, vision: 3, crossing: 2 }
};
const clean_sheet = {
  id: 'clean_sheet',
  type: 'positive',
  title: 'Clean Sheet!',
  description: 'La tua difesa è stata impenetrabile. Zero gol subiti!',
  statChanges: { marking: 3, positioning: 3, tackling: 2 }
};
const skill_move = {
  id: 'skill_move',
  type: 'positive',
  title: 'Giocata Fantastica',
  description: 'Un dribbling ubriacante ha lasciato il difensore sul posto! I social impazziscono.',
  statChanges: { dribbling: 4, agility: 3, composure: 2 }
};
const save_penalty = {
  id: 'save_penalty',
  type: 'positive',
  title: 'Rigore Parato!',
  description: 'Hai letto le intenzioni del rigorista e hai parato il penalty!',
  statChanges: { reflexes: 5, diving: 3, positioning: 2 }
};
const coach_praise = {
  id: 'coach_praise',
  type: 'positive',
  title: 'Elogio del Mister',
  description: 'L\'allenatore ti ha elogiato pubblicamente in conferenza stampa. La tua autostima sale.',
  statChanges: { composure: 3, positioning: 2, vision: 2 }
};
const gym_work = {
  id: 'gym_work',
  type: 'positive',
  title: 'Sessione in Palestra',
  description: 'Hai passato ore in palestra. Il tuo fisico è ora una macchina da guerra.',
  statChanges: { strength: 4, stamina: 3, physical: 2 }
};
const speed_training = {
  id: 'speed_training',
  type: 'positive',
  title: 'Lavoro sulla Velocità',
  description: 'Il preparatore atletico ti ha fatto lavorare sugli scatti. Sei più esplosivo.',
  statChanges: { pace: 5, agility: 3 }
};
const hat_trick = {
  id: 'hat_trick',
  type: 'positive',
  title: 'Hat-Trick!',
  description: 'Tre gol in una sola partita! I tifosi ti acclamano come un eroe.',
  statChanges: { finishing: 5, shooting: 3, composure: 3 }
};

const injury = {
  id: 'injury',
  type: 'negative',
  title: 'Infortunio',
  description: 'Ti sei infortunato durante un\'azione di gioco. Dovrai stare fermo qualche settimana.',
  statChanges: { pace: -3, stamina: -2, agility: -2 },
  genLoss: true
};
const bad_match = {
  id: 'bad_match',
  type: 'negative',
  title: 'Prestazione Deludente',
  description: 'Una partita da dimenticare. Hai sbagliato troppo e i tifosi fischiano.',
  statChanges: { composure: -3, finishing: -2, passing: -2 }
};
const red_card = {
  id: 'red_card',
  type: 'negative',
  title: 'Cartellino Rosso',
  description: 'Un\'espulsione per proteste eccessive. Dovrai saltare le prossime partite.',
  statChanges: { composure: -4, marking: -2 }
};
const missed_penalty = {
  id: 'missed_penalty',
  type: 'negative',
  title: 'Rigore Sbagliato',
  description: 'Hai calciato il rigore fuori dallo specchio della porta. La tua autostima crolla.',
  statChanges: { finishing: -3, composure: -3 }
};
const muscle_strain = {
  id: 'muscle_strain',
  type: 'negative',
  title: 'Stiramento',
  description: 'Uno stiramento muscolare ti tiene fuori dal campo per qualche giorno.',
  statChanges: { pace: -2, strength: -2, stamina: -2 },
  genLoss: true
};
const coach_criticism = {
  id: 'coach_criticism',
  type: 'negative',
  title: 'Critica del Mister',
  description: 'L\'allenatore ti ha criticato duramente in conferenza stampa. Devi reagire.',
  statChanges: { composure: -3, positioning: -2 }
};
const fan_protests = {
  id: 'fan_protests',
  type: 'negative',
  title: 'Contestazione dei Tifosi',
  description: 'Una parte dei tifosi contesta la tua presenza in campo. La pressione sale.',
  statChanges: { composure: -4, vision: -2 }
};
const own_goal = {
  id: 'own_goal',
  type: 'negative',
  title: 'Autogol',
  description: 'Hai deviato il pallone nella tua porta. Un errore madornale.',
  statChanges: { marking: -3, positioning: -3, composure: -2 }
};
const loss_confidence = {
  id: 'loss_confidence',
  type: 'negative',
  title: 'Perdita di Fiducia',
  description: 'Una serie di prestazioni negative ha minato la tua fiducia. Devi ritrovarti.',
  statChanges: { composure: -3, finishing: -2, shooting: -2 }
};
const yellow_card_accumulation = {
  id: 'yellow_card_accumulation',
  type: 'negative',
  title: 'Diffida',
  description: 'Hai accumulato troppe ammonizioni. Dovrai stare attento nelle prossime partite.',
  statChanges: { tackling: -2, composure: -2 }
};

const new_position = {
  id: 'new_position',
  type: 'neutral',
  title: 'Cambio Ruolo',
  description: 'L\'allenatore ti ha provato in un nuovo ruolo. Devi adattarti.',
  statChanges: { positioning: 2, vision: 1, composure: -1 }
};
const media_interview = {
  id: 'media_interview',
  type: 'neutral',
  title: 'Intervista in TV',
  description: 'Un\'intervista in diretta nazionale. La pressione mediatica è alta.',
  statChanges: { composure: 2, vision: 1 }
};
const charity_event = {
  id: 'charity_event',
  type: 'neutral',
  title: 'Evento di Beneficenza',
  description: 'Hai partecipato a un evento di beneficenza. Ti senti bene con te stesso.',
  statChanges: { composure: 3, stamina: 1 }
};
const tactical_change = {
  id: 'tactical_change',
  type: 'neutral',
  title: 'Cambio Tattico',
  description: 'Il mister ha cambiato modulo e tu devi adattarti al nuovo sistema.',
  statChanges: { positioning: 2, passing: 1, dribbling: -1 }
};

// Events available to every role band
const SHARED_EVENTS = [
  great_training, gym_work, red_card,
  coach_criticism, fan_protests, new_position, media_interview, charity_event, tactical_change
];

// Injury events: the only ones that cause gen loss, kept rare
export const INJURY_EVENTS = [injury, muscle_strain];

export const EVENTS_BY_BAND = {
  attacker: [
    match_winner, assist_master, skill_move, speed_training, hat_trick,
    bad_match, missed_penalty, loss_confidence,
    ...SHARED_EVENTS
  ],
  midfielder: [
    assist_master, clean_sheet, coach_praise,
    bad_match, own_goal, yellow_card_accumulation, loss_confidence,
    ...SHARED_EVENTS
  ],
  goalkeeper: [
    save_penalty, clean_sheet, coach_praise,
    red_card,
    ...SHARED_EVENTS
  ],
};

export const getRoleBand = (role) => {
  if (role === 'GK') return 'goalkeeper';
  if (role === 'ST' || role === 'LW' || role === 'RW') return 'attacker';
  return 'midfielder';
};

// Get random event for a role band; injuries are uncommon (~10% of draws)
export const getRandomEvent = (role) => {
  if (Math.random() < 0.1) {
    return INJURY_EVENTS[Math.floor(Math.random() * INJURY_EVENTS.length)];
  }
  const pool = EVENTS_BY_BAND[getRoleBand(role)] || EVENTS_BY_BAND.midfielder;
  return pool[Math.floor(Math.random() * pool.length)];
};
