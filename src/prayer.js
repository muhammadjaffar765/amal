export const PRAYER_ROWS = [
  { key: 'Fajr', label: 'Fajr', icon: 'moon' },
  { key: 'Sunrise', label: 'Sunrise', icon: 'sun', note: true },
  { key: 'Dhuhr', label: 'Dhuhr', icon: 'sun' },
  { key: 'Asr', label: 'Asr', icon: 'sun' },
  { key: 'Maghrib', label: 'Maghrib', icon: 'moon' },
  { key: 'Isha', label: 'Isha', icon: 'moon' },
];

export const METHODS = [
  { id: 1, name: 'University of Islamic Sciences, Karachi' },
  { id: 2, name: 'ISNA (North America)' },
  { id: 3, name: 'Muslim World League' },
  { id: 4, name: 'Umm al-Qura, Makkah' },
  { id: 5, name: 'Egyptian General Authority' },
];

// "05:12 (PKT)" -> seconds since midnight
export function parseHM(text) {
  const m = /(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(text || '');
  return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3] || 0) : null;
}

// Current time in the prayer location's timezone, as seconds since midnight.
export function secondsNow(timeZone) {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).formatToParts(new Date());
    const get = (t) => Number(parts.find((p) => p.type === t).value);
    return (get('hour') % 24) * 3600 + get('minute') * 60 + get('second');
  } catch {
    const d = new Date();
    return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
  }
}

export function nextPrayer(timings, timeZone) {
  const now = secondsNow(timeZone);
  for (const key of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
    const t = parseHM(timings[key]);
    if (t !== null && t > now) return { key, secondsLeft: t - now, tomorrow: false };
  }
  const fajr = parseHM(timings.Fajr) ?? 0;
  return { key: 'Fajr', secondsLeft: 86400 - now + fajr, tomorrow: true };
}

export function fmt12(text) {
  const t = parseHM(text);
  if (t === null) return '-';
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export function fmtCountdown(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

export function hijriText(data) {
  const h = data && data.date && data.date.hijri;
  if (!h) return '';
  return `${Number(h.day)} ${h.month.en} ${h.year} AH`;
}

// Qibla: great-circle bearing (degrees from true north) and distance to the Kaaba.
const KAABA = { lat: 21.4225, lng: 39.8262 };
const rad = (d) => (d * Math.PI) / 180;
export function qiblaFrom(lat, lng) {
  const p1 = rad(lat);
  const p2 = rad(KAABA.lat);
  const dl = rad(KAABA.lng - lng);
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  const bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const dphi = p2 - p1;
  const a = Math.sin(dphi / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  const km = 2 * 6371 * Math.asin(Math.sqrt(a));
  return { bearing, km };
}

// "05:12:35" -> "5:12:35 AM"
export function fmt12s(text) {
  const t = parseHM(text);
  if (t === null) return '-';
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const two = (n) => String(n).padStart(2, '0');
  return `${two(h % 12 || 12)}:${two(m)}:${two(s)} ${h >= 12 ? 'PM' : 'AM'}`;
}
// milliseconds since 1970 -> "05:12:35 AM" in the given time zone
export function fmtInstant(ms, timeZone) {
  try {
    return new Intl.DateTimeFormat('en-US', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(new Date(ms));
  } catch {
    return new Date(ms).toLocaleTimeString();
  }
}
// seconds -> "1:15:53"
export function fmtClock(sec) {
  const s = Math.max(0, Math.floor(sec));
  const two = (n) => String(n).padStart(2, '0');
  return `${Math.floor(s / 3600)}:${two(Math.floor((s % 3600) / 60))}:${two(s % 60)}`;
}
