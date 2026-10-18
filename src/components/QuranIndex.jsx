import { useEffect, useMemo, useState } from 'react';
import { getSurahs } from '../api.js';
import { JUZ_NAMES, JUZ_START, TOTAL_PAGES } from '../data/juz.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { todayKey } from '../hooks/useDaily.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';
import StarBadge from './StarBadge.jsx';

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, '');

export default function QuranIndex({ lastRead, settings, onSettings }) {
  const [surahs, setSurahs] = useState(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('surah');
  const [pageNo, setPageNo] = useState('');
  const [lastPage] = useLocalStorage('noor:last-page', 0);
  // Favourite surahs (for example Yaseen, Mulk, Kahf) with a tick for "read today"
  const [favs, setFavs] = useLocalStorage('amal:fav-surahs', []);
  const [doneToday, setDoneToday] = useLocalStorage('amal:fav-done', { date: '', list: [] });
  const today = todayKey();
  const readToday = doneToday.date === today ? doneToday.list : [];
  const toggleFav = (n) => setFavs((f) => (f.includes(n) ? f.filter((x) => x !== n) : [...f, n]));
  const toggleDone = (n) => setDoneToday({ date: today, list: readToday.includes(n) ? readToday.filter((x) => x !== n) : [...readToday, n] });

  useEffect(() => {
    let cancelled = false;
    setError('');
    getSurahs()
      .then((s) => !cancelled && setSurahs(s))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const filtered = useMemo(() => {
    if (!surahs) return [];
    const q = norm(query);
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        String(s.number) === query.trim() ||
        norm(s.englishName).includes(q) ||
        norm(s.englishNameTranslation).includes(q) ||
        s.name.includes(query.trim())
    );
  }, [surahs, query]);

  const pages = settings.readMode === 'pages';
  const surahHref = (n) => (pages ? `#/jump/surah/${n}` : `#/surah/${n}`);

  return (
    <>
      <PageHeader icon="book-open" hue={152} title="The Noble Quran" subtitle="Read by surah, by Juz (Para) or page by page like a Mushaf.">
        <div className="head-actions">
          <a className="btn btn-light" href="#/search"><Icon name="search" size={18} /> Search verses</a>
          <a className="btn btn-light" href="#/bookmarks"><Icon name="bookmark" size={18} /> Saved</a>
        </div>
      </PageHeader>

      {(lastRead || lastPage > 0) && (
        <div className="continue-row">
          {lastRead && (
            <a className="continue" href={`#/surah/${lastRead.surah}?ayah=${lastRead.ayah}`}>
              <span className="continue-icon"><Icon name="flag" size={20} /></span>
              <span className="continue-text"><strong>Continue reading</strong><span>Surah {lastRead.name}, verse {lastRead.ayah}</span></span>
              <Icon name="arrow-right" />
            </a>
          )}
          {lastPage > 0 && (
            <a className="continue" href={`#/page/${lastPage}`}>
              <span className="continue-icon"><Icon name="book-open" size={20} /></span>
              <span className="continue-text"><strong>Mushaf: page {lastPage}</strong><span>Pick up where you stopped</span></span>
              <Icon name="arrow-right" />
            </a>
          )}
        </div>
      )}

      {surahs && favs.length > 0 && (
        <section className="fav-box" aria-label="My daily surahs">
          <header>
            <h2>My daily surahs</h2>
            <span>{favs.filter((n) => readToday.includes(n)).length} of {favs.length} read today</span>
          </header>
          {favs.map((n) => {
            const s = surahs.find((x) => x.number === n);
            if (!s) return null;
            const done = readToday.includes(n);
            return (
              <div key={n} className={`fav-row${done ? ' is-done' : ''}`}>
                <a href={surahHref(n)} className="fav-link">
                  <strong>{s.englishName}</strong>
                  <span lang="ar">{s.name.replace(/^سُورَةُ\s*/, '')}</span>
                </a>
                <button className={done ? 'chip is-on' : 'chip'} onClick={() => toggleDone(n)} aria-pressed={done}><Icon name="check" size={14} /> {done ? 'Read' : 'Mark read'}</button>
              </div>
            );
          })}
        </section>
      )}

      <div className="index-tabs">
        <div className="seg" role="tablist" aria-label="Browse by">
          {[['surah', 'Surah'], ['juz', 'Juz (Para)'], ['page', 'Pages']].map(([id, label]) => (
            <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'is-on' : ''} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
        {tab === 'surah' && (
          <div className="seg" role="group" aria-label="How a surah opens">
            <button className={!pages ? 'is-on' : ''} aria-pressed={!pages} onClick={() => onSettings({ readMode: 'scroll' })}>Scroll</button>
            <button className={pages ? 'is-on' : ''} aria-pressed={pages} onClick={() => onSettings({ readMode: 'pages' })}>Mushaf pages</button>
          </div>
        )}
      </div>

      {tab === 'surah' && (
        <>
          <label className="search-box wide spaced">
            <Icon name="search" size={18} />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a surah by name or number" aria-label="Find a surah" />
          </label>
          {error && (
            <div className="notice"><p>{error}</p><button className="btn btn-primary" onClick={() => setAttempt((a) => a + 1)}>Try again</button></div>
          )}
          {!surahs && !error && (
            <div className="surah-grid" aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => <div key={i} className="surah-card skeleton-card"><span className="skeleton" /></div>)}
            </div>
          )}
          {surahs && filtered.length === 0 && <p className="empty">No surah matches “{query}”.</p>}
          {surahs && filtered.length > 0 && (
            <div className="surah-grid">
              {filtered.map((s) => (
                <div key={s.number} className="surah-wrap">
                  <a className="surah-card" href={surahHref(s.number)}>
                    <StarBadge n={s.number} />
                    <span className="surah-meta"><strong>{s.englishName}</strong><span>{s.englishNameTranslation}, {s.numberOfAyahs} verses</span></span>
                    <span className="surah-arabic" lang="ar">{s.name.replace(/^سُورَةُ\s*/, '')}</span>
                  </a>
                  <button className={favs.includes(s.number) ? 'fav-star is-on' : 'fav-star'} onClick={() => toggleFav(s.number)} aria-pressed={favs.includes(s.number)} aria-label={favs.includes(s.number) ? `Remove ${s.englishName} from my daily surahs` : `Add ${s.englishName} to my daily surahs`}>
                    <Icon name="star" size={18} filled={favs.includes(s.number)} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'juz' && (
        <div className="juz-grid">
          {JUZ_START.map((start, i) => (
            <a key={start} className="juz-card" href={`#/page/${start}`}>
              <StarBadge n={i + 1} size={38} />
              <span className="juz-meta"><strong>Juz {i + 1}</strong><span>Page {start}</span></span>
              <span className="surah-arabic" lang="ar">{JUZ_NAMES[i]}</span>
            </a>
          ))}
        </div>
      )}

      {tab === 'page' && (
        <section className="card form">
          <h2>Go to a page</h2>
          <p className="hint">The Madani Mushaf has {TOTAL_PAGES} pages. Swipe to turn pages once you are in.</p>
          <form className="page-jump big" onSubmit={(e) => { e.preventDefault(); const n = Math.max(1, Math.min(TOTAL_PAGES, parseInt(pageNo, 10) || 1)); window.location.hash = `#/page/${n}`; }}>
            <input inputMode="numeric" value={pageNo} onChange={(e) => setPageNo(e.target.value.replace(/\D/g, ''))} placeholder="1 to 604" aria-label="Page number" />
            <button className="btn btn-primary" type="submit">Open page</button>
          </form>
          <div className="chips">
            {[1, 50, 100, 200, 300, 400, 500, 582, 604].map((n) => <a key={n} className="chip" href={`#/page/${n}`}>Page {n}</a>)}
          </div>
        </section>
      )}
    </>
  );
}
