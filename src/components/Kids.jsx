import { useEffect, useMemo, useState } from 'react';
import { DUAS } from '../data/duas.js';
import {
  BADGES, DAMMA, FATHA, KASRA, KIDS_DUAS, NON_JOINERS, QAIDA_LESSONS, QAIDA_LETTERS, SHADDA, STICKERS, STORIES, SUKOON,
} from '../data/kids.js';
import { todayKey } from '../hooks/useDaily.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { MemoryGame, OrderGame, QuizGame } from './KidsGames.jsx';
import Icon from './Icon.jsx';
import TextBlock from './TextBlock.jsx';

const DEFAULT = { stars: 0, badges: [], stickers: {}, lessons: {}, stories: [] };

// Progress is saved on this device only. There is no account, no ad and no tracking.
export function useKids() {
  const [raw, setRaw] = useLocalStorage('noor:kids', DEFAULT);
  const kids = { ...DEFAULT, ...raw };
  // add stars and badges; returns the names of any badges that were just earned
  const award = (stars = 0, badgeIds = []) => {
    const fresh = badgeIds.filter((b) => !kids.badges.includes(b));
    setRaw((s) => {
      const cur = { ...DEFAULT, ...s };
      return { ...cur, stars: cur.stars + stars, badges: [...new Set([...cur.badges, ...badgeIds])] };
    });
    return fresh.map((id) => BADGES.find((b) => b.id === id)).filter(Boolean);
  };
  const patch = (fn) => setRaw((s) => fn({ ...DEFAULT, ...s }));
  return { kids, award, patch };
}

export function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith('ar'));
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ar-SA';
  u.rate = 0.7;
  if (voice) u.voice = voice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
  return !!voice;
}

function KidsHead({ title, sub, back = '#/kids', stars }) {
  return (
    <header className="kids-head">
      <a className="page-back" href={back}><Icon name="arrow-left" size={16} /> {back === '#/kids' ? 'Kids Corner' : 'Back'}</a>
      <div className="kids-head-main">
        <div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>
        {stars !== undefined && <span className="star-count" aria-label={`${stars} stars`}>⭐ {stars}</span>}
      </div>
    </header>
  );
}

function NewBadges({ list }) {
  if (!list || !list.length) return null;
  return (
    <div className="new-badge" role="status">
      {list.map((b) => <span key={b.id}>{b.emoji} New badge: <strong>{b.name}</strong></span>)}
    </div>
  );
}

// ---------- hub ----------
function Hub({ kids }) {
  const games = [
    { href: '#/kids/qaida', emoji: '🔤', label: 'Amalani Qaida', desc: 'Learn the letters and hear them', hue: 28 },
    { href: '#/kids/memory', emoji: '🧠', label: 'Memory match', desc: 'Find the matching pairs', hue: 195 },
    { href: '#/kids/quiz', emoji: '❓', label: 'Islamic quiz', desc: 'Easy questions, earn stars', hue: 280 },
    { href: '#/kids/wudu', emoji: '💧', label: 'Wudu steps', desc: 'Put the steps in order', hue: 205 },
    { href: '#/kids/salah', emoji: '🤲', label: 'Salah steps', desc: 'Put the steps in order', hue: 140 },
    { href: '#/kids/dua', emoji: '🌟', label: 'Dua of the day', desc: 'Say it and get a sticker', hue: 45 },
    { href: '#/kids/stories', emoji: '📚', label: 'Prophet stories', desc: 'Short stories to read', hue: 350 },
  ];
  return (
    <>
      <header className="kids-hero">
        <h1>Kids Corner</h1>
        <p>Learn, play and collect stars. No ads, no login, and nothing leaves this device.</p>
        <span className="star-count big">⭐ {kids.stars}</span>
      </header>
      <div className="kids-tiles">
        {games.map((g) => (
          <a key={g.href} className="kids-tile" href={g.href} style={{ '--hue': g.hue }}>
            <span className="kids-emoji">{g.emoji}</span>
            <strong>{g.label}</strong>
            <span>{g.desc}</span>
          </a>
        ))}
      </div>
      <div className="section-head"><h2>My badges</h2></div>
      <div className="badges">
        {BADGES.map((b) => {
          const on = kids.badges.includes(b.id);
          return (
            <div key={b.id} className={on ? 'badge is-on' : 'badge'} title={b.how}>
              <span>{on ? b.emoji : '🔒'}</span>
              <strong>{b.name}</strong>
              <small>{on ? 'Earned' : b.how}</small>
            </div>
          );
        })}
      </div>
      <p className="hint kids-note">Parents: stories and quiz answers are simple and kept short. Please read along with young children and correct the Arabic with a teacher.</p>
    </>
  );
}

// ---------- Amalani Qaida ----------
function lessonItems(id, picked) {
  const ch = picked;
  switch (id) {
    case 'letters':
      return QAIDA_LETTERS.map(([c, ar, en]) => ({ show: c, say: ar, label: en }));
    case 'shapes':
      return QAIDA_LETTERS.filter(([c]) => c !== 'ء').map(([c, ar, en]) => ({
        show: c, say: ar, label: en,
        forms: NON_JOINERS.includes(c) ? [c, `\u200D${c}`] : [c, `${c}\u200D`, `\u200D${c}\u200D`, `\u200D${c}`],
      }));
    case 'harakat':
      return [[FATHA, 'Zabar'], [KASRA, 'Zer'], [DAMMA, 'Pesh']].map(([m, n]) => ({ show: `${ch}${m}`, say: `${ch}${m}`, label: n }));
    case 'tanween':
      return [['\u064B', 'Two zabar'], ['\u064D', 'Two zer'], ['\u064C', 'Two pesh']].map(([m, n]) => ({ show: `${ch}${m}`, say: `${ch}${m}`, label: n }));
    case 'madd':
      return [[`${ch}${FATHA}\u0627`, 'Long a'], [`${ch}${KASRA}\u064A`, 'Long ee'], [`${ch}${DAMMA}\u0648`, 'Long oo']].map(([s, n]) => ({ show: s, say: s, label: n }));
    case 'sukoon':
      return [[`\u0627${FATHA}${ch}${SUKOON}`, 'Sukoon: stop on the letter'], [`${ch}${FATHA}${SHADDA}`, 'Shadda: say the letter twice']].map(([s, n]) => ({ show: s, say: s, label: n }));
    default:
      return [];
  }
}

function Qaida({ id, kids, award, patch }) {
  const [picked, setPicked] = useState('ب');
  const [voice, setVoice] = useState(true);
  const [badges, setBadges] = useState([]);
  const lesson = QAIDA_LESSONS.find((l) => l.id === id);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return undefined;
    const check = () => setVoice(window.speechSynthesis.getVoices().some((v) => v.lang && v.lang.toLowerCase().startsWith('ar')));
    check();
    window.speechSynthesis.addEventListener('voiceschanged', check);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', check);
  }, []);

  if (!id) {
    return (
      <>
        <KidsHead title="Amalani Qaida" sub="Learn to read Arabic, step by step." stars={kids.stars} />
        <div className="lesson-list">
          {QAIDA_LESSONS.map((l, i) => (
            <a key={l.id} className="lesson-card" href={`#/kids/qaida/${l.id}`}>
              <span className="lesson-n">{i + 1}</span>
              <span><strong>{l.title}</strong><small>{l.desc}</small></span>
              {kids.lessons[l.id] && <span className="done-mark">✅</span>}
            </a>
          ))}
        </div>
      </>
    );
  }
  if (!lesson) return <div className="empty-card"><p>Lesson not found.</p><a className="btn btn-primary" href="#/kids/qaida">Back</a></div>;

  const needsLetter = ['harakat', 'tanween', 'madd', 'sukoon'].includes(id);
  const items = lessonItems(id, picked);
  const finish = () => {
    if (kids.lessons[id]) return;
    patch((s) => ({ ...s, lessons: { ...s.lessons, [id]: true } }));
    setBadges(award(1, id === 'letters' ? ['letters'] : []));
  };
  const idx = QAIDA_LESSONS.findIndex((l) => l.id === id);
  const next = QAIDA_LESSONS[idx + 1];

  return (
    <>
      <KidsHead title={lesson.title} sub={lesson.desc} back="#/kids/qaida" stars={kids.stars} />
      {!voice && <p className="notice-inline">This device has no Arabic voice, so there is no sound. A parent or teacher can read each one aloud.</p>}
      {needsLetter && (
        <div className="letter-picker" role="group" aria-label="Choose a letter">
          {QAIDA_LETTERS.map(([c]) => <button key={c} className={c === picked ? 'chip is-on arabic-chip' : 'chip arabic-chip'} aria-pressed={c === picked} onClick={() => setPicked(c)} lang="ar">{c}</button>)}
        </div>
      )}
      <div className={id === 'letters' ? 'qaida-grid letters' : 'qaida-grid'}>
        {items.map((it, i) => (
          <button key={`${it.show}-${i}`} className="qaida-card" onClick={() => speak(it.say)} aria-label={`Hear ${it.label}`}>
            {it.forms ? (
              <span className="forms" lang="ar" dir="rtl">{it.forms.map((f, k) => <span key={k}>{f}</span>)}</span>
            ) : (
              <span className="q-ar" lang="ar">{it.show}</span>
            )}
            <small>{it.label}</small>
            <Icon name="volume" size={16} />
          </button>
        ))}
      </div>
      <NewBadges list={badges} />
      <div className="form-actions">
        <button className="btn btn-primary" onClick={finish} disabled={!!kids.lessons[id]}>{kids.lessons[id] ? 'Lesson done ✅' : 'I finished this lesson'}</button>
        {next && <a className="btn btn-ghost" href={`#/kids/qaida/${next.id}`}>Next lesson <Icon name="arrow-right" size={18} /></a>}
      </div>
    </>
  );
}

// ---------- dua of the day with stickers ----------
function DuaDay({ settings, kids, award, patch }) {
  const today = todayKey();
  const list = useMemo(() => KIDS_DUAS.map((id) => DUAS.find((d) => d.id === id)).filter(Boolean), []);
  const day = Math.floor(Date.UTC(...today.split('-').map((n, i) => (i === 1 ? Number(n) - 1 : Number(n)))) / 86400000);
  const dua = list[day % list.length];
  const got = kids.stickers[today];
  const [badges, setBadges] = useState([]);

  const say = () => {
    if (got) return;
    const owned = new Set(Object.values(kids.stickers));
    const pool = STICKERS.filter((s) => !owned.has(s));
    const pick = (pool.length ? pool : STICKERS)[Math.floor(Math.random() * (pool.length || STICKERS.length))];
    patch((s) => ({ ...s, stickers: { ...s.stickers, [today]: pick } }));
    const count = Object.keys(kids.stickers).length + 1;
    setBadges(award(1, count >= 5 ? ['stickers'] : []));
  };
  const earned = Object.entries(kids.stickers).sort(([a], [b]) => (a < b ? 1 : -1));

  return (
    <>
      <KidsHead title="Dua of the day" sub="Say it, then tap the button to get a sticker." stars={kids.stars} />
      <article className="dhikr kids-dua">
        <h2>{dua.title}</h2>
        <TextBlock item={dua} settings={{ ...settings, showEnglish: true, translit: true }} />
        <button className="btn btn-primary big" onClick={say} disabled={!!got}>{got ? `You got ${got} today!` : 'I said it! 🎉'}</button>
        {got && <p className="sticker-pop" aria-hidden="true">{got}</p>}
      </article>
      <NewBadges list={badges} />
      <div className="section-head"><h2>My sticker book</h2></div>
      <div className="sticker-book">
        {earned.map(([d, s]) => <span key={d} className="sticker" title={d}>{s}</span>)}
        {Array.from({ length: Math.max(0, 12 - earned.length) }, (_, i) => <span key={`e${i}`} className="sticker empty">?</span>)}
      </div>
    </>
  );
}

// ---------- stories ----------
function Stories({ id, kids, award, patch }) {
  const story = STORIES.find((s) => s.id === id);
  const [badges, setBadges] = useState([]);
  useEffect(() => {
    if (story && !kids.stories.includes(story.id)) {
      patch((s) => ({ ...s, stories: [...s.stories, story.id] }));
      const n = kids.stories.length + 1;
      setBadges(award(1, n >= 3 ? ['stories'] : []));
    }
  }, [story && story.id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!id) {
    return (
      <>
        <KidsHead title="Stories of the Prophets" sub="Short stories to read with a parent." stars={kids.stars} />
        <div className="lesson-list">
          {STORIES.map((s) => (
            <a key={s.id} className="lesson-card" href={`#/kids/stories/${s.id}`}>
              <span className="lesson-n story-emoji">{s.emoji}</span>
              <span><strong>{s.title}</strong><small>{kids.stories.includes(s.id) ? 'Read' : 'New'}</small></span>
            </a>
          ))}
        </div>
      </>
    );
  }
  if (!story) return <div className="empty-card"><p>Story not found.</p><a className="btn btn-primary" href="#/kids/stories">Back</a></div>;
  const i = STORIES.indexOf(story);
  return (
    <>
      <KidsHead title={story.title} back="#/kids/stories" stars={kids.stars} />
      <article className="story">
        <p className="story-emoji big">{story.emoji}</p>
        <p>{story.text}</p>
      </article>
      <NewBadges list={badges} />
      <div className="form-actions">
        {i > 0 && <a className="btn btn-ghost" href={`#/kids/stories/${STORIES[i - 1].id}`}><Icon name="arrow-left" size={18} /> Previous</a>}
        {i < STORIES.length - 1 && <a className="btn btn-primary" href={`#/kids/stories/${STORIES[i + 1].id}`}>Next story <Icon name="arrow-right" size={18} /></a>}
      </div>
    </>
  );
}

export default function Kids({ segments, settings }) {
  const { kids, award, patch } = useKids();
  const [, sub, arg] = segments;
  let view;
  switch (sub) {
    case 'qaida': view = <Qaida id={arg} kids={kids} award={award} patch={patch} />; break;
    case 'memory': view = <MemoryGame kids={kids} award={award} Head={KidsHead} Badges={NewBadges} />; break;
    case 'quiz': view = <QuizGame kids={kids} award={award} Head={KidsHead} Badges={NewBadges} />; break;
    case 'wudu': view = <OrderGame kind="wudu" kids={kids} award={award} Head={KidsHead} Badges={NewBadges} />; break;
    case 'salah': view = <OrderGame kind="salah" kids={kids} award={award} Head={KidsHead} Badges={NewBadges} />; break;
    case 'dua': view = <DuaDay settings={settings} kids={kids} award={award} patch={patch} />; break;
    case 'stories': view = <Stories id={arg} kids={kids} award={award} patch={patch} />; break;
    default: view = <Hub kids={kids} />;
  }
  return <div className="kids-theme">{view}</div>;
}
