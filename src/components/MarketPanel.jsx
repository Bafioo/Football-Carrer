import { LEAGUES, getTeamLogoUrl } from '../data/teams';

const LOGO_FALLBACK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23d4d2d2"/></svg>';

const LABELS = {
  stay:     { text: 'Resta',    cls: 'text-success' },
  transfer: { text: 'Firma',    cls: 'text-accent' },
  loan:     { text: 'Prestito', cls: 'text-warning' },
  join:     { text: 'Firma',    cls: 'text-accent' },
};

function MarketCard({ team, kind, compact, onPick }) {
  const { text, cls } = LABELS[kind] || LABELS.transfer;
  const league = LEAGUES[team.leagueId];
  const base = 'bg-surface-soft border border-hairline-strong hover:border-ink rounded-lg transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.97] flex flex-col items-center text-center';
  const sizing = compact ? 'flex-1 min-w-0 px-2 py-2 gap-0.5' : 'w-full p-3 gap-1';
  return (
    <button onClick={() => onPick(kind, team)} className={`${base} ${sizing}`}>
      <span className={`uppercase font-bold ${compact ? 'text-[9px]' : 'text-[10px]'} ${cls}`}>{text}</span>
      <div className={`font-bold w-full leading-tight ${compact ? 'text-[10px]' : 'text-xs'}`}>{team.name}</div>
      <img
        src={getTeamLogoUrl(team)}
        alt={team.name}
        className={`object-contain ${compact ? 'w-8 h-8' : 'w-10 h-10'}`}
        onError={(e) => { e.target.src = LOGO_FALLBACK; }}
      />
      {league && (
        <div className="flex items-center justify-center gap-1">
          <img
            src={league.logoUrl}
            alt=""
            className="w-3.5 h-3.5 object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className={`text-stone ${compact ? 'text-[8px]' : 'text-[9px]'} leading-none`}>{league.name}</span>
        </div>
      )}
    </button>
  );
}

export default function MarketPanel({ offers, retired, onPick }) {
  if (!offers) return null;
  const hint = retired
    ? 'Carriera conclusa: a 40 anni hai appeso gli scarpini al chiodo.'
    : offers.join
      ? 'Scegli il tuo primo contratto: ogni firma ti fa giocare le prossime stagioni.'
      : 'Scegli il tuo prossimo passo: ogni scelta gioca le prossime stagioni.';

  return (
    <>
      {/* Desktop: sticky right column */}
      <div className="hidden lg:block lg:sticky lg:top-4 self-start">
        <div className="card">
          <h3 className="text-lg font-bold mb-1">{offers.join ? 'Offerte di Contratto' : 'Mercato'}</h3>
          <p className="text-stone text-xs mb-3">{hint}</p>
          {!retired && (
            <div className="space-y-2">
              {offers.cards.map(({ team, kind }, i) => (
                <MarketCard key={i} team={team} kind={kind} onPick={onPick} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile: fixed bottom bar */}
      {retired ? (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-canvas border-t border-hairline px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-center text-xs text-stone rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.35)]">
          Carriera conclusa: a 40 anni hai appeso gli scarpini al chiodo.
        </div>
      ) : (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-canvas border-t border-hairline px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.35)]">
          <div className="max-w-7xl mx-auto flex items-stretch gap-2">
            {offers.cards.map(({ team, kind }, i) => (
              <MarketCard key={i} team={team} kind={kind} compact onPick={onPick} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}