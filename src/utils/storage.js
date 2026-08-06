const STORAGE_KEY = 'football_career_sim_v1';
const PREFS_KEY = 'football_career_prefs_v1';

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

export const savePrefs = (p) => {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({
      name: p.name,
      nationality: (p.nationality || {}).code || null,
      role: p.role,
      advanceCount: p.advanceCount || 1,
    }));
  } catch (e) {
    console.error('Save failed', e);
  }
};

export const loadPrefs = () => {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
  } catch (e) {
    return {};
  }
};
