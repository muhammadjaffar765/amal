import { KHATM_QADRIA } from '../data/khatmqadria.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import Icon from './Icon.jsx';
import MaskImg, { SizeControl, TranslationSwitch } from './MaskImg.jsx';
import PageHeader from './PageHeader.jsx';
import ListenBar from './ListenBar.jsx';

export default function Qadria({ settings, onSettings }) {
  const [done, setDone] = useLocalStorage('noor:qadria-done', []);
  const doneSet = new Set(done);
  const total = KHATM_QADRIA.length;
  const toggle = (n) => setDone((d) => (d.includes(n) ? d.filter((x) => x !== n) : [...d, n]));
  const sections = [...new Set(KHATM_QADRIA.map((s) => s.section))];
  const jump = (sec) => {
    const el = document.getElementById(`qs-${sec.replace(/\W+/g, '-')}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <>
      <PageHeader icon="star" hue={262} title="Khatm-e-Qadria" subtitle="Recited together, with a sweet dish and a Fatiha, through the wasila of Sayyiduna Ghaus al-Azam." />
      <ListenBar id="qadria" title="Khatm-e-Qadria" query="Khatme Qadria recitation" />
      <div className="progress-row">
        <div className="bar" aria-hidden="true"><span style={{ width: `${(done.length / total) * 100}%` }} /></div>
        <span>{done.length} of {total} done</span>
        {done.length > 0 && <button className="link-btn" onClick={() => setDone([])}>Start again</button>}
      </div>
      <div className="read-tools">
        <TranslationSwitch settings={settings} onSettings={onSettings} />
        <SizeControl settings={settings} onSettings={onSettings} />
      </div>
      <div className="chips chapter-chips">
        {sections.map((s) => <button key={s} className="chip" onClick={() => jump(s)}>{s}</button>)}
      </div>
      {KHATM_QADRIA.map((s, i) => (
        <div key={s.n}>
          {(i === 0 || KHATM_QADRIA[i - 1].section !== s.section) && <h2 className="qsec" id={`qs-${s.section.replace(/\W+/g, '-')}`}>{s.section}</h2>}
          <article className={`qslide${doneSet.has(s.n) ? ' is-done' : ''}`}>
            <header className="qslide-head">
              <span className="qslide-n">{s.n}</span>
              <span className="qslide-title"><strong>{s.title}</strong><small>{s.count}</small></span>
              <button className={doneSet.has(s.n) ? 'chip is-on' : 'chip'} onClick={() => toggle(s.n)} aria-pressed={doneSet.has(s.n)}>
                <Icon name="check" size={14} /> {doneSet.has(s.n) ? 'Done' : 'Mark done'}
              </button>
            </header>
            <MaskImg img={s.a} scale={settings.imgSize} className="qslide-ar" label={`${s.title}, slide ${s.n}`} />
            {settings.sacredTranslation && s.t && <MaskImg img={s.t} scale={settings.imgSize} className="qslide-tr" label="Transliteration and translation" />}
          </article>
        </div>
      ))}
      <p className="note">The Arabic is cut from the slides of the PDF you provided, so it is exactly as printed there. Please have it proofread. Each part says how many times it is recited, as shown on the slide.</p>
    </>
  );
}
