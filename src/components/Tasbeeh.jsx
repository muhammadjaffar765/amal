import { buzz } from '../hooks/useDaily.js';
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';

const PRESETS = [
  { id: 'subhanallah', label: 'SubhanAllah', arabic: 'سُبْحَانَ اللَّهِ', target: 33 },
  { id: 'alhamdulillah', label: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', target: 33 },
  { id: 'allahuakbar', label: 'Allahu Akbar', arabic: 'اللَّهُ أَكْبَرُ', target: 34 },
  { id: 'tahlil', label: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', target: 100 },
  { id: 'istighfar', label: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', target: 100 },
  { id: 'salawat', label: 'Salawat', arabic: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', target: 100 },
  { id: 'bihamdihi', label: 'SubhanAllahi wa bihamdihi', arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', target: 100 },
  { id: 'azim', label: 'SubhanAllahil Azim', arabic: 'سُبْحَانَ اللَّهِ الْعَظِيمِ', target: 100 },
  { id: 'hawqala', label: 'La hawla wa la quwwata', arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', target: 100 },
  { id: 'hasbunallah', label: 'Hasbunallah', arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', target: 100 },
];
const TARGETS = [33, 99, 100, 500, 1000];
const R = 118;
const C = 2 * Math.PI * R;

export default function Tasbeeh({ settings }) {
  const [state, setState] = useLocalStorage('noor:tasbeeh', { preset: 'subhanallah', data: {} });
  // Your own dhikr: any name, any Arabic text you like, any number to reach
  const custom = state.custom || [];
  const ALL = [...PRESETS, ...custom];
  const preset = ALL.find((p) => p.id === state.preset) || PRESETS[0];
  const isCustom = custom.some((c) => c.id === preset.id);
  const [form, setForm] = useState({ label: '', arabic: '', target: '100' });
  const addCustom = (e) => {
    e.preventDefault();
    const label = form.label.trim();
    if (!label) return;
    const id = `c${Date.now()}`;
    const target = Math.max(1, Math.min(100000, parseInt(form.target, 10) || 100));
    setState((s) => ({ ...s, custom: [...(s.custom || []), { id, label, arabic: form.arabic.trim(), target }], preset: id }));
    setForm({ label: '', arabic: '', target: '100' });
  };
  const removeCustom = () => setState((s) => ({ ...s, custom: (s.custom || []).filter((c) => c.id !== preset.id), preset: 'subhanallah' }));
  const cur = state.data[preset.id] || { count: 0, laps: 0, target: preset.target };
  const target = cur.target || preset.target;

  const patch = (changes) =>
    setState((s) => ({
      ...s,
      data: { ...s.data, [preset.id]: { count: 0, laps: 0, target, ...(s.data[preset.id] || {}), ...changes } },
    }));

  const tap = () => {
    const next = cur.count + 1;
    if (next >= target) {
      patch({ count: 0, laps: cur.laps + 1 });
      buzz(settings, 60);
    } else {
      patch({ count: next });
      buzz(settings, 8);
    }
  };

  const total = cur.laps * target + cur.count;
  const offset = C * (1 - cur.count / target);

  return (
    <>
      <PageHeader icon="beads" hue={175} title="Tasbeeh" subtitle="Tap the circle to count. Your count is saved on this device." />

      <div className="chips" role="group" aria-label="Choose dhikr">
        {ALL.map((p) => (
          <button key={p.id} className={p.id === preset.id ? 'chip is-on' : 'chip'} aria-pressed={p.id === preset.id} onClick={() => setState((s) => ({ ...s, preset: p.id }))}>
            {p.label}
          </button>
        ))}
      </div>

      <details className="card form tasbeeh-add">
        <summary>Add your own dhikr or durood</summary>
        <form onSubmit={addCustom}>
          <label className="field">Name<input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="For example: Durood Ibrahimi" /></label>
          <label className="field">Arabic text (optional)<input dir="rtl" lang="ar" value={form.arabic} onChange={(e) => setForm((f) => ({ ...f, arabic: e.target.value }))} /></label>
          <label className="field">Count to<input inputMode="numeric" value={form.target} onChange={(e) => setForm((f) => ({ ...f, target: e.target.value.replace(/\D/g, '') }))} /></label>
          <button className="btn btn-primary" type="submit" disabled={!form.label.trim()}>Add</button>
        </form>
      </details>
      {isCustom && <button className="link-btn" onClick={removeCustom}>Remove "{preset.label}" from my list</button>}

      <section className="tasbeeh">
        <p className="arabic tasbeeh-ar" lang="ar" dir="rtl">{preset.arabic || preset.label}</p>
        <button className="ring-btn" onClick={tap} aria-label={`Count ${preset.label}. ${cur.count} of ${target}`}>
          <svg viewBox="0 0 280 280" aria-hidden="true">
            <circle className="ring-track" cx="140" cy="140" r={R} />
            <circle className="ring-fill" cx="140" cy="140" r={R} strokeDasharray={C} strokeDashoffset={offset} transform="rotate(-90 140 140)" />
          </svg>
          <span className="ring-count">{cur.count}</span>
          <span className="ring-target">of {target}</span>
        </button>
        <div className="tasbeeh-stats">
          <span><strong>{cur.laps}</strong> rounds</span>
          <span><strong>{total}</strong> total</span>
        </div>
        <div className="tasbeeh-targets">
          <span>Target</span>
          <div className="seg" role="group" aria-label="Target count">
            {TARGETS.map((t) => (
              <button key={t} className={t === target ? 'is-on' : ''} aria-pressed={t === target} onClick={() => patch({ target: t, count: 0 })}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => patch({ count: 0, laps: 0 })}>
          <Icon name="rotate" size={18} /> Reset
        </button>
      </section>
    </>
  );
}
