import { useMemo, useState } from 'react';
import Icon from './Icon.jsx';
import Marked from './Marked.jsx';
import PageHeader from './PageHeader.jsx';

const WHERE = { en: 'English translation', ur: 'Urdu translation', tafsir: 'Tafsir' };

// Everything the reader wrote or highlighted, in one place, like the notebook next to a printed Quran.
export default function Notes({ marks, onMark, snips, onSnips }) {
  const [filter, setFilter] = useState('all');
  const [copied, setCopied] = useState(false);

  const entries = useMemo(
    () => Object.entries(marks).map(([key, m]) => ({ key, ...m })).sort((a, b) => a.surah - b.surah || a.ayah - b.ayah),
    [marks]
  );
  const shown = entries.filter((e) => (filter === 'notes' ? e.note && e.note.trim() : filter === 'highlights' ? e.color : true));
  const loneSnips = snips.filter((s) => filter !== 'notes');

  const copyAll = async () => {
    const lines = entries.map((e) => `${e.name} ${e.surah}:${e.ayah}\n${e.text}\n${e.note ? `My note: ${e.note}` : ''}`.trim());
    const sn = snips.map((s) => `${s.ref} (${WHERE[s.where] || s.where}): "${s.text}"`);
    try {
      await navigator.clipboard.writeText([...lines, ...sn].join('\n\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard can be blocked */
    }
  };

  const empty = entries.length === 0 && snips.length === 0;
  return (
    <>
      <PageHeader icon="edit" hue={40} title="My Amal notes" subtitle="What you learned, and what you will do about it." />
      {empty ? (
        <div className="empty-card">
          <Icon name="edit" size={30} />
          <p>No notes or highlights yet. Open any verse in the Quran, tap it, then use Note or the colour dots.</p>
          <a className="btn btn-primary" href="#/quran">Open the Quran</a>
        </div>
      ) : (
        <>
          <div className="chips" role="group" aria-label="Show">
            {[['all', 'All'], ['notes', 'Notes'], ['highlights', 'Highlights']].map(([id, label]) => (
              <button key={id} className={filter === id ? 'chip is-on' : 'chip'} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
            ))}
            <button className="chip" onClick={copyAll}><Icon name={copied ? 'check' : 'copy'} size={14} /> Copy all</button>
          </div>

          {shown.map((e) => (
            <article key={e.key} className={`note-card${e.color ? ` bar-${e.color}` : ''}`}>
              <div className="note-top">
                <a className="result-ref" href={`#/surah/${e.surah}?ayah=${e.ayah}`}>{e.name} {e.surah}:{e.ayah}</a>
                <button className="icon-btn" aria-label="Delete this note and highlight" onClick={() => { if (window.confirm('Delete this note and highlight?')) onMark(e, { color: '', note: '' }); }}><Icon name="trash" size={16} /></button>
              </div>
              <p className="arabic note-ar" lang="ar" dir="rtl">{e.text}</p>
              <label className="field">
                <span className="sr-only">My note</span>
                <textarea rows={2} value={e.note || ''} placeholder="How will I act on this verse?" onChange={(ev) => onMark(e, { note: ev.target.value })} />
              </label>
            </article>
          ))}
          {shown.length === 0 && <p className="empty">Nothing here yet.</p>}

          {loneSnips.length > 0 && (
            <>
              <div className="section-head"><h2>Highlighted words</h2></div>
              <ul className="snips big">
                {loneSnips.map((s) => (
                  <li key={s.id} className={`hl hl-${s.color}`}>
                    <span>
                      <a href={`#/surah/${s.surah}?ayah=${s.ayah}`}>{s.ref}</a>
                      <small>{WHERE[s.where] || s.where}</small>
                      <Marked text={s.text} snips={[]} />
                    </span>
                    <button className="icon-btn" aria-label="Remove highlight" onClick={() => onSnips((list) => list.filter((x) => x.id !== s.id))}><Icon name="close" size={14} /></button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </>
  );
}
