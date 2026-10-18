// Data comes from the free Al Quran Cloud API (https://alquran.cloud/api).
// The Quran text is never typed by hand: it must be exactly right.
const BASE = 'https://api.alquran.cloud/v1';
const memory = new Map();

// quran-uthmani: Arabic text | en.sahih: English (Saheeh International) | ur.jalandhry: Urdu
const EDITIONS = ['quran-uthmani', 'en.sahih', 'ur.jalandhry'];

async function request(path) {
  if (memory.has(path)) return memory.get(path);
  let res;
  try {
    res = await fetch(BASE + path);
  } catch {
    throw new Error('No internet connection. Check your network and try again.');
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.code !== 200) {
    throw new Error('The Quran service did not respond. Please try again in a moment.');
  }
  memory.set(path, json.data);
  return json.data;
}

// In the API data the first verse of most surahs starts with the Bismillah.
// We show the Bismillah once as a heading, so remove it from verse 1.
const strip = (s) =>
  s
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/\u0671/g, '\u0627')
    .trim();

export function withoutBismillah(text, surahNumber, verseNumber) {
  if (surahNumber === 1 || verseNumber !== 1) return text;
  const words = text.trim().split(/\s+/);
  if (words.length > 4 && strip(words.slice(0, 4).join(' ')) === 'بسم الله الرحمن الرحيم') {
    return words.slice(4).join(' ');
  }
  return text;
}

export async function getSurahs() {
  try {
    const cached = localStorage.getItem('noor:surahs');
    if (cached) return JSON.parse(cached);
  } catch {
    /* ignore */
  }
  const data = await request('/surah');
  try {
    localStorage.setItem('noor:surahs', JSON.stringify(data));
  } catch {
    /* ignore */
  }
  return data;
}

const clean = (t) => String(t || '').replace(/\uFEFF/g, '');

// Urdu is requested on its own, with a few Urdu editions to fall back on, so a problem with one
// edition never hides the Arabic or the English.
const UR_ALL = ['ur.kanzuliman', 'ur.jalandhry', 'ur.junagarhi', 'ur.ahmedali'];
async function urduFor(path, preferred) {
  const order = [preferred, ...UR_ALL].filter((e, i, a) => e && a.indexOf(e) === i);
  for (const ed of order) {
    try {
      const d = await request(`${path}/${ed}`);
      if (d && d.ayahs && d.ayahs.length) return { edition: ed, ayahs: d.ayahs };
    } catch {
      /* try the next edition */
    }
  }
  return null;
}

// script: 'simple' is the usual modern spelling (full alif, as in the South Asian printed Quran), 'uthmani' is the
// spelling of the Madani Mushaf (dagger alif and small marks). If the simple text cannot be loaded, Uthmani is used.
export async function getSurah(number, urPref, script = 'uthmani') {
  let data = null;
  let arId = 'quran-uthmani';
  if (script === 'simple') {
    try {
      const d = await request(`/surah/${number}/editions/quran-simple,en.sahih`);
      if (d.find((x) => x.edition.identifier === 'quran-simple')) { data = d; arId = 'quran-simple'; }
    } catch {
      data = null;
    }
  }
  if (!data) data = await request(`/surah/${number}/editions/quran-uthmani,en.sahih`);
  const byId = (id) => data.find((d) => d.edition.identifier === id);
  const ar = byId(arId);
  const en = byId('en.sahih');
  const urd = await urduFor(`/surah/${number}`, urPref);
  return {
    number: ar.number,
    name: ar.name,
    englishName: ar.englishName,
    englishNameTranslation: ar.englishNameTranslation,
    revelationType: ar.revelationType,
    numberOfAyahs: ar.numberOfAyahs,
    urdu: urd ? urd.edition : null,
    ayahs: ar.ayahs.map((a, i) => ({
      global: a.number,
      n: a.numberInSurah,
      juz: a.juz,
      page: a.page,
      ruku: a.ruku,
      text: withoutBismillah(clean(a.text), ar.number, a.numberInSurah),
      en: en && en.ayahs[i] ? en.ayahs[i].text : '',
      ur: urd && urd.ayahs[i] ? urd.ayahs[i].text : '',
    })),
  };
}

// One page of the Madani Mushaf (1 to 604).
export async function getPage(number, urPref) {
  const ar = await request(`/page/${number}/quran-uthmani`);
  let en = null;
  try {
    en = await request(`/page/${number}/en.sahih`);
  } catch {
    /* English is optional */
  }
  const urd = await urduFor(`/page/${number}`, urPref);
  const enMap = new Map(((en && en.ayahs) || []).map((a) => [a.number, a.text]));
  const urMap = new Map(((urd && urd.ayahs) || []).map((a) => [a.number, a.text]));
  return {
    number,
    urdu: urd ? urd.edition : null,
    ayahs: ar.ayahs.map((a) => ({
      global: a.number,
      n: a.numberInSurah,
      juz: a.juz,
      page: a.page,
      text: withoutBismillah(clean(a.text), a.surah.number, a.numberInSurah),
      en: enMap.get(a.number) || '',
      ur: urMap.get(a.number) || '',
      surah: {
        number: a.surah.number,
        name: a.surah.name,
        englishName: a.surah.englishName,
        numberOfAyahs: a.surah.numberOfAyahs,
        revelationType: a.surah.revelationType,
      },
    })),
  };
}

// One ruku (1 to 556) of the Quran, for plans that are counted in rukus instead of verses.
export async function getRuku(number) {
  const d = await request(`/ruku/${number}/quran-uthmani`);
  return d.ayahs.map((a) => ({
    global: a.number, n: a.numberInSurah, juz: a.juz, page: a.page,
    text: withoutBismillah(clean(a.text), a.surah.number, a.numberInSurah),
    surah: { number: a.surah.number, name: a.surah.name, englishName: a.surah.englishName },
  }));
}

// Which Mushaf page a verse is on (used to open a surah in page mode).
export async function getAyahPage(surah, ayah = 1) {
  const d = await request(`/ayah/${surah}:${ayah}/quran-uthmani`);
  return d.page;
}

// One verse per day: the same verse for everyone on a given date.
export async function getDailyAyah(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  const number = ((day * 53) % 6236) + 1;
  const data = await request(`/ayah/${number}/editions/quran-uthmani,en.sahih`);
  const ar = data.find((d) => d.edition.identifier === 'quran-uthmani');
  const en = data.find((d) => d.edition.identifier === 'en.sahih');
  return {
    global: number,
    surahNumber: ar.surah.number,
    surahName: ar.surah.englishName,
    n: ar.numberInSurah,
    text: withoutBismillah(ar.text, ar.surah.number, ar.numberInSurah),
    en: en.text,
  };
}

export async function searchQuran(keyword, lang) {
  const edition = lang === 'ar' ? 'quran-simple' : lang === 'ur' ? 'ur.jalandhry' : 'en.sahih';
  let res;
  try {
    res = await fetch(`${BASE}/search/${encodeURIComponent(keyword)}/all/${edition}`);
  } catch {
    throw new Error('No internet connection. Check your network and try again.');
  }
  const json = await res.json().catch(() => null);
  // The API answers 404 when nothing matches, which is not an error for us.
  if (!json || json.code !== 200 || !json.data) return { count: 0, matches: [] };
  return json.data;
}

const TAFSIR_BASE = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir';
const tafsirCache = new Map();

// Some editions contain simple HTML. Keep paragraphs, drop the tags.
const cleanTafsir = (t) =>
  String(t || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();

// Returns { [verseNumber]: text } for a whole surah.
export async function getTafsir(edition, surahNumber) {
  const key = `${edition}/${surahNumber}`;
  if (tafsirCache.has(key)) return tafsirCache.get(key);
  let res;
  try {
    res = await fetch(`${TAFSIR_BASE}/${edition}/${surahNumber}.json`);
  } catch {
    throw new Error('No internet connection.');
  }
  if (!res.ok) throw new Error('Tafsir not available.');
  const json = await res.json();
  const map = {};
  (json.ayahs || []).forEach((a) => {
    map[a.ayah] = cleanTafsir(a.text);
  });
  tafsirCache.set(key, map);
  return map;
}

// Arabic text only, for one surah (used by Manzil, adhkar and duas).
export async function getSurahArabic(number) {
  const data = await request(`/surah/${number}/quran-uthmani`);
  return data.ayahs.map((a) => ({
    n: a.numberInSurah,
    text: withoutBismillah(a.text, number, a.numberInSurah),
  }));
}

const ALADHAN = 'https://api.aladhan.com/v1';
const prayerInflight = new Map();

// Prayer times for today. Falls back to the last saved answer for the same day when offline.
export function getPrayerTimes({ city, country, coords, method, school }) {
  const now = new Date();
  const date = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
  const params = new URLSearchParams({ method: String(method), school: String(school) });
  let url;
  if (coords) {
    params.set('latitude', String(coords.lat));
    params.set('longitude', String(coords.lng));
    url = `${ALADHAN}/timings/${date}?${params}`;
  } else {
    params.set('city', city);
    params.set('country', country);
    url = `${ALADHAN}/timingsByCity/${date}?${params}`;
  }
  if (prayerInflight.has(url)) return prayerInflight.get(url);

  const cacheKey = `noor:prayer:${url}`;
  const promise = (async () => {
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok || json.code !== 200) throw new Error('bad response');
      try {
        localStorage.setItem(cacheKey, JSON.stringify(json.data));
      } catch {
        /* ignore */
      }
      return json.data;
    } catch {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) return JSON.parse(cached);
      } catch {
        /* ignore */
      }
      throw new Error('Prayer times could not load. Check the city name and your connection.');
    }
  })();
  prayerInflight.set(url, promise);
  setTimeout(() => prayerInflight.delete(url), 60000);
  return promise;
}

export function audioUrl(reciter, globalAyahNumber) {
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${globalAyahNumber}.mp3`;
}
