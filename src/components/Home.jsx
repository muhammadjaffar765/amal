import { useEffect, useMemo, useState } from 'react';
import { getDailyAyah } from '../api.js';
import { AMAL_DAILY } from '../data/amalDaily.js';
import { FEATURES } from '../data/features.js';
import { hijriText, fmt12, fmtClock } from '../prayer.js';
import { todayKey, useDaily } from '../hooks/useDaily.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { usePrayerTimes } from '../hooks/usePrayerTimes.js';
import { addDays, daysBetween, fmtDate, plural, today as todayStr } from '../trip.js';
import { nextOccurrence } from '../hijri.js';
import FeatureGrid from './FeatureGrid.jsx';
import Icon from './Icon.jsx';
import { Beads, Hands, KaabaArt, Mat, NamesStar, QuranStand } from './Illustrations.jsx';

const STARS = [[8, 14, 0], [22, 62, 0.6], [38, 20, 1.2], [58, 70, 0.3], [74, 16, 0.9], [88, 54, 1.5], [93, 22, 0.4], [12, 82, 1.1], [66, 44, 1.8]];

function Hero({ settings }) {
  const p = usePrayerTimes(settings);
  const now = new Date();
  const gregorian = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const nextTime = p.data && p.next ? fmt12(p.data.timings[p.next.key]) : '';
  return (
    <section className="home-hero rise">
      {STARS.map(([x, y, d], i) => <span key={i} className="twinkle" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }} />)}
      <span className="hero-moon" aria-hidden="true" />
      <svg className="skyline" viewBox="0 0 600 70" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <g fill="rgba(255,255,255,0.13)">
          <rect x="0" y="60" width="600" height="10" />
          <path d="M215 60 V42 C215 8 305 8 305 42 V60 Z" /><rect x="258" y="0" width="4" height="12" />
          <rect x="150" y="22" width="14" height="40" /><path d="M150 22 L157 6 L164 22 Z" />
          <rect x="436" y="22" width="14" height="40" /><path d="M436 22 L443 6 L450 22 Z" />
          <path d="M70 60 V48 C70 30 118 30 118 48 V60 Z" /><path d="M482 60 V48 C482 30 530 30 530 48 V60 Z" />
          <path d="M20 60 V52 C20 42 44 42 44 52 V60 Z" /><path d="M556 60 V52 C556 42 580 42 580 52 V60 Z" />
        </g>
      </svg>
      <p className="hero-salam" lang="ar">السَّلَامُ عَلَيْكُمْ</p>
      <h1 className="hero-slogan">Read it. <span>Live it.</span></h1>
      <p className="hero-urdu" lang="ur" dir="rtl">پڑھیں، سمجھیں، اور عمل کریں</p>
      <p className="hero-date">{gregorian}{p.data ? ` · ${hijriText(p.data)}` : ''}</p>
      {p.data && p.next ? (
        <a className="next-chip" href="#/prayer">
          <Icon name="clock" size={20} />
          <span><strong>{p.next.key}</strong> {p.next.tomorrow ? 'tomorrow' : 'at'} {nextTime}</span>
          <span className="next-chip-count">{fmtClock(p.next.secondsLeft)}</span>
        </a>
      ) : (
        <a className="next-chip" href="#/prayer">
          <Icon name="pin" size={20} />
          <span>{p.status === 'error' ? 'Set your city for prayer times' : 'Loading prayer times…'}</span>
          <Icon name="chevron-right" size={18} />
        </a>
      )}
    </section>
  );
}

function Continue({ lastRead }) {
  const [lastPage] = useLocalStorage('noor:last-page', 0);
  const href = lastRead ? `#/surah/${lastRead.surah}?ayah=${lastRead.ayah}` : lastPage ? `#/page/${lastPage}` : '#/surah/1';
  return (
    <a className="continue-card rise" style={{ '--d': '0.05s' }} href={href}>
      <span className="cc-art"><QuranStand /></span>
      <span className="cc-text">
        <small>{lastRead ? 'Last read' : 'Start reading'}</small>
        <strong>{lastRead ? `Surah ${lastRead.name}` : 'Al-Fatihah'}</strong>
        <span>{lastRead ? `Verse ${lastRead.ayah}` : 'Begin with the opening'}</span>
        <span className="cc-btn">Continue <Icon name="arrow-right" size={16} /></span>
      </span>
    </a>
  );
}

const QUICK = [
  { href: '#/quran', label: 'Quran', icon: 'book-open', hue: 152 },
  { href: '#/prayer', label: 'Prayer', icon: 'clock', hue: 205 },
  { href: '#/qibla', label: 'Qibla', icon: 'compass', hue: 190 },
  { href: '#/adhkar', label: 'Adhkar', icon: 'sun', hue: 36 },
  { href: '#/tasbeeh', label: 'Tasbeeh', icon: 'beads', hue: 175 },
  { href: '#/duas', label: 'Duas', icon: 'moon', hue: 250 },
  { href: '#/notes', label: 'Notes', icon: 'edit', hue: 50 },
];

const MAIN = [
  { href: '#/quran', label: 'Quran', icon: 'book-open', hue: 152 },
  { href: '#/prayer', label: 'Prayer times', icon: 'clock', hue: 205 },
  { href: '#/calendar', label: 'Calendar', icon: 'calendar', hue: 280 },
  { href: '#/hadith', label: 'Hadith', icon: 'book', hue: 25 },
  { href: '#/hajj', label: 'Hajj & Umrah', icon: 'mosque', hue: 42 },
  { href: '#/adhkar/salawat', label: 'Durood Sharif', icon: 'heart', hue: 340 },
  { href: '#/dalail', label: 'Dalail al-Khayrat', icon: 'scroll', hue: 18 },
  { href: '#/texts', label: 'Wazaif & Qasaid', icon: 'scroll', hue: 168 },
  { href: '#/tasbeeh', label: 'Tasbeeh', icon: 'beads', hue: 175 },
  { href: '#/adhkar', label: 'Adhkar', icon: 'sun', hue: 36 },
  { href: '#/qibla', label: 'Qibla', icon: 'compass', hue: 190 },
  { href: '#/kids', label: 'Kids Corner', icon: 'gamepad', hue: 28 },
];

// The main parts of the app as big cards (a coloured line under each), so they are one tap away.
function MainCards() {
  return (
    <div className="main-cards rise" style={{ '--d': '0.1s' }}>
      {MAIN.map((m) => (
        <a key={m.href} className="main-card" href={m.href} style={{ '--hue': m.hue }}>
          <span className="main-label">{m.label}</span>
          <span className="main-ico"><Icon name={m.icon} size={26} /></span>
        </a>
      ))}
    </div>
  );
}

function QuickRow() {
  return (
    <div className="quick rise" style={{ '--d': '0.1s' }}>
      {QUICK.map((q) => (
        <a key={q.href} className="quick-item" href={q.href} style={{ '--hue': q.hue }}>
          <span className="tile-icon"><Icon name={q.icon} size={22} /></span>
          <span>{q.label}</span>
        </a>
      ))}
    </div>
  );
}

function TripCard({ settings }) {
  const [trip] = useLocalStorage('amal:trip', { umrah: null, hajj: null });
  const now = todayStr();
  const u = trip && trip.umrah;
  const h = trip && trip.hajj;
  let line = null;
  if (u && u.depart && u.ret && now <= u.ret) {
    const toGo = daysBetween(now, u.depart);
    line = toGo > 0
      ? { href: '#/umrah', big: plural(toGo, 'day'), text: `to your Umrah (${fmtDate(u.depart)})`, icon: 'mosque' }
      : { href: '#/umrah', big: `Day ${daysBetween(u.depart, now) + 1}`, text: `of your Umrah, until ${fmtDate(u.ret)}`, icon: 'pin' };
  } else if (h && h.arrive && h.depart && now <= h.depart) {
    const next = nextOccurrence({ m: 12, d: 8 }, new Date(new Date().setDate(new Date().getDate() - 6)), settings.hijriOffset || 0);
    const start = next ? `${next.date.getFullYear()}-${String(next.date.getMonth() + 1).padStart(2, '0')}-${String(next.date.getDate()).padStart(2, '0')}` : null;
    const toGo = start ? daysBetween(now, start) : null;
    line = toGo !== null && toGo > 0
      ? { href: '#/hajjplan', big: plural(toGo, 'day'), text: 'until Hajj begins', icon: 'mosque' }
      : { href: '#/hajjplan', big: 'Hajj', text: 'Open your timeline', icon: 'pin' };
  }
  if (line) {
    return (
      <a className="trip-card rise" style={{ '--d': '0.14s' }} href={line.href}>
        <span className="trip-icon"><Icon name={line.icon} size={26} /></span>
        <span><strong>{line.big}</strong><small>{line.text}</small></span>
        <Icon name="chevron-right" size={20} />
      </a>
    );
  }
  return (
    <section className="plan-promo rise" style={{ '--d': '0.14s' }}>
      <span className="promo-art"><KaabaArt /></span>
      <div>
        <strong>Going for Umrah or Hajj?</strong>
        <p>Set your dates. Amal counts down and plans every day.</p>
        <div className="promo-btns"><a className="btn btn-primary" href="#/umrah">Umrah</a><a className="btn btn-ghost" href="#/hajjplan">Hajj</a></div>
      </div>
    </section>
  );
}

function AmalToday() {
  const [done, update] = useDaily('amal:deed');
  const [amal] = useLocalStorage('noor:amal', { custom: [], days: {} });
  const day = Math.floor(Date.UTC(...todayKey().split('-').map((n, i) => (i === 1 ? Number(n) - 1 : Number(n)))) / 86400000);
  const deed = AMAL_DAILY[day % AMAL_DAILY.length];
  const ticks = ((amal.days || {})[todayKey()] || []).length;
  const total = 10 + (amal.custom || []).length;
  const pct = Math.round((ticks / total) * 100);
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <div className="amal-today rise" style={{ '--d': '0.18s' }}>
      <section className={done.deed ? 'deed is-done' : 'deed'}>
        <small>Amal of the day</small>
        <strong>{deed.title}</strong>
        <p>{deed.text}</p>
        <button className="btn btn-primary" onClick={() => update((d) => ({ ...d, deed: !d.deed }))} aria-pressed={!!done.deed}>
          <Icon name={done.deed ? 'check-circle' : 'check'} size={18} /> {done.deed ? 'Done, Masha Allah' : 'I did it'}
        </button>
      </section>
      <a className="ring-card" href="#/amal" aria-label={`Daily checklist, ${pct} percent`}>
        <svg viewBox="0 0 64 64" width="84" height="84">
          <circle cx="32" cy="32" r={R} fill="none" stroke="var(--line)" strokeWidth="7" />
          <circle cx="32" cy="32" r={R} fill="none" stroke="var(--primary)" strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} transform="rotate(-90 32 32)" />
          <text x="32" y="37" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--ink)" fontFamily="var(--font-ui)">{pct}%</text>
        </svg>
        <span>Today's checklist</span>
      </a>
    </div>
  );
}

function VerseOfTheDay({ settings }) {
  const [verse, setVerse] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    getDailyAyah().then((v) => !cancelled && setVerse(v)).catch(() => !cancelled && setFailed(true));
    return () => { cancelled = true; };
  }, []);
  return (
    <section className="verse-card rise" style={{ '--d': '0.22s' }} aria-label="Verse of the day">
      <p className="verse-label"><Icon name="sparkles" size={16} /> Verse of the day</p>
      {verse ? (
        <>
          <p className="hero-arabic" lang="ar" dir="rtl" style={{ fontSize: `clamp(24px, 6vw, ${Math.min(settings.arabicSize + 6, 46)}px)` }}>{verse.text}</p>
          <p className="hero-english">{verse.en}</p>
          <div className="hero-foot">
            <span>Surah {verse.surahName}, verse {verse.n}</span>
            <a className="btn btn-primary" href={`#/surah/${verse.surahNumber}?ayah=${verse.n}`}>Read and act on it <Icon name="arrow-right" size={18} /></a>
          </div>
        </>
      ) : failed ? (
        <p className="hero-english">The verse of the day could not load. Open the Quran to start reading.</p>
      ) : (
        <div className="hero-skeleton" aria-hidden="true"><span className="skeleton" /><span className="skeleton short" /></div>
      )}
    </section>
  );
}

const POPULAR = [
  { href: '#/quran', label: 'Quran', sub: 'Read, listen, tafsir', Art: QuranStand, hue: 152 },
  { href: '#/duas', label: 'Duas', sub: '50 duas with search', Art: Hands, hue: 250 },
  { href: '#/tasbeeh', label: 'Tasbeeh', sub: 'Count your dhikr', Art: Beads, hue: 175 },
  { href: '#/prayer', label: 'Prayers', sub: 'Times and Qibla', Art: Mat, hue: 205 },
  { href: '#/names', label: '99 Names', sub: 'Learn and live them', Art: NamesStar, hue: 45 },
  { href: '#/hajj', label: 'Hajj and Umrah', sub: 'Guide with pictures', Art: KaabaArt, hue: 28 },
];

export default function Home({ lastRead, settings }) {
  const isFriday = new Date().getDay() === 5;
  const rest = useMemo(() => FEATURES, []);
  return (
    <>
      <Hero settings={settings} />
      {isFriday && (
        <section className="jumuah rise">
          <span className="tile-icon" style={{ '--hue': 40 }}><Icon name="mosque" size={24} /></span>
          <div>
            <strong>Jumu'ah Mubarak</strong>
            <span>Many Muslims read Surah Al-Kahf and send extra salawat on Fridays.</span>
            <div className="jumuah-links"><a href="#/surah/18">Surah Al-Kahf</a><a href="#/adhkar/salawat">Salawat</a></div>
          </div>
        </section>
      )}
      <Continue lastRead={lastRead} />
      <MainCards />
      <TripCard settings={settings} />
      <AmalToday />
      <VerseOfTheDay settings={settings} />

      <div className="section-head"><h2>Popular</h2></div>
      <div className="popular">
        {POPULAR.map((p, i) => (
          <a key={p.href} className="pop-card rise" style={{ '--hue': p.hue, '--d': `${0.05 * i}s` }} href={p.href}>
            <span className="pop-art"><p.Art /></span>
            <strong>{p.label}</strong>
            <small>{p.sub}</small>
          </a>
        ))}
      </div>

      <div className="section-head"><h2>Everything in Amal</h2></div>
      <FeatureGrid items={rest} />
    </>
  );
}
