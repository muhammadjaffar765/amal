import { useMemo, useState } from 'react';
import { KEY_DATES, MONTHS, SUNNAH_FASTS, hijriOf, monthLength, monthStart, nextMonthStart, nextOccurrence, prevMonthStart } from '../hijri.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';

const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export default function IslamicCalendar({ settings, onUpdate }) {
  const offset = settings.hijriOffset || 0;
  const today = new Date();
  const todayH = hijriOf(today, offset);
  const [start, setStart] = useState(() => monthStart(today, offset));

  // Keep the shown month valid when the offset changes.
  const first = useMemo(() => monthStart(start, offset), [start, offset]);
  const length = monthLength(first, offset);
  const shown = hijriOf(first, offset);
  const lead = first.getDay();

  const cells = [];
  for (let i = 0; i < lead; i += 1) cells.push(null);
  for (let d = 0; d < length; d += 1) {
    const g = new Date(first.getFullYear(), first.getMonth(), first.getDate() + d, 12);
    cells.push({ day: d + 1, g });
  }

  const upcoming = useMemo(
    () => KEY_DATES.map((ev) => ({ ev, next: nextOccurrence(ev, today, offset) })).filter((x) => x.next).sort((a, b) => a.next.days - b.next.days),
    [offset] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const fmtG = (d) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      <PageHeader icon="calendar" hue={280} title="Islamic calendar" subtitle="Hijri dates, key days and Sunnah fasts.">
        <div className="cal-today">
          <strong>{todayH.d} {MONTHS[todayH.m - 1][0]} {todayH.y} AH</strong>
          <span lang="ar" dir="rtl">{todayH.d} {MONTHS[todayH.m - 1][1]} {todayH.y}</span>
        </div>
      </PageHeader>

      <section className="card cal">
        <div className="cal-nav">
          <button className="icon-btn" aria-label="Previous month" onClick={() => setStart(prevMonthStart(first, offset))}><Icon name="arrow-left" size={18} /></button>
          <div className="cal-title">
            <strong>{MONTHS[shown.m - 1][0]} {shown.y}</strong>
            <span lang="ar">{MONTHS[shown.m - 1][1]}</span>
          </div>
          <button className="icon-btn" aria-label="Next month" onClick={() => setStart(nextMonthStart(first, offset))}><Icon name="arrow-right" size={18} /></button>
        </div>
        <div className="cal-grid" role="grid" aria-label="Hijri month">
          {WEEK.map((w) => <span key={w} className="cal-head" role="columnheader">{w}</span>)}
          {cells.map((c, i) =>
            c ? (
              <span key={i} role="gridcell" className={`cal-cell${sameDay(c.g, today) ? ' is-today' : ''}${c.g.getDay() === 5 ? ' is-fri' : ''}${[13, 14, 15].includes(c.day) ? ' is-white' : ''}`}>
                <strong>{c.day}</strong>
                <small>{c.g.getDate()}</small>
              </span>
            ) : (
              <span key={i} />
            )
          )}
        </div>
        <p className="hint">Big number: Hijri day. Small number: Gregorian date. The 13th to 15th are the white days (fasting recommended).</p>
        <label className="field cal-offset">
          Moon sighting adjustment
          <select value={offset} onChange={(e) => { const v = Number(e.target.value); onUpdate({ hijriOffset: v }); setStart(monthStart(today, v)); }}>
            <option value={-2}>2 days behind Saudi dates</option>
            <option value={-1}>1 day behind Saudi dates</option>
            <option value={0}>Same as Saudi (Umm al-Qura)</option>
            <option value={1}>1 day ahead</option>
          </select>
        </label>
        <p className="hint">Dates follow the Umm al-Qura calendar. Moon sighting can differ by a day or two in your country, so follow your local announcement for Ramadan and Eid.</p>
      </section>

      <div className="section-head"><h2>Coming up</h2></div>
      <ul className="events">
        {upcoming.map(({ ev, next }) => (
          <li key={ev.name} className="event">
            <span className="event-date"><strong>{next.date.getDate()}</strong><small>{next.date.toLocaleDateString('en-GB', { month: 'short' })}</small></span>
            <span className="event-body">
              <strong>{ev.name}</strong>
              <span>{ev.d} {MONTHS[ev.m - 1][0]}, {fmtG(next.date)}{next.days === 0 ? ' (today)' : next.days === 1 ? ' (tomorrow)' : ` (in ${next.days} days)`}</span>
              {ev.note && <small>{ev.note}</small>}
            </span>
          </li>
        ))}
      </ul>

      <div className="section-head"><h2>Sunnah fasts</h2></div>
      <ul className="bullets card">
        {SUNNAH_FASTS.map((f) => <li key={f}>{f}</li>)}
      </ul>
    </>
  );
}
