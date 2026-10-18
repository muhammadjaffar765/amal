import Icon from './Icon.jsx';

export default function Bookmarks({ bookmarks, onRemove }) {
  return (
    <>
      <div className="section-head">
        <h2>Saved verses</h2>
      </div>

      {bookmarks.length === 0 ? (
        <div className="empty-card">
          <Icon name="bookmark" size={28} />
          <p>No saved verses yet. Tap the bookmark icon on any verse to keep it here.</p>
          <a className="btn btn-primary" href="#/">
            Start reading
          </a>
        </div>
      ) : (
        <ul className="results">
          {bookmarks.map((b) => (
            <li key={b.id} className="saved">
              <a className="result" href={`#/surah/${b.surah}?ayah=${b.ayah}`}>
                <span className="result-ref">
                  Surah {b.surahName} {b.surah}:{b.ayah}
                </span>
                <span className="saved-arabic" lang="ar" dir="rtl">
                  {b.text}
                </span>
                <span className="result-text">{b.en}</span>
              </a>
              <button className="icon-btn" onClick={() => onRemove(b)} aria-label={`Remove ${b.surahName} ${b.surah}:${b.ayah}`}>
                <Icon name="close" size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
