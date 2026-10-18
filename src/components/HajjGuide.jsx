import { useState } from 'react';
import { HAJJ_CHECKLIST, HAJJ_DAYS, HAJJ_DUAS, HAJJ_TYPES, IHRAM_RULES, UMRAH_STEPS } from '../data/hajj.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { fmtLong, today } from '../trip.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';
import Scene, { HajjRoute } from './Scenes.jsx';
import TextBlock from './TextBlock.jsx';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'umrah', label: 'Umrah' },
  { id: 'hajj', label: 'Hajj days' },
  { id: 'duas', label: 'Duas' },
  { id: 'checklist', label: 'Checklist' },
];

function StepCard({ step, index, label, done, onToggle }) {
  return (
    <article className={done ? 'step is-done' : 'step'}>
      <Scene kind={step.scene} />
      <div className="step-body">
        <div className="step-top">
          <span className="step-n">{index}</span>
          <div>
            <h2>{step.title || step.name}</h2>
            {label && <p className="step-label">{label}</p>}
          </div>
        </div>
        <ul className="bullets">
          {step.points.map((pt) => <li key={pt}>{pt}</li>)}
        </ul>
        <button className={done ? 'btn btn-primary' : 'btn btn-ghost'} onClick={onToggle} aria-pressed={done}>
          <Icon name={done ? 'check-circle' : 'check'} size={18} /> {done ? 'Done' : 'Mark as done'}
        </button>
      </div>
    </article>
  );
}

export default function HajjGuide({ settings }) {
  const [tab, setTab] = useState('overview');
  const [state, setState] = useLocalStorage('noor:hajj', { done: {}, list: {} });
  const toggle = (key) => setState((s) => ({ ...s, done: { ...s.done, [key]: !s.done[key] } }));
  const toggleItem = (i) =>
    setState((s) => {
      const list = { ...s.list, [i]: !s.list[i] };
      const all = HAJJ_CHECKLIST.every((_, k) => list[k]);
      return { ...s, list, readyOn: all ? s.readyOn || today() : null };
    });
  const resetList = () => setState((s) => ({ ...s, list: {}, readyOn: null }));

  const umrahDone = UMRAH_STEPS.filter((s) => state.done[`u-${s.id}`]).length;
  const hajjDone = HAJJ_DAYS.filter((s) => state.done[`h-${s.id}`]).length;
  const listDone = HAJJ_CHECKLIST.filter((_, i) => state.list[i]).length;

  return (
    <>
      <PageHeader icon="mosque" hue={42} title="Hajj and Umrah guide" subtitle="Step by step, with pictures, duas and a checklist." />

      <div className="tabs" role="tablist" aria-label="Guide sections">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'tab is-on' : 'tab'} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <p className="note">
            This guide gives the common steps in simple words. Rules can differ a little between schools of thought and
            between groups, so always follow your scholar or Hajj guide for your own situation.
          </p>
          <section className="card">
            <h2>The route of Hajj</h2>
            <HajjRoute />
            <p className="hint">Makkah, Mina, Arafah, Muzdalifah, and back to Mina and Makkah, from the 8th to the 13th of Dhul Hijjah.</p>
          </section>

          <div className="section-head"><h2>Three types of Hajj</h2></div>
          <div className="types">
            {HAJJ_TYPES.map((t) => (
              <div key={t.id} className="type-card">
                <strong>{t.name}</strong>
                <span>{t.text}</span>
              </div>
            ))}
          </div>

          <div className="section-head"><h2>Umrah and Hajj at a glance</h2></div>
          <div className="glance">
            <button className="glance-card" onClick={() => setTab('umrah')}>
              <Scene kind="kaaba" />
              <strong>Umrah</strong>
              <span>Ihram, Tawaf, Sa'i, trimming the hair. {umrahDone}/{UMRAH_STEPS.length} done</span>
            </button>
            <button className="glance-card" onClick={() => setTab('hajj')}>
              <Scene kind="arafah" />
              <strong>Hajj days</strong>
              <span>From Mina to Arafah to the Jamarat. {hajjDone}/{HAJJ_DAYS.length} done</span>
            </button>
          </div>

          <div className="section-head"><h2>Rules of ihram</h2></div>
          <section className="card rules">
            <h3>For everyone, while in ihram, avoid</h3>
            <ul className="bullets">{IHRAM_RULES.both.map((r) => <li key={r}>{r}</li>)}</ul>
            <h3>Men also avoid</h3>
            <ul className="bullets">{IHRAM_RULES.men.map((r) => <li key={r}>{r}</li>)}</ul>
            <h3>Women also avoid</h3>
            <ul className="bullets">{IHRAM_RULES.women.map((r) => <li key={r}>{r}</li>)}</ul>
          </section>

          <section className="card">
            <h2>Visiting Madinah</h2>
            <p>Visiting Madinah is not part of Hajj or Umrah, but many pilgrims go to pray in Masjid an-Nabawi and to visit Masjid Quba.</p>
          </section>
        </>
      )}

      {tab === 'umrah' && (
        <>
          <div className="page-progress"><span className="bar" aria-hidden="true"><span style={{ width: `${(umrahDone / UMRAH_STEPS.length) * 100}%` }} /></span><span>{umrahDone} of {UMRAH_STEPS.length} steps</span></div>
          {UMRAH_STEPS.map((s, i) => <StepCard key={s.id} step={s} index={i + 1} done={!!state.done[`u-${s.id}`]} onToggle={() => toggle(`u-${s.id}`)} />)}
        </>
      )}

      {tab === 'hajj' && (
        <>
          <div className="page-progress"><span className="bar" aria-hidden="true"><span style={{ width: `${(hajjDone / HAJJ_DAYS.length) * 100}%` }} /></span><span>{hajjDone} of {HAJJ_DAYS.length} stages</span></div>
          {HAJJ_DAYS.map((s, i) => <StepCard key={s.id} step={s} index={i + 1} label={s.day} done={!!state.done[`h-${s.id}`]} onToggle={() => toggle(`h-${s.id}`)} />)}
        </>
      )}

      {tab === 'duas' && (
        <>
          <p className="note">Tawaf and most other acts of worship have no required dua. You may speak to Allah in your own words, in any language.</p>
          {HAJJ_DUAS.map((d) => (
            <article key={d.id} className="dhikr">
              <div className="dhikr-top"><h2>{d.title}</h2></div>
              <TextBlock item={d} settings={settings} />
            </article>
          ))}
        </>
      )}

      {tab === 'checklist' && (
        <>
          <div className="page-progress"><span className="bar" aria-hidden="true"><span style={{ width: `${(listDone / HAJJ_CHECKLIST.length) * 100}%` }} /></span><span>{listDone} of {HAJJ_CHECKLIST.length} ready</span></div>
          {listDone === HAJJ_CHECKLIST.length && (
            <section className="ready-card" role="status">
              <span style={{ fontSize: 44 }} aria-hidden="true">🕋</span>
              <h2>You are ready, Masha Allah!</h2>
              <p>Checklist completed{state.readyOn ? ` on ${fmtLong(state.readyOn)}` : ''}. Next, set your dates and Amal will plan every day.</p>
              <div className="form-actions" style={{ justifyContent: 'center' }}>
                <a className="btn" href="#/umrah">Plan my Umrah</a>
                <a className="btn" href="#/hajjplan">Plan my Hajj</a>
                <button className="btn btn-ghost" onClick={resetList}>Reset checklist</button>
              </div>
            </section>
          )}
          <ul className="amal-list">
            {HAJJ_CHECKLIST.map((item, i) => {
              const on = !!state.list[i];
              return (
                <li key={item} className={on ? 'is-on' : ''}>
                  <button className="amal-check" onClick={() => toggleItem(i)} aria-pressed={on}>
                    <span className="amal-box">{on && <Icon name="check" size={16} />}</span>
                    <span>{item}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
