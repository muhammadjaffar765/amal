import { useEffect, useState } from 'react';
import { getSurahs } from '../api.js';
import { JUZ_START } from '../data/juz.js';
import { todayKey } from '../hooks/useDaily.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';
import StarBadge from './StarBadge.jsx';

const TOTAL_AYAHS = 6236;
const PLAN_DAYS = [7, 15, 30, 60, 90];
const R = 58;
const C = 2 * Math.PI * R;

function SurahPlanner() {
  const [surahs, setSurahs] = useState(null);
  const [error, setError] = useState('');
  const [plan, setPlan] = useLocalStorage('noor:khatm', { done: [], days: 30, start: todayKey() });

  useEffect(() => {
    getSurahs().then(setSurahs).catch((e) => setError(e.message));
  }, []);

  const toggle = (n) =>
    setPlan((p) => ({ ...p, done: p.done.includes(n) ? p.done.filter((x) => x !== n) : [...p.done, n] }));

  const read = surahs ? surahs.filter((s) => plan.done.includes(s.number)).reduce((a, s) => a + s.numberOfAyahs, 0) : 0;
  const pct = Math.round((read / TOTAL_AYAHS) * 100);
  const elapsed = Math.max(0, Math.floor((new Date(todayKey()) - new Date(plan.start)) / 86400000));
  const daysLeft = Math.max(1, plan.days - elapsed);
  const perDay = Math.ceil((TOTAL_AYAHS - read) / daysLeft);
  const finished = read >= TOTAL_AYAHS;

  return (
    <>
      {error && <div className="notice"><p>{error}</p></div>}

      <section className="khatm-card">
        <svg viewBox="0 0 140 140" className="khatm-ring" role="img" aria-label={`${pct} percent complete`}>
          <circle className="ring-track" cx="70" cy="70" r={R} />
          <circle className="ring-fill" cx="70" cy="70" r={R} strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} transform="rotate(-90 70 70)" />
          <text x="70" y="78" textAnchor="middle" className="khatm-pct">{pct}%</text>
        </svg>
        <div className="khatm-info">
          {finished ? (
            <>
              <h2>Khatm complete</h2>
              <p>Alhamdulillah. You have finished every surah on your list.</p>
            </>
          ) : (
            <>
              <h2>About {perDay.toLocaleString()} verses a day</h2>
              <p>{read.toLocaleString()} of {TOTAL_AYAHS.toLocaleString()} verses read, {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left in your plan.</p>
            </>
          )}
          <div className="plan-row">
            <span>Finish in</span>
            <div className="seg" role="group" aria-label="Plan length in days">
              {PLAN_DAYS.map((d) => (
                <button key={d} className={plan.days === d ? 'is-on' : ''} aria-pressed={plan.days === d} onClick={() => setPlan((p) => ({ ...p, days: d }))}>{d}d</button>
              ))}
            </div>
          </div>
          <button className="btn btn-ghost" onClick={() => setPlan({ done: [], days: plan.days, start: todayKey() })}>
            <Icon name="rotate" size={18} /> Start a new plan
          </button>
        </div>
      </section>

      <div className="khatm-grid">
        {surahs && surahs.map((s) => {
          const on = plan.done.includes(s.number);
          return (
            <div key={s.number} className={on ? 'khatm-item is-on' : 'khatm-item'}>
              <button className="khatm-check" onClick={() => toggle(s.number)} aria-pressed={on} aria-label={`Mark ${s.englishName} as ${on ? 'not read' : 'read'}`}>
                {on ? <Icon name="check" size={18} /> : <StarBadge n={s.number} size={30} />}
              </button>
              <a href={`#/surah/${s.number}`}>
                <strong>{s.englishName}</strong>
                <span>{s.numberOfAyahs} verses</span>
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
}

const UNITS = {
  ruku: { label: 'Ruku', total: 556, one: 'ruku', many: 'rukus' },
  juz: { label: 'Juz (Para)', total: 30, one: 'juz', many: 'juz' },
  page: { label: 'Page', total: 604, one: 'page', many: 'pages' },
};

// A plan counted in rukus, juz or pages (not verses): "Today: ruku 12 to 17".
function UnitPlanner({ unit }) {
  const info = UNITS[unit];
  const [plans, setPlans] = useLocalStorage('amal:khatm-units', {});
  const plan = { days: 30, start: todayKey(), done: 0, ...(plans[unit] || {}) };
  const save = (patch) => setPlans((p) => ({ ...p, [unit]: { days: 30, start: todayKey(), done: 0, ...(p[unit] || {}), ...patch } }));
  const elapsed = Math.max(0, Math.floor((new Date(todayKey()) - new Date(plan.start)) / 86400000));
  const daysLeft = Math.max(1, plan.days - elapsed);
  const remaining = info.total - plan.done;
  const perDay = Math.max(1, Math.ceil(remaining / daysLeft));
  const from = Math.min(info.total, plan.done + 1);
  const to = Math.min(info.total, plan.done + perDay);
  const pct = Math.round((plan.done / info.total) * 100);
  const finished = plan.done >= info.total;
  const open = unit === 'ruku' ? `#/ruku/${from}-${to}` : unit === 'page' ? `#/page/${from}` : `#/page/${JUZ_START[from - 1]}`;
  const range = from === to ? `${info.one} ${from}` : `${info.many} ${from} to ${to}`;
  return (
    <section className="khatm-card">
      <svg viewBox="0 0 140 140" className="khatm-ring" role="img" aria-label={`${pct} percent complete`}>
        <circle className="ring-track" cx="70" cy="70" r={R} />
        <circle className="ring-fill" cx="70" cy="70" r={R} strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} transform="rotate(-90 70 70)" />
        <text x="70" y="78" textAnchor="middle" className="khatm-pct">{pct}%</text>
      </svg>
      <div className="khatm-info">
        {finished ? (
          <><h2>Khatm complete</h2><p>Alhamdulillah. You have finished the whole Quran.</p></>
        ) : (
          <>
            <h2>Today: {range}</h2>
            <p>{plan.done} of {info.total} {info.many} done, {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left. About {perDay} {perDay === 1 ? info.one : info.many} a day.</p>
          </>
        )}
        <div className="plan-row">
          <span>Finish in</span>
          <div className="seg" role="group" aria-label="Plan length in days">
            {PLAN_DAYS.map((d) => (
              <button key={d} className={plan.days === d ? 'is-on' : ''} aria-pressed={plan.days === d} onClick={() => save({ days: d })}>{d}d</button>
            ))}
          </div>
        </div>
        {!finished && (
          <div className="form-actions">
            <a className="btn btn-primary" href={open}><Icon name="book-open" size={18} /> Open today's reading</a>
            <button className="btn btn-ghost" onClick={() => save({ done: to })}><Icon name="check" size={18} /> I finished it</button>
          </div>
        )}
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={() => save({ done: Math.max(0, plan.done - 1) })} aria-label={`One ${info.one} back`}>−1 {info.one}</button>
          <button className="btn btn-ghost" onClick={() => save({ done: Math.min(info.total, plan.done + 1) })} aria-label={`One ${info.one} forward`}>+1 {info.one}</button>
          <button className="btn btn-ghost" onClick={() => save({ done: 0, start: todayKey() })}><Icon name="rotate" size={18} /> New plan</button>
        </div>
      </div>
    </section>
  );
}

export default function Khatm() {
  const [mode, setMode] = useLocalStorage('amal:khatm-mode', 'ruku');
  return (
    <>
      <PageHeader icon="target" hue={120} title="Khatm planner" subtitle="Plan to complete the Quran by ruku, juz, page or surah." />
      <div className="seg lang-seg" role="tablist" aria-label="Plan by">
        {[['ruku', 'Ruku'], ['juz', 'Juz'], ['page', 'Page'], ['surah', 'Surah']].map(([id, label]) => (
          <button key={id} role="tab" aria-selected={mode === id} className={mode === id ? 'is-on' : ''} onClick={() => setMode(id)}>{label}</button>
        ))}
      </div>
      {mode === 'surah' ? <SurahPlanner /> : <UnitPlanner key={mode} unit={mode} />}
    </>
  );
}
