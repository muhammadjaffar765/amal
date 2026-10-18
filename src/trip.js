// Small date helpers for the Umrah and Hajj planners. Dates are plain "YYYY-MM-DD" strings.
export const toDate = (s) => {
  const [y, m, d] = String(s).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12);
};
export const toStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const today = () => toStr(new Date());
export const addDays = (s, n) => {
  const d = toDate(s);
  d.setDate(d.getDate() + n);
  return toStr(d);
};
export const daysBetween = (a, b) => Math.round((toDate(b) - toDate(a)) / 86400000);
export const fmtDate = (s, opts = { weekday: 'short', day: 'numeric', month: 'short' }) => toDate(s).toLocaleDateString('en-GB', opts);
export const fmtLong = (s) => fmtDate(s, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
