const STORAGE_KEY = 'football_career_sim_v1';

export const saveGame = (player) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  } catch (e) {
    console.error('Save failed', e);
  }
};

export const loadGame = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Load failed', e);
    return null;
  }
};

export const clearGame = () => {
  localStorage.removeItem(STORAGE_KEY);
};
