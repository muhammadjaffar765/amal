import { DALAIL_PARTS } from '../data/dalail.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';

const DAY_TO_PART = [6, 0, 1, 2, 3, 4, 5]; // Sunday..Saturday -> index in DALAIL_PARTS (Monday = Hizb 1)

export default function TextsHub() {
  const today = DALAIL_PARTS[DAY_TO_PART[new Date().getDay()]];
  const cards = [
    { href: '#/dalail', icon: 'scroll', hue: 18, title: 'Dalail al-Khayrat', desc: 'All 8 hizb, one for each day, and the dua after the khatm' },
    { href: '#/hizbulbahr', icon: 'sparkles', hue: 205, title: 'Hizb al-Bahr', desc: 'Arabic text with the finger and breath actions as optional notes' },
    { href: '#/burda', icon: 'book-open', hue: 340, title: 'Qaseeda Burda Shareef', desc: 'All 160 couplets in 10 chapters, plus the closing couplets' },
    { href: '#/wazifa', icon: 'scroll', hue: 120, title: 'Al-Wazifa-tul-Karima', desc: 'Imam Ahmad Raza Khan: wazaif for morning, evening, after salah and sleep' },
    { href: '#/qadria', icon: 'star', hue: 262, title: 'Khatm-e-Qadria', desc: '56 slides with the count to recite and a tick for each' },
  ];
  return (
    <>
      <PageHeader icon="scroll" hue={168} title="Wazaif and Qasaid" subtitle="Read the texts inside the app. The Arabic comes first; translations are optional." />
      <a className="continue" href="#/dalail">
        <span className="continue-icon"><Icon name="sun" size={20} /></span>
        <span className="continue-text"><strong>Today's Dalail part</strong><span>{today.name} ({today.day})</span></span>
        <Icon name="arrow-right" />
      </a>
      <div className="feature-grid texts-grid">
        {cards.map((c) => (
          <a key={c.href} className="tile" href={c.href} style={{ '--hue': c.hue }}>
            <span className="tile-icon"><Icon name={c.icon} size={24} /></span>
            <span className="tile-text"><strong>{c.title}</strong><span>{c.desc}</span></span>
          </a>
        ))}
      </div>
      <section className="card note-card">
        <h2>Where the texts come from</h2>
        <p>Every text here was taken from a file you provided, not typed from memory. Dalail al-Khayrat and Al-Wazifa-tul-Karima come from your scanned books, Burda from the Salawat.com PDF, Khatm-e-Qadria from the slides compiled by @MaksudYusuf, and Hizb al-Bahr from the Aliya Publications PDF. Please have them proofread before you rely on them.</p>
        <p>The translations and transliterations shown on request belong to those publishers. If you publish this app publicly, get their permission or delete those images (the folders <code>public/dalail</code>, <code>public/burda</code> and <code>public/khatm</code>).</p>
      </section>
    </>
  );
}
