import { useState } from 'react';
import { todayKey } from '../hooks/useDaily.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';

const BASE = [
  { id: 'fajr', label: 'Fajr', icon: 'moon' },
  { id: 'dhuhr', label: 'Dhuhr', icon: 'sun' },
  { id: 'asr', label: 'Asr', icon: 'sun' },
  { id: 'maghrib', label: 'Maghrib', icon: 'moon' },
  { id: 'isha', label: 'Isha', icon: 'moon' },
  { id: 'morning', label: 'Morning adhkar', icon: 'sun' },
  { id: 'evening', label: 'Evening adhkar', icon: 'moon' },
  { id: 'quran', label: 'Read the Quran', icon: 'book-open' },
  { id: 'salawat', label: 'Salawat', icon: 'heart' },
  { id: 'sadaqah', label: 'Give sadaqah', icon: 'sparkles' },
];

const shift = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return todayKey(d);
};

export default function Amal() {
  const [state, setState] = useLocalStorage('noor:amal', { custom: [], days: {} });
  const [text, setText] = useState('');
  const today = todayKey();
  const tasks = [...BASE, ...state.custom.map((c) => ({ ...c, icon: 'star-custom' }))];
  const todayDone = state.days[today] || [];

  const toggle = (id) =>
    setState((s) => {
      const cur = s.days[today] || [];
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      const days = { ...s.days, [today]: next };
      Object.keys(days).forEach((k) => {
        if (k < shift(120)) delete days[k];
      });
      return { ...s, days };
    });

  const addCustom = (e) => {
    e.preventDefault();
    const label = text.trim();
    if (!label) return;
    setState((s) => ({ ...s, custom: [...s.custom, { id: `c${Date.now().toString(36)}`, label }] }));
    setText('');
  };
  const removeCustom = (id) =>
    setState((s) => ({ ...s, custom: s.custom.filter((c) => c.id !== id) }));

  // Streak: consecutive days with at least one item done (no pressure on any single prayer).
  let streak = 0;
  for (let i = todayDone.length ? 0 : 1; i < 120; i += 1) {
    if ((state.days[shift(i)] || []).length) streak += 1;
    else break;
  }
  const week = Array.from({ length: 7 }, (_, i) => {
    const key = shift(6 - i);
    const n = (state.days[key] || []).length;
    const d = new Date(`${key}T12:00:00`);
    return { key, frac: Math.min(1, n / tasks.length), label: d.toLocaleDateString('en-US', { weekday: 'narrow' }), today: key === today };
  });
  const pct = Math.round((todayDone.length / tasks.length) * 100);

  return (
    <>
      <PageHeader icon="list-check" hue={12} title="Daily amal" subtitle="A gentle checklist for your day. It stays on this device." />

      <section className="amal-top">
        <div className="streak"><Icon name="flame" size={28} /><strong>{streak}</strong><span>{streak === 1 ? 'day' : 'days'} in a row</span></div>
        <div className="week" aria-label="Last 7 days">
          {week.map((w) => (
            <span key={w.key} className={w.today ? 'week-day is-today' : 'week-day'}>
              <span className="dot" style={{ '--frac': w.frac }} />
              {w.label}
            </span>
          ))}
        </div>
      </section>

      <div className="page-progress">
        <span className="bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></span>
        <span>{todayDone.length} of {tasks.length} today</span>
      </div>

      <ul className="amal-list">
        {tasks.map((t) => {
          const on = todayDone.includes(t.id);
          const custom = t.icon === 'star-custom';
          return (
            <li key={t.id} className={on ? 'is-on' : ''}>
              <button className="amal-check" onClick={() => toggle(t.id)} aria-pressed={on}>
                <span className="amal-box">{on && <Icon name="check" size={16} />}</span>
                <Icon name={custom ? 'heart' : t.icon} size={18} />
                <span>{t.label}</span>
              </button>
              {custom && (
                <button className="icon-btn" onClick={() => removeCustom(t.id)} aria-label={`Remove ${t.label}`}>
                  <Icon name="trash" size={16} />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <form className="add-row" onSubmit={addCustom}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add your own, such as Surah Kahf" aria-label="New daily item" />
        <button className="btn btn-primary" type="submit"><Icon name="plus" size={18} /> Add</button>
      </form>
    </>
  );
}
