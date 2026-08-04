export const genFactor = (gen) => {
  const t = Math.max(0, Math.min(1, (gen - 50) / 49));
  return 1 + t * t * (3 - 2 * t);
};

export const seasonNoise = () => 0.75 + Math.random() * 0.5;
