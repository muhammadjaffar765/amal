# Amal: Quran and daily Islamic companion (React + Vite)

A modern, installable web app: Quran with translations, tafsir and audio, plus the things many Muslims use every day.

## Run it

```bash
npm install
npm run dev
```

Open the link shown in the terminal (usually http://localhost:5173).

## Deploy (free on Vercel)

```bash
npm run build
```

1. Push this folder to a GitHub repository.
2. On vercel.com choose "Add New Project" and import the repository.
3. Vercel detects Vite automatically. Press Deploy and you get a live link.

Routing uses the URL hash (`#/surah/2`), so no extra server settings are needed.
After deploying, the app can be installed from the browser (PWA) and opens offline once visited.

## Features

**Quran**
- Reads like a Mushaf: continuous text with numbered verse-end markers. The translation stays hidden until you tap a verse; the panel has an English | Urdu switch that is always visible, plus tafsir, play, bookmark, copy and share
- Mushaf page mode (604 Madani pages) with swipe and page-turn animation, reading by Juz (Para), by Surah, or by page number
- Arabic and translation text sizes are separate and saved
- All 114 surahs, Arabic (Uthmani) with English and Urdu translation
- Tafsir on every verse: 7 books in English, Urdu and Arabic
- Verse-by-verse audio, auto-play next verse, 4 reciters
- Search in English, Urdu or Arabic, bookmarks, last read, Continue reading
- Share any verse as a designed image (PNG)
- Khatm planner: pick 7 to 90 days and track surahs finished

**Kalimas, naats and kids**
- Six Kalimas (Arabic, transliteration, English and Urdu meaning)
- Naats: paste a link from the reciter's own YouTube channel and it plays inside Amal through YouTube's official player. Nothing is downloaded
- Kids Corner (no ads, no login, nothing leaves the device): Amalani Qaida with sound, memory match, quiz with stars and badges, wudu and salah ordering games, dua of the day with stickers, stories of the Prophets

**Hifz (beta)**
- Hifz listener: recite a passage from memory; Amal follows your words, highlights them, and stops with a red word and a buzzer at a mistake. Uses the browser's speech recognition (Chrome or Edge, https, internet). It accepts the disjointed letters as letter names ("alif laam meem") and as "alam". It cannot hear tajweed or short vowels. A teacher mode (a parent taps right or wrong) works in every browser

**Daily practice**
- Prayer times with live countdown and Hijri date (city or GPS, Karachi and Hanafi Asr by default)
- Qibla compass
- Daily adhkar: morning, evening, after salah, before sleep, with counters and transliteration
- Salawat (16: hadith forms and classical salawat, kept in separate groups), Manzil (verses loaded from the Quran API)
- 50 Duas with a search bar (English and Roman Urdu words such as khana, neend, safar)
- Islamic calendar: Hijri month view, upcoming key dates, Sunnah fasts, moon-sighting adjustment
- Forty Hadith of Imam an-Nawawi (English summaries)
- Hajj and Umrah guide with illustrations, route map, duas, ihram rules and a checklist
- 99 Names of Allah: tap a name for its meaning, praise, explanation, how to live by it, a counter, favourites and a practice mode
- Tasbeeh counter with rounds and haptics
- Daily amal checklist with streak (no pressure on any single prayer)
- Dalail al-Khayrat and Hizb al-Bahr: direct links to the official pages (opened in a new tab), with the 8-day Dalail plan
- My wird: a line-by-line reader (Arabic with translation under each line) for Dalail al-Khayrat, Hizb al-Bahr or any litany. It has parts, an 8-day plan, resume, and a translation switch. You add the text yourself
- Jumu'ah banner on Fridays

**Design**
- 4 colour themes (Emerald, Midnight, Maroon, Ocean), each with light, dark or automatic mode
- Arabic text size slider, mobile bottom navigation, installable PWA

## About religious texts

- Qaseeda Burda, Dalail al-Khayrat and Hizb al-Bahr are NOT bundled. No openly licensed, proofread digital text was found, and the text must never be typed from memory. They can be added once a licensed and verified source file is provided.
- The Six Kalimas and the kids' stories were written by hand from the commonly printed versions. Please proofread them.
- Naat video links are added by the user; Amal does not check the video owner.

- Quran text comes from the Al Quran Cloud API and is never typed by hand.
- Adhkar and duas in `src/data` are short, widely known texts. Always compare them with a printed source you trust
  (for example Hisn al-Muslim) before publishing.
- Dalail al-Khayrat and Hizb al-Bahr are not bundled: the Arabic must be exact, and published translations belong
  to their authors. Add the text yourself in "My wird" (one Arabic line, then its translation, then a blank line).
  To build a text in, get permission or use your own translation, then save it as a file in `src/data`.
- The Forty Hadith are English summaries without Arabic. Read the Arabic in a printed edition.
- The compass needs a phone with a sensor and an https page. Laptops have no compass, so a manual dial is provided.
- The Manzil follows the commonly printed list. Editions differ slightly.

## Project structure

```
src/
  api.js              Quran, tafsir and prayer-time requests
  prayer.js           prayer helpers, Qibla maths
  shareImage.js       verse image generator
  themes.js           palettes, reciters, tafsir books, default settings
  styles.css          colours (CSS variables) and layout
  App.jsx             routing, settings, bookmarks, install button
  data/               adhkar, duas, 99 names, Manzil, feature tiles
  hooks/              storage, hash router, daily counters, prayer times
  components/         one file per page or widget
public/
  manifest.webmanifest, sw.js, icons   (installable and offline)
```

## Customise

- App name: search for "Amal" in `index.html`, `public/manifest.webmanifest` and `src/components/Header.jsx`.
- New colour theme: copy a `[data-palette=...]` block pair in `src/styles.css`, change the colours, add it to `src/themes.js`.
- New adhkar: add items in `src/data/adhkar.js`. Use `quran: [{ s, from, to }]` for Quran verses (text is fetched) or `arabic` for hadith texts.
- New tafsir book: add an entry to `TAFSIRS` in `src/themes.js`.

## Credits

Quran text, translations and audio: [Al Quran Cloud API](https://alquran.cloud/api) and the Islamic Network audio CDN.
Tafsir: the open [tafsir_api](https://github.com/spa5k/tafsir_api) dataset (jsDelivr). Prayer times: [AlAdhan](https://aladhan.com).
Fonts: Figtree, Amiri Quran, Noto Nastaliq Urdu (Google Fonts).

## Wazaif and Qasaid (Dalail al-Khayrat, Hizb al-Bahr, Burda, Khatm-e-Qadria)

Every text here comes from a file the owner supplied; nothing was typed from memory.

- Dalail al-Khayrat: the pages of the scanned book (`public/dalail`, 223 pages). Arabic-only versions hide the small Urdu lines; the toggle shows the original page. 9 pages cannot be separated and always show the full page. The 8 hizb and their days follow the book's contents page.
- Hizb al-Bahr: Arabic read from the glyph names of the Aliya Publications PDF (`src/data/hizbulbahr.js`); the practice notes are short paraphrases of its printed instructions.
- Qaseeda Burda: the Arabic couplets are images cut from the Salawat.com PDF (`public/burda`), 160 numbered couplets in 10 chapters plus the closing couplets.
- Khatm-e-Qadria: the Arabic of the 56 slides (`public/khatm`); counts were read from the slide headers.

Translations and transliterations shown on request belong to those publishers. Before publishing the app publicly, get permission or delete those images.

- Al-Wazifa-tul-Karima: the 48 printed pages of the scanned Maktaba-tul-Madina booklet (`public/wazifa`) with its 20 sections from the contents page. The booklet mixes Urdu explanation with the Arabic wazaif, so pages are shown exactly as printed.
- Listen: every text has a player where you add a recitation: a YouTube link (official embed), a link to an audio file, or a file from your phone, which is kept on the device (IndexedDB). The app ships no recordings.

## Reading and navigation (latest)

- Prayer times are calculated on the device (`src/prayerCalc.js`), with seconds, start and end of each prayer, a ring for the time left, and "Other times". For Karachi on 12 October 2026 they matched a reference app within about 10 seconds. Settings: city, calculation method, Asr rule, height above sea level. The default Hijri offset is 2 days behind Saudi dates.
- Dalail, Al-Wazifa-tul-Karima: pages fit the screen, swipe both ways (touch events), zoom, and page turns do not grow the browser history, so Back leaves the book.
- Hizb al-Bahr: screen-sized pages with a text size slider. Quran Mushaf pages: optional "fit the whole page to the screen", text size 14 to 72.
- Side menu and bottom bar (Home, Quran, Prayer, Calendar, Menu).
- Favourite surahs with a daily "read" tick; Manzil audio; your own dhikr in Tasbeeh; Khatm planner by ruku, juz, page or surah (`#/ruku/12-17` opens a day's rukus).
- Tafsir: choose the book in the verse panel, Urdu first, with a fallback to the other Urdu books.
- Surah reading now defaults to screen-sized pages (swipe right for the next page, the last page goes on to the next surah); "Scroll" gives the old long page. Dalail and Wazifa pages also zoom by pinching with two fingers or by double tap.

## Dalail al-Khayrat as text (latest)

`#/dalail` is now laid out like the website: Opening Dua, Dua of Intention, Part 1 to 8 (with the day of each part) and the Dua of Completion, in that order. Every part is one scrolling page of numbered durood (the numbers match the website), words in the highlight colour, a text size slider, a "keep my place" tap on any number, Listen, and a "Next" button at the end. The text was read from the PDFs of the website pages that the owner saved (`src/data/dalailText.js`). 16 words that had lost a vowel mark in those PDFs were given it back by matching them with the same word elsewhere in the text. The scanned book is still available at `#/dalail/book`.

## Books, audio and the Quran layout (latest)

- Al-Wazifa-tul-Karima and the scanned Dalail pages use a book viewer (`BookViewer.jsx`): pinch, drag, double tap and mouse wheel zoom like a PDF, a page flip with a paper sound (made with the Web Audio API, switchable), swipe right for the next page. Wazifa also has a topic search in Urdu and English (`src/data/wazifaIndex.js`, made by reading the pages) and buttons to open and download the PDF (`public/wazifa/Al-Wazifa-tul-Karima.pdf`). Page 2 of that booklet says that others are not allowed to print it, so remove the PDF and the page images before publishing the app publicly.
- Dalail as text: a reading progress bar on top, an audio player (file, audio link or YouTube link) and "Sync the lines with this audio": play the audio and tap each number once, the times are saved on the phone, and the line being recited is highlighted and followed. The Listen player is also on Burda, Hizb al-Bahr, Khatm-e-Qadria, Wazifa, Kalimas, Duas, Adhkar and the 99 Names. The app ships no recordings.
- Surah screens have an Indo-Pak style layout (banner with verses, rukus and place of revelation, verse numbers in brackets, ruku marks). It uses the Uthmani text of the app with the Noto Naskh Arabic font; the exact Indo-Pak lettering needs the Indo-Pak font and text (for example from Quran.com's QUL resources).
- Surah screens use "Simple spelling" by default (the Tanzil simple text, full alif as in the South Asian printed Quran, no small Uthmani marks); the Reading options switch it to Uthmani. If the simple text cannot be loaded the Uthmani text is shown, so nothing breaks.

