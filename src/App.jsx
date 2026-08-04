import { useState, useEffect } from 'react';
import PlayerCreation from './components/PlayerCreation';
import PlayerDashboard from './components/PlayerDashboard';
import { loadGame, saveGame, clearGame } from './utils/storage';

export default function App() {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = loadGame();
    if (saved) setPlayer(saved);
    setLoading(false);
  }, []);

  const handleCreatePlayer = (newPlayer) => {
    setPlayer(newPlayer);
    saveGame(newPlayer);
  };

  const handleUpdatePlayer = (updated) => {
    setPlayer(updated);
    saveGame(updated);
  };

  const handleReset = () => {
    if (confirm('Vuoi davvero cancellare la carriera e ricominciare?')) {
      clearGame();
      setPlayer(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold animate-pulse text-ink">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {!player ? (
        <PlayerCreation onCreate={handleCreatePlayer} />
      ) : (
        <PlayerDashboard
          player={player}
          onUpdate={handleUpdatePlayer}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
