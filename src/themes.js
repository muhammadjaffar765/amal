// Colour palettes. The actual colour values live in styles.css
// (search for [data-palette="..."]). Add a new palette there, then list it here.
export const PALETTES = [
  { id: 'emerald', name: 'Emerald', colors: ['#0D7A55', '#FFFFFF'] },
  { id: 'midnight', name: 'Midnight', colors: ['#24408F', '#C79A1E'] },
  { id: 'maroon', name: 'Maroon', colors: ['#8C1D3F', '#FFFFFF'] },
  { id: 'ocean', name: 'Ocean', colors: ['#0B7285', '#FFFFFF'] },
];

// Audio comes from the islamic.network CDN (same source as the Al Quran Cloud API).
export const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Alafasy' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdur-Rahman As-Sudais' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)' },
];

// Tafsir (commentary) editions. Source: the open "tafsir_api" dataset served by jsDelivr
// (https://github.com/spa5k/tafsir_api). `id` is the folder name in that dataset.
export const TAFSIRS = [
  { id: 'ur-tafseer-ibn-e-kaseer', name: 'Tafsir Ibn Kathir (Urdu)', lang: 'ur' },
  { id: 'ur-tafsir-bayan-ul-quran', name: 'Bayan ul Quran (Dr. Israr Ahmad)', lang: 'ur' },
  { id: 'ur-tafsir-fe-zalul-quran-syed-qatab', name: 'Fi Zilal al-Quran (Sayyid Qutb)', lang: 'ur' },
  { id: 'ur-tafsir-as-saadi-urdu', name: 'Tafsir As-Saadi (Urdu)', lang: 'ur' },
  { id: 'en-al-jalalayn', name: 'Tafsir al-Jalalayn', lang: 'en' },
  { id: 'en-tafisr-ibn-kathir', name: 'Tafsir Ibn Kathir', lang: 'en' },
  { id: 'en-tafsir-maarif-ul-quran', name: 'Maarif-ul-Quran (Mufti Shafi)', lang: 'en' },
  { id: 'en-tafsir-al-tustari', name: 'Tafsir al-Tustari', lang: 'en' },
  { id: 'en-al-qushairi-tafsir', name: 'Al-Qushairi Tafsir', lang: 'en' },
  { id: 'ar-tafsir-al-jalalayn', name: 'Al-Jalalayn', lang: 'ar' },
  { id: 'ar-tafsir-muyassar', name: 'Al-Muyassar', lang: 'ar' },
  { id: 'ar-tafsir-ibn-kathir', name: 'Ibn Kathir', lang: 'ar' },
  { id: 'ar-tafseer-al-qurtubi', name: 'Al-Qurtubi', lang: 'ar' },
  { id: 'ar-tafsir-al-baghawi', name: 'Al-Baghawi', lang: 'ar' },
  { id: 'tafsir-al-nasafi', name: 'Al-Nasafi', lang: 'ar' },
  { id: 'tafsir-al-baydawi', name: 'Al-Baydawi', lang: 'ar' },
  { id: 'tafsir-al-alusi', name: 'Al-Alusi (Ruh al-Ma\'ani)', lang: 'ar' },
  { id: 'tafsir-al-razi', name: 'Al-Razi', lang: 'ar' },
];
export const TAFSIR_LANGS = { en: 'English', ur: 'Urdu', ar: 'Arabic' };

export const DEFAULT_SETTINGS = {
  tafsir: 'ur-tafseer-ibn-e-kaseer',
  urEdition: 'ur.kanzuliman', // Urdu translation: Kanz-ul-Iman by default
  readTheme: 'paper', // 'paper' | 'white' | 'sepia' | 'night'
  city: 'Karachi',
  country: 'Pakistan',
  method: 1, // 1 = University of Islamic Sciences, Karachi
  school: 1, // 1 = Hanafi (later Asr), 0 = Shafi
  elevation: null, // metres above sea level (empty = use the default of the place)
  coords: null, // { lat, lng } when "Use my location" is chosen
  hijriOffset: -2, // days to shift Hijri dates for local moon sighting (Pakistan is often 1 to 2 days behind Saudi Arabia)
  haptics: true,
  translit: true,
  palette: 'emerald',
  mode: 'system', // 'light' | 'dark' | 'system'
  arabicSize: 34,
  arabicScript: 'simple', // surah screens: 'simple' spelling (full alif, like the printed South Asian Quran) or 'uthmani'
  scriptStyle: 'indopak', // surah screens: 'indopak' layout (banner, (28) numbers, ruku marks) or 'madani'
  surahStyle: 'pages', // surah reading: 'pages' (swipe, screen-sized) or 'scroll'
  fitPage: true, // Quran pages: fit the whole page to the screen
  pageSound: true, // paper sound when a page of a book is turned
  dalailSize: 26, // Dalail al-Khayrat text size
  hizbSize: 20, // Hizb al-Bahr text size
  pageZoom: 100, // zoom of page images: 100 = the whole page fits the screen
  imgSize: 100, // width of the image-based texts (Dalail, Burda, Khatm-e-Qadria) in per cent
  sacredTranslation: false, // show the printed translation next to those texts
  transSize: 18, // translation text size in the reader
  transLang: 'en', // 'en' | 'ur' (which translation the verse panel opens with)
  readMode: 'scroll', // 'scroll' | 'pages' (how a surah opens)
  showEnglish: true,
  showUrdu: false,
  reciter: 'ar.alafasy',
  autoNext: true,
};

// Urdu translation editions offered by the Quran API.
export const UR_EDITIONS = [
  { id: 'ur.kanzuliman', name: 'Kanz-ul-Iman (Ala Hazrat)' },
  { id: 'ur.jalandhry', name: 'Fateh Muhammad Jalandhry' },
  { id: 'ur.junagarhi', name: 'Muhammad Junagarhi' },
];
export const READ_THEMES = [
  { id: 'paper', name: 'Paper' },
  { id: 'white', name: 'White' },
  { id: 'sepia', name: 'Sepia' },
  { id: 'night', name: 'Night' },
];
export const HL_COLORS = ['yellow', 'green', 'pink', 'blue'];
