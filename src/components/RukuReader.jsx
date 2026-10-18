import { useEffect, useState } from 'react';
import { getRuku } from '../api.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import Icon from './Icon.jsx';
import MushafText from './MushafText.jsx';

// "#/ruku/12-17": the rukus of today's reading, one after the other, in Mushaf style.
export default function RukuReader({ from, to, settings, onSettings }) {
  const [blocks, setBlocks] = useState(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [plans, setPlans] = useLocalStorage('amal:khatm-units', {});
  const size = settings.arabicSize;

  useEffect(() => {
    let cancelled = false;
    setBlocks(null);
    setError('');
    const nums = Array.from({ length: to - from + 1 }, (_, i) => from + i);
    Promise.all(nums.map((n) => getRuku(n).then((ayahs) => ({ n, ayahs }))))
      .then((b) => !cancelled && setBlocks(b))
      .catch((e) => !cancelled && setError(e.message));
    return () => { cancelled = true; };
  }, [from, to, attempt]);

  const finish = () => {
    const cur = { days: 30, done: 0, ...(plans.ruku || {}) };
    setPlans((p) => ({ ...p, ruku: { ...cur, done: Math.max(cur.done, to) } }));
    window.location.hash = '#/khatm';
  };

  return (
    <>
      <div className="rd-bar">
        <a className="btn btn-ghost sm" href="#/khatm"><Icon name="arrow-left" size={18} /> Planner</a>
        <span className="rd-title"><strong>{from === to ? `Ruku ${from}` : `Rukus ${from} to ${to}`}</strong><small>Today's reading</small></span>
      </div>
      <label className="size-slider">
        <span>Text size</span>
        <input type="range" min="14" max="64" step="1" value={size} onChange={(e) => onSettings({ arabicSize: Number(e.target.value) })} aria-label="Text size" />
        <span className="size-val">{size}</span>
      </label>
      {error && <div className="notice"><p>{error}</p><button className="btn btn-primary" onClick={() => setAttempt((a) => a + 1)}>Try again</button></div>}
      {!blocks && !error && <div aria-hidden="true"><span className="skeleton tall" /></div>}
      {blocks && blocks.map(({ n, ayahs }) => {
        const first = ayahs[0]; const last = ayahs[ayahs.length - 1];
        return (
          <section key={n} className="mushaf-card ruku-block">
            <p className="ruku-label">Ruku {n}: {first.surah.englishName} {first.n}{last.surah.number === first.surah.number ? ` to ${last.n}` : ` to ${last.surah.englishName} ${last.n}`}</p>
            <MushafText ayahs={ayahs} size={size} headers onSelect={() => {}} />
          </section>
        );
      })}
      {blocks && <button className="btn btn-primary wide-btn" onClick={finish}><Icon name="check" size={18} /> I finished today's reading</button>}
    </>
  );
}
