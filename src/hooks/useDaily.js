import { useLocalStorage } from './useLocalStorage.js';

export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Per-day storage that starts empty every new day (used for adhkar counters, Manzil, wird).
export function useDaily(key) {
  const today = todayKey();
  const [stored, setStored] = useLocalStorage(key, { date: today, data: {} });
  const data = stored.date === today ? stored.data : {};
  const update = (fn) =>
    setStored((s) => ({ date: today, data: fn(s.date === today ? s.data : {}) }));
  return [data, update];
}

export const buzz = (settings, ms = 12) => {
  if (settings.haptics && typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms);
};
