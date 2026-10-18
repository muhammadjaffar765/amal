import { useMemo, useRef, useState } from 'react';
import { buzz, useDaily } from '../hooks/useDaily.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import CountButton from './CountButton.jsx';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';

// ---------- helpers ----------
// A part's text is written as pairs: the Arabic line, then its translation on the next line.
// A blank line starts the next pair.
export function parseLines(text) {
  return String(text || '')
    .split(/\n\s*\n/)
    .map((block) => block.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((b) => b.length)
    .map((b) => ({ ar: b[0], tr: b.slice(1).join(' ') }));
}

const newId = (p) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const ALL_DAYS = [1, 2, 3, 4, 5, 6, 7, 8];

// Older saved items had a single `text`. Treat them as one part.
export function partsOf(item) {
  if (item.parts && item.parts.length) return item.parts;
  return [{ id: 'p1', title: item.title, text: item.text || '', days: [] }];
}

const dalailParts = () => [
  { title: 'Opening dua', days: [1, 8] },
  { title: 'Names of Allah', days: [1, 8] },
  { title: 'Names of the Prophet', days: [1, 8] },
  { title: 'Dua of intention', days: ALL_DAYS },
  ...[1, 2, 3, 4, 5, 6, 7].map((n) => ({ title: `Part ${n}`, days: n === 1 ? [1, 8] : [n] })),
  { title: 'Part 8', days: [8] },
  { title: 'Dua of completion', days: [8] },
].map((p) => ({ id: newId('p'), text: '', ...p }));

const SUGGESTIONS = [
  { label: 'Dalail al-Khayrat', preset: 'dalail' },
  { label: 'Hizb al-Bahr', preset: 'hizb' },
  { label: 'Other litany', preset: '' },
];

const SAMPLE = 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ\nO Allah, send prayers upon Muhammad.\n\nوَسَلِّمْ\nAnd grant him peace.';

// Official pages for reading online. Amal links to them instead of copying their text.
const DALAIL = 'https://www.dalailalkhayrat.com';
const DL = {
  opening: { label: 'Opening dua', href: `${DALAIL}/duas.php?dua=opening` },
  allah: { label: 'Names of Allah', href: `${DALAIL}/names.php?names=Allah` },
  prophet: { label: 'Names of the Prophet', href: `${DALAIL}/names.php?names=RasoolSAW` },
  intention: { label: 'Dua of intention', href: `${DALAIL}/duas.php?dua=intention` },
  completion: { label: 'Dua of completion', href: `${DALAIL}/duas.php?dua=completion` },
  ...Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8].map((n) => [`p${n}`, { label: `Part ${n}`, href: `${DALAIL}/parts.php?part=${n}` }])),
};
const DALAIL_PLAN = {
  1: ['opening', 'allah', 'prophet', 'intention', 'p1'],
  2: ['intention', 'p2'], 3: ['intention', 'p3'], 4: ['intention', 'p4'],
  5: ['intention', 'p5'], 6: ['intention', 'p6'], 7: ['intention', 'p7'],
  8: ['p8', 'completion', 'opening', 'allah', 'prophet', 'intention', 'p1'],
};

function OnlineSources() {
  const [day, setDay] = useLocalStorage('noor:dalail-day', 1);
  return (
    <section className="card online">
      <h2>Read inside Noor</h2>
      <div className="form-actions">
        <a className="btn btn-primary" href="#/dalail"><Icon name="scroll" size={18} /> Dalail al-Khayrat</a>
        <a className="btn btn-primary" href="#/hizbulbahr"><Icon name="sparkles" size={18} /> Hizb al-Bahr</a>
        <a className="btn btn-ghost" href="#/texts">All texts</a>
      </div>
      <h2>Or read online</h2>
      <p className="hint">These open the official websites in a new tab, with the Arabic, transliteration and English translation. They need an internet connection.</p>

      <div className="online-block">
        <div className="online-title">
          <strong>Dalail al-Khayrat</strong>
          <span>Read over one week</span>
        </div>
        <div className="chips" role="group" aria-label="Choose the day">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((d) => (
            <button key={d} className={d === day ? 'chip is-on' : 'chip'} aria-pressed={d === day} onClick={() => setDay(d)}>Day {d}</button>
          ))}
        </div>
        <ol className="online-list">
          {DALAIL_PLAN[day].map((k, i) => (
            <li key={`${k}-${i}`}>
              <a href={DL[k].href} target="_blank" rel="noopener noreferrer">
                <span>{DL[k].label}</span>
                <Icon name="external" size={16} />
              </a>
            </li>
          ))}
        </ol>
        <button className="btn btn-ghost" onClick={() => setDay(day >= 8 ? 1 : day + 1)}>
          <Icon name="check-circle" size={18} /> Finish day {day}, go to day {day >= 8 ? 1 : day + 1}
        </button>
      </div>

      <div className="online-block">
        <div className="online-title">
          <strong>Hizb al-Bahr</strong>
          <span>Arabic and translation</span>
        </div>
        <a className="btn btn-ghost" href="https://salawat.com/hizbul-bahr/" target="_blank" rel="noopener noreferrer">
          <Icon name="external" size={18} /> Open Hizb al-Bahr
        </a>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <p className="note">
      Amal does not include the full text of Dalail al-Khayrat, Hizb al-Bahr or similar litanies, so that nothing is
      mistyped or copied without permission. Add the Arabic with its translation line by line from a printed edition or
      a source you have permission to use, and follow your teacher's guidance on how and when to recite it. Everything
      you add is saved on this device only.
    </p>
  );
}

// ---------- list ----------
function List({ items }) {
  return (
    <>
      <PageHeader icon="scroll" hue={18} title="My wird" subtitle="Dalail al-Khayrat, Hizb al-Bahr and your own litanies, line by line with translation." />
      <OnlineSources />
      <Intro />
      <div className="chips" aria-label="Quick add">
        {SUGGESTIONS.map((s) => (
          <a key={s.label} className="chip" href={`#/wird/new?preset=${s.preset}&title=${encodeURIComponent(s.preset ? s.label : '')}`}>
            <Icon name="plus" size={14} /> {s.label}
          </a>
        ))}
      </div>
      {items.length === 0 ? (
        <div className="empty-card">
          <Icon name="scroll" size={28} />
          <p>You have not added a wird yet. Choose one above to set it up.</p>
        </div>
      ) : (
        <ul className="results">
          {items.map((w) => {
            const parts = partsOf(w);
            const lines = parts.reduce((n, p) => n + parseLines(p.text).length, 0);
            return (
              <li key={w.id}>
                <a className="result" href={`#/wird/${w.id}`}>
                  <span className="result-ref">{w.title}</span>
                  <span className="result-text">{parts.length} {parts.length === 1 ? 'part' : 'parts'}, {lines} {lines === 1 ? 'line' : 'lines'}</span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

// ---------- editor ----------
function Editor({ item, preset, presetTitle, onSave, onDelete }) {
  const [title, setTitle] = useState(item ? item.title : presetTitle || '');
  const [count, setCount] = useState(item ? item.count || 1 : 1);
  const [parts, setParts] = useState(() => {
    if (item) return partsOf(item).map((p) => ({ ...p, daysText: (p.days || []).join(',') }));
    const base = preset === 'dalail' ? dalailParts() : [{ id: newId('p'), title: presetTitle || 'Part 1', text: '', days: [] }];
    return base.map((p) => ({ ...p, daysText: (p.days || []).join(',') }));
  });
  const ready = title.trim() && parts.length;

  const setPart = (id, patch) => setParts((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const save = (e) => {
    e.preventDefault();
    if (!ready) return;
    onSave({
      title: title.trim(),
      count: Math.max(1, Number(count) || 1),
      kind: preset || (item && item.kind) || 'custom',
      parts: parts.map((p) => ({
        id: p.id,
        title: p.title.trim() || 'Part',
        text: p.text,
        days: String(p.daysText || '').split(/[,\s]+/).map(Number).filter((n) => n >= 1 && n <= 8),
      })),
    });
  };

  return (
    <>
      <PageHeader icon="edit" hue={18} title={item ? 'Edit wird' : 'Set up a wird'} back={{ href: item ? `#/wird/${item.id}` : '#/wird', label: 'Back' }} />
      <Intro />
      <form className="card form" onSubmit={save}>
        <label className="field">Name<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Hizb al-Bahr" /></label>
        <label className="field">Times to recite the whole wird (optional)
          <input type="number" min="1" max="10000" value={count} onChange={(e) => setCount(e.target.value)} />
        </label>

        <div className="how">
          <strong>How to add the text</strong>
          <p>For each part, write the Arabic line, then its translation on the next line, then leave a blank line. Repeat for every line. A line without a translation is also fine.</p>
          <pre lang="ar" dir="auto">{SAMPLE}</pre>
        </div>

        {parts.map((p, i) => (
          <fieldset key={p.id} className="part-edit">
            <legend>Part {i + 1}</legend>
            <div className="form-row">
              <label className="field">Part title<input value={p.title} onChange={(e) => setPart(p.id, { title: e.target.value })} /></label>
              <label className="field">Days to read it (optional, 1 to 8, such as 1,8)
                <input value={p.daysText} onChange={(e) => setPart(p.id, { daysText: e.target.value })} placeholder="every day" />
              </label>
            </div>
            <label className="field">Text, line by line
              <textarea className="wird-input" lang="ar" dir="auto" rows={8} value={p.text} onChange={(e) => setPart(p.id, { text: e.target.value })} placeholder="Arabic line&#10;Translation line&#10;&#10;Next Arabic line&#10;Its translation" />
            </label>
            {parts.length > 1 && (
              <button type="button" className="link-btn" onClick={() => setParts((ps) => ps.filter((x) => x.id !== p.id))}>Remove this part</button>
            )}
          </fieldset>
        ))}
        <button type="button" className="btn btn-ghost" onClick={() => setParts((ps) => [...ps, { id: newId('p'), title: `Part ${ps.length + 1}`, text: '', days: [], daysText: '' }])}>
          <Icon name="plus" size={18} /> Add another part
        </button>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={!ready}>Save</button>
          {item && (
            <button className="btn btn-ghost" type="button" onClick={() => { if (window.confirm(`Delete "${item.title}"?`)) onDelete(); }}>
              <Icon name="trash" size={18} /> Delete
            </button>
          )}
        </div>
      </form>
    </>
  );
}

// ---------- reader ----------
function Reader({ item, settings }) {
  const parts = partsOf(item);
  const planned = parts.some((p) => p.days && p.days.length);
  const [todayMap, setTodayMap] = useLocalStorage('noor:wird-today', {});
  const [posMap, setPosMap] = useLocalStorage('noor:wird-pos', {});
  const [days, updateDays] = useDaily('noor:wird-days');
  const [scope, setScope] = useState(planned ? 'today' : 'all');
  const [showTr, setShowTr] = useState(true);
  const refs = useRef({});

  const day = todayMap[item.id] || 1;
  const pos = posMap[item.id];
  const shownParts = scope === 'today' && planned ? parts.filter((p) => !p.days || !p.days.length || p.days.includes(day)) : parts;
  const parsed = useMemo(() => Object.fromEntries(parts.map((p) => [p.id, parseLines(p.text)])), [item]); // eslint-disable-line react-hooks/exhaustive-deps

  const setPos = (partId, line) => setPosMap((m) => ({ ...m, [item.id]: { partId, line } }));
  const resume = () => {
    if (!pos) return;
    const el = refs.current[`${pos.partId}:${pos.line}`];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const nextDay = () => {
    setTodayMap((m) => ({ ...m, [item.id]: day >= 8 ? 1 : day + 1 }));
    setPosMap((m) => { const c = { ...m }; delete c[item.id]; return c; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const target = item.count || 1;
  const count = days[item.id] || 0;
  const hasText = parts.some((p) => parsed[p.id].length);

  return (
    <>
      <PageHeader icon="scroll" hue={18} title={item.title} subtitle={planned ? `Day ${day} of the weekly plan` : `${parts.length} ${parts.length === 1 ? 'part' : 'parts'}`} back={{ href: '#/wird', label: 'My wird' }}>
        <div className="head-actions">
          <a className="btn btn-light" href={`#/wird/${item.id}/edit`}><Icon name="edit" size={18} /> Add or edit text</a>
          <button className="btn btn-light" onClick={() => setShowTr((v) => !v)} aria-pressed={showTr}>
            <Icon name="book" size={18} /> Translation {showTr ? 'on' : 'off'}
          </button>
        </div>
      </PageHeader>

      {planned && (
        <section className="card plan">
          <div className="plan-top">
            <strong>Weekly plan</strong>
            <div className="seg" role="group" aria-label="Show parts">
              <button className={scope === 'today' ? 'is-on' : ''} onClick={() => setScope('today')} aria-pressed={scope === 'today'}>Day {day}</button>
              <button className={scope === 'all' ? 'is-on' : ''} onClick={() => setScope('all')} aria-pressed={scope === 'all'}>All parts</button>
            </div>
          </div>
          <div className="chips" role="group" aria-label="Choose the day">
            {ALL_DAYS.map((d) => (
              <button key={d} className={d === day ? 'chip is-on' : 'chip'} aria-pressed={d === day} onClick={() => setTodayMap((m) => ({ ...m, [item.id]: d }))}>Day {d}</button>
            ))}
          </div>
          <p className="hint">The plan is split into daily readings. When you finish a day, tap "Finish day" to move to the next one.</p>
        </section>
      )}

      {pos && (
        <button className="continue" onClick={resume}>
          <span className="continue-icon"><Icon name="flag" size={20} /></span>
          <span className="continue-text">
            <strong>Resume where you stopped</strong>
            <span>{(parts.find((p) => p.id === pos.partId) || {}).title}, line {pos.line + 1}</span>
          </span>
          <Icon name="arrow-right" />
        </button>
      )}

      {!hasText && (
        <div className="empty-card">
          <Icon name="scroll" size={28} />
          <p>No text has been added yet. Add the Arabic and its translation, line by line.</p>
          <a className="btn btn-primary" href={`#/wird/${item.id}/edit`}>Add the text</a>
        </div>
      )}

      {shownParts.map((p) => {
        const lines = parsed[p.id];
        return (
          <section key={p.id} className="wird-part">
            <h2 className="wird-part-title">{p.title}<small>{lines.length} {lines.length === 1 ? 'line' : 'lines'}</small></h2>
            {lines.length === 0 && <p className="tafsir-note">Nothing added for this part yet. <a className="link-btn" href={`#/wird/${item.id}/edit`}>Add text</a></p>}
            {lines.map((l, i) => {
              const here = pos && pos.partId === p.id && pos.line === i;
              return (
                <article key={i} ref={(el) => { refs.current[`${p.id}:${i}`] = el; }} className={here ? 'wline is-here' : 'wline'}>
                  <div className="wline-bar">
                    <span className="wline-n">{i + 1}</span>
                    <button className={here ? 'icon-btn is-on' : 'icon-btn'} onClick={() => setPos(p.id, i)} aria-label={`Mark line ${i + 1} as where I stopped`}>
                      <Icon name="flag" size={16} />
                    </button>
                  </div>
                  <p className="arabic" lang="ar" dir="rtl" style={{ fontSize: `${settings.arabicSize}px` }}>{l.ar}</p>
                  {showTr && l.tr && <p className="translation">{l.tr}</p>}
                </article>
              );
            })}
          </section>
        );
      })}

      {hasText && target > 1 && (
        <CountButton count={count} target={target} onTap={() => { updateDays((d) => ({ ...d, [item.id]: (d[item.id] || 0) + 1 })); buzz(settings, count + 1 === target ? 40 : 10); }} onReset={() => updateDays((d) => ({ ...d, [item.id]: 0 }))} />
      )}
      {planned && scope === 'today' && hasText && (
        <button className="btn btn-primary wide-btn" onClick={nextDay}><Icon name="check-circle" size={18} /> Finish day {day} and move to day {day >= 8 ? 1 : day + 1}</button>
      )}
    </>
  );
}

// ---------- router ----------
export default function MyWird({ segments, params, settings }) {
  const [items, setItems] = useLocalStorage('noor:wird', []);
  const [, arg, sub] = segments;

  if (!arg) return <List items={items} />;

  if (arg === 'new') {
    return (
      <Editor
        preset={params.get('preset') || ''}
        presetTitle={params.get('title') || ''}
        onSave={(data) => {
          const id = newId('w');
          setItems((l) => [...l, { id, ...data }]);
          window.location.hash = `#/wird/${id}`;
        }}
      />
    );
  }

  const item = items.find((w) => w.id === arg);
  if (!item) {
    return (
      <div className="empty-card">
        <p>That wird was not found on this device.</p>
        <a className="btn btn-primary" href="#/wird">Back to my wird</a>
      </div>
    );
  }

  if (sub === 'edit') {
    return (
      <Editor
        item={item}
        onSave={(data) => {
          setItems((l) => l.map((w) => (w.id === item.id ? { id: w.id, ...data } : w)));
          window.location.hash = `#/wird/${item.id}`;
        }}
        onDelete={() => {
          setItems((l) => l.filter((w) => w.id !== item.id));
          window.location.hash = '#/wird';
        }}
      />
    );
  }
  return <Reader item={item} settings={settings} />;
}
