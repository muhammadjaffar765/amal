import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { buzz } from '../hooks/useDaily.js';
import Icon from './Icon.jsx';

const KINDS = {
  tawaf: { label: 'Tawaf', unit: 'round', tip: 'Start at the Black Stone with the Kaaba on your left. Seven rounds.', done: 'Seven rounds complete. Now pray two rakat behind the Station of Ibrahim, or anywhere in the Haram.' },
  sai: { label: "Sa'i", unit: 'trip', tip: 'Start at Safa. Safa to Marwah is one trip, Marwah to Safa is the next. Seven trips end at Marwah.', done: "Seven trips complete, ending at Marwah. Now shave or trim your hair (for Umrah)." },
};

// A simple tap counter so you never lose count during Tawaf or Sa'i.
export default function TawafCounter({ settings }) {
  const [state, setState] = useLocalStorage('amal:tawaf', { kind: 'tawaf', tawaf: 0, sai: 0 });
  const kind = KINDS[state.kind] ? state.kind : 'tawaf';
  const k = KINDS[kind];
  const n = state[kind] || 0;
  const done = n >= 7;
  const set = (patch) => setState((s) => ({ ...s, ...patch }));
  const tap = () => {
    if (done) return;
    set({ [kind]: n + 1 });
    buzz(settings, n + 1 === 7 ? 80 : 12);
  };
  return (
    <section className="card counter">
      <div className="seg" role="group" aria-label="What are you counting">
        {Object.entries(KINDS).map(([id, v]) => (
          <button key={id} className={kind === id ? 'is-on' : ''} aria-pressed={kind === id} onClick={() => set({ kind: id })}>{v.label}</button>
        ))}
      </div>
      <button className={done ? 'big-count is-done' : 'big-count'} onClick={tap} aria-label={`Count a ${k.unit}. ${n} of 7`}>
        <span className="big-n">{n}</span>
        <span className="big-of">of 7 {k.unit}s</span>
      </button>
      <div className="dots" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <span key={i} className={i < n ? 'on' : ''} />)}</div>
      <p className="hint">{done ? k.done : k.tip}</p>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={() => set({ [kind]: Math.max(0, n - 1) })} disabled={n === 0}>Undo</button>
        <button className="btn btn-ghost" onClick={() => set({ [kind]: 0 })} disabled={n === 0}><Icon name="rotate" size={16} /> Reset</button>
      </div>
    </section>
  );
}
