import { useState } from 'react';
import { searchQuran } from '../api.js';
import Icon from './Icon.jsx';

const LANGS = [
  { id: 'en', label: 'English' },
  { id: 'ur', label: 'Urdu' },
  { id: 'ar', label: 'Arabic' },
];
const MAX_SHOWN = 60;

function Highlight({ text, term }) {
  const clean = term.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!clean) return text;
  const parts = text.split(new RegExp(`(${clean})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === term.trim().toLowerCase() ? <mark key={i}>{part}</mark> : part
  );
}

export default function SearchView() {
  const [term, setTerm] = useState('');
  const [lang, setLang] = useState('en');
  const [result, setResult] = useState(null); // { term, lang, count, matches }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    setLoading(true);
    setError('');
    try {
      const data = await searchQuran(q, lang);
      setResult({ term: q, lang, count: data.count || 0, matches: data.matches || [] });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="section-head">
        <h2>Search the Quran</h2>
      </div>

      <form className="search-form" onSubmit={submit}>
        <label className="search-box wide">
          <Icon name="search" size={18} />
          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder={lang === 'en' ? 'Try “patience” or “mercy”' : lang === 'ur' ? 'کوئی لفظ لکھیں' : 'اكتب كلمة'}
            aria-label="Search word"
            dir={lang === 'en' ? 'ltr' : 'rtl'}
          />
        </label>
        <div className="seg" role="group" aria-label="Search language">
          {LANGS.map((l) => (
            <button
              type="button"
              key={l.id}
              className={lang === l.id ? 'is-on' : ''}
              aria-pressed={lang === l.id}
              onClick={() => setLang(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading || !term.trim()}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <div className="notice"><p>{error}</p></div>}

      {!result && !error && (
        <p className="empty">Search for any word in the English, Urdu or Arabic text. Results link straight to the verse.</p>
      )}

      {result && result.count === 0 && (
        <p className="empty">No verses found for “{result.term}”. Try a shorter or different word.</p>
      )}

      {result && result.count > 0 && (
        <>
          <p className="result-count">
            {result.count} {result.count === 1 ? 'verse' : 'verses'} found
            {result.count > MAX_SHOWN ? `, showing the first ${MAX_SHOWN}` : ''}
          </p>
          <ul className="results">
            {result.matches.slice(0, MAX_SHOWN).map((m) => (
              <li key={m.number}>
                <a className="result" href={`#/surah/${m.surah.number}?ayah=${m.numberInSurah}`}>
                  <span className="result-ref">
                    Surah {m.surah.englishName} {m.surah.number}:{m.numberInSurah}
                  </span>
                  {result.lang === 'en' ? (
                    <span className="result-text">
                      <Highlight text={m.text} term={result.term} />
                    </span>
                  ) : (
                    <span
                      className={result.lang === 'ur' ? 'result-text urdu' : 'result-text arabic-result'}
                      lang={result.lang}
                      dir="rtl"
                    >
                      {m.text}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
