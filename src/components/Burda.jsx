import { useState } from 'react';
import { BURDA } from '../data/burda.js';
import MaskImg, { SizeControl, TranslationSwitch } from './MaskImg.jsx';
import PageHeader from './PageHeader.jsx';
import ListenBar from './ListenBar.jsx';

function Couplet({ c, settings, chorus }) {
  return (
    <div className="couplet" id={c.n ? `bc-${c.n}` : undefined}>
      {c.n && <span className="couplet-n">{c.n}</span>}
      <MaskImg img={c.a} scale={settings.imgSize} className="couplet-ar" label={c.n ? `Couplet ${c.n}` : 'Couplet'} />
      {settings.sacredTranslation && c.t && <MaskImg img={c.t} scale={settings.imgSize} className="couplet-tr" label="Transliteration and translation" />}
      {chorus && <MaskImg img={chorus.a} scale={Math.round(settings.imgSize * 0.8)} className="couplet-chorus" label="Chorus" />}
    </div>
  );
}

export default function Burda({ settings, onSettings }) {
  const [repeat, setRepeat] = useState(false);
  const chorus = repeat ? BURDA.chorus : null;
  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <>
      <PageHeader icon="book-open" hue={340} title="Qaseeda Burda Shareef" subtitle="Imam Sharaf ad-Din al-Busiri. The Poem of the Mantle." />
      <ListenBar id="burda" title="Qaseeda Burda" query="Qasida Burda Sharif recitation" />
      <div className="read-tools">
        <TranslationSwitch settings={settings} onSettings={onSettings} />
        <label className="switch-row">
          <input type="checkbox" checked={repeat} onChange={(e) => setRepeat(e.target.checked)} />
          <span>Chorus after every couplet</span>
        </label>
        <SizeControl settings={settings} onSettings={onSettings} />
      </div>
      <div className="chips chapter-chips">
        <button className="chip" onClick={() => jump('burda-intro')}>Opening</button>
        {BURDA.chapters.map((ch) => <button key={ch.n} className="chip" onClick={() => jump(`bch-${ch.n}`)}>{ch.n}</button>)}
        <button className="chip" onClick={() => jump('burda-extra')}>Closing</button>
      </div>

      <section className="burda-sec" id="burda-intro">
        <Couplet c={BURDA.intro} settings={settings} />
        <p className="sec-label">Chorus</p>
        <Couplet c={BURDA.chorus} settings={settings} />
      </section>

      {BURDA.chapters.map((ch) => (
        <section key={ch.n} className="burda-sec" id={`bch-${ch.n}`}>
          <header className="burda-head">
            <span className="burda-head-n">Chapter {ch.n}</span>
            <MaskImg img={ch.heading.a} scale={settings.imgSize} className="burda-title" label={`Chapter ${ch.n}`} />
            <span className="burda-head-t">{ch.title}</span>
          </header>
          {ch.couplets.map((c) => <Couplet key={c.n} c={c} settings={settings} chorus={chorus} />)}
        </section>
      ))}

      <section className="burda-sec" id="burda-extra">
        <header className="burda-head">
          <span className="burda-head-n">Closing couplets</span>
          <span className="burda-head-t">Found after the main poem in some editions</span>
        </header>
        {BURDA.supplement.map((c, i) => <Couplet key={i} c={{ ...c, n: null }} settings={settings} chorus={chorus} />)}
      </section>
      <p className="note">The Arabic couplets are exactly as printed in the Salawat.com PDF you provided. The 160 couplets are numbered as in that PDF. Please have them proofread.</p>
    </>
  );
}
