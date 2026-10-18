import { useEffect, useRef, useState } from 'react';
import { audioUrl } from '../api.js';

// One audio element for reading screens. `play(ayah, list)` plays a verse and, if auto-next is on,
// carries on through `list`. `onAdvance(ayah)` lets the screen follow along.
export function useAyahPlayer(settings, onAdvance) {
  const audioRef = useRef(null);
  const listRef = useRef([]);
  const idxRef = useRef(-1);
  const settingsRef = useRef(settings);
  const advanceRef = useRef(onAdvance);
  const playAtRef = useRef(null);
  settingsRef.current = settings;
  advanceRef.current = onAdvance;

  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.addEventListener('play', () => setPlaying(true));
    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('error', () => {
      if (audio.getAttribute('src')) {
        setError('Audio could not load. Check your connection.');
        setPlaying(false);
      }
    });
    audio.addEventListener('ended', () => {
      const next = idxRef.current + 1;
      if (settingsRef.current.autoNext && next < listRef.current.length) playAtRef.current(next);
      else setPlaying(false);
    });
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };
  }, []);

  const playAt = (i) => {
    const ayah = listRef.current[i];
    const audio = audioRef.current;
    if (!ayah || !audio) return;
    idxRef.current = i;
    setError('');
    audio.src = audioUrl(settingsRef.current.reciter, ayah.global);
    audio.play().catch(() => {
      setError('Audio could not play. Check your connection.');
      setPlaying(false);
    });
    setCurrent(ayah);
    if (advanceRef.current) advanceRef.current(ayah);
  };
  playAtRef.current = playAt;

  const play = (ayah, list) => {
    listRef.current = list;
    const i = list.findIndex((a) => a.global === ayah.global);
    const audio = audioRef.current;
    if (current && current.global === ayah.global && audio && audio.src) {
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
      return;
    }
    playAt(i < 0 ? 0 : i);
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  const step = (delta) => {
    const next = idxRef.current + delta;
    if (next >= 0 && next < listRef.current.length) playAt(next);
  };

  const stop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
    }
    idxRef.current = -1;
    setCurrent(null);
    setPlaying(false);
    setError('');
  };

  return { current, playing, error, play, toggle, step, stop, hasNext: idxRef.current < listRef.current.length - 1, hasPrev: idxRef.current > 0 };
}
