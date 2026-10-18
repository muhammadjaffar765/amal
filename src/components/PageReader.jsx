import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { getPage } from '../api.js';
import { UR_EDITIONS } from '../themes.js';
import { Corners } from './MushafFrame.jsx';
import { JUZ_NAMES, JUZ_START, TOTAL_PAGES } from '../data/juz.js';
import { useAyahPlayer } from '../hooks/useAyahPlayer.js';
import { useFitHeight } from '../hooks/useFitHeight.js';
import { replaceHash, useSwipe } from '../hooks/useSwipe.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import AyahSheet from './AyahSheet.jsx';
import Icon from './Icon.jsx';
import MushafText from './MushafText.jsx';
import PlayerBar from './PlayerBar.jsx';

const digits = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

// One page of the 604-page Madani Mushaf. Swipe (or use the arrows or the keyboard) to turn the page.
// Like a printed Mushaf, the next page is to the left: swipe right to go forward.
export default function PageReader({ number, settings, onSettings, bookmarks, onToggleBookmark, onLastRead, marks, onMark, snips, onSnips }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState(null);
  const [, setLastPage] = useLocalStorage('noor:last-page', 1);
  const [jump, setJump] = useState(String(number));
  const prev = useRef(number);
  const dir = number >= prev.current ? 'next' : 'prev';
  const [opts, setOpts] = useState(false);
  const [fitSize, setFitSize] = useState(null);
  const fit = settings.fitPage !== false;
  const [wrapRef, wrapH] = useFitHeight(56, [opts, fit]);
  const pageRef = useRef(null);

  useEffect(() => {
    prev.current = number;
    setJump(String(number));
    setLastPage(number);
    setSelected(null);
  }, [number]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError('');
    getPage(number, settings.urEdition)
      .then((d) => {
        if (cancelled) return;
        setData(d);
        if (number < TOTAL_PAGES) getPage(number + 1, settings.urEdition).catch(() => {}); // warm up the next page
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [number, attempt, settings.urEdition]);

  const go = (n) => {
    const target = Math.max(1, Math.min(TOTAL_PAGES, n));
    if (target !== number) replaceHash(`#/page/${target}`);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target && /input|select|textarea/i.test(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') go(number + 1);
      if (e.key === 'ArrowRight') go(number - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [number]); // eslint-disable-line react-hooks/exhaustive-deps

  // swipe right for the next page, left for the previous one (like an Arabic book)
  const swipe = useSwipe(() => go(number - 1), () => go(number + 1));

  const ayahs = data ? data.ayahs : [];
  const player = useAyahPlayer(settings, (a) => {
    onLastRead({ surah: a.surah.number, ayah: a.n, name: a.surah.englishName });
  });

  // Fit page to screen: find the biggest text size at which the whole Mushaf page fits without scrolling.
  useLayoutEffect(() => {
    if (!fit || !data || !pageRef.current) return undefined;
    const run = () => {
      const page = pageRef.current;
      const text = page && page.querySelector('.mushaf');
      if (!text) return;
      let lo = 10; let hi = 40; let best = lo;
      for (let k = 0; k < 7; k += 1) {
        const mid = (lo + hi) / 2;
        text.style.fontSize = `${mid}px`;
        if (page.scrollHeight <= page.clientHeight + 1) { best = mid; lo = mid; } else hi = mid;
      }
      text.style.fontSize = `${best}px`;
      setFitSize(Math.floor(best * 10) / 10);
    };
    run();
    window.addEventListener('resize', run);
    return () => window.removeEventListener('resize', run);
  }, [fit, data, wrapH, opts, number]);

  const juz = ayahs[0] ? ayahs[0].juz : JUZ_START.filter((s) => s <= number).length;
  const surahNames = useMemo(() => [...new Set(ayahs.map((a) => a.surah.englishName))], [ayahs]);
  const bookmarkIds = new Set(bookmarks.map((b) => b.id));
  const sel = selected;
  const urduMissing = data && !data.urdu;

  return (
    <>
      <div className="rd-bar">
        <a className="btn btn-ghost sm" href="#/quran"><Icon name="arrow-left" size={18} /> Quran</a>
        <span className="rd-title"><strong>Juz {juz} <span lang="ar">{JUZ_NAMES[juz - 1]}</span></strong><small>{surahNames.join(', ')}</small></span>
        <button className={opts ? 'icon-btn is-on' : 'icon-btn'} onClick={() => setOpts((o) => !o)} aria-label="Reading options" aria-expanded={opts}><Icon name="sliders" size={18} /></button>
      </div>
      {opts && (
        <div className="rd-opts">
          <label className="switch-row">
            <input type="checkbox" checked={fit} onChange={(e) => onSettings({ fitPage: e.target.checked })} />
            <span>Fit the whole page to the screen</span>
          </label>
          <label className={`size-slider${fit ? ' is-off' : ''}`}>
            <span>Text size</span>
            <input type="range" min="14" max="72" step="1" value={settings.arabicSize} disabled={fit} onChange={(e) => onSettings({ arabicSize: Number(e.target.value) })} aria-label="Arabic text size" />
            <span className="size-val">{fit ? 'Auto' : settings.arabicSize}</span>
          </label>
          <label className="field">Jump to a Juz
            <select value={juz} onChange={(e) => go(JUZ_START[Number(e.target.value) - 1])}>
              {JUZ_START.map((_, i) => <option key={i} value={i + 1}>Juz {i + 1}  {JUZ_NAMES[i]}</option>)}
            </select>
          </label>
        </div>
      )}

      <div className="turn-wrap pr-wrap" ref={wrapRef} style={fit && wrapH ? { height: wrapH } : undefined} {...swipe}>
        <section ref={pageRef} key={number} className={`mpage turn-${dir}${fit ? ' is-fit' : ''}`} aria-label={`Page ${number}`} data-rt={settings.readTheme}>
          <Corners />
          {error && (
            <div className="notice">
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => setAttempt((a) => a + 1)}>Try again</button>
            </div>
          )}
          {!data && !error && (
            <div aria-hidden="true">
              {Array.from({ length: 9 }, (_, i) => <span key={i} className="skeleton line" />)}
            </div>
          )}
          {data && <MushafText ayahs={ayahs} size={fit && fitSize ? fitSize : settings.arabicSize} headers selected={sel} playing={player.current} onSelect={setSelected} marks={marks} />}
          <p className="page-no" lang="ar">{digits(number)}</p>
        </section>
      </div>

      <div className="rd-nav">
        <button className="icon-btn" onClick={() => go(number - 1)} disabled={number <= 1} aria-label="Previous page"><Icon name="chevron-left" size={20} /></button>
        <form onSubmit={(e) => { e.preventDefault(); go(parseInt(jump, 10) || number); }}>
          <label className="sr-only" htmlFor="pg">Page</label>
          <input id="pg" inputMode="numeric" value={jump} onChange={(e) => setJump(e.target.value.replace(/\D/g, ''))} />
          <span>/ {TOTAL_PAGES}</span>
        </form>
        <button className="icon-btn" onClick={() => go(number + 1)} disabled={number >= TOTAL_PAGES} aria-label="Next page"><Icon name="chevron-right" size={20} /></button>
      </div>

      {sel && (
        <AyahSheet
          ayah={sel}
          settings={settings}
          onSettings={onSettings}
          onClose={() => setSelected(null)}
          isPlaying={!!player.current && player.current.global === sel.global && player.playing}
          onPlay={() => player.play(sel, ayahs)}
          bookmarked={bookmarkIds.has(`${sel.surah.number}:${sel.n}`)}
          onBookmark={() => onToggleBookmark({ id: `${sel.surah.number}:${sel.n}`, surah: sel.surah.number, ayah: sel.n, surahName: sel.surah.englishName, text: sel.text, en: sel.en })}
          onMarkRead={() => onLastRead({ surah: sel.surah.number, ayah: sel.n, name: sel.surah.englishName })}
          urduMissing={!!urduMissing}
          onRetry={urduMissing ? () => setAttempt((a) => a + 1) : undefined}
          urLabel={(UR_EDITIONS.find((e) => e.id === (data && data.urdu)) || {}).name}
          mark={marks[`${sel.surah.number}:${sel.n}`]}
          onMark={onMark}
          snips={snips}
          onSnips={onSnips}
        />
      )}
      {player.current && !sel && (
        <PlayerBar
          label={`${player.current.surah.englishName}, verse ${player.current.n}`}
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

// "#/jump/surah/2": finds the page a surah starts on, then opens it in page mode.
export function Jump({ surah }) {
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    import('../api.js').then(({ getAyahPage }) =>
      getAyahPage(surah, 1)
        .then((p) => !cancelled && window.location.replace(`#/page/${p}`))
        .catch((e) => !cancelled && setError(e.message))
    );
    return () => {
      cancelled = true;
    };
  }, [surah]);
  return error ? (
    <div className="notice"><p>{error}</p><a className="btn btn-primary" href={`#/surah/${surah}`}>Open as a surah instead</a></div>
  ) : (
    <div aria-hidden="true"><span className="skeleton tall" /></div>
  );
}
