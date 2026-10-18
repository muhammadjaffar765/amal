// Prayer times worked out on the phone, to the second, with no internet.
// The sun's position is calculated each day for the chosen place. The method, the Asr rule and the height above
// sea level all change the result a little, so they are settings.
import { MONTHS, hijriOf } from './hijri.js';

// [name, country, latitude, longitude, height in metres, time zone]
export const CITIES = [
  ['Karachi', 'Pakistan', 24.8607, 67.0011, 23, 'Asia/Karachi'], ['Lahore', 'Pakistan', 31.5497, 74.3436, 217, 'Asia/Karachi'],
  ['Islamabad', 'Pakistan', 33.6844, 73.0479, 540, 'Asia/Karachi'], ['Rawalpindi', 'Pakistan', 33.5651, 73.0169, 508, 'Asia/Karachi'],
  ['Peshawar', 'Pakistan', 34.0151, 71.5249, 331, 'Asia/Karachi'], ['Quetta', 'Pakistan', 30.1798, 66.975, 1680, 'Asia/Karachi'],
  ['Multan', 'Pakistan', 30.1575, 71.5249, 122, 'Asia/Karachi'], ['Faisalabad', 'Pakistan', 31.4504, 73.135, 184, 'Asia/Karachi'],
  ['Hyderabad', 'Pakistan', 25.396, 68.3578, 13, 'Asia/Karachi'], ['Sialkot', 'Pakistan', 32.4945, 74.5229, 256, 'Asia/Karachi'],
  ['Gujranwala', 'Pakistan', 32.1877, 74.1945, 226, 'Asia/Karachi'], ['Sukkur', 'Pakistan', 27.7052, 68.8574, 67, 'Asia/Karachi'],
  ['Larkana', 'Pakistan', 27.5589, 68.2264, 53, 'Asia/Karachi'], ['Bahawalpur', 'Pakistan', 29.3956, 71.6836, 110, 'Asia/Karachi'],
  ['Abbottabad', 'Pakistan', 34.1688, 73.2215, 1256, 'Asia/Karachi'], ['Gilgit', 'Pakistan', 35.9208, 74.308, 1500, 'Asia/Karachi'],
  ['Makkah', 'Saudi Arabia', 21.4225, 39.8262, 277, 'Asia/Riyadh'], ['Madinah', 'Saudi Arabia', 24.4672, 39.6024, 608, 'Asia/Riyadh'],
  ['Riyadh', 'Saudi Arabia', 24.7136, 46.6753, 612, 'Asia/Riyadh'], ['Dubai', 'UAE', 25.2048, 55.2708, 5, 'Asia/Dubai'],
  ['Abu Dhabi', 'UAE', 24.4539, 54.3773, 27, 'Asia/Dubai'], ['Doha', 'Qatar', 25.2854, 51.531, 10, 'Asia/Qatar'],
  ['Kuwait City', 'Kuwait', 29.3759, 47.9774, 5, 'Asia/Kuwait'], ['Muscat', 'Oman', 23.588, 58.3829, 15, 'Asia/Muscat'],
  ['Delhi', 'India', 28.6139, 77.209, 216, 'Asia/Kolkata'], ['Mumbai', 'India', 19.076, 72.8777, 14, 'Asia/Kolkata'],
  ['Dhaka', 'Bangladesh', 23.8103, 90.4125, 23, 'Asia/Dhaka'], ['Istanbul', 'Turkey', 41.0082, 28.9784, 40, 'Europe/Istanbul'],
  ['Cairo', 'Egypt', 30.0444, 31.2357, 23, 'Africa/Cairo'], ['Kuala Lumpur', 'Malaysia', 3.139, 101.6869, 22, 'Asia/Kuala_Lumpur'],
  ['Jakarta', 'Indonesia', -6.2088, 106.8456, 8, 'Asia/Jakarta'], ['London', 'UK', 51.5074, -0.1278, 11, 'Europe/London'],
  ['Birmingham', 'UK', 52.4862, -1.8904, 140, 'Europe/London'], ['Manchester', 'UK', 53.4808, -2.2426, 38, 'Europe/London'],
  ['New York', 'USA', 40.7128, -74.006, 10, 'America/New_York'], ['Chicago', 'USA', 41.8781, -87.6298, 180, 'America/Chicago'],
  ['Los Angeles', 'USA', 34.0522, -118.2437, 71, 'America/Los_Angeles'], ['Toronto', 'Canada', 43.6532, -79.3832, 76, 'America/Toronto'],
  ['Sydney', 'Australia', -33.8688, 151.2093, 58, 'Australia/Sydney'],
];

// Fajr and Isha angles of each calculation method (ishaMinutes: Isha is a fixed time after Maghrib)
const METHOD = {
  1: { fajr: 18, isha: 18 }, // University of Islamic Sciences, Karachi
  2: { fajr: 15, isha: 15 }, // ISNA
  3: { fajr: 18, isha: 17 }, // Muslim World League
  4: { fajr: 18.5, ishaMinutes: 90 }, // Umm al-Qura
  5: { fajr: 19.5, isha: 17.5 }, // Egyptian
};

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const sin = (d) => Math.sin(d * D2R);
const cos = (d) => Math.cos(d * D2R);
const tan = (d) => Math.tan(d * D2R);
const asin = (x) => Math.asin(x) * R2D;
const acos = (x) => Math.acos(Math.max(-1, Math.min(1, x))) * R2D;
const atan2 = (y, x) => Math.atan2(y, x) * R2D;
const fix = (a, b) => { const r = a - b * Math.floor(a / b); return r < 0 ? r + b : r; };

function julian(y, m, d) {
  let yy = y; let mm = m;
  if (mm <= 2) { yy -= 1; mm += 12; }
  const A = Math.floor(yy / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + d + B - 1524.5;
}

function sunPosition(jd) {
  const d = jd - 2451545.0;
  const g = fix(357.529 + 0.98560028 * d, 360);
  const q = fix(280.459 + 0.98564736 * d, 360);
  const L = fix(q + 1.915 * sin(g) + 0.02 * sin(2 * g), 360);
  const e = 23.439 - 0.00000036 * d;
  const RA = fix(atan2(cos(e) * sin(L), cos(L)) / 15, 24);
  return { decl: asin(sin(e) * sin(L)), eq: q / 15 - RA };
}

// Times of one day, as hours in the local time zone (can be fractional).
export function computeDay({ y, m, d, lat, lng, tz, elev = 0, method = 1, asrFactor = 2 }) {
  const par = METHOD[method] || METHOD[1];
  const jd = julian(y, m, d) - lng / (15 * 24);
  // The horizon dips below eye level when you are higher up, so sunrise comes earlier and sunset later.
  const sunAngle = 0.833 + 0.0347 * Math.sqrt(Math.max(0, elev));
  const noon = (t) => fix(12 - sunPosition(jd + t).eq, 24);
  const around = (angle, t, before) => {
    const s = sunPosition(jd + t);
    const h = acos((-sin(angle) - sin(s.decl) * sin(lat)) / (cos(s.decl) * cos(lat))) / 15;
    return noon(t) + (before ? -h : h);
  };
  // Asr: the shadow is `asrFactor` times the object plus its noon shadow. The sun's disc (0.267 degrees)
  // is counted from its upper edge, which is how the Hanafi time is usually fixed.
  const asr = (t) => {
    const s = sunPosition(jd + t);
    const a = Math.atan(1 / (asrFactor + tan(Math.abs(lat - s.decl)))) * R2D - 0.2667;
    return noon(t) + acos((sin(a) - sin(s.decl) * sin(lat)) / (cos(s.decl) * cos(lat))) / 15;
  };
  let t = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, maghrib: 18, isha: 19 };
  for (let i = 0; i < 2; i += 1) {
    t = {
      fajr: around(par.fajr, t.fajr / 24, true),
      sunrise: around(sunAngle, t.sunrise / 24, true),
      dhuhr: noon(t.dhuhr / 24),
      asr: asr(t.asr / 24),
      maghrib: around(sunAngle, t.maghrib / 24, false),
      isha: par.ishaMinutes ? 0 : around(par.isha, t.isha / 24, false),
    };
  }
  if (par.ishaMinutes) t.isha = t.maghrib + par.ishaMinutes / 60;
  const shift = tz - lng / 15;
  const out = {};
  Object.keys(t).forEach((k) => { out[k] = t[k] + shift; });
  return out;
}

// Offset of a time zone from UTC, in hours, at a given moment.
export function tzOffsetHours(timeZone, date) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
    }).formatToParts(date);
    const g = (n) => Number(parts.find((p) => p.type === n).value);
    const asUtc = Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'), g('second'));
    return (asUtc - Math.floor(date.getTime() / 1000) * 1000) / 3600000;
  } catch {
    return -date.getTimezoneOffset() / 60;
  }
}

export function placeOf(settings) {
  if (settings.coords) {
    return {
      lat: settings.coords.lat, lng: settings.coords.lng,
      elev: settings.elevation != null ? settings.elevation : settings.coords.alt || 0,
      tzName: Intl.DateTimeFormat().resolvedOptions().timeZone, name: 'Your location',
    };
  }
  const c = CITIES.find((x) => x[0].toLowerCase() === String(settings.city).toLowerCase()) || CITIES[0];
  return { lat: c[2], lng: c[3], elev: settings.elevation != null ? settings.elevation : c[4], tzName: c[5], name: `${c[0]}, ${c[1]}` };
}

const pad2 = (n) => String(n).padStart(2, '0');
export function hmsOfHours(h) {
  const s = Math.round(h * 3600);
  const H = ((Math.floor(s / 3600) % 24) + 24) % 24;
  return `${pad2(H)}:${pad2(Math.floor((s % 3600) / 60))}:${pad2(((s % 60) + 60) % 60)}`;
}

// Everything the screens need for "now" in the chosen place.
export function buildPrayerData(settings, now = new Date()) {
  const place = placeOf(settings);
  const tz = tzOffsetHours(place.tzName, now);
  const local = new Date(now.getTime() + tz * 3600000);
  const y = local.getUTCFullYear(); const m = local.getUTCMonth() + 1; const d = local.getUTCDate();
  const base = { lat: place.lat, lng: place.lng, tz, elev: place.elev, method: settings.method, asrFactor: settings.school === 0 ? 1 : 2 };
  const at = (dayShift) => {
    const dt = new Date(Date.UTC(y, m - 1, d + dayShift));
    return computeDay({ ...base, y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() });
  };
  const today = at(0); const tomorrow = at(1); const yesterday = at(-1);
  const dayStart = Date.UTC(y, m - 1, d) - tz * 3600000;
  const ms = (h, shift = 0) => dayStart + (shift * 24 + h) * 3600000;
  const inst = {
    Fajr: ms(today.fajr), Sunrise: ms(today.sunrise), Dhuhr: ms(today.dhuhr), Asr: ms(today.asr), Maghrib: ms(today.maghrib), Isha: ms(today.isha),
    NextFajr: ms(tomorrow.fajr, 1), PrevIsha: ms(yesterday.isha, -1),
  };
  const timings = {
    Fajr: hmsOfHours(today.fajr), Sunrise: hmsOfHours(today.sunrise), Dhuhr: hmsOfHours(today.dhuhr),
    Asr: hmsOfHours(today.asr), Maghrib: hmsOfHours(today.maghrib), Isha: hmsOfHours(today.isha),
  };
  const night = inst.NextFajr - inst.Maghrib;
  const extra = {
    Sunrise: inst.Sunrise,
    Ishraq: inst.Sunrise + 20 * 60000,
    Zawal: inst.Dhuhr - 6 * 60000,
    Sunset: inst.Maghrib,
    Midnight: inst.Maghrib + night / 2,
    LastThird: inst.Maghrib + (night * 2) / 3,
  };
  const hj = hijriOf(new Date(y, m - 1, d), settings.hijriOffset || 0);
  return {
    timings, inst, extra, place,
    meta: { timezone: place.tzName, latitude: place.lat, longitude: place.lng, elevation: place.elev, gmt: tz },
    date: { hijri: { day: String(hj.d), month: { en: (MONTHS[hj.m - 1] || ['?'])[0] }, year: String(hj.y) } },
  };
}

// The prayer whose time it is now (or null between sunrise and Zuhr) and the next one.
export function statusAt(data, nowMs) {
  const i = data.inst;
  const windows = [
    { key: 'Isha', start: i.PrevIsha, end: i.Fajr },
    { key: 'Fajr', start: i.Fajr, end: i.Sunrise },
    { key: 'Dhuhr', start: i.Dhuhr, end: i.Asr },
    { key: 'Asr', start: i.Asr, end: i.Maghrib },
    { key: 'Maghrib', start: i.Maghrib, end: i.Isha },
    { key: 'Isha', start: i.Isha, end: i.NextFajr },
  ];
  const current = windows.find((w) => nowMs >= w.start && nowMs < w.end) || null;
  const order = [['Fajr', i.Fajr], ['Dhuhr', i.Dhuhr], ['Asr', i.Asr], ['Maghrib', i.Maghrib], ['Isha', i.Isha]];
  const upcoming = order.find(([, t]) => t > nowMs);
  const next = upcoming
    ? { key: upcoming[0], secondsLeft: Math.ceil((upcoming[1] - nowMs) / 1000), tomorrow: false }
    : { key: 'Fajr', secondsLeft: Math.ceil((i.NextFajr - nowMs) / 1000), tomorrow: true };
  return {
    current: current && {
      ...current,
      remaining: Math.max(0, Math.ceil((current.end - nowMs) / 1000)),
      fraction: Math.min(1, Math.max(0, (current.end - nowMs) / (current.end - current.start))),
    },
    next,
  };
}
