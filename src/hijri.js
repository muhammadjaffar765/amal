// Hijri calendar helpers. They use the browser's built-in Umm al-Qura calendar, so they work offline.
// `offset` shifts the date by whole days to match local moon sighting (for example -1 in many places).
const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric' });

export const MONTHS = [
  ['Muharram', 'محرم'], ['Safar', 'صفر'], ['Rabi al-Awwal', 'ربيع الأول'], ['Rabi al-Thani', 'ربيع الآخر'],
  ['Jumada al-Awwal', 'جمادى الأولى'], ['Jumada al-Thani', 'جمادى الآخرة'], ['Rajab', 'رجب'], ["Sha'ban", 'شعبان'],
  ['Ramadan', 'رمضان'], ['Shawwal', 'شوال'], ["Dhul Qa'dah", 'ذو القعدة'], ['Dhul Hijjah', 'ذو الحجة'],
];

const noon = (d, plus = 0) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + plus, 12);

export function hijriOf(date, offset = 0) {
  const parts = fmt.formatToParts(noon(date, offset));
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  return { d: get('day'), m: get('month'), y: get('year') };
}

// Gregorian date of the first day of the Hijri month that contains `date`.
export function monthStart(date, offset = 0) {
  const h = hijriOf(date, offset);
  return noon(date, -(h.d - 1));
}

export function nextMonthStart(start, offset = 0) {
  let d = noon(start, 29);
  if (hijriOf(d, offset).d !== 1) d = noon(d, 1);
  if (hijriOf(d, offset).d !== 1) d = noon(start, 30);
  return d;
}

export function prevMonthStart(start, offset = 0) {
  return monthStart(noon(start, -1), offset);
}

export const monthLength = (start, offset = 0) => Math.round((nextMonthStart(start, offset) - start) / 86400000);

// Key dates. `note` marks days where scholars differ about observing them.
export const KEY_DATES = [
  { m: 1, d: 1, name: 'Islamic New Year' },
  { m: 1, d: 10, name: 'Day of Ashura', note: 'A recommended fast, together with the 9th or 11th.' },
  { m: 3, d: 12, name: 'Mawlid an-Nabi (12 Rabi al-Awwal)', note: 'Observed by many Muslims; scholars differ on how it should be marked.' },
  { m: 7, d: 27, name: "Isra and Mi'raj (27 Rajab)", note: 'Commonly remembered on this night.' },
  { m: 8, d: 15, name: "Mid-Sha'ban (Shab-e-Barat)", note: 'Observed by many Muslims; scholars differ on how it should be marked.' },
  { m: 9, d: 1, name: 'First day of Ramadan' },
  { m: 9, d: 21, name: 'Last ten nights of Ramadan begin', note: 'Laylat al-Qadr is sought in the odd nights of the last ten.' },
  { m: 10, d: 1, name: 'Eid al-Fitr' },
  { m: 12, d: 8, name: 'Yawm at-Tarwiyah (Hajj begins)' },
  { m: 12, d: 9, name: 'Day of Arafah', note: 'Fasting is recommended for those who are not performing Hajj.' },
  { m: 12, d: 10, name: 'Eid al-Adha' },
  { m: 12, d: 11, name: 'Days of Tashreeq (11, 12, 13)', note: 'Days of eating, drinking and remembering Allah.' },
];

// Next date this event happens, looking ahead up to 400 days.
export function nextOccurrence(ev, from = new Date(), offset = 0) {
  for (let i = 0; i < 400; i += 1) {
    const g = noon(from, i);
    const h = hijriOf(g, 0);
    const shifted = hijriOf(g, offset);
    if (shifted.m === ev.m && shifted.d === ev.d) return { date: g, days: i, hijriYear: shifted.y, h };
  }
  return null;
}

export const SUNNAH_FASTS = [
  'Mondays and Thursdays each week',
  'The white days: the 13th, 14th and 15th of each Hijri month',
  'The 9th and 10th of Muharram (Ashura)',
  'Six days of Shawwal, after Eid al-Fitr',
  'The Day of Arafah (9 Dhul Hijjah) for those not performing Hajj',
];
