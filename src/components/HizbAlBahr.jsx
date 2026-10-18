import { useState } from 'react';
import { HIZB_AL_BAHR } from '../data/hizbulbahr.js';
import ListenBar from './ListenBar.jsx';
import PagedText from './PagedText.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

export default function HizbAlBahr({ settings, onSettings }) {
  const [notes, setNotes] = useState(false);
  const [mode, setMode] = useLocalStorage('amal:hizb-mode', 'pages');
  const size = settings.hizbSize || 20;
  const text = HIZB_AL_BAHR.segments.map((s, i) => {
    if (s.k === 'note') return notes ? <p key={i} className="hizb-note" dir="ltr" lang="en">{s.t}</p> : null;
    return <p key={i} className={`hizb-${s.k}`}>{s.t}</p>;
  });
  return (
    <>
      <h1 className="compact-title">Hizb al-Bahr <small>The Litany of the Sea, Imam ash-Shadhili</small></h1>
      <div className="read-tools">
        <div className="seg" role="group" aria-label="Reading style">
          <button className={mode === 'pages' ? 'is-on' : ''} aria-pressed={mode === 'pages'} onClick={() => setMode('pages')}>Pages</button>
          <button className={mode === 'scroll' ? 'is-on' : ''} aria-pressed={mode === 'scroll'} onClick={() => setMode('scroll')}>Scroll</button>
        </div>
        <label className="switch-row">
          <input type="checkbox" checked={notes} onChange={(e) => setNotes(e.target.checked)} />
          <span>Practice notes</span>
        </label>
      </div>
      <label className="size-slider">
        <span>Text size</span>
        <input type="range" min="14" max="48" step="1" value={size} onChange={(e) => onSettings({ hizbSize: Number(e.target.value) })} aria-label="Text size" />
        <span className="size-val">{size}</span>
      </label>
      {mode === 'pages' ? (
        <PagedText dep={`${size}-${notes}`} resume="amal:hizb-page" className="hizb-paged">
          <article className="hizb-text hizb-flow" lang="ar" style={{ fontSize: `${size}px` }}>{text}</article>
        </PagedText>
      ) : (
        <article className="hizb-text" lang="ar" dir="rtl" style={{ fontSize: `${size}px` }}>{text}</article>
      )}
      <ListenBar id="hizbulbahr" title="Hizb al-Bahr" query="Hizb al Bahr recitation" />
      <p className="note">The Arabic was read from the glyphs of the Aliya Publications PDF you provided, so it matches that edition exactly, including its spelling and vowel marks. Please have it proofread. The practice notes are short summaries of the instructions printed in that PDF. That PDF has no translation of the litany itself, so there is none here.</p>
    </>
  );
}
