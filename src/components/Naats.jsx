import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';

// Understands watch, youtu.be, shorts, embed and playlist links.
export function parseYouTube(input) {
  const text = String(input || '').trim();
  if (!text) return null;
  let url;
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, '');
  if (!['youtube.com', 'youtu.be', 'youtube-nocookie.com', 'music.youtube.com'].includes(host)) return null;
  const idOk = (s) => /^[A-Za-z0-9_-]{11}$/.test(s || '');
  let id = null;
  if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
  else if (url.searchParams.get('v')) id = url.searchParams.get('v');
  else {
    const m = /^\/(?:embed|shorts|live)\/([^/?]+)/.exec(url.pathname);
    if (m) id = m[1];
  }
  const list = url.searchParams.get('list');
  if (idOk(id)) return { kind: 'video', id };
  if (list && /^[A-Za-z0-9_-]{10,}$/.test(list)) return { kind: 'playlist', id: list };
  return null;
}

export const embedSrc = (p) =>
  p.kind === 'playlist'
    ? `https://www.youtube-nocookie.com/embed/videoseries?list=${p.id}&rel=0&playsinline=1`
    : `https://www.youtube-nocookie.com/embed/${p.id}?rel=0&modestbranding=1&playsinline=1`;
export const watchUrl = (p) => (p.kind === 'playlist' ? `https://www.youtube.com/playlist?list=${p.id}` : `https://www.youtube.com/watch?v=${p.id}`);
const search = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

const RECITERS = ['Owais Raza Qadri', 'Hafiz Tahir Qadri', 'Junaid Jamshed', 'Khalid Hasnain Khalid', 'Siddique Ismail', 'Syed Fasihuddin Soharwardi', 'Umme Habiba', 'Qari Waheed Zafar Qasmi', 'Sami Yusuf', 'Maher Zain'];
const TITLES = [
  { t: 'Mustafa Jaan-e-Rahmat Pe Lakhon Salam', by: 'Salam by Imam Ahmad Raza Khan (Ala Hazrat). Recited by many.' },
  { t: 'Muhammad Ka Roza Qareeb Aa Raha Hai', by: 'Junaid Jamshed' },
  { t: 'Faizan-e-Muhammad', by: 'Junaid Jamshed' },
  { t: 'Qaseeda Burda Sharif', by: 'Poem of Imam al-Busiri. Recited by many.' },
  { t: 'Main To Ummati Hoon', by: 'Junaid Jamshed' },
  { t: 'Mere Nabi Pyare Nabi', by: 'Junaid Jamshed' },
  { t: 'Tala al-Badru Alayna', by: 'Traditional welcome to the Prophet ﷺ in Madinah. Recited by many.' },
  { t: 'Hasbi Rabbi Jallallah', by: 'Traditional. Recited by many.' },
  { t: 'Ya Nabi Salam Alayka', by: 'Salawat nasheed. Recited by many.' },
];

export default function Naats() {
  const [tab, setTab] = useState('player');
  const [list, setList] = useLocalStorage('noor:naats', []);
  const [link, setLink] = useState('');
  const [name, setName] = useState('');
  const [now, setNow] = useState(null);
  const [error, setError] = useState('');

  const add = (e) => {
    e.preventDefault();
    const p = parseYouTube(link);
    if (!p) {
      setError('That does not look like a YouTube link. Copy the link from the video or playlist page.');
      return;
    }
    setError('');
    const item = { ...p, title: name.trim() || (p.kind === 'playlist' ? 'Playlist' : `Naat ${list.length + 1}`), key: `${p.kind}:${p.id}` };
    setList((l) => (l.some((x) => x.key === item.key) ? l : [...l, item]));
    setNow(item);
    setLink('');
    setName('');
  };

  return (
    <>
      <PageHeader icon="music" hue={285} title="Naats" subtitle="Listen inside Amal through official YouTube players." />
      <div className="seg lang-seg" role="tablist" aria-label="Naats">
        <button role="tab" aria-selected={tab === 'player'} className={tab === 'player' ? 'is-on' : ''} onClick={() => setTab('player')}>My player</button>
        <button role="tab" aria-selected={tab === 'find'} className={tab === 'find' ? 'is-on' : ''} onClick={() => setTab('find')}>Find naats</button>
      </div>

      {tab === 'player' && (
        <>
          <p className="note">Paste a link to a naat from the reciter's own YouTube channel. It plays here through YouTube's official player, so the reciter keeps their views. Amal does not download or store any recording.</p>
          <form className="card form" onSubmit={add}>
            <label className="field">YouTube link<input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." inputMode="url" /></label>
            <label className="field">Name (optional)<input value={name} onChange={(e) => setName(e.target.value)} placeholder="For example: Owais Raza Qadri, Salam" /></label>
            {error && <p className="tafsir-note">{error}</p>}
            <button className="btn btn-primary" type="submit" disabled={!link.trim()}><Icon name="play" size={18} filled /> Play and save</button>
          </form>

          {now && (
            <section className="naat-player">
              <div className="video"><iframe key={now.key} title={now.title} src={embedSrc(now)} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>
              <div className="naat-bar">
                <strong>{now.title}</strong>
                <a className="link-btn" href={watchUrl(now)} target="_blank" rel="noopener noreferrer">If it does not play, open on YouTube</a>
              </div>
            </section>
          )}

          <div className="section-head"><h2>Saved naats</h2></div>
          {list.length === 0 ? (
            <div className="empty-card"><Icon name="music" size={28} /><p>No naats saved yet. Paste a link above.</p></div>
          ) : (
            <ul className="results">
              {list.map((n) => (
                <li key={n.key} className="saved">
                  <button className={now && now.key === n.key ? 'result is-now' : 'result'} onClick={() => { setNow(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    <span className="result-ref">{n.kind === 'playlist' ? 'Playlist' : 'Video'}</span>
                    <span className="result-text">{n.title}</span>
                  </button>
                  <button className="icon-btn" onClick={() => { setList((l) => l.filter((x) => x.key !== n.key)); if (now && now.key === n.key) setNow(null); }} aria-label={`Remove ${n.title}`}><Icon name="close" size={18} /></button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {tab === 'find' && (
        <>
          <p className="note">These buttons open a YouTube search. Choose the video from the reciter's own channel, copy its link, and paste it in "My player".</p>
          <div className="section-head"><h2>Reciters</h2></div>
          <div className="chips">
            {RECITERS.map((r) => <a key={r} className="chip" href={search(`${r} naat official`)} target="_blank" rel="noopener noreferrer">{r} <Icon name="external" size={14} /></a>)}
          </div>
          <div className="section-head"><h2>Well-known naats</h2></div>
          <ul className="results">
            {TITLES.map((n) => (
              <li key={n.t}>
                <a className="result" href={search(`${n.t} naat`)} target="_blank" rel="noopener noreferrer">
                  <span className="result-ref">{n.by}</span>
                  <span className="result-text">{n.t}</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
