// Teams with real logos from football-logos.cc
// Image URL format: https://assets.football-logos.cc/logos/{country}/{size}/{slug}.{hash}.png

export const LEAGUES = {
  serie_a: {
    name: 'Serie A',
    country: 'Italia',
    teams: [
      { id: 'inter', name: 'Inter', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/inter.d4ebfb95.png' },
      { id: 'milan', name: 'Milan', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/milan.6b4c62be.png' },
      { id: 'juventus', name: 'Juventus', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/juventus.309408e0.png' },
      { id: 'napoli', name: 'Napoli', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/napoli.3e57a185.png' },
      { id: 'roma', name: 'Roma', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/roma.90753835.png' },
      { id: 'lazio', name: 'Lazio', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/lazio.b6301260.png' },
      { id: 'atalanta', name: 'Atalanta', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/atalanta.fff93c78.png' },
      { id: 'fiorentina', name: 'Fiorentina', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/fiorentina.3a19a902.png' },
      { id: 'torino', name: 'Torino', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/torino.9469ee1c.png' },
    ]
  },
  premier_league: {
    name: 'Premier League',
    country: 'Inghilterra',
    teams: [
      { id: 'man_city', name: 'Manchester City', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/manchester-city.8d2b6688.png' },
      { id: 'man_united', name: 'Manchester United', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/manchester-united.104c5aa9.png' },
      { id: 'liverpool', name: 'Liverpool', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/liverpool.d03fd250.png' },
      { id: 'chelsea', name: 'Chelsea', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/chelsea.450170ff.png' },
      { id: 'arsenal', name: 'Arsenal', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/arsenal.d4144b2a.png' },
      { id: 'tottenham', name: 'Tottenham', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/tottenham.b32501c6.png' },
      { id: 'newcastle', name: 'Newcastle', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/newcastle.c19d66db.png' },
      { id: 'aston_villa', name: 'Aston Villa', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/aston-villa.5265a6b0.png' },
    ]
  },
  la_liga: {
    name: 'La Liga',
    country: 'Spagna',
    teams: [
      { id: 'real_madrid', name: 'Real Madrid', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/real-madrid.e34f5ba5.png' },
      { id: 'barcelona', name: 'Barcelona', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/barcelona.8e8b43a3.png' },
      { id: 'atletico', name: 'Atlético Madrid', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/atletico-madrid.1acb70ea.png' },
      { id: 'sevilla', name: 'Sevilla', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/sevilla.f1a10bfd.png' },
      { id: 'real_sociedad', name: 'Real Sociedad', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/real-sociedad.7d3dbc7c.png' },
      { id: 'villarreal', name: 'Villarreal', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/villarreal.6ced8346.png' },
      { id: 'athletic', name: 'Athletic Bilbao', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/athletic-club.ec38af57.png' },
      { id: 'betis', name: 'Real Betis', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/real-betis.18a05d13.png' },
    ]
  },
  bundesliga: {
    name: 'Bundesliga',
    country: 'Germania',
    teams: [
      { id: 'bayern', name: 'Bayern Monaco', logoUrl: 'https://assets.football-logos.cc/logos/germany/1500x1500/bayern-munchen.1eac18e8.png' },
      { id: 'dortmund', name: 'Borussia Dortmund', logoUrl: 'https://assets.football-logos.cc/logos/germany/1500x1500/borussia-dortmund.145250de.png' },
      { id: 'rb_leipzig', name: 'RB Leipzig', logoUrl: 'https://assets.football-logos.cc/logos/germany/1500x1500/rb-leipzig.ea056608.png' },
      { id: 'leverkusen', name: 'Bayer Leverkusen', logoUrl: 'https://assets.football-logos.cc/logos/germany/1500x1500/bayer-leverkusen.ada32552.png' },
      { id: 'frankfurt', name: 'Eintracht Frankfurt', logoUrl: 'https://assets.football-logos.cc/logos/germany/1500x1500/eintracht-frankfurt.7c29dd10.png' },
      { id: 'stuttgart', name: 'Stoccarda', logoUrl: 'https://assets.football-logos.cc/logos/germany/1500x1500/vfb-stuttgart.f5cd8411.png' },
    ]
  },
  ligue_1: {
    name: 'Ligue 1',
    country: 'Francia',
    teams: [
      { id: 'psg', name: 'Paris Saint-Germain', logoUrl: 'https://assets.football-logos.cc/logos/france/1500x1500/paris-saint-germain.976d063a.png' },
      { id: 'marseille', name: 'Olympique Marsiglia', logoUrl: 'https://assets.football-logos.cc/logos/france/1500x1500/marseille.6f770410.png' },
      { id: 'lyon', name: 'Olympique Lione', logoUrl: 'https://assets.football-logos.cc/logos/france/1500x1500/lyon.05fe1f9a.png' },
      { id: 'monaco', name: 'Monaco', logoUrl: 'https://assets.football-logos.cc/logos/france/1500x1500/as-monaco.1d58091e.png' },
      { id: 'lille', name: 'Lille', logoUrl: 'https://assets.football-logos.cc/logos/france/1500x1500/lille.682b7a4f.png' },
    ]
  },
  serie_b: {
    name: 'Serie B',
    country: 'Italia',
    teams: [
      { id: 'palermo', name: 'Palermo', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/palermo.b917fedb.png' },
      { id: 'sampdoria', name: 'Sampdoria', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/sampdoria.82421bf6.png' },
      { id: 'cremonese', name: 'Cremonese', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/cremonese.dccb1bd2.png' },
      { id: 'pisa', name: 'Pisa', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/pisa.f6f656f1.png' },
      { id: 'cesena', name: 'Cesena', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/cesena.7ec6e76c.png' },
      { id: 'modena', name: 'Modena', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/modena.d76ef820.png' },
      { id: 'padova', name: 'Padova', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/padova.72578f17.png' },
      { id: 'catanzaro', name: 'Catanzaro', logoUrl: 'https://assets.football-logos.cc/logos/italy/1500x1500/catanzaro.16896255.png' },
    ]
  },
  championship: {
    name: 'Championship',
    country: 'Inghilterra',
    teams: [
      { id: 'leeds', name: 'Leeds United', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/leeds-united.7a40d61b.png' },
      { id: 'leicester', name: 'Leicester', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/leicester.56d11a8c.png' },
      { id: 'southampton', name: 'Southampton', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/southampton.a461171e.png' },
      { id: 'norwich', name: 'Norwich City', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/norwich-city.c5752aff.png' },
      { id: 'west_brom', name: 'West Bromwich Albion', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/west-bromwich-albion.929ac1c8.png' },
      { id: 'sunderland', name: 'Sunderland', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/sunderland.4cec0d39.png' },
      { id: 'middlesbrough', name: 'Middlesbrough', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/middlesbrough.20488c14.png' },
      { id: 'coventry', name: 'Coventry City', logoUrl: 'https://assets.football-logos.cc/logos/england/1500x1500/coventry-city.c4fc9437.png' },
    ]
  },
  la_liga_2: {
    name: 'La Liga 2',
    country: 'Spagna',
    teams: [
      { id: 'zaragoza', name: 'Real Saragozza', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/zaragoza.2221edb0.png' },
      { id: 'sporting_gijon', name: 'Sporting Gijon', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/sporting-gijon.9a56af7b.png' },
      { id: 'malaga', name: 'Malaga', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/malaga.97c04d99.png' },
      { id: 'elche', name: 'Elche', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/elche.d494b9b9.png' },
      { id: 'eibar', name: 'Eibar', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/eibar.174ec159.png' },
      { id: 'leganes', name: 'Leganes', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/leganes.c9dbb630.png' },
      { id: 'tenerife', name: 'Tenerife', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/tenerife.552a1382.png' },
      { id: 'levante', name: 'Levante', logoUrl: 'https://assets.football-logos.cc/logos/spain/1500x1500/levante.55058f42.png' },
    ]
  },
  zweite_bundesliga: {
    name: '2. Bundesliga',
    country: 'Germania',
    teams: [
      { id: 'hannover', name: 'Hannover 96', logoUrl: 'https://assets.football-logos.cc/logos/germany/1500x1500/hannover-96.600c304d.png' },
      { id: 'hertha', name: 'Hertha Berlino', logoUrl: 'https://assets.football-logos.cc/logos/germany/1500x1500/hertha-bsc.e1e27349.png' },
      { id: 'kaiserslautern', name: 'Kaiserslautern', logoUrl: 'https://assets.football-logos.cc/logos/germany/1500x1500/fc-kaiserslautern.5ca3bfa5.png' },
      { id: 'nurnberg', name: 'Norimberga', logoUrl: 'https://assets.football-logos.cc/logos/germany/1500x1500/fc-nurnberg.1fc7e589.png' },
      { id: 'dresden', name: 'Dinamo Dresda', logoUrl: 'https://assets.football-logos.cc/logos/germany/1500x1500/dynamo-dresden.8cddabe4.png' },
      { id: 'st_pauli', name: 'St. Pauli', logoUrl: 'https://assets.football-logos.cc/logos/germany/1500x1500/st-pauli.4603e7f7.png' },
    ]
  },
  ligue_2: {
    name: 'Ligue 2',
    country: 'Francia',
    teams: [
      { id: 'metz', name: 'Metz', logoUrl: 'https://assets.football-logos.cc/logos/france/1500x1500/fc-metz.d284830e.png' },
      { id: 'guingamp', name: 'Guingamp', logoUrl: 'https://assets.football-logos.cc/logos/france/1500x1500/guingamp.401f1482.png' },
      { id: 'grenoble', name: 'Grenoble', logoUrl: 'https://assets.football-logos.cc/logos/france/1500x1500/grenoble-foot-38.300bff80.png' },
      { id: 'sochaux', name: 'Sochaux', logoUrl: 'https://assets.football-logos.cc/logos/france/1500x1500/sochaux.8b1ea5d6.png' },
      { id: 'annecy', name: 'Annecy', logoUrl: 'https://assets.football-logos.cc/logos/france/1500x1500/annecy.b0632b8e.png' },
      { id: 'pau', name: 'Pau', logoUrl: 'https://assets.football-logos.cc/logos/france/1500x1500/pau.66f501ff.png' },
    ]
  },
};

// Get logo URL from football-logos.cc
export const getTeamLogoUrl = (team) => {
  return team?.logoUrl || null;
};

// Get all teams as flat list
export const getAllTeams = () => {
  const teams = [];
  Object.entries(LEAGUES).forEach(([leagueId, league]) => {
    league.teams.forEach(team => {
      teams.push({ ...team, leagueId, leagueName: league.name, country: league.country });
    });
  });
  return teams;
};

// Overall requirement to join a club (rewards big teams)
const TOP_TEAMS = ['Real Madrid', 'Barcelona', 'Manchester City', 'Bayern Monaco', 'Paris Saint-Germain', 'Liverpool'];
const MID_TEAMS = ['Inter', 'Milan', 'Juventus', 'Napoli', 'Atletico Madrid', 'Chelsea', 'Arsenal', 'Borussia Dortmund'];

export const getTeamRequirement = (teamName) => {
  if (TOP_TEAMS.includes(teamName)) return 80;
  if (MID_TEAMS.includes(teamName)) return 70;
  return 50;
};
