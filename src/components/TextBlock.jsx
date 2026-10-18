import QuranText from './QuranText.jsx';

// Arabic (or Quran verses) with transliteration and translations, following the user's settings.
export default function TextBlock({ item, settings }) {
  return (
    <div className="text-block">
      {item.quran ? (
        <QuranText parts={item.quran} size={settings.arabicSize} />
      ) : (
        <p className="arabic" lang="ar" dir="rtl" style={{ fontSize: `${settings.arabicSize}px` }}>
          {item.arabic}
        </p>
      )}
      {settings.translit && item.translit && <p className="translit">{item.translit}</p>}
      {settings.showEnglish && item.en && <p className="translation">{item.en}</p>}
      {settings.showUrdu && item.ur && (
        <p className="translation urdu" lang="ur" dir="rtl">
          {item.ur}
        </p>
      )}
    </div>
  );
}
