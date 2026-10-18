import { useRef } from 'react';

// Swipe left or right on a phone. Uses touch events (they are the most reliable on phones) and falls back to the
// mouse. `onLeft` runs for a swipe to the left, `onRight` for a swipe to the right. Vertical scrolling is left alone.
export function useSwipe(onLeft, onRight, min = 45) {
  const start = useRef(null);
  const done = (x, y) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = x - s.x;
    const dy = y - s.y;
    if (Math.abs(dx) < min || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    if (dx < 0) onLeft(); else onRight();
  };
  return {
    onTouchStart: (e) => { const t = e.touches[0]; start.current = { x: t.clientX, y: t.clientY }; },
    onTouchEnd: (e) => { const t = e.changedTouches[0]; done(t.clientX, t.clientY); },
    onTouchCancel: () => { start.current = null; },
    onMouseDown: (e) => { start.current = { x: e.clientX, y: e.clientY }; },
    onMouseUp: (e) => done(e.clientX, e.clientY),
  };
}

// Change the page without adding to the browser history, so the back button leaves the reader straight away.
export function replaceHash(hash) {
  window.__amalReplace = true;
  window.location.replace(hash);
}
