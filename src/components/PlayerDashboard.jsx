import { useState, useEffect } from 'react';
import { ROLES } from '../data/roles';
import { getFlagUrl } from '../data/nationalities';
import { getTeamLogoUrl, getAllTeams, getTeamRequirement } from '../data/teams';
import { getRandomEvent } from '../data/events';
import { genFactor, seasonNoise } from '../utils/gen';
import TeamSwitcher from './TeamSwitcher';
import MarketPanel from './MarketPanel';

const LOGO_FALLBACK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23d4d2d2"/></svg>';

const ROLE_COEFFS = {
  ST:  { goals: 16, assists: 5,  cleanSheets: 0 },
  LW:  { goals: 10,  assists: 12,  cleanSheets: 0 },
  RW:  { goals: 10,  assists: 12,  cleanSheets: 0 },
  CAM: { goals: 8,  assists: 11, cleanSheets: 0 },
  CM:  { goals: 6,  assists: 9,  cleanSheets: 0 },
  CDM: { goals: 2,  assists: 5,  cleanSheets: 0 },
  CB:  { goals: 3,  assists: 1,  cleanSheets: 0 },
  LB:  { goals: 2,  assists: 7,  cleanSheets: 0 },
  RB:  { goals: 2,  assists: 7,  cleanSheets: 0 },
  GK:  { goals: 0,  assists: 0,  cleanSheets: 9 },
};

export default function PlayerDashboard({ player, onUpdate, onReset }) {
  const [showTeamSwitcher, setShowTeamSwitcher] = useState(false);
  const [yearSummary, setYearSummary] = useState(null);
  const [showFinal, setShowFinal] = useState(false);
  const [offers, setOffers] = useState(null);

  // Build the 3 possible moves for the current player state.
  // Teamless: 3 join offers. Teamed: stay / transfer / loan.
  const buildOffers = (p) => {
    const allTeams = getAllTeams();
    const joinable = allTeams.filter(t => (!p.team || t.id !== p.team.id) && getTeamRequirement(t.name) <= p.overall);
    const topTier = ([80, 70, 50].find(r => r <= p.overall)) || 50;
    const preferred = joinable.filter(t => getTeamRequirement(t.name) === topTier);
    const rest = joinable.filter(t => getTeamRequirement(t.name) !== topTier);
    const draw = (avoidIds) => {
      const bucket = preferred.length && Math.random() < 0.7 ? preferred : (rest.length ? rest : preferred);
      const candidates = bucket.filter(t => !avoidIds.includes(t.id));
      if (candidates.length) return candidates[Math.floor(Math.random() * candidates.length)];
      const any = joinable.filter(t => !avoidIds.includes(t.id));
      return any.length ? any[Math.floor(Math.random() * any.length)] : null;
    };
    if (!p.team) {
      const o1 = draw([]);
      const o2 = draw(o1 ? [o1.id] : []);
      const o3 = draw([...(o1 ? [o1.id] : []), ...(o2 ? [o2.id] : [])]);
      return { join: true, cards: [
        { team: o1, kind: 'join' },
        { team: o2, kind: 'join' },
        { team: o3, kind: 'join' },
      ].filter(c => c.team) };
    }
    const transferOffer = draw([]);
    const loanOffer = draw(transferOffer ? [transferOffer.id] : []);
    return { join: false, cards: [
      { team: p.team, kind: 'stay' },
      { team: transferOffer, kind: 'transfer' },
      { team: loanOffer, kind: 'loan' },
    ] };
  };

  // Regenerate offers whenever a brand-new career (or a fresh session)
  // has none yet.
  useEffect(() => {
    if (!offers) setOffers(buildOffers(player));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const role = ROLES[player.role];
  const overall = player.overall;
  const isGK = player.role === 'GK';
  const seasons = player.seasons || [];

  const teamHistory = (() => {
    const byTeam = {};
    seasons.forEach(s => {
      if (!byTeam[s.teamId]) {
        byTeam[s.teamId] = { team: s.team, min: s.season, max: s.season };
      } else {
        byTeam[s.teamId].min = Math.min(byTeam[s.teamId].min, s.season);
        byTeam[s.teamId].max = Math.max(byTeam[s.teamId].max, s.season);
      }
    });
    const list = Object.values(byTeam);
    if (player.team && !list.some(e => e.team.id === player.team.id)) {
      list.push({ team: player.team, min: player.season, max: null });
    }
    return list.sort((a, b) => a.min - b.min);
  })();

  const bestSeason = seasons.reduce((best, s) => {
    const score = isGK
      ? (s.saves || 0) + s.cleanSheets * 5 - (s.goalsConceded || 0)
      : s.goals + s.assists;
    return !best || score > best.score ? { ...s, score } : best;
  }, null);

  // Season rows: single per year, or pairs when advancing 2 at a time
  const seasonRows = (() => {
    const reversed = [...seasons].reverse();
    if ((player.advanceCount || 1) <= 1) return reversed.map(s => [s]);
    const rows = [];
    for (let i = 0; i < reversed.length; i += 2) {
      rows.push(i + 1 < reversed.length ? [reversed[i + 1], reversed[i]] : [reversed[i]]);
    }
    return rows;
  })();

  const simulateSeasons = (count, base) => {
    let p = { ...(base || player) };
    const agg = { matches: 0, goals: 0, assists: 0, cleanSheets: 0, saves: 0, goalsConceded: 0, events: [], loaned: false, years: 0, toSeason: p.season };

    for (let i = 0; i < count; i++) {
      if (p.age >= 40) break;

      const isGk = p.role === 'GK';
      const coeffs = ROLE_COEFFS[p.role] || ROLE_COEFFS.ST;
      const f = genFactor(p.overall);

      const matches = Math.max(18, Math.min(100, Math.round(30 * f * seasonNoise())));
      const clampToMatches = (n) => Math.max(0, Math.min(matches, n));
      const goals = clampToMatches(Math.round(coeffs.goals * f * seasonNoise()));
      const assists = clampToMatches(Math.round(coeffs.assists * f * seasonNoise()));
      const cleanSheets = clampToMatches(Math.round(coeffs.cleanSheets * f * seasonNoise()));
      const saves = isGk
        ? Math.max(0, Math.min(matches * 8, Math.round(70 * f * seasonNoise())))
        : 0;
      const goalsConceded = isGk
        ? Math.max(0, Math.min(matches * 4, Math.round(45 / f * seasonNoise())))
        : 0;

      // 1-2 random events during the year
      const eventCount = 1 + (Math.random() < 0.5 ? 1 : 0);
      const newStats = { ...p.stats };
      const events = [];
      for (let e = 0; e < eventCount; e++) {
        const event = getRandomEvent(p.role);
        Object.entries(event.statChanges).forEach(([stat, change]) => {
          newStats[stat] = Math.max(1, Math.min(99, newStats[stat] + change));
        });
        const genChange = event.type === 'positive'
          ? 2 + Math.floor(Math.random() * 4)   // +2..+5
          : event.genLoss
            ? -(1 + Math.floor(Math.random() * 3)) // -1..-3, only injuries
            : 0;                                  // others never touch gen
        events.push({ title: event.title, type: event.type, description: event.description, changes: event.statChanges, genChange });
      }

      // Gen: only age-curve shift + event genChange, never stat noise
      const eventImpact = events.reduce((t, e) => t + e.genChange, 0);
      let genShift = 0;
      if (p.age <= 25) {
        genShift = 1 + Math.floor(Math.random() * 4); // +1..+4, random positive
      } else if (p.age > 30) {
        genShift = -(1 + Math.floor(Math.random() * 3)); // -1..-3, random negative
      }
      const newOverall = Math.max(1, Math.min(99, p.overall + genShift + eventImpact));

      const wasLoaned = !!p.loanTeam;
      const history = [...p.history];

      if (wasLoaned) {
        history.unshift({
          type: 'transfer',
          date: new Date().toISOString(),
          text: `Fine prestito: ritorno al ${p.team.name}!`,
        });
      }

      history.unshift({
        type: 'match',
        date: new Date().toISOString(),
        text: `Stagione ${p.season + 1} conclusa: ${matches} partite, ${goals} gol, ${assists} assist${cleanSheets ? `, ${cleanSheets} clean sheet` : ''}. Gen ${p.overall} -> ${newOverall}.`,
      });

      events.forEach(event => {
        history.unshift({
          type: event.type,
          date: new Date().toISOString(),
          text: `${event.title}: ${event.description}`,
          changes: event.changes,
        });
      });

      p = {
        ...p,
        age: p.age + 1,
        season: p.season + 1,
        loanTeam: undefined,
        matchesPlayed: p.matchesPlayed + matches,
        goals: p.goals + goals,
        assists: p.assists + assists,
        cleanSheets: (p.cleanSheets || 0) + cleanSheets,
        saves: (p.saves || 0) + saves,
        goalsConceded: (p.goalsConceded || 0) + goalsConceded,
        stats: newStats,
        overall: newOverall,
        seasons: [...(p.seasons || []), {
          season: p.season + 1,
          age: p.age + 1,
          teamId: (p.loanTeam || p.team).id,
          team: p.loanTeam || p.team,
          loaned: !!p.loanTeam,
          matches,
          goals,
          assists,
          cleanSheets,
          saves,
          goalsConceded,
          overall: newOverall,
        }],
        history: history.slice(0, 50),
      };

      agg.matches += matches;
      agg.goals += goals;
      agg.assists += assists;
      agg.cleanSheets += cleanSheets;
      agg.saves += saves;
      agg.goalsConceded += goalsConceded;
      agg.events.push(...events);
      agg.loaned = agg.loaned || wasLoaned;
      agg.years += 1;
      agg.toSeason = p.season;
    }

    if (agg.years === 0) return;
    onUpdate(p);
    if (p.age >= 40) {
      setShowFinal(true);
      return;
    }

    setYearSummary({
      toSeason: agg.toSeason,
      years: agg.years,
      matches: agg.matches,
      goals: agg.goals,
      assists: agg.assists,
      cleanSheets: agg.cleanSheets,
      saves: agg.saves,
      goalsConceded: agg.goalsConceded,
      events: agg.events,
      newOverall: p.overall,
      loanReturned: agg.loaned,
    });
    setOffers(buildOffers(p));
  };

  const handleJoinOffer = (team) => {
    if (!team) return;
    const updated = {
      ...player,
      team,
      loanTeam: undefined,
      history: [{
        type: 'transfer',
        date: new Date().toISOString(),
        text: `Firma con il ${team.name}!`,
      }, ...player.history].slice(0, 50)
    };
    onUpdate(updated);
    simulateSeasons(player.advanceCount || 1, updated);
  };

  const handleLoanOffer = (team) => {
    if (!team) return;
    const updated = {
      ...player,
      loanTeam: team,
      history: [{
        type: 'transfer',
        date: new Date().toISOString(),
        text: `Prestito al ${team.name}! Un anno per farsi valere.`,
      }, ...player.history].slice(0, 50)
    };
    onUpdate(updated);
    simulateSeasons(player.advanceCount || 1, updated);
  };

  const handleTransferOffer = (team) => {
    if (!team) return;
    const updated = {
      ...player,
      team,
      loanTeam: undefined,
      history: [{
        type: 'transfer',
        date: new Date().toISOString(),
        text: `Trasferimento al ${team.name}!`,
      }, ...player.history].slice(0, 50)
    };
    onUpdate(updated);
    setShowTeamSwitcher(false);
    simulateSeasons(player.advanceCount || 1, updated);
  };

  const handleStay = () => {
    simulateSeasons(player.advanceCount || 1, player);
  };

  const handlePick = (kind, team) => {
    if (kind === 'stay') return handleStay();
    if (kind === 'loan') return handleLoanOffer(team);
    if (kind === 'join') return handleJoinOffer(team);
    return handleTransferOffer(team);
  };

  const handleTeamChange = (newTeam) => {
    const updated = {
      ...player,
      team: newTeam,
      loanTeam: undefined,
      history: [{
        type: 'transfer',
        date: new Date().toISOString(),
        text: `Trasferimento al ${newTeam.name}!`,
      }, ...player.history].slice(0, 50)
    };
    onUpdate(updated);
    setOffers(buildOffers(updated));
    setShowTeamSwitcher(false);
  };

  const getOverallColor = (ovr) => {
    if (ovr >= 85) return 'border-success';
    if (ovr >= 75) return 'border-accent';
    if (ovr >= 65) return 'border-warning';
    if (ovr >= 50) return 'border-stone';
    return 'border-danger';
  };

  return (
    <div className="min-h-screen p-4 pb-[calc(7rem+env(safe-area-inset-bottom))] lg:pb-4">
      <div className="max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl md:text-2xl font-bold tracking-widest text-ink">
            FOOTBALL CAREER
          </h1>
          <button onClick={onReset} className="btn-danger text-sm">
            Nuova Carriera
          </button>
        </div>

        {/* Player Header Card */}
        <div className="card mb-4 slide-up">
          <div className="flex flex-col md:flex-row gap-5 items-center md:items-start">
            {/* Overall */}
            <div className={`relative w-28 h-28 md:w-24 md:h-24 rounded-full border-[3px] ${getOverallColor(overall)} bg-surface-soft flex items-center justify-center shrink-0`}>
              <div className="text-5xl md:text-4xl font-bold">{overall}</div>
              <div className="absolute -bottom-2 bg-ink text-canvas px-2 py-0.5 rounded-full text-[10px] font-bold">
                OVR
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                <h2 className="text-xl font-bold">{player.name}</h2>
                <img
                  src={getFlagUrl(player.nationality.flag)}
                  alt={player.nationality.name}
                  className="w-10 h-7 object-cover rounded border border-hairline-strong"
                  title={player.nationality.name}
                />
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-ink text-canvas">
                  {player.role} {role.name}
                </span>
                <span className="bg-surface-soft border border-hairline-strong px-2 py-0.5 rounded-full text-xs text-body">
                  {player.age} anni
                </span>
                <span className="bg-surface-soft border border-hairline-strong px-2 py-0.5 rounded-full text-xs text-body">
                  Stagione {player.season}
                </span>
              </div>
              {player.team ? (
                <div className="inline-flex items-center justify-center md:justify-start gap-3 bg-surface-soft border border-hairline px-3 py-2 rounded">
                  <img
                    src={getTeamLogoUrl(player.loanTeam || player.team)}
                    alt={player.loanTeam?.name || player.team.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => { e.target.src = LOGO_FALLBACK; }}
                  />
                  <div className="text-left">
                    <div className="font-bold text-base">{player.loanTeam ? player.loanTeam.name : player.team.name}</div>
                    <div className="text-xs text-stone">{player.loanTeam?.leagueName || player.team.leagueName}</div>
                    {player.loanTeam && (
                      <div className="text-xs text-warning font-bold mt-0.5">
                        PROPRIETA: {player.team.name}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 bg-surface-soft border border-hairline px-3 py-2 rounded">
                  <div className="w-10 h-10 rounded-full bg-ink text-canvas flex items-center justify-center text-base font-bold">
                    ?
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base">Squadra Libera</div>
                    <div className="text-xs text-stone">Scegli un'offerta in basso</div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats summary - only on sm+ (duplicates Riassunto Carriera on mobile) */}
            <div className={`${isGK ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'} hidden sm:grid gap-2 text-center`}>
              <div className="bg-surface-soft border border-hairline px-3 py-2">
                <div className="text-xl font-bold text-ink">{player.matchesPlayed}</div>
                <div className="text-xs text-stone">Partite</div>
              </div>
              {isGK ? (
                <>
                  <div className="bg-surface-soft border border-hairline px-3 py-2">
                    <div className="text-xl font-bold text-accent">{player.saves || 0}</div>
                    <div className="text-xs text-stone">Parate</div>
                  </div>
                  <div className="bg-surface-soft border border-hairline px-3 py-2">
                    <div className="text-xl font-bold text-warning">{player.cleanSheets || 0}</div>
                    <div className="text-xs text-stone">Clean sheet</div>
                  </div>
                  <div className="bg-surface-soft border border-hairline px-3 py-2">
                    <div className="text-xl font-bold text-danger">{player.goalsConceded || 0}</div>
                    <div className="text-xs text-stone">Goal subiti</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-surface-soft border border-hairline px-3 py-2">
                    <div className="text-xl font-bold text-success">{player.goals}</div>
                    <div className="text-xs text-stone">Gol</div>
                  </div>
                  <div className="bg-surface-soft border border-hairline px-3 py-2">
                    <div className="text-xl font-bold text-accent">{player.assists}</div>
                    <div className="text-xs text-stone">Assist</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <button onClick={() => setShowTeamSwitcher(true)} className="btn-secondary">
            Cambia Squadra
          </button>
          {player.age >= 40 && (
            <button onClick={() => setShowFinal(true)} className="btn-primary ml-auto py-2 px-4">
              Riepilogo
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-5 lg:gap-4">
          {/* Team History */}
          <div className="card">
            <h3 className="text-lg font-bold mb-3">Storico Squadre</h3>
            <div className="space-y-2">
              {teamHistory.map((entry, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 bg-surface-soft border border-hairline px-3 py-1.5 ${entry.max === null ? 'border-ink' : ''}`}
                >
                  <img
                    src={getTeamLogoUrl(entry.team)}
                    alt={entry.team.name}
                    className="w-9 h-9 object-contain shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm truncate">{entry.team.name}</div>
                    <div className="text-xs text-stone">
                      {entry.max === null
                        ? entry.min === player.season ? `Stagione ${entry.min}` : `Dal S${entry.min}`
                        : entry.min === entry.max ? `Stagione ${entry.min}` : `Stagioni ${entry.min}-${entry.max}`}
                    </div>
                  </div>
                  {entry.max === null && (
                    <span className="ml-auto text-xs font-bold text-success">ORA</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Career Recap */}
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-bold mb-3">Riassunto Carriera</h3>

            <div className={`${isGK ? 'sm:grid-cols-5' : 'sm:grid-cols-4'} grid grid-cols-2 gap-2 text-center mb-3`}>
              <div className="bg-surface-soft border border-hairline px-3 py-2">
                <div className="text-xl font-bold text-ink">{player.season}</div>
                <div className="text-xs text-stone">Stagioni</div>
              </div>
              <div className="bg-surface-soft border border-hairline px-3 py-2">
                <div className="text-xl font-bold text-ink">{seasons.reduce((t, s) => t + s.matches, 0)}</div>
                <div className="text-xs text-stone">Partite</div>
              </div>
              {isGK ? (
                <>
                  <div className="bg-surface-soft border border-hairline px-3 py-2">
                    <div className="text-xl font-bold text-accent">{seasons.reduce((t, s) => t + (s.saves || 0), 0)}</div>
                    <div className="text-xs text-stone">Parate</div>
                  </div>
                  <div className="bg-surface-soft border border-hairline px-3 py-2">
                    <div className="text-xl font-bold text-warning">{seasons.reduce((t, s) => t + s.cleanSheets, 0)}</div>
                    <div className="text-xs text-stone">Clean sheet</div>
                  </div>
                  <div className="bg-surface-soft border border-hairline px-3 py-2">
                    <div className="text-xl font-bold text-danger">{seasons.reduce((t, s) => t + (s.goalsConceded || 0), 0)}</div>
                    <div className="text-xs text-stone">Goal subiti</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-surface-soft border border-hairline px-3 py-2">
                    <div className="text-xl font-bold text-success">{seasons.reduce((t, s) => t + s.goals, 0)}</div>
                    <div className="text-xs text-stone">Gol</div>
                  </div>
                  <div className="bg-surface-soft border border-hairline px-3 py-2">
                    <div className="text-xl font-bold text-accent">{seasons.reduce((t, s) => t + s.assists, 0)}</div>
                    <div className="text-xs text-stone">Assist</div>
                  </div>
                </>
              )}
            </div>

            {bestSeason ? (
              <div className="bg-surface-soft border border-hairline px-3 py-2 mb-3 flex flex-wrap items-center gap-x-6 gap-y-1">
                <span className="text-sm font-bold text-warning">MIGLIOR STAGIONE: S{bestSeason.season}</span>
                <span className="text-sm text-body">
                  {bestSeason.team.name}{bestSeason.loaned ? ' (prestito)' : ''} - {bestSeason.matches} partite{isGK
                    ? `, ${bestSeason.saves || 0} parate, ${bestSeason.cleanSheets} cs, ${bestSeason.goalsConceded || 0} subiti`
                    : `, ${bestSeason.goals} gol, ${bestSeason.assists} assist`}
                </span>
              </div>
            ) : (
              <div className="bg-surface-soft border border-hairline px-3 py-2 mb-3 text-sm text-body">
                Nessuna stagione conclusa ancora: firma un contratto per iniziare la carriera.
              </div>
            )}

            <div className="text-xs font-bold text-mute uppercase mb-2">Stagioni</div>
            <div className="max-h-[230px] overflow-y-auto pr-2">
              {seasonRows.map((row, i) => {
                const first = row[0];
                const last = row[row.length - 1];
                const sum = (k) => row.reduce((t, s) => t + (s[k] || 0), 0);
                return (
                  <div key={i} className={`flex items-center gap-1.5 px-2 py-1.5 border-b border-hairline text-sm ${last.season === player.season ? 'bg-surface-soft' : ''}`}>
                  <span className="w-8 font-bold text-ink">{last.age}a</span>
                    {row.length > 1 && first.team.id !== last.team.id && (
                      <>
                        <img src={getTeamLogoUrl(first.team)} alt="" className="w-4 h-4 object-contain shrink-0" />
                        <span className="truncate max-w-16 text-stone hidden sm:block">{first.team.name}</span>
                        <span className="text-stone shrink-0 hidden sm:block">-&gt;</span>
                      </>
                    )}
                    <img src={getTeamLogoUrl(last.team)} alt="" className="w-5 h-5 object-contain shrink-0" />
                    <span className="flex-1 truncate font-semibold text-body">
                      {last.team.name}
                      {row.some(s => s.loaned) && <span className="text-warning text-xs font-bold ml-1">[prestito]</span>}
                    </span>
                    <span className="w-8 text-right text-stone">{sum('matches')}</span>
                    {isGK ? (
                      <>
                        <span className="w-8 text-right text-accent font-bold">{sum('saves')}</span>
                        <span className="w-8 text-right text-warning">{sum('cleanSheets')}</span>
                        <span className="w-8 text-right text-danger">{sum('goalsConceded')}</span>
                      </>
                    ) : (
                      <>
                        <span className="w-8 text-right text-success font-bold">{sum('goals')}</span>
                        <span className="w-8 text-right text-accent font-bold">{sum('assists')}</span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <MarketPanel
            offers={offers}
            retired={player.age >= 40}
            onPick={handlePick}
          />
        </div>

        {/* Year Summary Modal */}
        {yearSummary && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 fade-in">
            <div className="bg-canvas border border-ink max-w-lg w-full p-4 md:p-5 max-h-[90vh] overflow-y-auto slide-up">
              <div className="text-center mb-4">
                <div className="text-2xl font-black mb-1">
                  Fine Stagione {yearSummary.toSeason}
                  {yearSummary.years > 1 && <span className="text-lg text-body"> ({yearSummary.years} stagioni)</span>}
                </div>
                <div className="text-sm text-body">
                  {yearSummary.loanReturned && (
                    <span className="text-warning font-bold block mb-1">[x] Prestito concluso, sei tornato al club</span>
                  )}
                  Nuovo Overall: <span className="text-ink font-bold">{yearSummary.newOverall}</span>
                </div>
              </div>

              <div className={`${isGK ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'} grid gap-2 mb-4 text-center`}>
                <div className="bg-surface-soft border border-hairline px-2 py-2">
                  <div className="text-lg font-bold">{yearSummary.matches}</div>
                  <div className="text-xs text-stone">Partite</div>
                </div>
                {isGK ? (
                  <>
                    <div className="bg-surface-soft border border-hairline px-2 py-2">
                      <div className="text-lg font-bold text-accent">{yearSummary.saves}</div>
                      <div className="text-xs text-stone">Parate</div>
                    </div>
                    <div className="bg-surface-soft border border-hairline px-2 py-2">
                      <div className="text-lg font-bold text-warning">{yearSummary.cleanSheets}</div>
                      <div className="text-xs text-stone">Clean sheet</div>
                    </div>
                    <div className="bg-surface-soft border border-hairline px-2 py-2">
                      <div className="text-lg font-bold text-danger">{yearSummary.goalsConceded}</div>
                      <div className="text-xs text-stone">Goal subiti</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-surface-soft border border-hairline px-2 py-2">
                      <div className="text-lg font-bold text-success">{yearSummary.goals}</div>
                      <div className="text-xs text-stone">Gol</div>
                    </div>
                    <div className="bg-surface-soft border border-hairline px-2 py-2">
                      <div className="text-lg font-bold text-accent">{yearSummary.assists}</div>
                      <div className="text-xs text-stone">Assist</div>
                    </div>
                  </>
                )}
              </div>

              {yearSummary.events.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-bold text-mute uppercase mb-2">Eventi della stagione</div>
                  <div className="space-y-2">
                    {yearSummary.events.map((event, i) => (
                      <div key={i} className={`p-3 border-l-4 bg-surface-soft text-sm ${event.type === 'positive' ? 'border-l-success' : event.type === 'negative' ? 'border-l-danger' : 'border-l-warning'}`}>
                        <div className="font-bold flex justify-between items-center">
                          {event.title}
                          <span className={`font-black ${event.genChange > 0 ? 'text-success' : event.genChange < 0 ? 'text-danger' : 'text-stone'}`}>
                            GEN {event.genChange > 0 ? '+' : ''}{event.genChange}
                          </span>
                        </div>
                        <div className="text-body">{event.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-hairline pt-4">
                <button onClick={() => setYearSummary(null)} className="btn-primary w-full">
                  [x] Continua
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Final Career Summary Modal */}
        {showFinal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 fade-in">
            <div className="bg-canvas border border-ink max-w-lg w-full p-4 md:p-5 max-h-[90vh] overflow-y-auto slide-up">
              <div className="text-center mb-4">
                <div className="text-2xl font-black mb-1">Fine Carriera</div>
                <div className="text-sm text-body">
                  Stagione {player.season} - a {player.age} anni hai appeso gli scarpini al chiodo
                </div>
                <div className="text-sm text-body mt-1">
                  Gen finale: <span className="text-ink font-bold">{player.overall}</span>
                </div>
              </div>

              <div className={`${isGK ? 'sm:grid-cols-5' : 'sm:grid-cols-4'} grid grid-cols-2 gap-2 mb-4 text-center`}>
                <div className="bg-surface-soft border border-hairline px-2 py-2">
                  <div className="text-lg font-bold">{player.season - 1}</div>
                  <div className="text-xs text-stone">Stagioni</div>
                </div>
                <div className="bg-surface-soft border border-hairline px-2 py-2">
                  <div className="text-lg font-bold">{player.matchesPlayed}</div>
                  <div className="text-xs text-stone">Partite</div>
                </div>
                {isGK ? (
                  <>
                    <div className="bg-surface-soft border border-hairline px-2 py-2">
                      <div className="text-lg font-bold text-accent">{player.saves || 0}</div>
                      <div className="text-xs text-stone">Parate</div>
                    </div>
                    <div className="bg-surface-soft border border-hairline px-2 py-2">
                      <div className="text-lg font-bold text-warning">{player.cleanSheets || 0}</div>
                      <div className="text-xs text-stone">Clean sheet</div>
                    </div>
                    <div className="bg-surface-soft border border-hairline px-2 py-2">
                      <div className="text-lg font-bold text-danger">{player.goalsConceded || 0}</div>
                      <div className="text-xs text-stone">Goal subiti</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-surface-soft border border-hairline px-2 py-2">
                      <div className="text-lg font-bold text-success">{player.goals}</div>
                      <div className="text-xs text-stone">Gol</div>
                    </div>
                    <div className="bg-surface-soft border border-hairline px-2 py-2">
                      <div className="text-lg font-bold text-accent">{player.assists}</div>
                      <div className="text-xs text-stone">Assist</div>
                    </div>
                  </>
                )}
              </div>

              {bestSeason && (
                <div className="bg-surface-soft border border-hairline px-3 py-2 mb-3 flex flex-wrap items-center gap-x-6 gap-y-1">
                  <span className="text-sm font-bold text-warning">MIGLIOR STAGIONE: S{bestSeason.season}</span>
                  <span className="text-sm text-body">
                    {bestSeason.team.name}{bestSeason.loaned ? ' (prestito)' : ''} - {bestSeason.goals} gol, {bestSeason.assists} assist{isGK ? `, ${bestSeason.saves || 0} parate, ${bestSeason.cleanSheets} cs, ${bestSeason.goalsConceded || 0} subiti` : ''}
                  </span>
                </div>
              )}

              <div className="text-xs font-bold text-mute uppercase mb-2">Squadre in carriera</div>
              <div className="space-y-2 mb-4">
                {teamHistory.map((entry, i) => (
                  <div key={i} className="flex items-center gap-3 bg-surface-soft border border-hairline px-3 py-1.5">
                    <img src={getTeamLogoUrl(entry.team)} alt={entry.team.name} className="w-8 h-8 object-contain shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-sm truncate">{entry.team.name}</div>
                      <div className="text-xs text-stone">
                        {entry.min === entry.max ? `Stagione ${entry.min}` : `Stagioni ${entry.min}-${entry.max}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => setShowFinal(false)} className="btn-secondary w-full">
                  [x] Rivedi il profilo
                </button>
                <button onClick={onReset} className="btn-primary w-full">
                  [+] Nuova Carriera
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Team Switcher Modal */}
        {showTeamSwitcher && (
          <TeamSwitcher
            currentTeam={player.team}
            playerOverall={overall}
            onSelect={handleTeamChange}
            onClose={() => setShowTeamSwitcher(false)}
          />
        )}
      </div>
    </div>
  );
}
