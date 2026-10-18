import { useEffect, useRef, useState } from 'react';
import Header, { MobileNav } from './components/Header.jsx';
import Home from './components/Home.jsx';
import QuranIndex from './components/QuranIndex.jsx';
import Reader from './components/Reader.jsx';
import SearchView from './components/SearchView.jsx';
import Bookmarks from './components/Bookmarks.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import PrayerTimes from './components/PrayerTimes.jsx';
import Qibla from './components/Qibla.jsx';
import { AdhkarCategory, AdhkarIndex } from './components/Adhkar.jsx';
import Manzil from './components/Manzil.jsx';
import Tasbeeh from './components/Tasbeeh.jsx';
import Names, { NameDetail } from './components/Names.jsx';
import IslamicCalendar from './components/IslamicCalendar.jsx';
import Hadith from './components/Hadith.jsx';
import HajjGuide from './components/HajjGuide.jsx';
import Duas from './components/Duas.jsx';
import Khatm from './components/Khatm.jsx';
import Amal from './components/Amal.jsx';
import MyWird from './components/MyWird.jsx';
import HifzListener from './components/HifzListener.jsx';
import PageReader, { Jump } from './components/PageReader.jsx';
import Kalimas from './components/Kalimas.jsx';
import Naats from './components/Naats.jsx';
import Kids from './components/Kids.jsx';
import TextsHub from './components/TextsHub.jsx';
import DalailReader, { DalailIndex } from './components/Dalail.jsx';
import { DalailHub, DalailTextReader } from './components/DalailText.jsx';
import HizbAlBahr from './components/HizbAlBahr.jsx';
import Burda from './components/Burda.jsx';
import Qadria from './components/Qadria.jsx';
import WazifaReader, { WazifaIndex } from './components/WazifaKarima.jsx';
import Notes from './components/Notes.jsx';
import { HajjPlanner, UmrahPlanner } from './components/Planner.jsx';
import More from './components/More.jsx';
import SideMenu from './components/SideMenu.jsx';
import RukuReader from './components/RukuReader.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useSystemDark } from './hooks/useSystemDark.js';
import { DEFAULT_SETTINGS } from './themes.js';

const NAV_GROUP = {
  quran: 'quran', surah: 'quran', page: 'quran', jump: 'quran', search: 'quran', bookmarks: 'quran',
  prayer: 'prayer', qibla: 'prayer',
  adhkar: 'adhkar',
  more: 'more', manzil: 'more', wird: 'more', tasbeeh: 'more', names: 'more', duas: 'more', khatm: 'more', amal: 'more', calendar: 'calendar', hadith: 'more', hajj: 'more', hifz: 'more', ruku: 'more', texts: 'more', dalail: 'more', hizbulbahr: 'more', burda: 'more', qadria: 'more', wazifa: 'more', kalimas: 'more', notes: 'more', umrah: 'more', hajjplan: 'more', naats: 'more', kids: 'more',
};

export default function App() {
  const route = useHashRoute();
  const [stored, setStored] = useLocalStorage('noor:settings', {});
  const [bookmarks, setBookmarks] = useLocalStorage('noor:bookmarks', []);
  const [lastRead, setLastRead] = useLocalStorage('noor:last-read', null);
  const [marks, setMarks] = useLocalStorage('amal:marks', {});
  const [snips, setSnips] = useLocalStorage('amal:snips', []);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [installEvent, setInstallEvent] = useState(null);
  const systemDark = useSystemDark();

  // In-app back button. On phones (especially an installed app) there is no browser back button,
  // so we keep count of how many pages the person has opened inside Amal.
  const navCount = useRef(0);
  const goingBack = useRef(false);
  useEffect(() => {
    const onHash = () => {
      if (window.__amalReplace) {
        window.__amalReplace = false; // a page turn inside a reader does not add to the history
        return;
      }
      if (goingBack.current) {
        goingBack.current = false;
        navCount.current = Math.max(0, navCount.current - 1);
      } else {
        navCount.current += 1;
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const goBack = () => {
    setSettingsOpen(false);
    if (navCount.current > 0) {
      goingBack.current = true;
      window.history.back();
    } else {
      window.location.hash = '#/';
    }
  };

  const settings = { ...DEFAULT_SETTINGS, ...stored };
  const mode = settings.mode === 'system' ? (systemDark ? 'dark' : 'light') : settings.mode;

  // Apply the theme to <html> so CSS variables switch.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.palette = settings.palette;
    root.dataset.mode = mode;
    root.style.colorScheme = mode;
    const bg = getComputedStyle(root).getPropertyValue('--bg').trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg || '#ffffff');
  }, [settings.palette, mode]);

  // "Install app" button (Chrome, Edge, Android).
  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setInstallEvent(e);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);
  const install = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice.catch(() => {});
    setInstallEvent(null);
  };

  const pageKey = route.segments.join('/');
  useEffect(() => setMenuOpen(false), [pageKey]);
  useEffect(() => {
    if (!route.params.get('ayah')) window.scrollTo(0, 0);
  }, [pageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateSettings = (patch) => setStored((s) => ({ ...s, ...patch }));
  // A note or colour on a verse. `base` says which verse; an empty colour and empty note remove the entry.
  const updateMark = (base, patch) =>
    setMarks((m) => {
      const key = `${base.surah}:${base.ayah}`;
      const next = { surah: base.surah, ayah: base.ayah, name: base.name, text: base.text, ...(m[key] || {}), ...patch, t: Date.now() };
      if (!next.color && !(next.note || '').trim()) {
        const rest = { ...m };
        delete rest[key];
        return rest;
      }
      return { ...m, [key]: next };
    });
  const toggleBookmark = (item) =>
    setBookmarks((list) => (list.some((b) => b.id === item.id) ? list.filter((b) => b.id !== item.id) : [item, ...list]));

  const [page, arg] = route.segments;
  let view;
  switch (page) {
    case undefined:
      view = <Home lastRead={lastRead} settings={settings} />;
      break;
    case 'quran':
      view = <QuranIndex lastRead={lastRead} settings={settings} onSettings={updateSettings} />;
      break;
    case 'surah': {
      const n = parseInt(arg, 10);
      const ayah = parseInt(route.params.get('ayah'), 10);
      view =
        n >= 1 && n <= 114 ? (
          <Reader
            key={n}
            number={n}
            focusAyah={Number.isNaN(ayah) ? null : ayah}
            settings={settings}
            onSettings={updateSettings}
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
            lastRead={lastRead}
            onLastRead={setLastRead}
            marks={marks}
            onMark={updateMark}
            snips={snips}
            onSnips={setSnips}
          />
        ) : (
          <div className="empty-card">
            <p>There is no surah with that number. The Quran has 114 surahs.</p>
            <a className="btn btn-primary" href="#/quran">Back to all surahs</a>
          </div>
        );
      break;
    }
    case 'page': {
      const n = parseInt(arg, 10);
      view = n >= 1 && n <= 604
        ? <PageReader number={n} settings={settings} onSettings={updateSettings} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} onLastRead={setLastRead} marks={marks} onMark={updateMark} snips={snips} onSnips={setSnips} />
        : <div className="empty-card"><p>The Mushaf has pages 1 to 604.</p><a className="btn btn-primary" href="#/page/1">Go to page 1</a></div>;
      break;
    }
    case 'jump':
      view = <Jump key={route.segments.join('/')} surah={parseInt(route.segments[2], 10) || 1} />;
      break;
    case 'texts':
      view = <TextsHub />;
      break;
    case 'dalail': {
      const pg = parseInt(route.segments[2], 10);
      if (route.segments[1] === 'p' && pg >= 1 && pg <= 223) view = <DalailReader number={pg} settings={settings} onSettings={updateSettings} />;
      else if (route.segments[1] === 't') view = <DalailTextReader key={route.segments[2]} id={route.segments[2]} settings={settings} onSettings={updateSettings} />;
      else if (route.segments[1] === 'book') view = <DalailIndex />;
      else view = <DalailHub />;
      break;
    }
    case 'wazifa': {
      const wp = parseInt(route.segments[2], 10);
      view = route.segments[1] === 'p' && wp >= 1 && wp <= 48
        ? <WazifaReader number={wp} settings={settings} onSettings={updateSettings} />
        : <WazifaIndex />;
      break;
    }
    case 'hizbulbahr':
      view = <HizbAlBahr settings={settings} onSettings={updateSettings} />;
      break;
    case 'burda':
      view = <Burda settings={settings} onSettings={updateSettings} />;
      break;
    case 'qadria':
      view = <Qadria settings={settings} onSettings={updateSettings} />;
      break;
    case 'kalimas':
      view = <Kalimas settings={settings} onSettings={updateSettings} />;
      break;
    case 'naats':
      view = <Naats />;
      break;
    case 'umrah':
      view = <UmrahPlanner settings={settings} />;
      break;
    case 'hajjplan':
      view = <HajjPlanner settings={settings} />;
      break;
    case 'notes':
      view = <Notes marks={marks} onMark={updateMark} snips={snips} onSnips={setSnips} />;
      break;
    case 'kids':
      view = <Kids segments={route.segments} settings={settings} />;
      break;
    case 'search':
      view = <SearchView />;
      break;
    case 'bookmarks':
      view = <Bookmarks bookmarks={bookmarks} onRemove={toggleBookmark} />;
      break;
    case 'prayer':
      view = <PrayerTimes settings={settings} onUpdate={updateSettings} />;
      break;
    case 'qibla':
      view = <Qibla settings={settings} />;
      break;
    case 'adhkar':
      view = arg ? <AdhkarCategory key={arg} id={arg} settings={settings} /> : <AdhkarIndex />;
      break;
    case 'manzil':
      view = <Manzil settings={settings} />;
      break;
    case 'tasbeeh':
      view = <Tasbeeh settings={settings} />;
      break;
    case 'names':
      view = arg === 'quiz' ? <Names view="quiz" /> : arg !== undefined ? <NameDetail index={arg} settings={settings} /> : <Names />;
      break;
    case 'calendar':
      view = <IslamicCalendar settings={settings} onUpdate={updateSettings} />;
      break;
    case 'hadith':
      view = <Hadith />;
      break;
    case 'hifz':
      view = <HifzListener settings={settings} />;
      break;
    case 'hajj':
      view = <HajjGuide settings={settings} />;
      break;
    case 'duas':
      view = <Duas settings={settings} />;
      break;
    case 'ruku': {
      const m = /^(\d+)(?:-(\d+))?$/.exec(arg || '');
      const a = m ? Math.max(1, Math.min(556, Number(m[1]))) : 1;
      const b = m && m[2] ? Math.max(a, Math.min(556, Number(m[2]), a + 40)) : a;
      view = <RukuReader key={`${a}-${b}`} from={a} to={b} settings={settings} onSettings={updateSettings} />;
      break;
    }
    case 'khatm':
      view = <Khatm />;
      break;
    case 'amal':
      view = <Amal />;
      break;
    case 'wird':
      view = <MyWird key={route.segments.join('/')} segments={route.segments} params={route.params} settings={settings} />;
      break;
    case 'more':
      view = <More canInstall={!!installEvent} onInstall={install} />;
      break;
    default:
      view = (
        <div className="empty-card">
          <p>That page does not exist.</p>
          <a className="btn btn-primary" href="#/">Go home</a>
        </div>
      );
  }

  const active = page === undefined ? '' : NAV_GROUP[page] ?? '';

  return (
    <>
      <Header active={active} onOpenSettings={() => setSettingsOpen(true)} showBack={route.segments.length > 0} onBack={goBack} onOpenMenu={() => setMenuOpen(true)} />
      <main className="container page">{view}</main>
      <MobileNav active={active} onOpenMenu={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SettingsPanel open={settingsOpen} settings={settings} onChange={updateSettings} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
