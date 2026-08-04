import { useState } from 'react';
import { LEAGUES, getTeamLogoUrl, getTeamRequirement } from '../data/teams';

export default function TeamSwitcher({ currentTeam, playerOverall, onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('all');

  const canJoin = (team) => {
    if (currentTeam && team.id === currentTeam.id) return false;
    return playerOverall >= getTeamRequirement(team.name);
  };

  const filteredLeagues = Object.entries(LEAGUES).filter(([id]) =>
    selectedLeague === 'all' || id === selectedLeague
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 fade-in" onClick={onClose}>
      <div className="bg-canvas border border-ink max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col rounded-2xl modal-panel" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-ink">Cambia Squadra</h3>
            <p className="text-stone text-sm">Il tuo Overall: <span className="text-ink font-bold">{playerOverall}</span></p>
          </div>
          <button onClick={onClose} className="text-2xl text-mute hover:text-danger transition-colors">✕</button>
        </div>

        <div className="flex gap-1 mb-4 flex-wrap border-b border-hairline">
          <button
            onClick={() => setSelectedLeague('all')}
            className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
              selectedLeague === 'all' ? 'text-ink border-b-2 border-ash' : 'text-mute hover:text-ink border-b-2 border-transparent'
            }`}
          >
            Tutte
          </button>
          {Object.entries(LEAGUES).map(([id, league]) => (
            <button
              key={id}
              onClick={() => setSelectedLeague(id)}
              className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
                selectedLeague === id ? 'text-ink border-b-2 border-ash' : 'text-mute hover:text-ink border-b-2 border-transparent'
              }`}
            >
              {league.name}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca squadra..."
          className="text-input mb-4"
        />

        <div className="overflow-y-auto pr-2 flex-1">
          {filteredLeagues.map(([leagueId, league]) => {
            const teams = league.teams.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
            if (teams.length === 0) return null;
            return (
              <div key={leagueId} className="mb-4">
                <h4 className="font-bold text-ink mb-3 sticky top-0 bg-canvas py-1.5 border-b border-hairline">
                  {league.name}
                </h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {teams.map(team => {
                    const joinable = canJoin(team);
                    const isCurrent = team.id === currentTeam.id;
                    const req = getTeamRequirement(team.name);
                    return (
                      <button
                        key={team.id}
                        onClick={() => joinable && onSelect({ ...team, leagueId, leagueName: league.name })}
                        disabled={!joinable}
                        className={`p-3 rounded border transition-colors duration-150 text-left ${
                          isCurrent
                            ? 'border-success bg-success/10 cursor-default'
                            : joinable
                              ? 'border-hairline-strong bg-canvas hover:border-ink cursor-pointer'
                              : 'border-hairline bg-surface-soft opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={getTeamLogoUrl(team)}
                            alt={team.name}
                            className="w-10 h-10 object-contain"
                            onError={(e) => { e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23d4d2d2"/></svg>'; }}
                          />
                          <div className="flex-1">
                            <div className="font-bold text-ink">{team.name}</div>
                            {isCurrent && <div className="text-xs text-success">Squadra attuale</div>}
                          </div>
                        </div>
                        {!joinable && !isCurrent && (
                          <div className="text-xs text-danger mt-1">
                            [!] Richiede Overall {req}+
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 pt-3 border-t border-hairline text-center text-xs text-stone">
          [+] Migliora il tuo Overall con eventi positivi per sbloccare squadre migliori!
        </div>
      </div>
    </div>
  );
}
