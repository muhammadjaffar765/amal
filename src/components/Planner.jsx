import { useMemo, useState } from 'react';
import { HAJJ_PACK, HAJJ_STAGES, UMRAH_PACK, UMRAH_STEPS_SHORT } from '../data/planner.js';
import { MONTHS, nextOccurrence } from '../hijri.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { addDays, daysBetween, fmtDate, fmtLong, plural, today } from '../trip.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';
import TawafCounter from './TawafCounter.jsx';

export const TRIP_KEY = 'amal:trip';
const EMPTY = { umrah: null, hajj: null };

export function useTrip() {
  const [raw, setRaw] = useLocalStorage(TRIP_KEY, EMPTY);
  const trip = { ...EMPTY, ...raw };
  const patch = (kind, change) => setRaw((s) => ({ ...EMPTY, ...s, [kind]: { ...((s || {})[kind] || {}), ...change } }));
  const clear = (kind) => setRaw((s) => ({ ...EMPTY, ...s, [kind]: null }));
  return { trip, patch, clear };
}

// ---------- shared pieces ----------
function Hero({ icon, tone, big, line, sub }) {
  return (
    <section className={`trip-hero tone-${tone}`}>
      <span className="trip-icon"><Icon name={icon} size={30} /></span>
      <div>
        <p className="trip-big">{big}</p>
        <p>{line}</p>
        {sub && <p className="trip-sub">{sub}</p>}
      </div>
    </section>
  );
}

function PackList({ groups, done, onToggle }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const count = Object.values(done || {}).filter(Boolean).length;
  return (
    <section className="card">
      <div className="pack-head"><h2>Packing list</h2><span className="tag">{count}/{total}</span></div>
      <div className="bar" aria-hidden="true"><span style={{ width: `${(count / total) * 100}%` }} /></div>
      {groups.map((g) => (
        <div key={g.group} className="pack-group">
          <h3>{g.group}</h3>
          <ul className="amal-list">
            {g.items.map((item) => {
              const id = `${g.group}:${item}`;
              const on = !!(done && done[id]);
              return (
                <li key={id} className={on ? 'is-on' : ''}>
                  <button className="amal-check" onClick={() => onToggle(id)} aria-pressed={on}>
                    <span className="amal-box">{on && <Icon name="check" size={16} />}</span>
                    <span>{item}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}

function InfoCard({ data, onChange, fields }) {
  return (
    <section className="card form">
      <h2>Trip details</h2>
      <div className="form-row">
        {fields.map(([id, label, ph]) => (
          <label key={id} className="field">{label}
            <input value={(data.info && data.info[id]) || ''} placeholder={ph} onChange={(e) => onChange({ info: { ...(data.info || {}), [id]: e.target.value } })} />
          </label>
        ))}
      </div>
      <p className="hint">Saved on this device only.</p>
    </section>
  );
}

function Notes({ value, onChange }) {
  return (
    <section className="card form">
      <h2>My trip diary</h2>
      <label className="field">
        <span className="sr-only">Notes</span>
        <textarea rows={5} value={value || ''} placeholder="Duas you want to make, people to remember, things you saw and felt…" onChange={(e) => onChange(e.target.value)} />
      </label>
    </section>
  );
}

function Actions({ hasTrip, onEdit, onResetChecks, onNew }) {
  if (!hasTrip) return null;
  return (
    <div className="form-actions trip-actions">
      <button className="btn btn-ghost" onClick={onEdit}><Icon name="edit" size={16} /> Change dates</button>
      <button className="btn btn-ghost" onClick={() => { if (window.confirm('Clear all ticks (packing, schedule) but keep the dates?')) onResetChecks(); }}><Icon name="rotate" size={16} /> Reset ticks</button>
      <button className="btn btn-ghost" onClick={() => { if (window.confirm('Delete this trip and start again?')) onNew(); }}><Icon name="trash" size={16} /> Start a new trip</button>
    </div>
  );
}

// ======================= UMRAH =======================
function buildUmrahDays(t) {
  const total = Math.max(1, daysBetween(t.depart, t.ret) + 1);
  const makkahDays = Math.min(total, Math.max(0, Number(t.makkahDays ?? Math.ceil(total * 0.6))));
  const first = t.first === 'madinah' ? 'madinah' : 'makkah';
  const second = first === 'makkah' ? 'madinah' : 'makkah';
  const counts = { makkah: makkahDays, madinah: total - makkahDays };
  const days = [];
  for (let i = 0; i < total; i += 1) {
    const place = i < counts[first] ? first : second;
    days.push({ date: addDays(t.depart, i), place, n: i + 1 });
  }
  // plan for each day
  days.forEach((d, i) => {
    const prev = days[i - 1];
    const isFirstInPlace = !prev || prev.place !== d.place;
    const lastInPlace = !days[i + 1] || days[i + 1].place !== d.place;
    const tasks = [];
    if (d.place === 'makkah') {
      if (isFirstInPlace) tasks.push('Arrive in Makkah. If you are doing Umrah, wear ihram before the miqat', ...UMRAH_STEPS_SHORT.slice(1));
      else tasks.push('Pray the five prayers in the Haram', 'Nafl tawaf if you can', 'Drink Zamzam and recite Quran');
      if (!isFirstInPlace && i % 2 === 0) tasks.push('Optional visits (for example Jabal al-Noor or Jabal Thawr)');
      if (lastInPlace && i !== days.length - 1 && first === 'makkah') tasks.push('Farewell tawaf before you leave Makkah');
      if (lastInPlace && i === days.length - 1) tasks.push('Farewell tawaf before you leave Makkah');
    } else {
      if (isFirstInPlace) tasks.push('Arrive in Madinah and settle in', 'Visit Masjid an-Nabawi and send salawat and salam');
      else tasks.push('Pray the five prayers in Masjid an-Nabawi', 'Recite Quran and make dhikr');
      if (!isFirstInPlace && !lastInPlace) tasks.push('Visit Quba Mosque and pray two rakat', 'Visit Uhud and Baqi if you can');
    }
    if (i === days.length - 1) tasks.push('Pack, settle any bills, and travel home safely');
    d.tasks = tasks.map((text, k) => ({ id: `${d.date}:${k}`, text }));
  });
  return days;
}

export function UmrahPlanner({ settings }) {
  const { trip, patch, clear } = useTrip();
  const t = trip.umrah;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ depart: '', ret: '', first: 'makkah', makkahDays: '' });
  const now = today();
  const days = useMemo(() => (t && t.depart && t.ret ? buildUmrahDays(t) : []), [t]);
  const set = (change) => patch('umrah', change);

  const startEdit = () => {
    setForm({ depart: (t && t.depart) || '', ret: (t && t.ret) || '', first: (t && t.first) || 'makkah', makkahDays: t && t.makkahDays != null ? String(t.makkahDays) : '' });
    setEditing(true);
  };
  const validForm = form.depart && form.ret && daysBetween(form.depart, form.ret) >= 0;
  const save = (e) => {
    e.preventDefault();
    if (!validForm) return;
    set({ depart: form.depart, ret: form.ret, first: form.first, makkahDays: form.makkahDays === '' ? undefined : Number(form.makkahDays) });
    setEditing(false);
  };

  if (!t || !t.depart || editing) {
    const total = validForm ? daysBetween(form.depart, form.ret) + 1 : 0;
    return (
      <>
        <PageHeader icon="mosque" hue={42} title="Umrah planner" subtitle="Set your dates and Amal builds your day-by-day plan." />
        <form className="card form" onSubmit={save}>
          <h2>{t && t.depart ? 'Change your dates' : 'When are you going?'}</h2>
          <div className="form-row">
            <label className="field">Leaving on<input type="date" value={form.depart} onChange={(e) => setForm({ ...form, depart: e.target.value })} required /></label>
            <label className="field">Coming back on<input type="date" min={form.depart || undefined} value={form.ret} onChange={(e) => setForm({ ...form, ret: e.target.value })} required /></label>
          </div>
          <div className="form-row">
            <label className="field">First stop
              <select value={form.first} onChange={(e) => setForm({ ...form, first: e.target.value })}>
                <option value="makkah">Makkah first</option>
                <option value="madinah">Madinah first</option>
              </select>
            </label>
            <label className="field">Days in Makkah (optional)
              <input type="number" min="0" max={total || undefined} value={form.makkahDays} onChange={(e) => setForm({ ...form, makkahDays: e.target.value })} placeholder="automatic" />
            </label>
          </div>
          {total > 0 && <p className="hint">That is {plural(total, 'day')} in total.</p>}
          {form.depart && form.ret && !validForm && <p className="tafsir-note">The return date must be after the leaving date.</p>}
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={!validForm}>Save my plan</button>
            {editing && <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)}>Cancel</button>}
          </div>
        </form>
        <p className="note">Not sure about the steps? Open the <a href="#/hajj">Hajj and Umrah guide</a> and its checklist first. The counter below helps during Tawaf and Sa'i.</p>
        <TawafCounter settings={settings} />
      </>
    );
  }

  const total = days.length;
  const toGo = daysBetween(now, t.depart);
  const during = now >= t.depart && now <= t.ret;
  const dayIndex = during ? daysBetween(t.depart, now) : -1;
  const today_ = during ? days[dayIndex] : null;
  const after = now > t.ret;
  const doneCount = days.reduce((n, d) => n + d.tasks.filter((x) => t.done && t.done[x.id]).length, 0);
  const allTasks = days.reduce((n, d) => n + d.tasks.length, 0);
  const toggleTask = (id) => set({ done: { ...(t.done || {}), [id]: !(t.done && t.done[id]) } });

  return (
    <>
      <PageHeader icon="mosque" hue={42} title="Umrah planner" subtitle={`${fmtDate(t.depart)} to ${fmtDate(t.ret)} (${plural(total, 'day')})`} />

      {toGo > 0 && <Hero icon="calendar" tone="soon" big={plural(toGo, 'day')} line={`until you leave, on ${fmtLong(t.depart)}`} sub="Finish your packing list and learn the steps." />}
      {during && <Hero icon="pin" tone="live" big={`Day ${dayIndex + 1} of ${total}`} line={`You are in ${today_.place === 'makkah' ? 'Makkah' : 'Madinah'} today`} sub="Your plan for today is below. May Allah accept your Umrah." />}
      {after && <Hero icon="check-circle" tone="done" big="Umrah mubarak" line={`You returned ${plural(daysBetween(t.ret, now), 'day')} ago`} sub="May Allah accept it from you. Keep acting on what you learned." />}

      {during && (
        <section className="card today-card">
          <h2>Today, {fmtDate(now)}</h2>
          <ul className="amal-list">
            {today_.tasks.map((x) => {
              const on = !!(t.done && t.done[x.id]);
              return (
                <li key={x.id} className={on ? 'is-on' : ''}>
                  <button className="amal-check" onClick={() => toggleTask(x.id)} aria-pressed={on}><span className="amal-box">{on && <Icon name="check" size={16} />}</span><span>{x.text}</span></button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="section-head"><h2>Tawaf and Sa'i counter</h2></div>
      <TawafCounter settings={settings} />

      <PackList groups={UMRAH_PACK} done={t.pack} onToggle={(id) => set({ pack: { ...(t.pack || {}), [id]: !(t.pack && t.pack[id]) } })} />

      <div className="section-head"><h2>Day by day</h2><span className="tag">{doneCount}/{allTasks} done</span></div>
      <ol className="days">
        {days.map((d) => (
          <li key={d.date} className={`day${d.date === now ? ' is-today' : ''}${d.date < now ? ' is-past' : ''}`}>
            <div className="day-head">
              <span className="day-n">{d.n}</span>
              <span><strong>{fmtDate(d.date)}</strong><small>{d.place === 'makkah' ? 'Makkah' : 'Madinah'}</small></span>
            </div>
            <ul className="amal-list">
              {d.tasks.map((x) => {
                const on = !!(t.done && t.done[x.id]);
                return (
                  <li key={x.id} className={on ? 'is-on' : ''}>
                    <button className="amal-check" onClick={() => toggleTask(x.id)} aria-pressed={on}><span className="amal-box">{on && <Icon name="check" size={16} />}</span><span>{x.text}</span></button>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      <InfoCard data={t} onChange={set} fields={[['flight', 'Flight number', 'PK 000'], ['hotelM', 'Hotel in Makkah', 'Name and room'], ['hotelD', 'Hotel in Madinah', 'Name and room'], ['leader', 'Group leader phone', '+92 …'], ['emergency', 'Emergency contact at home', 'Name and phone']]} />
      <Notes value={t.notes} onChange={(v) => set({ notes: v })} />
      <Actions hasTrip onEdit={startEdit} onResetChecks={() => set({ done: {}, pack: {} })} onNew={() => clear('umrah')} />
    </>
  );
}

// ======================= HAJJ =======================
function hajjDates(offset) {
  const from = addDays(today(), -6);
  const next = nextOccurrence({ m: 12, d: 8 }, toDateSafe(from), offset);
  if (!next) return null;
  const y = `${next.date.getFullYear()}-${String(next.date.getMonth() + 1).padStart(2, '0')}-${String(next.date.getDate()).padStart(2, '0')}`;
  return { start: y, year: next.hijriYear };
}
const toDateSafe = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d, 12);
};

export function HajjPlanner({ settings }) {
  const { trip, patch, clear } = useTrip();
  const t = trip.hajj;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ arrive: '', depart: '', type: 'tamattu' });
  const now = today();
  const offset = settings.hijriOffset || 0;
  const hd = useMemo(() => hajjDates(offset), [offset]);
  const set = (change) => patch('hajj', change);

  if (!hd) return <div className="empty-card"><p>Hajj dates could not be worked out on this device.</p></div>;
  const dateOf = (stage) => (stage.day !== undefined ? addDays(hd.start, stage.day) : null);
  const arafah = addDays(hd.start, 1);
  const end13 = addDays(hd.start, 5);

  const startEdit = () => {
    setForm({ arrive: (t && t.arrive) || '', depart: (t && t.depart) || '', type: (t && t.type) || 'tamattu' });
    setEditing(true);
  };
  const validForm = form.arrive && form.depart && daysBetween(form.arrive, form.depart) >= 7;
  const save = (e) => {
    e.preventDefault();
    if (!validForm) return;
    set({ arrive: form.arrive, depart: form.depart, type: form.type });
    setEditing(false);
  };

  const intro = (
    <section className="card hajj-dates">
      <h2>Hajj {hd.year} AH</h2>
      <ul className="date-list">
        <li><span>8 Dhul Hijjah, Tarwiyah</span><strong>{fmtLong(hd.start)}</strong></li>
        <li><span>9 Dhul Hijjah, Arafah</span><strong>{fmtLong(arafah)}</strong></li>
        <li><span>10 Dhul Hijjah, Eid al-Adha</span><strong>{fmtLong(addDays(hd.start, 2))}</strong></li>
        <li><span>11 to 13 Dhul Hijjah</span><strong>{fmtDate(addDays(hd.start, 3))} to {fmtDate(end13)}</strong></li>
      </ul>
      <p className="hint">These follow the Umm al-Qura calendar (Saudi). The Hajj days are fixed by the Saudi moon sighting, so they can move by a day. Your group will confirm them.</p>
    </section>
  );

  if (!t || !t.arrive || editing) {
    return (
      <>
        <PageHeader icon="mosque" hue={42} title="Hajj planner" subtitle="Your dates, your days, and a clear timeline." />
        {intro}
        <form className="card form" onSubmit={save}>
          <h2>{t && t.arrive ? 'Change your trip' : 'Your trip'}</h2>
          <div className="form-row">
            <label className="field">Arriving on<input type="date" value={form.arrive} onChange={(e) => setForm({ ...form, arrive: e.target.value })} required /></label>
            <label className="field">Returning on<input type="date" min={form.arrive || undefined} value={form.depart} onChange={(e) => setForm({ ...form, depart: e.target.value })} required /></label>
          </div>
          <label className="field">Type of Hajj
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="tamattu">Tamattu (Umrah first, then Hajj)</option>
              <option value="qiran">Qiran (Umrah and Hajj together)</option>
              <option value="ifrad">Ifrad (Hajj only)</option>
            </select>
          </label>
          {validForm && <p className="hint">{plural(daysBetween(form.arrive, form.depart) + 1, 'day')} in total.</p>}
          {form.arrive && form.depart && !validForm && <p className="tafsir-note">Hajj takes at least a week. Check your dates.</p>}
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={!validForm}>Save my plan</button>
            {editing && <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)}>Cancel</button>}
          </div>
        </form>
      </>
    );
  }

  const type = t.type || 'tamattu';
  const stages = HAJJ_STAGES.filter((s) => (s.tamattu ? type === 'tamattu' : true)).map((s) => {
    let date = dateOf(s);
    if (s.id === 'arrive') date = t.arrive;
    if (s.id === 'umrah') date = addDays(hd.start, -1) < t.arrive ? t.arrive : addDays(t.arrive, Math.max(0, Math.min(1, daysBetween(t.arrive, hd.start) - 1)));
    if (s.id === 'wada') date = addDays(end13, 0);
    if (s.id === 'depart') date = t.depart;
    return { ...s, date };
  });
  const toGo = daysBetween(now, hd.start);
  const during = now >= hd.start && now <= end13;
  const after = now > end13;
  const current = during ? stages.find((s) => s.date === now && s.id.startsWith('d')) : null;
  const before = Math.max(0, daysBetween(t.arrive, hd.start));
  const afterDays = Math.max(0, daysBetween(end13, t.depart));
  const total = daysBetween(t.arrive, t.depart) + 1;
  const doneCount = stages.filter((s) => t.done && t.done[s.id]).length;
  const toggle = (id) => set({ done: { ...(t.done || {}), [id]: !(t.done && t.done[id]) } });
  const arrivesLate = t.arrive > hd.start;

  return (
    <>
      <PageHeader icon="mosque" hue={42} title="Hajj planner" subtitle={`${fmtDate(t.arrive)} to ${fmtDate(t.depart)} (${plural(total, 'day')})`} />
      {toGo > 0 && <Hero icon="calendar" tone="soon" big={plural(toGo, 'day')} line={`until Hajj begins on ${fmtLong(hd.start)}`} sub={`You arrive ${plural(before, 'day')} before the 8th and stay ${plural(afterDays, 'day')} after the 13th.`} />}
      {during && <Hero icon="pin" tone="live" big={current ? current.title : `Day ${daysBetween(hd.start, now) + 1} of Hajj`} line={current ? current.note : 'May Allah accept your Hajj.'} />}
      {after && <Hero icon="check-circle" tone="done" big="Hajj mabrur" line="May Allah accept your Hajj and forgive you." sub="Keep acting on what you learned." />}
      {arrivesLate && <p className="notice-inline">Your arrival date is after the 8th of Dhul Hijjah. Please check your dates with your group.</p>}
      {intro}

      <div className="section-head"><h2>Your timeline</h2><span className="tag">{doneCount}/{stages.length} done</span></div>
      <ol className="days timeline">
        {stages.map((s) => {
          const on = !!(t.done && t.done[s.id]);
          return (
            <li key={s.id} className={`day${s.date === now ? ' is-today' : ''}${s.date && s.date < now ? ' is-past' : ''}${s.optional ? ' is-optional' : ''}`}>
              <button className="stage" onClick={() => toggle(s.id)} aria-pressed={on}>
                <span className={on ? 'amal-box on' : 'amal-box'}>{on && <Icon name="check" size={16} />}</span>
                <span className="stage-body">
                  <strong>{s.title}</strong>
                  <small>{s.date ? fmtDate(s.date) : ''}{s.optional ? ' (optional)' : ''}</small>
                  <span>{s.note}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <section className="card">
        <h2>Your Hajj type: {type === 'tamattu' ? 'Tamattu' : type === 'qiran' ? 'Qiran' : 'Ifrad'}</h2>
        <p className="hint">{type === 'ifrad' ? 'Ifrad does not need a sacrifice.' : 'Tamattu and Qiran need a sacrifice (qurbani). Arrange it through your group.'} See the <a href="#/hajj">full guide</a> for each step and dua.</p>
      </section>

      <div className="section-head"><h2>Tawaf and Sa'i counter</h2></div>
      <TawafCounter settings={settings} />
      <PackList groups={HAJJ_PACK} done={t.pack} onToggle={(id) => set({ pack: { ...(t.pack || {}), [id]: !(t.pack && t.pack[id]) } })} />
      <InfoCard data={t} onChange={set} fields={[['flight', 'Flight number', 'PK 000'], ['hotel', 'Hotel and room', 'Name and room'], ['tent', 'Mina tent number', ''], ['leader', 'Group leader phone', '+92 …'], ['emergency', 'Emergency contact at home', 'Name and phone']]} />
      <Notes value={t.notes} onChange={(v) => set({ notes: v })} />
      <Actions hasTrip onEdit={startEdit} onResetChecks={() => set({ done: {}, pack: {} })} onNew={() => clear('hajj')} />
    </>
  );
}
