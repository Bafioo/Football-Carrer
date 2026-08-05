const STORAGE_KEY = 'football_career_sim_v1';
const MAX_GEN_KEY = 'football_career_max_gen_v1';

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

export const loadMaxGen = () => {
  try {
    const value = parseInt(localStorage.getItem(MAX_GEN_KEY), 10);
    return Number.isFinite(value) ? value : 0;
  } catch (e) {
    console.error('Load failed', e);
    return 0;
  }
};

export const saveMaxGen = (gen) => {
  try {
    localStorage.setItem(MAX_GEN_KEY, String(gen));
  } catch (e) {
    console.error('Save failed', e);
  }
};
