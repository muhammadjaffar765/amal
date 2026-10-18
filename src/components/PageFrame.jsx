import { useEffect, useRef, useState } from 'react';
import { useFitHeight } from '../hooks/useFitHeight.js';
import { replaceHash, useSwipe } from '../hooks/useSwipe.js';
import Icon from './Icon.jsx';

const STEPS = [100, 125, 150, 175, 200, 250, 300, 400];

// +/- zoom for page images. 100 means the whole page fits the screen.
export function ZoomControl({ zoom, onZoom }) {
  const exact = STEPS.indexOf(zoom);
  const i = exact >= 0 ? exact : Math.max(0, STEPS.findIndex((s) => s >= zoom) - 0);
  return (
    <span className="zoom-ctl" role="group" aria-label="Zoom">
      <button className="icon-btn" onClick={() => onZoom(STEPS[Math.max(0, (exact >= 0 ? i : i - 1) - (exact >= 0 ? 1 : 0))])} disabled={zoom <= 100} aria-label="Zoom out">−</button>
      <button className="zoom-val" onClick={() => onZoom(100)} aria-label="Fit the page to the screen">{zoom === 100 ? 'Fit' : `${zoom}%`}</button>
      <button className="icon-btn" onClick={() => onZoom(STEPS[Math.min(STEPS.length - 1, exact >= 0 ? i + 1 : i)])} disabled={zoom >= 400} aria-label="Zoom in">+</button>
    </span>
  );
}

// One page of a book. Swipe right for the next page and left for the previous one (like an Arabic book).
// At 100 per cent the page is made to fit the screen, so there is no scrolling. Zoom in to pan around.
export function PageFrame({ src, alt, zoom, base = 100, dir, onNext, onPrev, onZoom, fitDeps = [] }) {
  const swipe = useSwipe(onPrev, onNext);
  const [ref, h] = useFitHeight(62, fitDeps);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const zoomFn = useRef(onZoom);
  zoomFn.current = onZoom;
  // Pinch with two fingers to zoom; double tap to jump between fit and 2x.
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let start = null;
    let lastTap = 0;
    const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const down = (e) => {
      if (e.touches.length === 2) start = { d: dist(e.touches), z: zoomRef.current };
      else if (e.touches.length === 1) {
        const now = Date.now();
        if (now - lastTap < 300 && zoomFn.current) zoomFn.current(zoomRef.current > 100 ? 100 : 200);
        lastTap = now;
      }
    };
    const move = (e) => {
      if (start && e.touches.length === 2) {
        e.preventDefault();
        const z = Math.max(100, Math.min(400, Math.round((start.z * dist(e.touches)) / start.d / 5) * 5));
        if (zoomFn.current && z !== zoomRef.current) zoomFn.current(z);
      }
    };
    const up = (e) => { if (e.touches.length < 2) start = null; };
    el.addEventListener('touchstart', down, { passive: true });
    el.addEventListener('touchmove', move, { passive: false });
    el.addEventListener('touchend', up, { passive: true });
    return () => {
      el.removeEventListener('touchstart', down);
      el.removeEventListener('touchmove', move);
      el.removeEventListener('touchend', up);
    };
  }, [ref]);
  const z = zoom > 100 ? zoom : 100;
  const wide = base !== 100 || z > 100; // base: the width (in per cent of the screen) the page needs to be readable
  const width = Math.round((base * z) / 100);
  return (
    <div ref={ref} className={`pageframe${wide ? ' is-zoomed' : ''}`} style={h ? { height: h } : undefined} {...(wide ? {} : swipe)}>
      <div key={src} className={`pf-page turn-${dir}`}>
        <img className="pf-img" src={src} alt={alt} draggable="false" style={wide ? { width: `${width}%` } : undefined} />
      </div>
    </div>
  );
}

// The small row under a page: previous, page number box, next. Swipe is the main way, these are a backup.
export function PageNav({ number, total, go }) {
  const [jump, setJump] = useState(String(number));
  useEffect(() => setJump(String(number)), [number]);
  return (
    <div className="rd-nav">
      <button className="icon-btn" onClick={() => go(number - 1)} disabled={number <= 1} aria-label="Previous page"><Icon name="chevron-left" size={20} /></button>
      <form onSubmit={(e) => { e.preventDefault(); go(parseInt(jump, 10) || number); }}>
        <label className="sr-only" htmlFor="pgn">Page</label>
        <input id="pgn" inputMode="numeric" value={jump} onChange={(e) => setJump(e.target.value.replace(/\D/g, ''))} onBlur={() => setJump(String(number))} />
        <span>/ {total}</span>
      </form>
      <button className="icon-btn" onClick={() => go(number + 1)} disabled={number >= total} aria-label="Next page"><Icon name="chevron-right" size={20} /></button>
    </div>
  );
}

// Keyboard arrows (a laptop): left arrow is the next page in a right-to-left book.
export function useArrowKeys(go, number) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && /input|select|textarea/i.test(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') go(number + 1);
      if (e.key === 'ArrowRight') go(number - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [number]); // eslint-disable-line react-hooks/exhaustive-deps
}

export const goTo = (prefix, n, total, current) => {
  const t = Math.max(1, Math.min(total, n));
  if (t !== current) replaceHash(`${prefix}${t}`);
};
