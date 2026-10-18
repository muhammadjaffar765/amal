import { useMemo, useState } from 'react';
import { HADITH40 } from '../data/hadith40.js';
import PageHeader from './PageHeader.jsx';
import Icon from './Icon.jsx';

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');

export default function Hadith() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);
  const today = new Date();
  const day = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
  const daily = HADITH40[day % HADITH40.length];

  const list = useMemo(() => {
    const q = norm(query).trim();
    if (!q) return HADITH40;
    return HADITH40.filter((h) => String(h.n) === q || norm(`${h.title} ${h.narrator} ${h.text} ${h.source}`).includes(q));
  }, [query]);

  return (
    <>
      <PageHeader icon="book" hue={25} title="Forty Hadith" subtitle="Imam an-Nawawi's collection of 42 core hadith, in simple English." />
      <p className="note">
        These are meaning summaries, not word-for-word translations, and the Arabic text is not included so that nothing
        is mistyped. Please read the Arabic and a full translation in a printed edition.
      </p>

      <section className="verse-card hadith-day">
        <p className="verse-label"><Icon name="sparkles" size={16} /> Hadith of the day</p>
        <h2>{daily.n}. {daily.title}</h2>
        <p className="hero-english">{daily.text.length > 360 ? `${daily.text.slice(0, 360).replace(/\s+\S*$/, '')}…` : daily.text}</p>
        <div className="hero-foot">
          <span>{daily.narrator}, {daily.source}</span>
          <button className="btn btn-primary" onClick={() => { setQuery(String(daily.n)); setOpen(daily.n); }}>Read in full</button>
        </div>
      </section>

      <label className="search-box wide spaced">
        <Icon name="search" size={18} />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by number, topic or narrator" aria-label="Search hadith" />
      </label>

      <ul className="hadith-list">
        {list.map((h) => {
          const isOpen = open === h.n || list.length === 1;
          return (
            <li key={h.n} className={isOpen ? 'hadith is-open' : 'hadith'}>
              <button className="hadith-head" onClick={() => setOpen(isOpen && list.length > 1 ? null : h.n)} aria-expanded={isOpen}>
                <span className="hadith-n">{h.n}</span>
                <span className="hadith-title">
                  <strong>{h.title}</strong>
                  <small>{h.narrator}</small>
                </span>
                <Icon name="chevron-right" size={18} />
              </button>
              {isOpen && (
                <div className="hadith-body">
                  <p>{h.text}</p>
                  <p className="source">Narrated by {h.narrator}. Source: {h.source}.</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {list.length === 0 && <p className="empty">No hadith matches “{query}”.</p>}
    </>
  );
}
