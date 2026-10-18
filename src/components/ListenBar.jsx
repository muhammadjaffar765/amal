import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { embedSrc, parseYouTube, watchUrl } from './Naats.jsx';

// Small helpers to keep a chosen audio file on this device (IndexedDB), so it plays again later without internet.
const openDb = () => new Promise((resolve, reject) => {
  if (!window.indexedDB) { reject(new Error('IndexedDB is not available')); return; }
  const r = indexedDB.open('noor-audio', 1);
  r.onupgradeneeded = () => r.result.createObjectStore('files');
  r.onsuccess = () => resolve(r.result);
  r.onerror = () => reject(r.error);
});
const idb = async (mode, fn) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', mode);
    const req = fn(tx.objectStore('files'));
    tx.oncomplete = () => resolve(req && req.result);
    tx.onerror = () => reject(tx.error);
  });
};

// Noor does not ship recordings. Each text gets a player where you attach the recitation you prefer:
// a YouTube link (played through YouTube's official player), a link to an audio file, or a file from your phone.
export default function ListenBar({ id, title, query, onAudio }) {
  const key = `noor:listen:${id}`;
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [rate, setRate] = useState(1);
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const setAudio = (el) => { audioRef.current = el; if (onAudio) onAudio(el); };

  useEffect(() => {
    let url = null;
    let cancelled = false;
    setMedia(null);
    setFileUrl(null);
    setError('');
    try {
      const raw = localStorage.getItem(key);
      const m = raw ? JSON.parse(raw) : null;
      setMedia(m);
      if (m && m.type === 'file') {
        idb('readonly', (s) => s.get(id))
          .then((blob) => {
            if (cancelled) return;
            if (blob) { url = URL.createObjectURL(blob); setFileUrl(url); } else setMedia(null);
          })
          .catch(() => !cancelled && setMedia(null));
      }
    } catch {
      /* storage can be blocked */
    }
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, [rate, media, fileUrl]);

  const save = (m) => {
    setMedia(m);
    try {
      if (m) localStorage.setItem(key, JSON.stringify(m));
      else localStorage.removeItem(key);
    } catch {
      /* storage can be blocked */
    }
  };

  const addLink = (e) => {
    e.preventDefault();
    const t = link.trim();
    const yt = parseYouTube(t);
    if (yt) { save({ type: 'yt', p: yt }); setLink(''); setError(''); return; }
    if (/^https?:\/\/.+\.(mp3|m4a|aac|ogg|oga|wav|opus)(\?.*)?$/i.test(t)) { save({ type: 'url', url: t }); setLink(''); setError(''); return; }
    setError('Paste a YouTube link, or a direct link to an audio file (mp3, m4a, ogg or wav).');
  };

  const onFile = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
      await idb('readwrite', (s) => s.put(f, id));
      setFileUrl(URL.createObjectURL(f));
      save({ type: 'file', name: f.name });
      setError('');
    } catch {
      setError('This browser could not keep the file on the device.');
    }
  };

  const remove = async () => {
    if (media && media.type === 'file') {
      try { await idb('readwrite', (s) => s.delete(id)); } catch { /* ignore */ }
    }
    setFileUrl(null);
    save(null);
  };

  const audioSrc = media && media.type === 'url' ? media.url : media && media.type === 'file' ? fileUrl : null;

  return (
    <section className="listen">
      {audioSrc && (
        <div className="listen-audio">
          <audio ref={setAudio} controls preload="metadata" src={audioSrc} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
        </div>
      )}
      <button className="listen-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Icon name="volume" size={18} />
        <span>{media ? `Listen: ${media.type === 'file' ? media.name : media.type === 'yt' ? 'YouTube' : 'audio link'}` : 'Listen'}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
      </button>
      {open && (
        <div className="listen-body">
          <p className="hint">Add the recitation of {title} that you like. This app does not include any recording.</p>
          {media && media.type === 'yt' && (
            <div className="video"><iframe title={`${title} recitation`} src={embedSrc(media.p)} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>
          )}
          {audioSrc && (
            <label className="listen-rate">Speed
              <select value={rate} onChange={(e) => setRate(Number(e.target.value))}>
                {[0.75, 1, 1.25, 1.5].map((r) => <option key={r} value={r}>{r}x</option>)}
              </select>
            </label>
          )}
          {media && media.type === 'yt' && <a className="link-btn" href={watchUrl(media.p)} target="_blank" rel="noopener noreferrer">If it does not play, open on YouTube</a>}
          {media && <button className="link-btn" onClick={remove}>Remove this recitation</button>}

          <form className="listen-form" onSubmit={addLink}>
            <label className="field">YouTube or audio link
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." inputMode="url" />
            </label>
            <button className="btn btn-primary" type="submit" disabled={!link.trim()}>Add</button>
          </form>
          <label className="btn btn-ghost listen-file">
            <Icon name="download" size={18} /> Choose an audio file from this device
            <input type="file" accept="audio/*" onChange={onFile} />
          </label>
          {error && <p className="tafsir-note">{error}</p>}
          {query && <a className="link-btn" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer">Find a recitation on YouTube</a>}
        </div>
      )}
    </section>
  );
}
