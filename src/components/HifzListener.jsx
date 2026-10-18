import { useEffect, useMemo, useRef, useState } from 'react';
import { audioUrl, getSurah, getSurahs } from '../api.js';
import { SENSITIVITY, advance, normWord } from '../hifz.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';

const digits = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

function useBuzzer() {
  const ctxRef = useRef(null);
  return (ms = 420, vibrate = true) => {
    try {
      if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 150;
      gain.gain.value = 0.25;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + ms / 1000);
    } catch {
      /* sound is optional */
    }
    if (vibrate && navigator.vibrate) navigator.vibrate([120, 60, 120]);
  };
}

export default function HifzListener({ settings }) {
  const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
  const buzz = useBuzzer();

  const [surahs, setSurahs] = useState(null);
  const [surah, setSurah] = useState(1);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(3);
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [phase, setPhase] = useState('setup');

  const [mode, setMode] = useState('hidden'); // hidden | show
  const [sens, setSens] = useState('balanced');
  const [teacher, setTeacher] = useState(!SR);

  const [ptr, setPtr] = useState(0); // words confirmed correct
  const [tentative, setTentative] = useState(0); // words heard but not final yet
  const [bad, setBad] = useState(null); // { index, kind, heard }
  const [revealed, setRevealed] = useState(-1);
  const [mistakes, setMistakes] = useState(0);
  const [listening, setListening] = useState(false);
  const [note, setNote] = useState('');
  const [heardText, setHeardText] = useState('');
  const [logVersion, setLogVersion] = useState(0);
  const [restarts, setRestarts] = useState(0);
  const [showDiag, setShowDiag] = useState(false);
  const isIOS = typeof navigator !== 'undefined' && /iP(hone|ad|od)/.test(navigator.userAgent);
  const standalone = typeof window !== 'undefined' && (window.navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches));
  const [playing, setPlaying] = useState(false);

  const recRef = useRef(null);
  const wantRef = useRef(false);
  const ptrRef = useRef(0);
  const baseRef = useRef(0);
  const logRef = useRef([]);
  const restartsRef = useRef([]);
  const lastErrorRef = useRef('');
  const pendingRef = useRef(null);
  const expectedRef = useRef([]);
  const thrRef = useRef(SENSITIVITY.balanced);
  const audioRef = useRef(null);

  useEffect(() => {
    getSurahs().then(setSurahs).catch(() => {});
    return () => {
      wantRef.current = false;
      if (recRef.current) {
        try { recRef.current.abort(); } catch { /* ignore */ }
      }
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    thrRef.current = SENSITIVITY[sens];
  }, [sens]);

  const meta = surahs && surahs.find((s) => s.number === Number(surah));
  const maxAyah = meta ? meta.numberOfAyahs : 7;

  const words = useMemo(() => {
    if (!data) return [];
    const out = [];
    data.ayahs.filter((a) => a.n >= from && a.n <= to).forEach((a) => {
      const start = out.length;
      a.text.split(/\s+/).filter(Boolean).forEach((tok) => {
        const n = normWord(tok);
        // pause marks such as ۛ are not spoken words: show them with the word before them
        if (!n) {
          if (out.length > start) out[out.length - 1].text += ` ${tok}`;
          return;
        }
        out.push({ text: tok, norm: n, ayah: a.n, last: false });
      });
      if (out.length > start) out[out.length - 1].last = true;
    });
    return out;
  }, [data, from, to]);

  useEffect(() => {
    expectedRef.current = words.map((w) => w.norm);
  }, [words]);

  const done = words.length > 0 && ptr >= words.length;

  // ---------- recognition ----------
  const stopRec = () => {
    wantRef.current = false;
    const r = recRef.current;
    if (r) {
      r.onresult = null;
      r.onend = null;
      r.onerror = null;
      try { r.abort(); } catch { /* ignore */ }
    }
    recRef.current = null;
    setListening(false);
    setTentative(0);
  };

  const commit = (newPtr) => {
    ptrRef.current = newPtr;
    setPtr(newPtr);
    setTentative(0);
  };

  const handleMistake = (m) => {
    stopRec();
    setBad(m);
    setMistakes((x) => x + 1);
    setNote('');
    buzz();
  };

  const wordsOf = (alt) => String(alt.transcript).trim().split(/\s+/).filter(Boolean);
  const log = (entry) => {
    logRef.current = [{ t: new Date().toLocaleTimeString(), ...entry }, ...logRef.current].slice(0, 12);
    setLogVersion((v) => v + 1);
  };

  // Phones differ from laptops: Android Chrome often repeats the whole phrase in every new result
  // ("ذلك" then "ذلك الكتاب" then "ذلك الكتاب لا ريب"), and it ends the session after short silences.
  // So each result is first collapsed (a result that just extends the one before it replaces it),
  // and everything is judged again from where this listening session began. Judging the same words
  // twice then gives the same answer instead of a false mistake.
  const collapse = (res) => {
    const segs = [];
    for (let i = 0; i < res.length; i += 1) {
      const alts = [];
      for (let k = 0; k < (res[i].length || 1); k += 1) if (res[i][k]) alts.push(wordsOf(res[i][k]));
      if (!alts.length || !alts[0].length) continue;
      const norm = alts[0].map(normWord).join(' ');
      const last = segs[segs.length - 1];
      if (last && (norm === last.norm || norm.startsWith(`${last.norm} `))) {
        segs[segs.length - 1] = { norm, alts, final: !!res[i].isFinal };
      } else {
        segs.push({ norm, alts, final: !!res[i].isFinal });
      }
    }
    return segs;
  };

  const handleResult = (e) => {
    const expected = expectedRef.current;
    const thr = thrRef.current;
    const segs = collapse(e.results);
    log({ results: e.results.length, flags: segs.map((x) => (x.final ? 'F' : 'i')).join(''), heard: segs.map((x) => x.alts[0].join(' ')).join(' | ') });
    if (!segs.length) return undefined;
    setHeardText(segs.map((x) => x.alts[0].join(' ')).join(' '));

    // 1) finished segments, judged from the start of this session (best of the engine's guesses)
    const finals = [];
    let i = 0;
    while (i < segs.length && segs[i].final) {
      finals.push(segs[i]);
      i += 1;
    }
    let ptr = baseRef.current;
    if (finals.length) {
      const guesses = Math.max(...finals.map((x) => x.alts.length));
      let best = null;
      for (let g = 0; g < guesses; g += 1) {
        const words = finals.flatMap((x) => x.alts[Math.min(g, x.alts.length - 1)]);
        const r = advance(expected, baseRef.current, words, thr);
        const better = !best || (!r.mistake && best.mistake) || (!!r.mistake === !!best.mistake && r.ptr > best.ptr);
        if (better) best = r;
      }
      ptr = best.ptr;
      commit(ptr);
      if (best.mistake) return handleMistake(best.mistake);
      if (ptr >= expected.length) return stopRec();
    }

    // 2) the part still being heard: shown as tentative. A mismatch that shows up twice in a row, in a
    //    word that is no longer the last one heard, counts as a real mistake without waiting for a pause.
    const live = segs.slice(i).flatMap((x) => x.alts[0]);
    if (live.length) {
      const stable = advance(expected, ptr, live.slice(0, -1), thr, { incomplete: true });
      if (stable.mistake) {
        const key = `${stable.mistake.index}:${stable.mistake.heard}`;
        if (pendingRef.current === key) {
          pendingRef.current = null;
          commit(stable.ptr);
          return handleMistake(stable.mistake);
        }
        pendingRef.current = key;
      } else {
        pendingRef.current = null;
      }
      setTentative(advance(expected, ptr, live, thr, { incomplete: true }).ptr);
    }
    return undefined;
  };

  const openRecognizer = () => {
    const rec = new SR();
    rec.lang = 'ar-SA';
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 3;
    baseRef.current = ptrRef.current; // this session starts where the confirmed words end
    pendingRef.current = null;
    rec.onresult = handleResult;
    rec.onerror = (ev) => {
      lastErrorRef.current = ev.error;
      log({ error: ev.error });
      if (ev.error === 'not-allowed') {
        wantRef.current = false;
        setNote('Microphone permission was blocked. Allow the microphone for this site (lock icon next to the address), then try again. Or use Teacher mode.');
        setListening(false);
      } else if (ev.error === 'service-not-allowed') {
        wantRef.current = false;
        setNote(isIOS
          ? 'On iPhone, turn on Settings, Siri and Search (or Keyboard, Enable Dictation), and open Amal in Safari, not from the home screen. Or use Teacher mode.'
          : 'Speech recognition is blocked on this device. Use Teacher mode.');
        setListening(false);
      } else if (ev.error === 'language-not-supported') {
        wantRef.current = false;
        setNote('Arabic speech recognition is not available on this device. Use Teacher mode.');
        setListening(false);
      } else if (ev.error === 'audio-capture') {
        wantRef.current = false;
        setNote('No microphone was found, or another app is using it.');
        setListening(false);
      } else if (ev.error === 'network') {
        wantRef.current = false;
        setNote('Speech recognition needs an internet connection.');
        setListening(false);
      }
      // "no-speech" and "aborted" are normal on phones; the session is simply restarted below
    };
    rec.onend = () => {
      if (!wantRef.current) {
        setListening(false);
        return;
      }
      // Phones end the session after a short silence. Restart it quietly, but give up if it keeps failing at once.
      const now = Date.now();
      restartsRef.current = restartsRef.current.filter((t) => now - t < 4000).concat(now);
      setRestarts((n) => n + 1);
      if (restartsRef.current.length > 6) {
        wantRef.current = false;
        setListening(false);
        setNote('The microphone keeps stopping on this device. Try again, or use Teacher mode.');
        return;
      }
      setTimeout(() => {
        if (!wantRef.current) return;
        try { openRecognizer(); } catch { setTimeout(() => { if (wantRef.current) { try { openRecognizer(); } catch { setListening(false); } } }, 400); }
      }, 250);
    };
    recRef.current = rec;
    rec.start();
  };

  const startListening = () => {
    if (!SR) return;
    setNote(window.isSecureContext ? '' : 'The microphone only works on a secure (https) page.');
    setBad(null);
    wantRef.current = true;
    restartsRef.current = [];
    setRestarts(0);
    buzz(1, false); // wakes up the audio system inside this tap
    try {
      openRecognizer();
      setListening(true);
    } catch {
      setNote('Could not start the microphone.');
    }
  };

  // ---------- manual (teacher) mode ----------
  const markRight = () => {
    if (done) return;
    setBad(null);
    commit(Math.min(words.length, ptrRef.current + 1));
  };
  const markWrong = () => {
    if (done) return;
    handleMistake({ index: ptrRef.current, kind: 'wrong', heard: '' });
  };
  useEffect(() => {
    if (phase !== 'practice' || !teacher) return undefined;
    const onKey = (e) => {
      if (e.target && /input|select|textarea/i.test(e.target.tagName)) return;
      if (e.key === ' ' || e.key === 'ArrowLeft') { e.preventDefault(); markRight(); }
      if (e.key === 'x' || e.key === 'X') markWrong();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, teacher, words.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- flow ----------
  const begin = async () => {
    setLoadError('');
    try {
      const d = await getSurah(Number(surah));
      setData(d);
      const f = Math.max(1, Math.min(Number(from) || 1, d.numberOfAyahs));
      const t = Math.max(f, Math.min(Number(to) || f, d.numberOfAyahs));
      setFrom(f);
      setTo(t);
      ptrRef.current = 0;
      setPtr(0);
      setTentative(0);
      setBad(null);
      setRevealed(-1);
      setMistakes(0);
      setPhase('practice');
    } catch (err) {
      setLoadError(err.message);
    }
  };

  const restart = () => {
    stopRec();
    ptrRef.current = 0;
    setPtr(0);
    setBad(null);
    setRevealed(-1);
    setMistakes(0);
    setNote('');
    setHeardText('');
  };

  const tryAgain = () => {
    setBad(null);
    setRevealed(-1);
    if (teacher) return;
    startListening();
  };
  const showWord = () => {
    if (bad) setRevealed(bad.index);
  };
  const skipWord = () => {
    const next = bad ? bad.index + 1 : ptrRef.current + 1;
    setBad(null);
    commit(Math.min(words.length, next));
    if (!teacher && next < words.length) startListening();
  };

  const playRange = () => {
    if (playing) {
      if (audioRef.current) audioRef.current.pause();
      setPlaying(false);
      return;
    }
    const list = data.ayahs.filter((a) => a.n >= from && a.n <= to);
    let i = 0;
    const audio = audioRef.current || new Audio();
    audioRef.current = audio;
    const next = () => {
      if (i >= list.length) return setPlaying(false);
      audio.src = audioUrl(settings.reciter, list[i].global);
      i += 1;
      audio.play().catch(() => setPlaying(false));
      return undefined;
    };
    audio.onended = next;
    audio.onerror = () => setPlaying(false);
    setPlaying(true);
    next();
  };

  const accuracy = ptr + mistakes ? Math.round((ptr / (ptr + mistakes)) * 100) : 100;
  const pct = words.length ? Math.round((ptr / words.length) * 100) : 0;

  // ---------- setup screen ----------
  if (phase === 'setup') {
    return (
      <>
        <PageHeader icon="mic" hue={350} title="Hifz listener (beta)" subtitle="Recite from memory. Amal follows your words and stops at a mistake." />
        <section className="card form">
          <h2>What will you recite?</h2>
          <label className="field">Surah
            <select value={surah} onChange={(e) => { setSurah(Number(e.target.value)); setFrom(1); setTo(Math.min(3, (surahs && surahs[Number(e.target.value) - 1]?.numberOfAyahs) || 3)); }}>
              {(surahs || []).map((s) => <option key={s.number} value={s.number}>{s.number}. {s.englishName}</option>)}
              {!surahs && <option value={1}>1. Al-Fatihah</option>}
            </select>
          </label>
          <div className="form-row">
            <label className="field">From verse<input type="number" min="1" max={maxAyah} value={from} onChange={(e) => setFrom(e.target.value)} /></label>
            <label className="field">To verse<input type="number" min="1" max={maxAyah} value={to} onChange={(e) => setTo(e.target.value)} /></label>
          </div>
          <p className="hint">This surah has {maxAyah} verses. Start with 1 to 3 verses and build up.</p>
          {loadError && <p className="tafsir-note">{loadError}</p>}
          <button className="btn btn-primary" onClick={begin}><Icon name="mic" size={18} /> Start practising</button>
        </section>
        <p className="note">
          This is a helper, not a teacher. It can catch a wrong, missing or extra word, but it cannot hear tajweed or
          short vowels (fatha, kasra, damma), and speech recognition makes mistakes, especially with young children.
          Please keep reciting to your teacher too.
        </p>
        {isIOS && standalone && <p className="notice-inline">Speech recognition does not work inside an installed iPhone app. Open Amal in Safari instead, or use Teacher mode.</p>}
        {!SR && <p className="notice-inline">This browser has no speech recognition. Use Chrome or Edge for listening mode. Teacher mode works everywhere: a parent or teacher taps right or wrong.</p>}
      </>
    );
  }

  // ---------- practice screen ----------
  const wordClass = (i) => {
    if (bad && bad.index === i) return 'hw is-bad';
    if (i < ptr) return 'hw is-ok';
    if (i < tentative) return 'hw is-tent';
    if (i === ptr) return 'hw is-cur';
    return 'hw';
  };
  const hiddenWord = (i) => mode === 'hidden' && i >= Math.max(ptr, tentative) && revealed !== i;

  return (
    <>
      <PageHeader icon="mic" hue={350} title={`${meta ? meta.englishName : 'Surah'} ${from}${to !== from ? ` to ${to}` : ''}`} subtitle={`${ptr} of ${words.length} words`} back={{ href: '#/hifz', label: 'Choose another passage', onClick: () => { stopRec(); setPhase('setup'); } }}>
        <div className="page-progress">
          <span className="bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></span>
          <span>{pct}%</span>
        </div>
      </PageHeader>

      <section className={bad ? 'hifz-board is-bad' : done ? 'hifz-board is-done' : 'hifz-board'} aria-live="polite">
        <p className="hifz-text" lang="ar" dir="rtl" style={{ fontSize: `${settings.arabicSize}px` }}>
          {words.map((w, i) => (
            <span key={i}>
              {hiddenWord(i) ? (
                <span className={bad && bad.index === i ? 'hw hw-mask is-bad' : i === ptr ? 'hw hw-mask is-cur' : 'hw hw-mask'} style={{ width: `${Math.max(1.6, w.norm.length * 0.5)}em` }} aria-label="hidden word" />
              ) : (
                <span className={wordClass(i)}>{w.text}</span>
              )}
              {w.last && <span className="hw-end">{`\u06DD${digits(w.ayah)}`}</span>}{' '}
            </span>
          ))}
        </p>
      </section>

      {bad && (
        <section className="hifz-alert" role="alert">
          <strong>Stopped at word {bad.index + 1}</strong>
          <p>
            {bad.kind === 'skipped' ? 'A word seems to be missing here.' : bad.heard ? 'This does not match the word.' : 'Marked as a mistake.'}
            {bad.heard ? <> I heard <span lang="ar" dir="rtl" className="heard">{bad.heard}</span>.</> : null}
          </p>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={tryAgain}><Icon name="rotate" size={18} /> Try again from here</button>
            <button className="btn btn-ghost" onClick={showWord}>Show the word</button>
            <button className="btn btn-ghost" onClick={skipWord}>Skip this word</button>
          </div>
        </section>
      )}

      {done && (
        <section className="hifz-result">
          <Icon name="check-circle" size={34} />
          <h2>{mistakes === 0 ? 'Masha Allah, no mistakes' : 'Passage finished'}</h2>
          <p>{mistakes} {mistakes === 1 ? 'mistake' : 'mistakes'}, {accuracy}% of attempts correct.</p>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={restart}><Icon name="rotate" size={18} /> Recite it again</button>
            <a className="btn btn-ghost" href="#/hifz" onClick={() => setPhase('setup')}>Choose another passage</a>
          </div>
        </section>
      )}

      {!done && !bad && (
        <section className="hifz-controls">
          {teacher ? (
            <div className="teacher">
              <button className="big-btn is-right" onClick={markRight}><Icon name="check" size={26} /> Correct word</button>
              <button className="big-btn is-wrong" onClick={markWrong}><Icon name="close" size={26} /> Mistake</button>
              <p className="hint">Shortcuts: Space for correct, X for a mistake.</p>
            </div>
          ) : (
            <button className={listening ? 'mic-btn is-live' : 'mic-btn'} onClick={listening ? stopRec : startListening} aria-pressed={listening}>
              <Icon name="mic" size={30} />
              <span>{listening ? 'Listening… tap to pause' : 'Tap and start reciting'}</span>
            </button>
          )}
          {!teacher && heardText && <p className="heard-line">I heard: <span lang="ar" dir="rtl">{heardText}</span></p>}
          {note && <p className="notice-inline">{note}</p>}
        </section>
      )}

      <section className="card hifz-options">
        <div className="opt">
          <span>Text</span>
          <div className="seg" role="group" aria-label="Text mode">
            <button className={mode === 'hidden' ? 'is-on' : ''} onClick={() => setMode('hidden')} aria-pressed={mode === 'hidden'}>Hidden</button>
            <button className={mode === 'show' ? 'is-on' : ''} onClick={() => setMode('show')} aria-pressed={mode === 'show'}>Show</button>
          </div>
        </div>
        <div className="opt">
          <span>Strictness</span>
          <div className="seg" role="group" aria-label="Strictness">
            {Object.keys(SENSITIVITY).map((k) => (
              <button key={k} className={sens === k ? 'is-on' : ''} onClick={() => setSens(k)} aria-pressed={sens === k}>{k[0].toUpperCase() + k.slice(1)}</button>
            ))}
          </div>
        </div>
        <label className="check">
          <input type="checkbox" checked={teacher} disabled={!SR && teacher} onChange={(e) => { stopRec(); setTeacher(e.target.checked); }} />
          Teacher mode (a parent or teacher taps right or wrong)
        </label>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={() => setRevealed(ptr)} disabled={done}>Hint: show next word</button>
          <button className="btn btn-ghost" onClick={playRange}><Icon name={playing ? 'pause' : 'play'} size={18} filled /> {playing ? 'Stop audio' : 'Listen to it first'}</button>
          <button className="btn btn-ghost" onClick={restart}><Icon name="rotate" size={18} /> Start over</button>
        </div>
        <p className="hint">In Chrome, your voice is sent to Google's speech service to be turned into words. Nothing is saved by Amal.</p>
        <button className="link-btn" onClick={() => setShowDiag((v) => !v)}>{showDiag ? 'Hide diagnostics' : 'Diagnostics (for troubleshooting)'}</button>
        {showDiag && (
          <div className="diag" data-v={logVersion}>
            <p>Secure page: {String(window.isSecureContext)} | Engine: {SR ? (window.SpeechRecognition ? 'SpeechRecognition' : 'webkitSpeechRecognition') : 'none'} | Restarts: {restarts} | Last error: {lastErrorRef.current || 'none'}</p>
            <p className="diag-ua">{navigator.userAgent}</p>
            <ul>{logRef.current.map((l, i) => <li key={i}>{l.t} {l.error ? `error: ${l.error}` : `results ${l.results} [${l.flags}] ${l.heard}`}</li>)}</ul>
            <button className="btn btn-ghost" onClick={() => navigator.clipboard && navigator.clipboard.writeText(`${navigator.userAgent}\nrestarts ${restarts}, last error ${lastErrorRef.current || 'none'}\n${logRef.current.map((l) => (l.error ? `${l.t} error ${l.error}` : `${l.t} ${l.results} [${l.flags}] ${l.heard}`)).join('\n')}`)}>Copy diagnostics</button>
          </div>
        )}
      </section>
    </>
  );
}
