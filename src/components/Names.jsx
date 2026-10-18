import { useMemo, useState } from 'react';
import { NAMES } from '../data/names.js';
import { NAMES_INFO } from '../data/namesInfo.js';
import { buzz } from '../hooks/useDaily.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';
import QuranText from './QuranText.jsx';
import StarBadge from './StarBadge.jsx';
import ListenBar from './ListenBar.jsx';

const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, '');

// "The King" -> "You are the King, O Allah."
const praiseOf = (meaning) => `O Allah, You are ${meaning.startsWith('The ') ? `the ${meaning.slice(4)}` : meaning}.`;

export default function Names({ view }) {
  const [favs] = useLocalStorage('noor:names-fav', []);
  const [known] = useLocalStorage('noor:names-known', []);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const today = new Date();
  const dayIndex = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000) % NAMES.length;

  const list = useMemo(() => {
    const q = norm(query);
    return NAMES.map((n, i) => ({ n, i })).filter(({ n, i }) => {
      if (filter === 'fav' && !favs.includes(i)) return false;
      return !q || norm(n[1]).includes(q) || norm(n[2]).includes(q);
    });
  }, [query, filter, favs]);

  if (view === 'quiz') return <NamesQuiz />;

  return (
    <>
      <PageHeader icon="sparkles" hue={48} title="99 Names of Allah" subtitle="Tap any name to read its meaning, explanation and how to live by it.">
        <div className="head-actions">
          <a className="btn btn-light" href="#/names/quiz"><Icon name="target" size={18} /> Practice names ({known.length}/99)</a>
          <a className="btn btn-light" href={`#/names/${dayIndex}`}><Icon name="sparkles" size={18} /> Name of the day</a>
        </div>
      </PageHeader>
      <ListenBar id="names" title="the 99 Names" query="99 Names of Allah recitation" />

      <div className="chips" role="group" aria-label="Filter names">
        <button className={filter === 'all' ? 'chip is-on' : 'chip'} onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>All 99</button>
        <button className={filter === 'fav' ? 'chip is-on' : 'chip'} onClick={() => setFilter('fav')} aria-pressed={filter === 'fav'}><Icon name="heart" size={14} /> Favourites ({favs.length})</button>
      </div>
      <label className="search-box wide spaced">
        <Icon name="search" size={18} />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or meaning" aria-label="Search names" />
      </label>

      <div className="names-grid">
        {list.map(({ n, i }) => (
          <a key={i} className="name-card" href={`#/names/${i}`}>
            <StarBadge n={i + 1} size={34} />
            <span className="name-ar" lang="ar">{n[0]}</span>
            <strong>{n[1]}</strong>
            <span>{n[2]}</span>
            {favs.includes(i) && <span className="name-fav"><Icon name="heart" size={14} filled /></span>}
          </a>
        ))}
      </div>
      {list.length === 0 && <p className="empty">{filter === 'fav' ? 'No favourite names yet. Open a name and tap the heart.' : `No name matches “${query}”.`}</p>}
    </>
  );
}

export function NameDetail({ index, settings }) {
  const [favs, setFavs] = useLocalStorage('noor:names-fav', []);
  const [counts, setCounts] = useLocalStorage('noor:names-count', {});
  const i = Number(index);
  if (!Number.isInteger(i) || i < 0 || i >= NAMES.length) {
    return (
      <div className="empty-card">
        <p>That name was not found.</p>
        <a className="btn btn-primary" href="#/names">Back to the names</a>
      </div>
    );
  }
  const [arabic, translit, meaning] = NAMES[i];
  const [about, live] = NAMES_INFO[i];
  const fav = favs.includes(i);
  const count = counts[i] || 0;
  const toggleFav = () => setFavs((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]));
  const tap = () => {
    setCounts((c) => ({ ...c, [i]: (c[i] || 0) + 1 }));
    buzz(settings, 8);
  };

  return (
    <>
      <div className="reader-top">
        <a className="btn btn-ghost" href="#/names"><Icon name="arrow-left" size={18} /> All names</a>
        <div className="reader-step">
          {i > 0 && <a className="icon-btn" href={`#/names/${i - 1}`} aria-label="Previous name"><Icon name="arrow-left" /></a>}
          {i < NAMES.length - 1 && <a className="icon-btn" href={`#/names/${i + 1}`} aria-label="Next name"><Icon name="arrow-right" /></a>}
        </div>
      </div>

      <section className="name-hero">
        <StarBadge n={i + 1} size={46} />
        <p className="name-hero-ar" lang="ar">{arabic}</p>
        <h1>{translit}</h1>
        <p className="name-hero-meaning">{meaning}</p>
        <button className={fav ? 'btn btn-light is-fav' : 'btn btn-light'} onClick={toggleFav} aria-pressed={fav}>
          <Icon name="heart" size={18} filled={fav} /> {fav ? 'In your favourites' : 'Add to favourites'}
        </button>
      </section>

      <section className="card name-section">
        <h2>Praise of Allah by this name</h2>
        <p className="praise">{praiseOf(meaning)}</p>
        <p className="praise-sub">Subhanallah, wa bihamdihi.</p>
      </section>

      <section className="card name-section">
        <h2>About this name</h2>
        <p>{about}</p>
      </section>

      <section className="card name-section">
        <h2>Living by it</h2>
        <p>{live}</p>
      </section>

      <section className="card name-section">
        <h2>Call upon Him by this name</h2>
        <QuranText parts={[{ s: 7, from: 180, to: 180 }]} size={settings.arabicSize} />
        <p className="hint">Allah has the most beautiful names, so call upon Him by them (Quran 7:180).</p>
        <div className="count-row">
          <button className="count-btn" onClick={tap} aria-label={`Count Ya ${translit}`}>
            <span className="count-label">Ya {translit.replace(/^(Al|Ar|As|At|Ad|An|Az|Ash)-/, '$1-')}</span>
            <span className="count-num">{count}</span>
          </button>
          <button className="icon-btn" onClick={() => setCounts((c) => ({ ...c, [i]: 0 }))} aria-label="Reset counter" disabled={!count}>
            <Icon name="rotate" size={18} />
          </button>
        </div>
      </section>
    </>
  );
}

function NamesQuiz() {
  const [known, setKnown] = useLocalStorage('noor:names-known', []);
  const [pos, setPos] = useState(0);
  const [shown, setShown] = useState(false);
  const pool = useMemo(() => NAMES.map((_, i) => i).filter((i) => !known.includes(i)), [known]);
  const i = pool.length ? pool[pos % pool.length] : null;

  const mark = (yes) => {
    if (i === null) return;
    if (yes) setKnown((k) => [...k, i]);
    else setPos((p) => p + 1);
    setShown(false);
  };

  return (
    <>
      <PageHeader icon="target" hue={48} title="Practice the names" subtitle={`${known.length} of 99 learned`} back={{ href: '#/names', label: 'All names' }}>
        <div className="page-progress">
          <span className="bar" aria-hidden="true"><span style={{ width: `${known.length}%` }} /></span>
          <span>{known.length}/99</span>
        </div>
      </PageHeader>

      {i === null ? (
        <div className="empty-card">
          <Icon name="check-circle" size={32} />
          <p>Masha Allah, you have learned all 99 names.</p>
          <button className="btn btn-ghost" onClick={() => setKnown([])}>Start again</button>
        </div>
      ) : (
        <section className="flash-card">
          <p className="name-hero-ar" lang="ar">{NAMES[i][0]}</p>
          {shown ? (
            <>
              <h2>{NAMES[i][1]}</h2>
              <p className="name-hero-meaning">{NAMES[i][2]}</p>
              <div className="form-actions">
                <button className="btn btn-primary" onClick={() => mark(true)}><Icon name="check" size={18} /> I know it</button>
                <button className="btn btn-ghost" onClick={() => mark(false)}>Show it again later</button>
              </div>
              <a className="link-btn" href={`#/names/${i}`}>Read about this name</a>
            </>
          ) : (
            <>
              <p className="hint">Do you remember its name and meaning?</p>
              <button className="btn btn-primary" onClick={() => setShown(true)}>Show answer</button>
            </>
          )}
        </section>
      )}
    </>
  );
}
