import { useMemo, useState } from 'react';
import { DUAS, DUA_GROUPS } from '../data/duas.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';
import TextBlock from './TextBlock.jsx';
import ListenBar from './ListenBar.jsx';

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\u0600-\u06FF ]/g, ' ');

export default function Duas({ settings }) {
  const [group, setGroup] = useState('all');
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const words = norm(query).split(/\s+/).filter(Boolean);
    return DUAS.filter((d) => {
      if (group !== 'all' && d.group !== group) return false;
      if (!words.length) return true;
      const hay = norm(`${d.title} ${d.tags || ''} ${d.en || ''} ${d.translit || ''} ${d.ur || ''} ${d.arabic || ''}`);
      return words.every((w) => hay.includes(w));
    });
  }, [group, query]);

  return (
    <>
      <PageHeader icon="moon" hue={230} title="Duas" subtitle={`${DUAS.length} duas for daily life, prayer, health, family and more.`} />
      <ListenBar id="duas" title="the duas" query="Quran duas recitation" />

      <label className="search-box wide spaced">
        <Icon name="search" size={18} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a dua: sleeping, eating, travel, sick, anger…"
          aria-label="Search duas"
        />
      </label>

      <div className="chips" role="group" aria-label="Dua groups">
        {[{ id: 'all', label: 'All' }, ...DUA_GROUPS].map((g) => (
          <button key={g.id} className={group === g.id ? 'chip is-on' : 'chip'} aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>
            {g.label}
          </button>
        ))}
      </div>

      <p className="result-count">{list.length} {list.length === 1 ? 'dua' : 'duas'}{query ? ` for “${query}”` : ''}</p>

      {list.map((d) => (
        <article key={d.id} className="dhikr">
          <div className="dhikr-top">
            <h2>{d.title}</h2>
            <span className="tag">{DUA_GROUPS.find((g) => g.id === d.group)?.label}</span>
          </div>
          <TextBlock item={d} settings={settings} />
          {d.source && <p className="source">Source: {d.source}</p>}
        </article>
      ))}
      {list.length === 0 && (
        <div className="empty-card">
          <p>No dua found for “{query}”. Try a simpler word such as sleep, food, travel, sick or anger.</p>
          <button className="btn btn-ghost" onClick={() => { setQuery(''); setGroup('all'); }}>Clear search</button>
        </div>
      )}
    </>
  );
}
