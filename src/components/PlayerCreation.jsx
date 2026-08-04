import { useState, useEffect, useRef } from 'react';
import { NATIONALITIES, getFlagUrl } from '../data/nationalities';
import { ROLES, ROLE_KEYS, generateInitialStats, calculateOverall } from '../data/roles';

const STEPS = [
  { key: 1, label: 'Nome' },
  { key: 2, label: 'Nazionalità' },
  { key: 3, label: 'Ruolo' },
];

// Position on pitch (x, y) in a 100x160 viewBox, top = opponent goal
const PITCH_POSITIONS = {
  GK: { x: 50, y: 150 },
  CB: { x: 50, y: 127 },
  LB: { x: 17, y: 117 },
  RB: { x: 83, y: 117 },
  CDM: { x: 50, y: 103 },
  CM: { x: 50, y: 80 },
  CAM: { x: 50, y: 60 },
  LW: { x: 16, y: 48 },
  RW: { x: 84, y: 48 },
  ST: { x: 50, y: 34 },
};

export default function PlayerCreation({ onCreate }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState(null);
  const [role, setRole] = useState(null);
  const [searchNat, setSearchNat] = useState('');
  const [advanceCount, setAdvanceCount] = useState(1);
  const navRef = useRef(null);

  useEffect(() => {
    if (role) navRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [role]);

  const filteredNat = NATIONALITIES.filter(n =>
    n.name.toLowerCase().includes(searchNat.toLowerCase())
  );

  const canNext = () => {
    if (step === 1) return name.trim().length >= 2;
    if (step === 2) return nationality !== null;
    if (step === 3) return role !== null;
    return false;
  };

  const handleCreate = () => {
    const stats = generateInitialStats(role);
    const overall = calculateOverall(stats, role);
    const player = {
      id: Date.now(),
      name: name.trim(),
      nationality,
      role,
      team: null,
      stats,
      overall,
      age: 16,
      season: 1,
      matchesPlayed: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      saves: 0,
      goalsConceded: 0,
      seasons: [],
      advanceCount,
      history: [{
        type: 'creation',
        date: new Date().toISOString(),
        text: `Inizio carriera come ${ROLES[role].name}. In attesa di un'offerta.`
      }],
      createdAt: new Date().toISOString(),
    };
    onCreate(player);
  };

  const selectClass = (selected) => selected
    ? 'border-ink bg-ink text-canvas'
    : 'border-hairline-strong bg-canvas text-ink hover:border-ink';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-4 md:mb-5 slide-up">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-widest text-ink">
            FOOTBALL CAREER
          </h1>
          <p className="text-body mt-1 text-base">Crea il tuo campione e vivi una carriera leggendaria</p>
        </div>

        {/* Progress */}
        <div className="mb-4 md:mb-5 slide-up">
          <div className="flex justify-center gap-4 text-sm font-bold">
            {STEPS.map(s => (
              <span
                key={s.key}
                className={`${s.key <= step ? 'text-ink' : 'text-mute'}`}
              >
                {s.key <= step ? '[x]' : '[ ]'} {s.label}
              </span>
            ))}
          </div>
          <div className="max-w-md mx-auto mt-2 h-1 bg-surface-card rounded-full overflow-hidden">
            <div
              className="h-full bg-ink origin-left"
              style={{ transform: `scaleX(${step / 3})`, transition: 'transform 300ms var(--ease-out)' }}
            />
          </div>
        </div>

        <div className="card slide-up p-4 md:p-5">
          <div key={step} className="step-content">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-2">Nome del Giocatore</h2>
              <p className="text-mute mb-4">Scegli il nome con cui sarai ricordato</p>
              <label className="flex items-center gap-2 text-sm font-bold text-ink mb-4">
                Avanzamento stagionale
                <select
                  value={advanceCount}
                  onChange={(e) => setAdvanceCount(Number(e.target.value))}
                  className="text-input !w-auto !py-2"
                >
                  <option value={1}>1 stagione alla volta</option>
                  <option value={2}>2 stagioni alla volta</option>
                </select>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Es. Marco Rossi"
                className="text-input text-lg font-bold"
                maxLength={30}
                autoFocus
              />
              <p className="text-stone text-xs mt-2">{name.length}/30 caratteri</p>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-2">Nazionalità</h2>
              <p className="text-mute mb-3">Da dove vieni?</p>
              <input
                type="text"
                value={searchNat}
                onChange={(e) => setSearchNat(e.target.value)}
                placeholder="Cerca nazione..."
                className="text-input mb-3"
              />
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-2">
                {filteredNat.map(n => (
                  <button
                    key={n.code}
                    onClick={() => setNationality(n)}
                    className={`p-2.5 rounded-lg border transition-[color,background-color,border-color,transform] duration-150 active:scale-[0.97] ${selectClass(nationality?.code === n.code)}`}
                  >
                    <img
                      src={getFlagUrl(n.flag)}
                      alt={n.name}
                      className="w-10 h-6 object-cover rounded mx-auto mb-1 border border-hairline"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="text-xs font-semibold truncate">{n.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-1">Ruolo</h2>
              <p className="text-mute mb-2">Tocca la posizione sul campo in cui vuoi giocare</p>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
                {/* Pitch */}
                <div className="flex-1 w-full flex justify-center bg-surface-soft border border-hairline p-2">
                  <svg viewBox="0 0 100 160" className="w-full max-w-[260px] md:max-w-[280px] h-auto">
                    {/* Field */}
                    <rect x="0" y="0" width="100" height="160" fill="#14532d" />
                    {/* Lines */}
                    <g stroke="#c9d6c9" strokeWidth="0.6" fill="none">
                      <rect x="1" y="1" width="98" height="158" />
                      <line x1="1" y1="80" x2="99" y2="80" />
                      <circle cx="50" cy="80" r="11" />
                      <circle cx="50" cy="80" r="0.9" fill="#c9d6c9" />
                      <rect x="30" y="1" width="40" height="18" />
                      <rect x="30" y="141" width="40" height="18" />
                      <rect x="40" y="1" width="20" height="8" />
                      <rect x="40" y="151" width="20" height="8" />
                      <circle cx="50" cy="14" r="0.9" fill="#c9d6c9" />
                      <circle cx="50" cy="146" r="0.9" fill="#c9d6c9" />
                      {/* Goals */}
                      <line x1="42" y1="0" x2="58" y2="0" strokeWidth="1.4" />
                      <line x1="42" y1="160" x2="58" y2="160" strokeWidth="1.4" />
                    </g>
                    {/* Position markers */}
                    {ROLE_KEYS.map(r => {
                      const { x, y } = PITCH_POSITIONS[r];
                      const selected = role === r;
                      return (
                        <g
                          key={r}
                          onClick={() => setRole(r)}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          {selected && (
                            <circle cx={x} cy={y} r="9" fill="none" stroke="#30d158" strokeWidth="0.7" opacity="0.35" className="transition-opacity duration-150" />
                          )}
                          <circle
                            cx={x} cy={y} r="6.5"
                            fill={selected ? '#fdfcfc' : '#2b2b2b'}
                            stroke={selected ? '#30d158' : '#8a8787'}
                            strokeWidth={selected ? 1.4 : 0.9}
                          />
                          <text
                            x={x} y={y} dy="2.4"
                            textAnchor="middle" fontSize="5.2" fontWeight="bold"
                            fill={selected ? '#171717' : '#fdfcfc'}
                          >
                            {r}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                {/* Details - compact bar on mobile, full panel on desktop */}
                <div className="w-full md:w-64">
                  {role ? (
                    <>
                      <div className="card p-3 fade-in">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-ink text-canvas rounded px-2 py-1 text-sm font-bold">{role}</div>
                          <div className="text-lg font-bold">{ROLES[role].name}</div>
                        </div>
                        <p className="text-body text-sm mb-3 hidden md:block">{ROLES[role].description}</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-stone text-xs md:text-sm border border-dashed border-hairline-strong p-3 md:p-6 text-center">
                      [ ] Seleziona una posizione sul campo
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div ref={navRef} className="flex flex-col sm:flex-row justify-between gap-3 mt-5">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1 || role !== null}
              className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              title={role !== null ? 'Dopo il ruolo non si torna indietro' : undefined}
            >
              ← Indietro
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Avanti →
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={!canNext()}
                className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Inizia Carriera!
              </button>
            )}
          </div>
          </div>
        </div>

        {/* Summary */}
        {(name || nationality || role) && step !== 3 && (
          <div className="card mt-4 fade-in">
            <h3 className="font-bold text-ink mb-3">[+] Riepilogo</h3>
            <div className="flex flex-wrap gap-4 items-center">
              {name && <div className="text-lg font-bold">{name}</div>}
              {nationality && (
                <div className="flex items-center gap-2 bg-surface-soft border border-hairline px-3 py-1 rounded">
                  <img src={getFlagUrl(nationality.flag)} className="w-6 h-4 object-cover rounded" alt="" />
                  <span>{nationality.name}</span>
                </div>
              )}
              {role && (
                <div className="bg-surface-soft border border-hairline px-3 py-1 rounded">
                  {role} {ROLES[role].name}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
