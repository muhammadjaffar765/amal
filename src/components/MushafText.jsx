import { Cartouche } from './MushafFrame.jsx';

export const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';
const digits = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

// Continuous Mushaf-style text: verses run on from each other, each ending in a numbered marker.
// Tap a verse to select it. Highlighted verses are coloured, and a small dot shows a verse that has a note.
// With `headers`, an ornamented surah banner (and Bismillah) appears where a surah begins.
export default function MushafText({ ayahs, size, selected, playing, onSelect, headers = false, marks = {} }) {
  const blocks = [];
  let flow = null;
  ayahs.forEach((a) => {
    if (headers && a.n === 1 && a.surah) {
      blocks.push({ type: 'banner', surah: a.surah });
      flow = null;
    }
    if (!flow) {
      flow = { type: 'flow', items: [] };
      blocks.push(flow);
    }
    flow.items.push(a);
  });

  return (
    <div className="mushaf" lang="ar" dir="rtl" style={{ fontSize: `${size}px` }}>
      {blocks.map((b, i) =>
        b.type === 'banner' ? (
          <div key={`b${i}`} className="banner-wrap">
            <Cartouche name={b.surah.name} ayahs={b.surah.numberOfAyahs} type={b.surah.revelationType} />
            {b.surah.number !== 1 && b.surah.number !== 9 && <p className="banner-bism">{BISMILLAH}</p>}
          </div>
        ) : (
          <p key={`f${i}`} className="flow">
            {b.items.map((a) => {
              const m = a.surah ? marks[`${a.surah.number}:${a.n}`] : null;
              return (
                <span
                  key={a.global}
                  data-g={a.global}
                  role="button"
                  tabIndex={0}
                  aria-label={`Verse ${a.n}`}
                  className={`ay${selected && selected.global === a.global ? ' is-sel' : ''}${playing && playing.global === a.global ? ' is-playing' : ''}${m && m.color ? ` hl hl-${m.color}` : ''}`}
                  onClick={() => onSelect(a)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(a);
                    }
                  }}
                >
                  {a.text}
                  <span className="end">{digits(a.n)}</span>
                  {m && m.note && m.note.trim() && <span className="note-dot" title="You wrote a note here" />}{' '}
                </span>
              );
            })}
          </p>
        )
      )}
    </div>
  );
}
