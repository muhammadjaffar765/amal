import { useEffect } from 'react';
import { PALETTES, READ_THEMES, RECITERS, TAFSIRS, TAFSIR_LANGS, UR_EDITIONS } from '../themes.js';
import Icon from './Icon.jsx';

const MODES = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'Auto' },
];

export default function SettingsPanel({ open, settings, onChange, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Display settings">
        <div className="drawer-head">
          <h2>Display</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close settings">
            <Icon name="close" />
          </button>
        </div>

        <section className="setting">
          <h3>Colour theme</h3>
          <div className="palettes">
            {PALETTES.map((p) => (
              <button
                key={p.id}
                className={settings.palette === p.id ? 'palette is-on' : 'palette'}
                onClick={() => onChange({ palette: p.id })}
                aria-pressed={settings.palette === p.id}
              >
                <span className="swatch" style={{ background: `linear-gradient(135deg, ${p.colors[0]} 55%, ${p.colors[1]} 55%)` }} />
                {p.name}
              </button>
            ))}
          </div>
        </section>

        <section className="setting">
          <h3>Appearance</h3>
          <div className="seg" role="group" aria-label="Appearance">
            {MODES.map((m) => (
              <button
                key={m.id}
                className={settings.mode === m.id ? 'is-on' : ''}
                aria-pressed={settings.mode === m.id}
                onClick={() => onChange({ mode: m.id })}
              >
                {m.label}
              </button>
            ))}
          </div>
        </section>

        <section className="setting">
          <h3>Arabic text size</h3>
          <input
            type="range"
            min="14"
            max="72"
            step="1"
            value={settings.arabicSize}
            onChange={(e) => onChange({ arabicSize: Number(e.target.value) })}
            aria-label="Arabic text size"
          />
          <p className="arabic setting-preview" lang="ar" dir="rtl" style={{ fontSize: `${settings.arabicSize}px` }}>
            ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ
          </p>
        </section>

        <section className="setting">
          <h3>Translation text size</h3>
          <input type="range" min="12" max="44" step="1" value={settings.transSize} onChange={(e) => onChange({ transSize: Number(e.target.value) })} aria-label="Translation text size" />
          <p className="sheet-text" style={{ fontSize: `${settings.transSize}px` }}>In the name of Allah, the Entirely Merciful.</p>
        </section>

        <section className="setting">
          <h3>Reading</h3>
          <div className="seg" role="group" aria-label="Translation language in the verse panel">
            <button className={settings.transLang === 'en' ? 'is-on' : ''} aria-pressed={settings.transLang === 'en'} onClick={() => onChange({ transLang: 'en' })}>English</button>
            <button className={settings.transLang === 'ur' ? 'is-on' : ''} aria-pressed={settings.transLang === 'ur'} onClick={() => onChange({ transLang: 'ur' })}>اردو</button>
          </div>
          <div className="seg" role="group" aria-label="How a surah opens">
            <button className={settings.readMode !== 'pages' ? 'is-on' : ''} aria-pressed={settings.readMode !== 'pages'} onClick={() => onChange({ readMode: 'scroll' })}>Scroll</button>
            <button className={settings.readMode === 'pages' ? 'is-on' : ''} aria-pressed={settings.readMode === 'pages'} onClick={() => onChange({ readMode: 'pages' })}>Mushaf pages</button>
          </div>
          <label className="field">Urdu translation
            <select value={settings.urEdition} onChange={(e) => onChange({ urEdition: e.target.value })}>
              {UR_EDITIONS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </label>
          <div className="seg" role="group" aria-label="Reading page colour">
            {READ_THEMES.map((t) => (
              <button key={t.id} className={settings.readTheme === t.id ? 'is-on' : ''} aria-pressed={settings.readTheme === t.id} onClick={() => onChange({ readTheme: t.id })}>{t.name}</button>
            ))}
          </div>
          <p className="hint">The translation opens when you tap a verse. It stays hidden while you read. If the chosen Urdu translation is not available, Amal uses the next one.</p>
        </section>

        <section className="setting">
          <h3>Adhkar and dua translations</h3>
          <label className="check">
            <input type="checkbox" checked={settings.showEnglish} onChange={(e) => onChange({ showEnglish: e.target.checked })} />
            English (Saheeh International)
          </label>
          <label className="check">
            <input type="checkbox" checked={settings.showUrdu} onChange={(e) => onChange({ showUrdu: e.target.checked })} />
            Urdu (Jalandhry)
          </label>
        </section>

        <section className="setting">
          <h3>Adhkar and counters</h3>
          <label className="check">
            <input type="checkbox" checked={settings.translit} onChange={(e) => onChange({ translit: e.target.checked })} />
            Show transliteration
          </label>
          <label className="check">
            <input type="checkbox" checked={settings.haptics} onChange={(e) => onChange({ haptics: e.target.checked })} />
            Vibrate when counting (phones)
          </label>
        </section>

        <section className="setting">
          <h3>Tafsir</h3>
          <label className="field">
            Commentary book
            <select value={settings.tafsir} onChange={(e) => onChange({ tafsir: e.target.value })}>
              {Object.entries(TAFSIR_LANGS).map(([lang, label]) => (
                <optgroup key={lang} label={label}>
                  {TAFSIRS.filter((t) => t.lang === lang).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <p className="hint">Tap the book icon on any verse to read its tafsir.</p>
        </section>

        <section className="setting">
          <h3>Audio</h3>
          <label className="field">
            Reciter
            <select value={settings.reciter} onChange={(e) => onChange({ reciter: e.target.value })}>
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <label className="check">
            <input type="checkbox" checked={settings.autoNext} onChange={(e) => onChange({ autoNext: e.target.checked })} />
            Play the next verse automatically
          </label>
        </section>
      </aside>
    </>
  );
}
