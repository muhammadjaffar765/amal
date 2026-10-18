import { useEffect, useRef, useState } from 'react';
import { DALAIL_AR_ONLY, DALAIL_AR_WIDTH, DALAIL_PAGES, DALAIL_PARTS } from '../data/dalail.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';
import BookViewer, { SoundToggle } from './BookViewer.jsx';
import { PageNav, goTo, useArrowKeys } from './PageFrame.jsx';
import ListenBar from './ListenBar.jsx';

const pad = (n) => String(n).padStart(3, '0');
const partOf = (page) => DALAIL_PARTS.find((p) => page >= p.from && page <= p.to) || DALAIL_PARTS[0];
const DAY_TO_PART = [6, 0, 1, 2, 3, 4, 5];
const FULL_W = 1075; // width of the full-page images

export function DalailIndex() {
  const [last] = useLocalStorage('noor:dalail-last', 0);
  const today = DAY_TO_PART[new Date().getDay()];
  return (
    <>
      <a className="btn btn-ghost sm" href="#/dalail"><Icon name="arrow-left" size={18} /> Dalail al-Khayrat</a>
      <PageHeader icon="scroll" hue={18} title="The scanned book" subtitle="Eight hizb, one for each day. The original pages of your book." />
      {last > 0 && (
        <a className="continue" href={`#/dalail/p/${last}`}>
          <span className="continue-icon"><Icon name="flag" size={20} /></span>
          <span className="continue-text"><strong>Continue reading</strong><span>{partOf(last).name}, page {last}</span></span>
          <Icon name="arrow-right" />
        </a>
      )}
      <div className="lesson-list parts-list">
        {DALAIL_PARTS.map((p, i) => (
          <a key={p.name} className={`part-card${i === today ? ' is-today' : ''}`} href={`#/dalail/p/${p.from}`}>
            <span className="part-n">{i < 8 ? i + 1 : '✦'}</span>
            <span className="part-text">
              <strong>{p.name}</strong>
              <small>{p.day ? `${p.day}, ` : ''}pages {p.from} to {p.to}</small>
            </span>
            {i === today && <span className="chip is-on">Today</span>}
            <Icon name="arrow-right" size={18} />
          </a>
        ))}
      </div>
      <p className="hint">The days follow the contents page of your book. Hizb 8 is read on the Monday of the second week.</p>
    </>
  );
}

export default function DalailReader({ number, settings, onSettings }) {
  const [, setLast] = useLocalStorage('noor:dalail-last', 0);
  const [opts, setOpts] = useState(false);
  const prev = useRef(number);
  const dir = number >= prev.current ? 'next' : 'prev';
  const part = partOf(number);
  const hasAr = DALAIL_AR_ONLY.has(number);
  const showFull = settings.sacredTranslation || !hasAr;
  const go = (n) => goTo('#/dalail/p/', n, DALAIL_PAGES, number);
  useArrowKeys(go, number);

  useEffect(() => {
    prev.current = number;
    setLast(number);
  }, [number]); // eslint-disable-line react-hooks/exhaustive-deps

  const src = `/dalail/${showFull ? 'full' : 'ar'}/p${pad(number)}.webp`;

  return (
    <>
      <div className="rd-bar">
        <a className="btn btn-ghost sm" href="#/dalail/book"><Icon name="arrow-left" size={18} /> Book</a>
        <span className="rd-title"><strong>{part.name}</strong><small>{part.day || 'Dua'}, page {number}</small></span>
        <SoundToggle on={settings.pageSound !== false} onChange={(v) => onSettings({ pageSound: v })} />
        <button className={opts ? 'icon-btn is-on' : 'icon-btn'} onClick={() => setOpts((o) => !o)} aria-label="Options" aria-expanded={opts}><Icon name="sliders" size={18} /></button>
      </div>
      {opts && (
        <div className="rd-opts">
          <label className="switch-row">
            <input type="checkbox" checked={settings.sacredTranslation} onChange={(e) => onSettings({ sacredTranslation: e.target.checked })} />
            <span>Show the Urdu translation (the small lines in your book)</span>
          </label>
          {!hasAr && <p className="hint">The translation cannot be hidden on this page, so the full page is shown.</p>}
          <label className="field">Go to a part
            <select value={part.name} onChange={(e) => go(DALAIL_PARTS.find((x) => x.name === e.target.value).from)}>
              {DALAIL_PARTS.map((x) => <option key={x.name} value={x.name}>{x.name}{x.day ? ` (${x.day})` : ''}</option>)}
            </select>
          </label>
          <ListenBar key={part.name} id={`dalail-${DALAIL_PARTS.indexOf(part) + 1}`} title={part.name} query={`Dalail al-Khayrat ${part.name} recitation`} />
        </div>
      )}
      <BookViewer src={src} alt={`Dalail al-Khayrat page ${number}`} dir={dir} sound={settings.pageSound !== false} fitDeps={[opts]} onNext={() => go(number + 1)} onPrev={() => go(number - 1)} />
      <PageNav number={number} total={DALAIL_PAGES} go={go} />
    </>
  );
}
