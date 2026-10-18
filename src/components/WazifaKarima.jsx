import { useEffect, useMemo, useRef, useState } from 'react';
import { WAZIFA_PAGES, WAZIFA_SECTIONS } from '../data/wazifa.js';
import { WAZIFA_INDEX } from '../data/wazifaIndex.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import BookViewer, { SoundToggle } from './BookViewer.jsx';
import Icon from './Icon.jsx';
import ListenBar from './ListenBar.jsx';
import { PageNav, goTo, useArrowKeys } from './PageFrame.jsx';
import PageHeader from './PageHeader.jsx';

const PDF = '/wazifa/Al-Wazifa-tul-Karima.pdf';
const pad = (n) => String(n).padStart(2, '0');
const sectionOf = (page) => [...WAZIFA_SECTIONS].reverse().find((s) => s.page <= page) || null;

// the same word spelled in different Urdu or Arabic letters, and with or without vowel marks, matches
const norm = (s) => s.toLowerCase()
  .replace(/[\u064b-\u065f\u0670\u0640\u06d6-\u06ed]/g, '')
  .replace(/[يىے]/g, 'ی').replace(/ك/g, 'ک').replace(/[ةھه]/g, 'ہ').replace(/[أإآٱ]/g, 'ا').replace(/ۃ/g, 'ہ')
  .replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
const SEARCHABLE = WAZIFA_INDEX.map((e) => ({ e, text: norm(`${e[1]} ${e[2]} ${e[3]}`) }));
function searchTopics(q) {
  const words = norm(q).split(' ').filter(Boolean);
  if (!words.length) return [];
  return SEARCHABLE.filter((x) => words.every((w) => x.text.includes(w))).map((x) => x.e);
}

function PdfButtons() {
  return (
    <div className="form-actions">
      <a className="btn btn-ghost" href={PDF} target="_blank" rel="noopener noreferrer"><Icon name="book-open" size={18} /> Open the PDF</a>
      <a className="btn btn-ghost" href={PDF} download="Al-Wazifa-tul-Karima.pdf"><Icon name="download" size={18} /> Download</a>
    </div>
  );
}

function TopicSearch({ autoFocus }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => searchTopics(q), [q]);
  return (
    <div className="topic-search">
      <label className="field">Search a topic, in Urdu or English
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="قرض, snake, sleep, ayatul kursi…" autoFocus={autoFocus} enterKeyHint="search" />
      </label>
      {q.trim() && results.length === 0 && <p className="hint">Nothing found. Try another word, for example "debt", "sleep" or "morning".</p>}
      {results.length > 0 && (
        <ul className="topic-results">
          {results.map((r, i) => (
            <li key={`${r[0]}-${i}`}>
              <a href={`#/wazifa/p/${r[0]}`}>
                <span className="tr-page">{r[0]}</span>
                <span className="tr-text"><strong lang="ur" dir="rtl">{r[1]}</strong><small>{r[2]}</small></span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function WazifaIndexPage() {
  const [last] = useLocalStorage('noor:wazifa-last', 0);
  return (
    <>
      <PageHeader icon="scroll" hue={168} title="Al-Wazifa-tul-Karima" subtitle="Imam Ahmad Raza Khan. Read it like a book." />
      <div className="form-actions">
        <a className="btn btn-primary" href={`#/wazifa/p/${last > 0 ? last : 1}`}><Icon name="book-open" size={18} /> {last > 0 ? `Continue: page ${last}` : 'Start reading'}</a>
        {last > 0 && <a className="btn btn-ghost" href="#/wazifa/p/1">From the first page</a>}
      </div>
      <TopicSearch />
      <PdfButtons />
      <ListenBar id="wazifa" title="Al-Wazifa-tul-Karima" query="Al Wazifa tul Karima recitation" />
      <h2 className="sec-title">Contents</h2>
      <div className="lesson-list parts-list">
        {WAZIFA_SECTIONS.map((s) => (
          <a key={s.n} className="part-card" href={`#/wazifa/p/${s.page}`}>
            <span className="part-n">{s.n}</span>
            <span className="part-text">
              <strong lang="ur" dir="rtl">{s.ur}</strong>
              <small>{s.en}, page {s.page}</small>
            </span>
            <Icon name="arrow-right" size={18} />
          </a>
        ))}
      </div>
      <p className="hint">Swipe right for the next page. Pinch, or double tap, to zoom in like in a PDF.</p>
    </>
  );
}

export default function WazifaReader({ number, settings, onSettings }) {
  const [, setLast] = useLocalStorage('noor:wazifa-last', 0);
  const [panel, setPanel] = useState(null); // 'search' | 'pdf' | null
  const prev = useRef(number);
  const dir = number >= prev.current ? 'next' : 'prev';
  const sec = sectionOf(number);
  const go = (n) => goTo('#/wazifa/p/', n, WAZIFA_PAGES, number);
  useArrowKeys(go, number);
  useEffect(() => {
    prev.current = number;
    setLast(number);
  }, [number]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = (name) => setPanel((p) => (p === name ? null : name));
  return (
    <>
      <div className="rd-bar">
        <a className="btn btn-ghost sm" href="#/wazifa"><Icon name="arrow-left" size={18} /> Contents</a>
        <span className="rd-title"><strong>{sec ? sec.en : 'Al-Wazifa-tul-Karima'}</strong><small>Page {number} of {WAZIFA_PAGES}</small></span>
        <button className={panel === 'search' ? 'icon-btn is-on' : 'icon-btn'} onClick={() => toggle('search')} aria-label="Search a topic" aria-expanded={panel === 'search'}><Icon name="search" size={18} /></button>
        <button className={panel === 'pdf' ? 'icon-btn is-on' : 'icon-btn'} onClick={() => toggle('pdf')} aria-label="PDF" aria-expanded={panel === 'pdf'}><Icon name="download" size={18} /></button>
        <SoundToggle on={settings.pageSound !== false} onChange={(v) => onSettings({ pageSound: v })} />
      </div>
      {panel === 'search' && <div className="rd-opts"><TopicSearch autoFocus /><button className="btn btn-ghost" onClick={() => setPanel(null)}>Back to the page</button></div>}
      {panel === 'pdf' && <div className="rd-opts"><PdfButtons /><p className="hint">The PDF opens in your phone's own PDF viewer, where you can also print or share it.</p></div>}
      {panel !== 'search' && (
        <>
          <BookViewer src={`/wazifa/p${pad(number)}.webp`} alt={`Al-Wazifa-tul-Karima page ${number}`} dir={dir} sound={settings.pageSound !== false} fitDeps={[panel]} onNext={() => go(number + 1)} onPrev={() => go(number - 1)} />
          <PageNav number={number} total={WAZIFA_PAGES} go={go} />
        </>
      )}
    </>
  );
}

export { WazifaIndexPage as WazifaIndex };
