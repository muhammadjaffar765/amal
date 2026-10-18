// Matching for the Hifz listener. Speech engines return plain Arabic without vowel marks,
// and they often write connected speech differently from the Quran spelling
// (for example "dhalikal-kitab" can come back as "ذلك كتاب"), so matching is forgiving.
export function normWord(w) {
  return String(w || '')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    .replace(/\u0649/g, '\u064A')
    .replace(/\u0629/g, '\u0647')
    .replace(/[^\u0621-\u064A]/g, '');
}

function distance(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i += 1) {
    const cur = [i];
    for (let j = 1; j <= n; j += 1) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

// 1 means identical, 0 means nothing in common.
export function sim(a, b) {
  if (!a || !b) return 0;
  return 1 - distance(a, b) / Math.max(a.length, b.length);
}

const dropAl = (w) => (w.length > 3 && w.startsWith('ال') ? w.slice(2) : w);
const skeleton = (w) => w.replace(/[اويءئؤى]/g, ''); // long vowels are spelled in different ways

// How well a heard word matches an expected word. When `loose` is on, it also tries:
// without the leading "al", and with the long vowels removed from both.
export function wordScore(heard, expected, loose = true) {
  const plain = sim(heard, expected);
  if (!loose) return plain;
  const h = dropAl(heard);
  const e = dropAl(expected);
  const noAl = h && e ? sim(h, e) - 0.02 : 0;
  const sh = skeleton(h);
  const se = skeleton(e);
  const skel = sh.length >= 2 && se.length >= 2 ? sim(sh, se) - 0.04 : 0;
  return Math.max(plain, noAl, skel);
}

// Disjointed letters at the start of 29 surahs (Alif Lam Mim, Ya Sin, Ha Mim, ...).
// They are recited by the NAMES of the letters ("alif laam meem"), so the speech engine writes
// "الف لام ميم", while the Quran text is "الم". Both ways are accepted.
const LETTER_NAMES = {
  'ا': ['الف', 'الفا'], 'ل': ['لام'], 'م': ['ميم'], 'ص': ['صاد'], 'ر': ['را', 'راء'], 'ك': ['كاف'], 'ه': ['ها', 'هاء'],
  'ي': ['يا', 'ياء'], 'ع': ['عين'], 'ط': ['طا', 'طاء'], 'س': ['سين'], 'ح': ['حا', 'حاء'], 'ق': ['قاف'], 'ن': ['نون'],
};
const MUQATTAAT = new Set(['الم', 'المص', 'الر', 'المر', 'كهيعص', 'طه', 'طسم', 'طس', 'يس', 'ص', 'حم', 'عسق', 'ق', 'ن']);

// How many heard words (0 if none) spell out the letter names of this word.
function matchLetterNames(heard, h, word, threshold) {
  const letters = [...word];
  const need = Math.max(0.7, threshold);
  let all = true;
  for (let k = 0; k < letters.length; k += 1) {
    const w = heard[h + k];
    const names = LETTER_NAMES[letters[k]];
    if (!w || !names || Math.max(...names.map((n) => sim(w, n))) < need) {
      all = false;
      break;
    }
  }
  if (all) return letters.length;
  // the engine may also write all the names as one word
  const canon = letters.map((l) => (LETTER_NAMES[l] || [''])[0]).join('');
  if (heard[h] && canon && sim(heard[h], canon) >= threshold) return 1;
  return 0;
}

// True when the heard words so far are the start of the letter names (the person is still speaking).
function isLetterPrefix(heard, h, word, threshold) {
  const letters = [...word];
  const rest = heard.length - h;
  if (rest >= letters.length) return false;
  const need = Math.max(0.7, threshold);
  for (let k = 0; k < rest; k += 1) {
    const names = LETTER_NAMES[letters[k]];
    if (!names || Math.max(...names.map((n) => sim(heard[h + k], n))) < need) return false;
  }
  return true;
}

export const SENSITIVITY = { lenient: 0.62, balanced: 0.72, strict: 0.82 };

// Walk the heard words against the expected words, starting at `ptr`.
// Returns the new pointer, the words that matched, and the first mistake (if any).
export function advance(expected, ptr, heardWords, threshold, opts = {}) {
  const loose = threshold < 0.8; // strict mode compares the plain spelling only
  const score = (a, b) => wordScore(a, b, loose);
  const heard = heardWords.map(normWord).filter(Boolean);
  const matched = [];
  let p = ptr;
  let mistake = null;
  for (let h = 0; h < heard.length; h += 1) {
    if (p >= expected.length) break;
    const w = heard[h];
    // for the disjointed letters only a near-exact spelling counts, otherwise "alif laam seen" would pass as "alif laam meem"
    const direct = MUQATTAAT.has(expected[p]) ? sim(w, expected[p]) >= 0.85 : score(w, expected[p]) >= threshold;
    if (direct) {
      matched.push(p);
      p += 1;
    } else if (MUQATTAAT.has(expected[p]) && matchLetterNames(heard, h, expected[p], threshold)) {
      h += matchLetterNames(heard, h, expected[p], threshold) - 1;
      matched.push(p);
      p += 1;
    } else if (heard[h + 1] && sim(w + heard[h + 1], expected[p]) >= threshold) {
      // the engine split one word in two
      matched.push(p);
      p += 1;
      h += 1;
    } else if (p + 1 < expected.length && sim(w, expected[p] + expected[p + 1]) >= threshold) {
      // the engine joined two words into one
      matched.push(p, p + 1);
      p += 2;
    } else if (opts.incomplete && MUQATTAAT.has(expected[p]) && isLetterPrefix(heard, h, expected[p], threshold)) {
      break; // still saying the letters: wait for the rest
    } else if (p + 1 < expected.length && score(w, expected[p + 1]) >= Math.min(0.95, threshold + 0.1)) {
      mistake = { index: p, kind: 'skipped', heard: w };
      break;
    } else {
      mistake = { index: p, kind: 'wrong', heard: w };
      break;
    }
  }
  return { ptr: p, matched, mistake };
}
