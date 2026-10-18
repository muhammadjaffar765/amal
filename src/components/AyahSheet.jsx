import { useEffect, useState } from 'react';
import { getTafsir } from '../api.js';
import { HL_COLORS, TAFSIRS } from '../themes.js';
import { makeVerseImage } from '../shareImage.js';
import Icon from './Icon.jsx';
import Marked from './Marked.jsx';

// The panel that opens when a verse is tapped: translation (English | Urdu switch always visible),
// tafsir, and your own note. You can colour the verse, and highlight any words you select in the
// translation or tafsir, like marking a printed copy.
export default function AyahSheet({
  ayah, settings, onSettings, onClose, isPlaying, onPlay, bookmarked, onBookmark, onMarkRead,
  urduMissing, onRetry, urLabel, mark, onMark, snips, onSnips,
}) {
  const lang = settings.transLang === 'ur' ? 'ur' : 'en';
  const [panel, setPanel] = useState('trans'); // trans | tafsir | note
  const [tafsir, setTafsir] = useState({ status: 'idle', text: '' });
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [color, setColor] = useState('yellow');
  const [hint, setHint] = useState('');
  const surahNo = ayah.surah.number;
  const key = `${surahNo}:${ayah.n}`;
  const meta = TAFSIRS.find((t) => t.id === settings.tafsir) || TAFSIRS[0];
  const base = { surah: surahNo, ayah: ayah.n, name: ayah.surah.englishName, text: ayah.text };

  useEffect(() => {
    setPanel('trans');
    setHint('');
    setTafsir({ status: 'idle', text: '' });
  }, [ayah.global]);

  useEffect(() => {
    if (panel !== 'tafsir') return undefined;
    let cancelled = false;
    setTafsir({ status: 'loading', text: '' });
    const wanted = TAFSIRS.find((t) => t.id === settings.tafsir) || TAFSIRS[0];
    const order = [wanted, ...TAFSIRS.filter((t) => t.lang === wanted.lang && t.id !== wanted.id)];
    (async () => {
      let failed = 0;
      for (const book of order) {
        try {
          const map = await getTafsir(book.id, surahNo);
          if (map[ayah.n]) return { text: map[ayah.n], book };
        } catch { failed += 1; }
      }
      if (failed === order.length) throw new Error('offline');
      return { text: '', book: wanted };
    })()
      .then((r) => !cancelled && setTafsir({ status: 'ready', text: r.text, book: r.book }))
      .catch(() => !cancelled && setTafsir({ status: 'error', text: '' }));
    return () => {
      cancelled = true;
    };
  }, [panel, settings.tafsir, surahNo, ayah.n]);

  // leave room under the page so the last verses can be scrolled above the panel
  useEffect(() => {
    document.body.classList.add('sheet-open');
    return () => document.body.classList.remove('sheet-open');
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const ref = `Surah ${ayah.surah.englishName} ${surahNo}:${ayah.n}`;
  const size = settings.transSize;
  const bump = (d) => onSettings({ transSize: Math.max(14, Math.min(32, size + d)) });
  const where = panel === 'trans' ? lang : panel;
  const mine = snips.filter((s) => s.key === key && s.where === where);

  const saveSnippet = () => {
    const sel = window.getSelection ? window.getSelection().toString().trim() : '';
    if (!sel) {
      setHint('Press and hold on some words, select them, then tap Highlight.');
      return;
    }
    setHint('');
    if (!snips.some((s) => s.key === key && s.where === where && s.text === sel)) {
      onSnips((list) => [...list, { id: `${Date.now().toString(36)}${list.length}`, key, where, text: sel, color, ref, surah: surahNo, ayah: ayah.n }]);
    }
    window.getSelection().removeAllRanges();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${ayah.text}\n\n${lang === 'ur' ? ayah.ur : ayah.en}\n\n(${ref})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard can be blocked */
    }
  };

  const share = async () => {
    setSharing(true);
    try {
      const blob = await makeVerseImage({ arabic: ayah.text, english: ayah.en, reference: ref });
      const file = new File([blob], `amal-${surahNo}-${ayah.n}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: ref });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } catch {
      /* the share sheet was closed */
    } finally {
      setSharing(false);
    }
  };

  const noPointerSteal = (e) => e.preventDefault(); // keeps the text selection when the button is pressed

  return (
    <aside className="sheet" role="dialog" aria-label={`Verse ${ayah.n} details`}>
      <div className="sheet-head">
        <strong>{ref}</strong>
        <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" size={18} /></button>
      </div>

      <div className="sheet-tabs">
        <div className="seg" role="group" aria-label="Translation language">
          <button className={panel === 'trans' && lang === 'en' ? 'is-on' : ''} aria-pressed={panel === 'trans' && lang === 'en'} onClick={() => { setPanel('trans'); onSettings({ transLang: 'en' }); }}>English</button>
          <button className={panel === 'trans' && lang === 'ur' ? 'is-on' : ''} aria-pressed={panel === 'trans' && lang === 'ur'} onClick={() => { setPanel('trans'); onSettings({ transLang: 'ur' }); }}>اردو</button>
        </div>
        <button className={panel === 'tafsir' ? 'chip is-on' : 'chip'} aria-pressed={panel === 'tafsir'} onClick={() => setPanel('tafsir')}>Tafsir</button>
        <button className={panel === 'note' ? 'chip is-on' : 'chip'} aria-pressed={panel === 'note'} onClick={() => setPanel('note')}>
          Note{mark && mark.note && mark.note.trim() ? ' ✎' : ''}
        </button>
      </div>

      <div className="hl-row" role="group" aria-label="Highlight colour">
        <span>Highlight verse</span>
        {HL_COLORS.map((c) => (
          <button key={c} className={`swatch sw-${c}${mark && mark.color === c ? ' is-on' : ''}`} aria-label={`Highlight ${c}`} aria-pressed={!!mark && mark.color === c} onClick={() => { setColor(c); onMark(base, { color: mark && mark.color === c ? '' : c }); }}>
            {mark && mark.color === c && <Icon name="check" size={14} />}
          </button>
        ))}
        {mark && mark.color && <button className="link-btn" onClick={() => onMark(base, { color: '' })}>Clear</button>}
      </div>

      <div className="sheet-body">
        {panel === 'trans' && lang === 'en' && (ayah.en
          ? <p className="sheet-text" style={{ fontSize: `${size}px` }}><Marked text={ayah.en} snips={mine} /></p>
          : <p className="tafsir-note">English translation is not available.</p>)}
        {panel === 'trans' && lang === 'ur' && (
          ayah.ur ? (
            <>
              <p className="sheet-text urdu" lang="ur" dir="rtl" style={{ fontSize: `${size + 2}px` }}><Marked text={ayah.ur} snips={mine} /></p>
              {urLabel && <p className="caption">Translation: {urLabel}</p>}
            </>
          ) : (
            <p className="tafsir-note">
              {urduMissing ? 'The Urdu translation could not load right now. ' : 'Urdu translation is not available for this verse. '}
              {onRetry && <button className="link-btn" onClick={onRetry}>Try again</button>}
            </p>
          )
        )}
        {panel === 'tafsir' && (
          <>
            <label className="tafsir-pick">Book
              <select value={settings.tafsir} onChange={(e) => onSettings({ tafsir: e.target.value })}>
                {['ur', 'en', 'ar'].map((l) => (
                  <optgroup key={l} label={l === 'ur' ? 'Urdu' : l === 'en' ? 'English' : 'Arabic'}>
                    {TAFSIRS.filter((t) => t.lang === l).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
            {tafsir.status === 'ready' && tafsir.text && tafsir.book && tafsir.book.id !== settings.tafsir && <p className="tafsir-note">{meta.name} has nothing for this verse, so this is from {tafsir.book.name}.</p>}
            {tafsir.status === 'loading' && <span className="skeleton" />}
            {tafsir.status === 'error' && <p className="tafsir-note">Tafsir could not load. Check your connection.</p>}
            {tafsir.status === 'ready' && (tafsir.text
              ? <p className={`tafsir-text lang-${(tafsir.book || meta).lang}`} lang={(tafsir.book || meta).lang} dir={(tafsir.book || meta).lang === 'en' ? 'ltr' : 'rtl'} style={{ fontSize: `${(tafsir.book || meta).lang === 'en' ? size : size + 2}px` }}><Marked text={tafsir.text} snips={mine} /></p>
              : <p className="tafsir-note">This edition has no separate commentary for this verse. It is usually covered in a nearby verse.</p>)}
            <p className="caption">For Sirat-ul-Jinan and Kanz-ul-Irfan, open the official site of <a href="https://www.dawateislami.net/quran/search" target="_blank" rel="noopener noreferrer">Dawat-e-Islami</a>.</p>
          </>
        )}
        {panel === 'note' && (
          <label className="field note-field">
            How will I act on this verse?
            <textarea
              rows={4}
              value={(mark && mark.note) || ''}
              placeholder="Write what you learned and what you will do about it today."
              onChange={(e) => onMark(base, { note: e.target.value })}
            />
            <span className="caption">Saved on this device. Find all your notes in More, My Amal notes.</span>
          </label>
        )}

        {panel !== 'note' && (
          <div className="snip-bar">
            <button className="btn btn-ghost" onPointerDown={noPointerSteal} onMouseDown={noPointerSteal} onClick={saveSnippet}>
              <Icon name="edit" size={16} /> Highlight selected words
            </button>
            {hint && <span className="caption">{hint}</span>}
          </div>
        )}
        {panel !== 'note' && mine.length > 0 && (
          <ul className="snips">
            {mine.map((s) => (
              <li key={s.id} className={`hl hl-${s.color}`}>
                <span>{s.text}</span>
                <button className="icon-btn" aria-label="Remove highlight" onClick={() => onSnips((list) => list.filter((x) => x.id !== s.id))}><Icon name="close" size={14} /></button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sheet-actions">
        <button className={isPlaying ? 'icon-btn is-on' : 'icon-btn'} onClick={onPlay} aria-label={isPlaying ? 'Pause' : 'Play this verse'}><Icon name={isPlaying ? 'pause' : 'play'} size={18} filled /></button>
        <button className={bookmarked ? 'icon-btn is-on' : 'icon-btn'} onClick={onBookmark} aria-pressed={bookmarked} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}><Icon name="bookmark" size={18} filled={bookmarked} /></button>
        <button className="icon-btn" onClick={copy} aria-label="Copy"><Icon name={copied ? 'check' : 'copy'} size={18} /></button>
        <button className="icon-btn" onClick={share} disabled={sharing} aria-label="Share as image"><Icon name="share" size={18} /></button>
        <button className="icon-btn" onClick={onMarkRead} aria-label="Mark as last read"><Icon name="flag" size={18} /></button>
        <span className="sheet-size">
          <button className="icon-btn" onClick={() => bump(-2)} aria-label="Smaller translation text" disabled={size <= 14}><Icon name="type" size={14} /></button>
          <button className="icon-btn" onClick={() => bump(2)} aria-label="Larger translation text" disabled={size >= 32}><Icon name="type" size={20} /></button>
        </span>
      </div>
    </aside>
  );
}
