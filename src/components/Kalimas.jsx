import { useState } from 'react';
import { KALIMAS } from '../data/kalimas.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';
import StarBadge from './StarBadge.jsx';
import ListenBar from './ListenBar.jsx';

export default function Kalimas({ settings, onSettings }) {
  const lang = settings.transLang === 'ur' ? 'ur' : 'en';
  const [copied, setCopied] = useState(null);
  const copy = async (k) => {
    try {
      await navigator.clipboard.writeText(`${k.arabic}\n\n${k.translit}\n\n${lang === 'ur' ? k.ur : k.en}`);
      setCopied(k.id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard can be blocked */
    }
  };
  return (
    <>
      <PageHeader icon="sparkles" hue={140} title="The Six Kalimas" subtitle="Arabic, transliteration and meaning." />
      <ListenBar id="kalimas" title="the Six Kalimas" query="Six Kalimas recitation" />
      <p className="note">These are the texts as commonly printed in South Asian prayer books. Wording can differ a little between editions, so please check them against a printed copy you trust.</p>
      <div className="seg lang-seg" role="group" aria-label="Meaning language">
        <button className={lang === 'en' ? 'is-on' : ''} aria-pressed={lang === 'en'} onClick={() => onSettings({ transLang: 'en' })}>English</button>
        <button className={lang === 'ur' ? 'is-on' : ''} aria-pressed={lang === 'ur'} onClick={() => onSettings({ transLang: 'ur' })}>اردو</button>
      </div>
      {KALIMAS.map((k) => (
        <article key={k.id} className="dhikr kalima">
          <div className="kalima-head">
            <StarBadge n={k.id} size={42} />
            <div>
              <h2>{k.name}</h2>
              <p>{k.meaning}</p>
            </div>
            <button className="icon-btn" onClick={() => copy(k)} aria-label={`Copy ${k.name}`}><Icon name={copied === k.id ? 'check' : 'copy'} size={18} /></button>
          </div>
          <p className="arabic" lang="ar" dir="rtl" style={{ fontSize: `${settings.arabicSize}px` }}>{k.arabic}</p>
          <p className="translit">{k.translit}</p>
          {lang === 'en'
            ? <p className="translation" style={{ fontSize: `${settings.transSize}px` }}>{k.en}</p>
            : <p className="translation urdu" lang="ur" dir="rtl" style={{ fontSize: `${settings.transSize + 2}px` }}>{k.ur}</p>}
        </article>
      ))}
    </>
  );
}
