import { Fragment } from 'react';
import { BISMILLAH } from './MushafText.jsx';

// A surah laid out like the South Asian printed Quran: a banner with the number of verses, rukus and the place of
// revelation, the verses one after another with the number in brackets, and a ruku mark (ع) where a ruku ends.
// Tap a verse to select it. Note: this uses the Uthmani text of the app; the exact Indo-Pak lettering needs its own font.
export default function IndoPakText({ surah, ayahs, size, selected, playing, onSelect, showBismillah }) {
  const rukus = [...new Set(ayahs.map((a) => a.ruku).filter(Boolean))];
  const rukuNo = (r) => rukus.indexOf(r) + 1;
  const name = String(surah.name || '').replace(/^سُورَةُ\s*/, '').replace(/^سورة\s*/, '');
  return (
    <div className="ip" lang="ar" dir="rtl" style={{ fontSize: `${size}px` }}>
      <div className="ip-banner">
        <div className="ip-cell"><small>آیتھا</small><b>{surah.numberOfAyahs}</b></div>
        <div className="ip-cell"><small>رکوعاتھا</small><b>{rukus.length || '-'}</b></div>
        <div className="ip-name"><span>{name}</span><small>{surah.revelationType === 'Meccan' ? 'مکیہ' : 'مدنیہ'}</small></div>
        <div className="ip-cell"><small>نمبر</small><b>{surah.number}</b></div>
      </div>
      {showBismillah && <p className="ip-bism">{BISMILLAH}</p>}
      <p className="ip-flow">
        {ayahs.map((a, i) => {
          const isSel = selected && selected.global === a.global;
          const isPlaying = playing && playing.global === a.global;
          const rukuEnds = a.ruku && (!ayahs[i + 1] || ayahs[i + 1].ruku !== a.ruku);
          return (
            <Fragment key={a.global}>
              <span
                data-g={a.global}
                role="button"
                tabIndex={0}
                className={`ay ip-ay${isSel ? ' is-sel' : ''}${isPlaying ? ' is-playing' : ''}`}
                onClick={() => onSelect(a)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(a)}
              >{a.text}</span>
              <span className="ip-num">({a.n})</span>{' '}
              {rukuEnds && (
                <span className="ip-ruku" role="separator">
                  <span className="ip-line" />
                  <span className="ip-ruku-mark" aria-label={`Ruku ${rukuNo(a.ruku)}`}>ع<small>{rukuNo(a.ruku)}</small></span>
                  <span className="ip-line" />
                </span>
              )}
            </Fragment>
          );
        })}
      </p>
    </div>
  );
}
