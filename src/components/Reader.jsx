import { useEffect, useMemo, useState } from 'react';
import { getSurah } from '../api.js';
import { UR_EDITIONS } from '../themes.js';
import { Corners, Cartouche } from './MushafFrame.jsx';
import { useAyahPlayer } from '../hooks/useAyahPlayer.js';
import AyahSheet from './AyahSheet.jsx';
import { BISMILLAH } from './MushafText.jsx';
import MushafText from './MushafText.jsx';
import PlayerBar from './PlayerBar.jsx';
import PagedText from './PagedText.jsx';
import IndoPakText from './IndoPakText.jsx';
import { replaceHash } from '../hooks/useSwipe.js';
import Icon from './Icon.jsx';

const scrollToAyah = (global, block = 'center') => {
  const el = document.querySelector(`[data-g="${global}"]`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block });
};

export default function Reader({ number, focusAyah, settings, onSettings, bookmarks, onToggleBookmark, lastRead, onLastRead, marks, onMark, snips, onSnips }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState(null);
  const [opts, setOpts] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError('');
    getSurah(number, settings.urEdition, settings.arabicScript)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [number, attempt, settings.urEdition, settings.arabicScript]);

  const ayahs = useMemo(
    () => (data ? data.ayahs.map((a) => ({ ...a, surah: { number: data.number, englishName: data.englishName, name: data.name } })) : []),
    [data]
  );

  const markRead = (a) => onLastRead({ surah: number, ayah: a.n, name: data ? data.englishName : '' });
  const player = useAyahPlayer(settings, (a) => {
    markRead(a);
    scrollToAyah(a.global);
  });

  // Open at a verse from a link such as #/surah/2?ayah=255.
  useEffect(() => {
    if (!ayahs.length || !focusAyah) return undefined;
    const target = ayahs.find((a) => a.n === focusAyah);
    if (!target) return undefined;
    const t = setTimeout(() => {
      scrollToAyah(target.global);
      setSelected(target);
    }, 120);
    return () => clearTimeout(t);
  }, [ayahs, focusAyah]);

  const select = (a) => {
    setSelected(a);
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-g="${a.global}"]`);
      if (el && el.getBoundingClientRect().bottom > window.innerHeight * 0.5) scrollToAyah(a.global, 'start');
    });
  };

  if (error) {
    return (
      <div className="notice">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => setAttempt((a) => a + 1)}>Try again</button>
      </div>
    );
  }
  if (!data) {
    return (
      <div aria-hidden="true">
        <div className="skeleton tall" />
        <span className="skeleton" />
        <span className="skeleton short" />
      </div>
    );
  }

  const bookmarkIds = new Set(bookmarks.map((b) => b.id));
  const showBismillah = data.number !== 1 && data.number !== 9;
  const bumpArabic = (d) => onSettings({ arabicSize: Math.max(14, Math.min(72, settings.arabicSize + d)) });
  const sel = selected;
  const urduMissing = !data.urdu;
  // Screen pages (swipe, nothing scrolls) is the default; Scroll is the old long page
  const pagesMode = settings.surahStyle !== 'scroll';
  const edge = (d) => {
    const n = number + d;
    if (n >= 1 && n <= 114) replaceHash(`#/surah/${n}`);
  };

  return (
    <>
      {pagesMode && (
        <>
          <div className="rd-bar">
            <a className="btn btn-ghost sm" href="#/quran"><Icon name="arrow-left" size={18} /> Surahs</a>
            <span className="rd-title"><strong>{data.englishName} <span lang="ar">{data.name.replace(/^سُورَةُ\s*/, '')}</span></strong><small>{data.numberOfAyahs} verses, swipe right for the next page</small></span>
            <button className={opts ? 'icon-btn is-on' : 'icon-btn'} onClick={() => setOpts((o) => !o)} aria-label="Reading options" aria-expanded={opts}><Icon name="sliders" size={18} /></button>
          </div>
          {opts && (
            <div className="rd-opts">
              <div className="seg" role="group" aria-label="Reading style">
                <button className="is-on" aria-pressed="true">Screen pages</button>
                <button aria-pressed="false" onClick={() => onSettings({ surahStyle: 'scroll' })}>Scroll</button>
              </div>
              <div className="seg" role="group" aria-label="Spelling">
                <button className={settings.arabicScript !== 'uthmani' ? 'is-on' : ''} aria-pressed={settings.arabicScript !== 'uthmani'} onClick={() => onSettings({ arabicScript: 'simple' })}>Simple spelling</button>
                <button className={settings.arabicScript === 'uthmani' ? 'is-on' : ''} aria-pressed={settings.arabicScript === 'uthmani'} onClick={() => onSettings({ arabicScript: 'uthmani' })}>Uthmani</button>
              </div>
              <div className="seg" role="group" aria-label="Layout">
                <button className={settings.scriptStyle !== 'madani' ? 'is-on' : ''} aria-pressed={settings.scriptStyle !== 'madani'} onClick={() => onSettings({ scriptStyle: 'indopak' })}>Indo-Pak layout</button>
                <button className={settings.scriptStyle === 'madani' ? 'is-on' : ''} aria-pressed={settings.scriptStyle === 'madani'} onClick={() => onSettings({ scriptStyle: 'madani' })}>Madani</button>
              </div>
              <label className="size-slider">
                <span>Text size</span>
                <input type="range" min="14" max="72" step="1" value={settings.arabicSize} onChange={(e) => onSettings({ arabicSize: Number(e.target.value) })} aria-label="Arabic text size" />
                <span className="size-val">{settings.arabicSize}</span>
              </label>
              <div className="form-actions">
                <button className="btn btn-primary" onClick={() => player.play(ayahs[0], ayahs)}><Icon name="play" size={18} filled /> Listen</button>
                <a className="btn btn-ghost" href={`#/page/${data.ayahs[0].page}`}><Icon name="book-open" size={18} /> Mushaf pages</a>
              </div>
            </div>
          )}
          <PagedText dep={`${settings.arabicSize}-${number}-${opts}`} resume={`amal:surah-page-${number}`} onEdge={edge} className="surah-paged">
            {settings.scriptStyle === 'madani' ? (
              <>
                {showBismillah && <p className="bismillah" lang="ar" dir="rtl" style={{ fontSize: `${settings.arabicSize + 2}px` }}>{BISMILLAH}</p>}
                <MushafText ayahs={ayahs} size={settings.arabicSize} selected={sel} playing={player.current} onSelect={select} marks={marks} />
              </>
            ) : (
              <IndoPakText surah={data} ayahs={ayahs} size={Math.round(settings.arabicSize * 0.75)} selected={sel} playing={player.current} onSelect={select} showBismillah={showBismillah} />
            )}
          </PagedText>
        </>
      )}

      {!pagesMode && (
      <>
      <div className="reader-top">
        <a className="btn btn-ghost" href="#/quran"><Icon name="arrow-left" size={18} /> All surahs</a>
        <div className="reader-step">
          {number > 1 && <a className="icon-btn" href={`#/surah/${number - 1}`} aria-label="Previous surah"><Icon name="arrow-left" /></a>}
          {number < 114 && <a className="icon-btn" href={`#/surah/${number + 1}`} aria-label="Next surah"><Icon name="arrow-right" /></a>}
        </div>
      </div>

      <header className="reader-head">
        <Cartouche name={data.name} ayahs={data.numberOfAyahs} type={data.revelationType} />
        <h1>{data.englishName}</h1>
        <p className="reader-sub">{data.englishNameTranslation}</p>
        <p className="reader-meta">{data.revelationType === 'Meccan' ? 'Meccan' : 'Medinan'} surah, {data.numberOfAyahs} verses</p>
      </header>

      <div className="read-tools" role="toolbar" aria-label="Reading tools">
        <button className="btn btn-primary" onClick={() => player.play(ayahs[0], ayahs)}><Icon name="play" size={18} filled /> Listen</button>
        <a className="btn btn-ghost" href={`#/page/${data.ayahs[0].page}`}><Icon name="book-open" size={18} /> Mushaf pages</a>
        <button className="btn btn-ghost" onClick={() => onSettings({ surahStyle: 'pages' })}>Screen pages</button>
        <span className="size-ctl">
          <button className="icon-btn" onClick={() => bumpArabic(-2)} aria-label="Smaller Arabic text" disabled={settings.arabicSize <= 14}><Icon name="type" size={14} /></button>
          <button className="icon-btn" onClick={() => bumpArabic(2)} aria-label="Larger Arabic text" disabled={settings.arabicSize >= 72}><Icon name="type" size={20} /></button>
        </span>
      </div>
      <p className="tap-hint">Tap any verse to see its translation.</p>

      {showBismillah && <p className="bismillah" lang="ar" dir="rtl" style={{ fontSize: `${settings.arabicSize + 2}px` }}>{BISMILLAH}</p>}

      <section className="mushaf-card" data-rt={settings.readTheme}>
        <Corners />
        <MushafText ayahs={ayahs} size={settings.arabicSize} selected={sel} playing={player.current} onSelect={select} marks={marks} />
      </section>

      <div className="reader-foot">
        {number > 1 ? <a className="btn btn-ghost" href={`#/surah/${number - 1}`}><Icon name="arrow-left" size={18} /> Previous surah</a> : <span />}
        {number < 114 && <a className="btn btn-primary" href={`#/surah/${number + 1}`}>Next surah <Icon name="arrow-right" size={18} /></a>}
      </div>

      </>
      )}

      {sel && (
        <AyahSheet
          ayah={sel}
          settings={settings}
          onSettings={onSettings}
          onClose={() => setSelected(null)}
          isPlaying={!!player.current && player.current.global === sel.global && player.playing}
          onPlay={() => player.play(sel, ayahs)}
          bookmarked={bookmarkIds.has(`${number}:${sel.n}`)}
          onBookmark={() => onToggleBookmark({ id: `${number}:${sel.n}`, surah: number, ayah: sel.n, surahName: data.englishName, text: sel.text, en: sel.en })}
          onMarkRead={() => markRead(sel)}
          urduMissing={urduMissing}
          onRetry={urduMissing ? () => setAttempt((a) => a + 1) : undefined}
          urLabel={(UR_EDITIONS.find((e) => e.id === data.urdu) || {}).name}
          mark={marks[`${number}:${sel.n}`]}
          onMark={onMark}
          snips={snips}
          onSnips={onSnips}
        />
      )}

      {player.current && !sel && (
        <PlayerBar
          label={`${data.englishName}, verse ${player.current.n}`}
          playing={player.playing}
          error={player.error}
          onToggle={player.toggle}
          onPrev={() => player.step(-1)}
          onNext={() => player.step(1)}
          onClose={player.stop}
        />
      )}
    </>
  );
}
