import { useEffect, useState } from 'react';
import { getSurahArabic, getSurahs } from '../api.js';

const digits = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

// Shows exact Quran text for ranges such as [{ s: 2, from: 255, to: 257 }] (no from/to = whole surah).
export default function QuranText({ parts, size = 32, labels = true }) {
  const [state, setState] = useState({ status: 'loading', blocks: [] });
  const [attempt, setAttempt] = useState(0);
  const partsKey = JSON.stringify(parts);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', blocks: [] });
    Promise.all([getSurahs(), ...parts.map((p) => getSurahArabic(p.s))])
      .then(([list, ...surahs]) => {
        if (cancelled) return;
        const blocks = parts.map((p, i) => {
          const ayahs = surahs[i].filter((a) => (!p.from || a.n >= p.from) && (!p.to || a.n <= p.to));
          const meta = list.find((s) => s.number === p.s);
          const range = p.from ? ` ${p.s}:${p.from}${p.to && p.to !== p.from ? `-${p.to}` : ''}` : '';
          return {
            key: `${p.s}:${p.from || 1}-${p.to || 'end'}`,
            label: meta ? `Surah ${meta.englishName}${range}` : '',
            text: ayahs.map((a) => `${a.text} \u06DD${digits(a.n)}`).join(' '),
          };
        });
        setState({ status: 'ready', blocks });
      })
      .catch(() => !cancelled && setState({ status: 'error', blocks: [] }));
    return () => {
      cancelled = true;
    };
  }, [partsKey, attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state.status === 'loading') {
    return (
      <div aria-hidden="true">
        <span className="skeleton" />
        <span className="skeleton short" />
      </div>
    );
  }
  if (state.status === 'error') {
    return (
      <p className="tafsir-note">
        The verses could not load. Check your connection.{' '}
        <button className="link-btn" onClick={() => setAttempt((a) => a + 1)}>
          Try again
        </button>
      </p>
    );
  }
  return (
    <div className="quran-text">
      {state.blocks.map((b) => (
        <div key={b.key}>
          {labels && b.label && <p className="quran-label">{b.label}</p>}
          <p className="arabic" lang="ar" dir="rtl" style={{ fontSize: `${size}px` }}>
            {b.text}
          </p>
        </div>
      ))}
    </div>
  );
}
