import { useState } from 'react';
import { getSurahs } from '../api.js';
import { MANZIL } from '../data/manzil.js';
import { useAyahPlayer } from '../hooks/useAyahPlayer.js';
import PlayerBar from './PlayerBar.jsx';
import { useDaily } from '../hooks/useDaily.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';
import QuranText from './QuranText.jsx';

export default function Manzil({ settings }) {
  const [days, update] = useDaily('noor:manzil');
  const done = !!days.recited;
  // Listen to the whole Manzil, verse after verse, in the reciter chosen in Settings.
  const player = useAyahPlayer({ ...settings, autoNext: true });
  const [loading, setLoading] = useState(false);
  const [listenError, setListenError] = useState('');
  const listen = async () => {
    if (player.current) { player.toggle(); return; }
    setLoading(true);
    setListenError('');
    try {
      const surahs = await getSurahs();
      const before = (s) => surahs.filter((x) => x.number < s).reduce((sum, x) => sum + x.numberOfAyahs, 0);
      const list = [];
      MANZIL.forEach((m) => {
        const meta = surahs.find((x) => x.number === m.s);
        const from = m.from || 1;
        const to = m.to || meta.numberOfAyahs;
        for (let n = from; n <= to; n += 1) list.push({ global: before(m.s) + n, n, surah: { number: m.s, englishName: meta.englishName } });
      });
      player.play(list[0], list);
    } catch {
      setListenError('Could not load the audio list. Check your connection and try again.');
    }
    setLoading(false);
  };
  return (
    <>
      <PageHeader
        icon="shield"
        hue={262}
        title="Manzil"
        subtitle="A collection of Quranic verses that many Muslims recite for protection."
      />
      <p className="note">
        The verse text comes straight from the Quran API. This follows the commonly printed Manzil, and some editions
        differ slightly, so compare with the edition you use.
      </p>

      <button className="btn btn-primary wide-btn" onClick={listen} disabled={loading}>
        <Icon name={player.current && player.playing ? 'pause' : 'play'} size={18} filled />
        {loading ? 'Loading…' : player.current ? (player.playing ? 'Pause the Manzil' : 'Continue listening') : 'Listen to the whole Manzil'}
      </button>
      {listenError && <p className="tafsir-note">{listenError}</p>}
      <p className="hint">The reciter can be changed in Settings. Each verse follows the one before it.</p>

      <button
        className={done ? 'btn btn-primary wide-btn' : 'btn btn-ghost wide-btn'}
        onClick={() => update((d) => ({ ...d, recited: !d.recited }))}
        aria-pressed={done}
      >
        <Icon name={done ? 'check-circle' : 'shield'} size={18} />
        {done ? 'Recited today' : 'Mark as recited today'}
      </button>

      {MANZIL.map((m) => (
        <section key={`${m.s}-${m.from || 0}`} className="dhikr">
          <QuranText parts={[{ s: m.s, from: m.from, to: m.to }]} size={settings.arabicSize} />
        </section>
      ))}
      {player.current && (
        <PlayerBar
          label={`${player.current.surah.englishName}, verse ${player.current.n}`}
          playing={player.playing}
          error={player.error}
          onToggle={player.toggle}
          onPrev={() => player.step(-1)}
          onNext={() => player.step(1)}
          onClose={player.stop}
        />
      )}
    </>
  );
}
