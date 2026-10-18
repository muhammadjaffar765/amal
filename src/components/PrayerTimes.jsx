import { useState } from 'react';
import { CITIES } from '../prayerCalc.js';
import { METHODS, fmt12s, fmtClock, fmtInstant, hijriText } from '../prayer.js';
import { usePrayerTimes } from '../hooks/usePrayerTimes.js';
import Icon from './Icon.jsx';

const ROWS = [
  { key: 'Fajr', label: 'Fajr', icon: 'moon', end: 'Sunrise' },
  { key: 'Dhuhr', label: 'Zuhr', icon: 'sun', end: 'Asr' },
  { key: 'Asr', label: 'Asr', icon: 'sun', end: 'Maghrib' },
  { key: 'Maghrib', label: 'Maghrib', icon: 'sun', end: 'Isha' },
  { key: 'Isha', label: 'Isha', icon: 'moon', end: 'NextFajr' },
];

// A ring of 60 ticks. The red ticks are the time that is left in the current prayer.
function Ring({ current, next }) {
  const red = current ? Math.ceil(current.fraction * 60) : 0;
  const label = current ? (current.key === 'Dhuhr' ? 'Zuhr' : current.key) : next.key === 'Dhuhr' ? 'Zuhr' : next.key;
  const secs = current ? current.remaining : next.secondsLeft;
  return (
    <div className="pt-ring" role="timer" aria-label={`${label}, ${fmtClock(secs)} left`}>
      <svg viewBox="0 0 200 200" aria-hidden="true">
        {Array.from({ length: 60 }, (_, i) => {
          const a = ((i / 60) * 360 - 90) * (Math.PI / 180);
          const r1 = 84; const r2 = 96;
          return <line key={i} x1={100 + r1 * Math.cos(a)} y1={100 + r1 * Math.sin(a)} x2={100 + r2 * Math.cos(a)} y2={100 + r2 * Math.sin(a)} className={i < red ? 'tick on' : 'tick'} />;
        })}
      </svg>
      <div className="pt-ring-text">
        <span className={current ? 'pt-ring-name' : 'pt-ring-name soft'}>{current ? label : `${label} in`}</span>
        <strong>{fmtClock(secs)}</strong>
        <small>{current ? 'left' : 'to go'}</small>
      </div>
    </div>
  );
}

export default function PrayerTimes({ settings, onUpdate }) {
  const p = usePrayerTimes(settings);
  const [tab, setTab] = useState('fard');
  const [geoError, setGeoError] = useState('');
  const [place, setPlace] = useState(`${settings.city}`);
  const d = p.data;
  const tz = d.meta.timezone;
  const gmt = d.meta.gmt;
  const t = (k) => (k === 'NextFajr' ? d.inst.NextFajr : d.inst[k]);
  const feet = Math.round((d.place.elev || 0) * 3.281);

  const pickCity = (name) => { setPlace(name); onUpdate({ city: name, coords: null, elevation: null }); };
  const locate = () => {
    setGeoError('');
    if (!navigator.geolocation) return setGeoError('This browser cannot share your location.');
    navigator.geolocation.getCurrentPosition(
      (pos) => onUpdate({ coords: { lat: Number(pos.coords.latitude.toFixed(4)), lng: Number(pos.coords.longitude.toFixed(4)), alt: pos.coords.altitude ? Math.round(pos.coords.altitude) : 0 }, elevation: null }),
      () => setGeoError('Location permission was denied. Choose your city instead.'),
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <>
      <section className="pt-hero">
        <Ring current={p.current} next={p.next} />
        <div className="pt-info">
          <p><Icon name="moon" size={18} /> <span>{hijriText(d)}</span></p>
          <p><Icon name="calendar" size={18} /> <span>{new Date(p.now).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', timeZone: tz })}</span></p>
          <p><Icon name="sun" size={18} /> <span>GMT: {gmt > 0 ? '+' : ''}{gmt}, Height: {feet} feet</span></p>
          <p><Icon name="pin" size={18} /> <span>{d.place.name}</span></p>
        </div>
      </section>

      <div className="seg pt-tabs" role="tablist" aria-label="Times">
        <button role="tab" aria-selected={tab === 'fard'} className={tab === 'fard' ? 'is-on' : ''} onClick={() => setTab('fard')}>Fard times</button>
        <button role="tab" aria-selected={tab === 'other'} className={tab === 'other' ? 'is-on' : ''} onClick={() => setTab('other')}>Other times</button>
      </div>

      {tab === 'fard' && (
        <ul className="pt-list">
          {ROWS.map((r) => {
            const active = p.current && p.current.key === r.key;
            const isNext = !p.current && p.next.key === r.key && !p.next.tomorrow;
            return (
              <li key={r.key} className={`${active ? 'is-now' : ''}${isNext ? ' is-next' : ''}`}>
                <span className="pt-name"><Icon name={r.icon} size={20} />
                  <span>{r.label}{r.key === 'Asr' ? <small className="pt-sub"> {settings.school === 0 ? 'Standard' : 'Hanafi'}</small> : null}</span>
                </span>
                <span className="pt-times">
                  <strong>{fmtInstant(t(r.key), tz)}</strong>
                  <small>until {fmtInstant(t(r.end), tz)}{r.end === 'NextFajr' ? ' (next Fajr)' : r.end === 'Sunrise' ? ' (sunrise)' : ''}</small>
                  {active && <small className="pt-left">{fmtClock(p.current.remaining)} left</small>}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {tab === 'other' && (
        <ul className="pt-list">
          {[
            ['Sunrise', 'sunrise', 'sun', 'The sun comes up. Fajr is over.'],
            ['Ishraq', 'ishraq', 'sun', 'Starts 20 minutes after sunrise.'],
            ['Zawal', 'zawal', 'sun', 'The sun is at its highest. No prayer from here until Zuhr (about 6 minutes).'],
            ['Sunset', 'sunset', 'sun', 'The sun goes down. Maghrib begins.'],
            ['Midnight', 'midnight', 'moon', 'Half way between sunset and the next Fajr.'],
            ['LastThird', 'last third of the night', 'moon', 'The last third of the night begins. A blessed time for Tahajjud.'],
          ].map(([k, label, icon, note]) => (
            <li key={k}>
              <span className="pt-name"><Icon name={icon} size={20} /><span style={{ textTransform: 'capitalize' }}>{label}</span></span>
              <span className="pt-times"><strong>{fmtInstant(d.extra[k], tz)}</strong><small>{note}</small></span>
            </li>
          ))}
        </ul>
      )}

      <section className="card form">
        <h2>Place and method</h2>
        <label className="field">City
          <select value={settings.coords ? '' : place} onChange={(e) => pickCity(e.target.value)}>
            {settings.coords && <option value="">Your location</option>}
            {CITIES.map((c) => <option key={c[0]} value={c[0]}>{c[0]}, {c[1]}</option>)}
          </select>
        </label>
        <div className="form-actions">
          <button className="btn btn-ghost" type="button" onClick={locate}><Icon name="pin" size={18} /> Use my exact location</button>
        </div>
        {geoError && <p className="tafsir-note">{geoError}</p>}
        <div className="form-row">
          <label className="field">Calculation method
            <select value={settings.method} onChange={(e) => onUpdate({ method: Number(e.target.value) })}>
              {METHODS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </label>
          <label className="field">Asr time
            <select value={settings.school} onChange={(e) => onUpdate({ school: Number(e.target.value) })}>
              <option value={1}>Hanafi (later Asr)</option>
              <option value={0}>Shafi, Maliki, Hanbali</option>
            </select>
          </label>
        </div>
        <label className="field">Height above sea level (metres)
          <input inputMode="numeric" value={settings.elevation == null ? '' : settings.elevation} placeholder={`${d.place.elev} (default for this place)`}
            onChange={(e) => { const v = e.target.value.replace(/[^\d-]/g, ''); onUpdate({ elevation: v === '' ? null : Number(v) }); }} />
        </label>
        <p className="hint">
          Times are worked out on your phone from the position of the sun, so they include seconds and work without internet. For Karachi on
          12 October 2026 they matched the app you showed within about 10 seconds. A different height, or the 15 or 20 minute rules some masjids
          add, can move a time by a minute or two. Follow your local masjid for fasting and Eid.
        </p>
      </section>
    </>
  );
}
