import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import Icon from './Icon.jsx';
import ListenBar from './ListenBar.jsx';
import PageHeader from './PageHeader.jsx';

// The order of the website: Opening Dua, Dua of Intention, the 8 parts, Dua of Completion.
export const FLOW = [
  { id: 'opening', title: 'Opening Dua', ar: 'دعاء الافتتاح', note: 'Begin here' },
  { id: 'intention', title: 'Dua of Intention', ar: 'دعاء النية', note: 'Before the daily part' },
  { id: 'p1', title: 'Part 1', ar: 'الحزب الأول', note: 'Monday', day: 1 },
  { id: 'p2', title: 'Part 2', ar: 'الحزب الثاني', note: 'Tuesday', day: 2 },
  { id: 'p3', title: 'Part 3', ar: 'الحزب الثالث', note: 'Wednesday', day: 3 },
  { id: 'p4', title: 'Part 4', ar: 'الحزب الرابع', note: 'Thursday', day: 4 },
  { id: 'p5', title: 'Part 5', ar: 'الحزب الخامس', note: 'Friday', day: 5 },
  { id: 'p6', title: 'Part 6', ar: 'الحزب السادس', note: 'Saturday', day: 6 },
  { id: 'p7', title: 'Part 7', ar: 'الحزب السابع', note: 'Sunday', day: 0 },
  { id: 'p8', title: 'Part 8', ar: 'الحزب الثامن', note: 'Monday, the last part', day: 'last' },
  { id: 'completion', title: 'Dua of Completion', ar: 'دعاء الختم', note: 'After the part' },
];
const todayId = () => {
  const d = new Date().getDay();
  return (FLOW.find((f) => f.day === d) || FLOW[2]).id;
};

export function DalailHub() {
  const [pin] = useLocalStorage('amal:dalail-pin', null);
  const today = todayId();
  const pinned = pin && FLOW.find((f) => f.id === pin.id);
  return (
    <>
      <PageHeader icon="scroll" hue={18} title="Dalail al-Khayrat" subtitle="Read it part by part, numbered like the website." />
      {pinned && (
        <a className="continue" href={`#/dalail/t/${pin.id}`}>
          <span className="continue-icon"><Icon name="flag" size={20} /></span>
          <span className="continue-text"><strong>Continue</strong><span>{pinned.title}, number {pin.n}</span></span>
          <Icon name="arrow-right" />
        </a>
      )}
      <ol className="flow-list">
        {FLOW.map((f, i) => (
          <li key={f.id}>
            <a className={`flow-card${f.id === today ? ' is-today' : ''}${f.day === undefined ? ' is-dua' : ''}`} href={`#/dalail/t/${f.id}`}>
              <span className="flow-n">{f.day === undefined ? <Icon name="sparkles" size={18} /> : f.id.replace('p', '')}</span>
              <span className="flow-text"><strong>{f.title}</strong><small>{f.note}</small></span>
              <span className="flow-ar" lang="ar">{f.ar}</span>
              {f.id === today && <span className="chip is-on">Today</span>}
            </a>
            {i < FLOW.length - 1 && <span className="flow-line" aria-hidden="true" />}
          </li>
        ))}
      </ol>
      <p className="hint">Today's part follows the day of the week. Read the Opening Dua and the Dua of Intention first, then the part, then the Dua of Completion.</p>
      <a className="btn btn-ghost wide-btn" href="#/dalail/book"><Icon name="book-open" size={18} /> The scanned book (original pages)</a>
    </>
  );
}

// "{{word}}" marks a word shown in the highlight colour
function Highlighted({ text }) {
  return text.split(/(\{\{[^}]*\}\})/).map((part, i) => (part.startsWith('{{') ? <span key={i} className="hl">{part.slice(2, -2)}</span> : part));
}

const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

export function DalailTextReader({ id, settings, onSettings }) {
  const idx = FLOW.findIndex((f) => f.id === id);
  const meta = FLOW[idx];
  const [data, setData] = useState(null);
  const [opts, setOpts] = useState(false);
  const [pin, setPin] = useLocalStorage('amal:dalail-pin', null);
  const [allCues, setAllCues] = useLocalStorage('amal:dalail-cues', {});
  const [audioEl, setAudioEl] = useState(null);
  const [now, setNow] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [follow, setFollow] = useState(true);
  const [pct, setPct] = useState(0);
  const [toast, setToast] = useState('');
  const size = settings.dalailSize || 26;
  const box = useRef(null);
  const cues = allCues[id] || {};

  useEffect(() => {
    let cancelled = false;
    setData(null);
    import('../data/dalailText.js').then((m) => !cancelled && setData(m.DALAIL_TEXT));
    window.scrollTo({ top: 0 });
    return () => { cancelled = true; };
  }, [id]);

  // How much of this part has been read: the bar on top of the screen
  useEffect(() => {
    const onScroll = () => {
      const el = box.current;
      if (!el) { setPct(0); return; }
      const top = el.getBoundingClientRect().top + window.scrollY;
      const read = window.scrollY + window.innerHeight * 0.55 - top;
      setPct(Math.max(0, Math.min(100, Math.round((read / el.offsetHeight) * 100))));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [data, size]);

  // The audio: which durood is being read now
  useEffect(() => {
    if (!audioEl) { setPlaying(false); return undefined; }
    const tick = () => setNow(audioEl.currentTime);
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    audioEl.addEventListener('timeupdate', tick);
    audioEl.addEventListener('seeked', tick);
    audioEl.addEventListener('play', on);
    audioEl.addEventListener('pause', off);
    audioEl.addEventListener('ended', off);
    return () => {
      audioEl.removeEventListener('timeupdate', tick);
      audioEl.removeEventListener('seeked', tick);
      audioEl.removeEventListener('play', on);
      audioEl.removeEventListener('pause', off);
      audioEl.removeEventListener('ended', off);
    };
  }, [audioEl]);

  const section = data && data.sections[id];
  const next = FLOW[idx + 1];
  const count = useMemo(() => (section ? section.paras.filter((p) => p.n).length : 0), [section]);
  const cueList = useMemo(() => Object.entries(cues).map(([n, t]) => [Number(n), t]).sort((a, b) => a[1] - b[1]), [cues]);
  let activeN = null;
  if (audioEl && (playing || now > 0)) {
    for (const [n, t] of cueList) if (t <= now + 0.15) activeN = n;
  }
  const pinHere = pin && pin.id === id ? pin.n : null;

  useEffect(() => {
    if (!follow || !activeN || !playing) return;
    const el = document.getElementById(`dp-${activeN}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeN, follow, playing]);

  const say = (t) => { setToast(t); setTimeout(() => setToast(''), 1600); };
  const resume = () => {
    const el = document.getElementById(`dp-${pinHere}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const onNumber = (n) => {
    if (syncing) {
      if (!audioEl) { say('Add an audio file or link first'); return; }
      setAllCues((c) => ({ ...c, [id]: { ...(c[id] || {}), [n]: Math.round(audioEl.currentTime * 10) / 10 } }));
      say(`Number ${n} starts at ${mmss(audioEl.currentTime)}`);
      return;
    }
    setPin(pinHere === n ? null : { id, n });
  };
  const playFrom = (n) => {
    if (!audioEl || cues[n] == null) return;
    audioEl.currentTime = cues[n];
    audioEl.play().catch(() => {});
  };
  const clearCues = () => setAllCues((c) => { const d = { ...c }; delete d[id]; return d; });

  if (!meta) return <div className="empty-card"><p>This part was not found.</p><a className="btn btn-primary" href="#/dalail">Back</a></div>;

  return (
    <>
      <div className="dt-progress" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100" aria-label="How much of this part you have read"><span style={{ width: `${pct}%` }} /></div>
      <div className="rd-bar">
        <a className="btn btn-ghost sm" href="#/dalail"><Icon name="arrow-left" size={18} /> Dalail</a>
        <span className="rd-title"><strong>{meta.title}</strong><small>{pct}% read{count ? `, ${count} durood` : ''}</small></span>
        {pinHere && <button className="chip" onClick={resume}><Icon name="flag" size={14} /> Resume</button>}
        <button className={opts ? 'icon-btn is-on' : 'icon-btn'} onClick={() => setOpts((o) => !o)} aria-label="Options" aria-expanded={opts}><Icon name="sliders" size={18} /></button>
      </div>
      <div className={opts ? 'rd-opts' : 'rd-opts is-collapsed'}>
        {opts && (
          <>
            <label className="size-slider">
              <span>Text size</span>
              <input type="range" min="16" max="48" step="1" value={size} onChange={(e) => onSettings({ dalailSize: Number(e.target.value) })} aria-label="Text size" />
              <span className="size-val">{size}</span>
            </label>
            <label className="field">Go to
              <select value={id} onChange={(e) => { window.location.hash = `#/dalail/t/${e.target.value}`; }}>
                {FLOW.map((f) => <option key={f.id} value={f.id}>{f.title}</option>)}
              </select>
            </label>
          </>
        )}
        <ListenBar key={id} id={`dalail-${id}`} title={meta.title} query={`Dalail al-Khayrat ${meta.title} recitation`} onAudio={setAudioEl} />
        {opts && audioEl && (
          <div className="sync-box">
            <div className="form-actions">
              <button className={syncing ? 'btn btn-primary' : 'btn btn-ghost'} onClick={() => setSyncing((v) => !v)} aria-pressed={syncing}>
                <Icon name="clock" size={18} /> {syncing ? 'Syncing: tap each number' : 'Sync the lines with this audio'}
              </button>
              <label className="switch-row"><input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} /><span>Scroll with the audio</span></label>
            </div>
            <p className="hint">
              {syncing
                ? 'Play the audio. When a durood begins, tap its number. Do this once; it is saved on this phone. Afterwards the line being read is highlighted by itself.'
                : cueList.length ? `${cueList.length} of ${count} numbers are synced. Tap the small play button next to a number to start from there.` : 'Sync once and the line being read will be highlighted as the audio plays.'}
            </p>
            {cueList.length > 0 && <button className="link-btn" onClick={clearCues}>Clear the sync of this part</button>}
          </div>
        )}
        {opts && !audioEl && <p className="hint">Add an audio file, an audio link or a YouTube link under Listen. With an audio file or link you can also sync the lines. A YouTube link plays in YouTube's own player and cannot be synced.</p>}
      </div>

      <header className="dt-head">
        <h1 lang="ar">{meta.ar}</h1>
        <p>{meta.title}{count ? `, ${count} durood` : ''}</p>
      </header>

      {!section && <div aria-hidden="true"><span className="skeleton tall" /><span className="skeleton" /></div>}
      {section && (
        <article className="dt-text" ref={box} style={{ fontSize: `${size}px` }}>
          {section.paras.map((p, i) => {
            if (p.mark) return <div key={i} className="dt-mark"><span lang="ar">{p.mark}</span>{p.en && <small>{p.en}</small>}</div>;
            return (
              <section key={i} id={p.n ? `dp-${p.n}` : undefined} className={`dt-para${pinHere && pinHere === p.n ? ' is-pin' : ''}${activeN && activeN === p.n ? ' is-playing' : ''}`}>
                {p.n ? (
                  <div className="dt-row">
                    <button className="dt-n" onClick={() => onNumber(p.n)} aria-pressed={pinHere === p.n} aria-label={syncing ? `Number ${p.n}. Tap when it starts in the audio` : `Number ${p.n}. Tap to keep your place here`}>{p.n}</button>
                    {audioEl && cues[p.n] != null && <button className="dt-play" onClick={() => playFrom(p.n)} aria-label={`Play from number ${p.n}`}><Icon name="play" size={13} filled /></button>}
                    {(syncing || opts) && cues[p.n] != null && <small className="dt-time">{mmss(cues[p.n])}</small>}
                  </div>
                ) : null}
                <p lang="ar" dir="rtl"><Highlighted text={p.t} /></p>
              </section>
            );
          })}
        </article>
      )}

      {section && (
        <nav className="dt-next" aria-label="Next">
          <h2>{next ? 'Next' : 'You have finished'}</h2>
          <div className="form-actions">
            {next && <a className="btn btn-primary" href={`#/dalail/t/${next.id}`}>{next.title} <Icon name="arrow-right" size={18} /></a>}
            {idx > 0 && <a className="btn btn-ghost" href={`#/dalail/t/${FLOW[idx - 1].id}`}><Icon name="arrow-left" size={18} /> {FLOW[idx - 1].title}</a>}
            {!next && <a className="btn btn-ghost" href="#/dalail">Back to the start</a>}
          </div>
        </nav>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
