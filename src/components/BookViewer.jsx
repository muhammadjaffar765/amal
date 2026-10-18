import { useEffect, useRef, useState } from 'react';
import { useFitHeight } from '../hooks/useFitHeight.js';
import { playPageSound } from '../pageSound.js';
import Icon from './Icon.jsx';

const MIN = 1;
const MAX = 5;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// A page of a book that behaves like a PDF viewer: pinch with two fingers, drag when zoomed, double tap to zoom,
// mouse wheel on a computer. At 100 per cent the whole page fits the screen and a swipe turns the page with a
// flip and a paper sound. Swipe right = next page (like an Urdu or Arabic book).
export default function BookViewer({ src, alt, dir = 'next', onNext, onPrev, sound = true, extra, fitDeps = [] }) {
  const [box, h] = useFitHeight(112, fitDeps);
  const img = useRef(null);
  const st = useRef({ s: 1, x: 0, y: 0 });
  const [label, setLabel] = useState(100);
  const [leaving, setLeaving] = useState(null);
  const prevSrc = useRef(src);
  const pts = useRef(new Map());
  const g = useRef(null);
  const lastTap = useRef({ t: 0, x: 0, y: 0 });
  const cb = useRef({});
  cb.current = { onNext, onPrev };

  const limit = () => {
    const b = box.current.getBoundingClientRect();
    const im = img.current;
    if (!im) return { mx: 0, my: 0 };
    return { mx: Math.max(0, (im.offsetWidth * st.current.s - b.width) / 2), my: Math.max(0, (im.offsetHeight * st.current.s - b.height) / 2) };
  };
  const apply = (smooth = false) => {
    const { mx, my } = limit();
    st.current.x = clamp(st.current.x, -mx, mx);
    st.current.y = clamp(st.current.y, -my, my);
    const im = img.current;
    if (im) {
      im.style.transition = smooth ? 'transform 0.18s ease-out' : 'none';
      im.style.transform = `translate(${st.current.x}px, ${st.current.y}px) scale(${st.current.s})`;
    }
    setLabel(Math.round(st.current.s * 100));
  };
  // zoom to scale `ns`, keeping the point (cx, cy) (measured from the centre of the page area) where it is
  const zoomAt = (ns, cx = 0, cy = 0, smooth = false) => {
    const s0 = st.current.s;
    const s1 = clamp(ns, MIN, MAX);
    st.current.x = cx - ((cx - st.current.x) * s1) / s0;
    st.current.y = cy - ((cy - st.current.y) * s1) / s0;
    st.current.s = s1;
    if (s1 === 1) { st.current.x = 0; st.current.y = 0; }
    apply(smooth);
  };
  const rel = (e) => {
    const b = box.current.getBoundingClientRect();
    return { x: e.clientX - b.left - b.width / 2, y: e.clientY - b.top - b.height / 2 };
  };

  // turning the page: the old page flips away, with a paper sound
  useEffect(() => {
    if (prevSrc.current === src) return undefined;
    setLeaving({ src: prevSrc.current, dir, k: Date.now() });
    if (sound) playPageSound();
    prevSrc.current = src;
    st.current.x = 0; st.current.y = 0;
    apply();
    const t = setTimeout(() => setLeaving(null), 460);
    return () => clearTimeout(t);
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const wheel = (e) => {
      e.preventDefault();
      const r = rel(e);
      zoomAt(st.current.s * Math.exp(-e.deltaY * 0.0022), r.x, r.y);
    };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => el.removeEventListener('wheel', wheel);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { apply(); }, [h]); // eslint-disable-line react-hooks/exhaustive-deps

  const down = (e) => {
    box.current.setPointerCapture(e.pointerId);
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.current.size === 2) {
      const [a, b] = [...pts.current.values()];
      const m = rel({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
      g.current = { type: 'pinch', d: Math.hypot(a.x - b.x, a.y - b.y), s: st.current.s, x: st.current.x, y: st.current.y, mx: m.x, my: m.y };
    } else {
      g.current = { type: 'one', sx: e.clientX, sy: e.clientY, x: st.current.x, y: st.current.y, t: Date.now(), moved: 0 };
    }
  };
  const move = (e) => {
    if (!pts.current.has(e.pointerId)) return;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const gs = g.current;
    if (!gs) return;
    if (gs.type === 'pinch' && pts.current.size >= 2) {
      const [a, b] = [...pts.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const m = rel({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
      const s1 = clamp((gs.s * d) / gs.d, MIN, MAX);
      // keep the content point that was under the fingers under the fingers
      const px = (gs.mx - gs.x) / gs.s;
      const py = (gs.my - gs.y) / gs.s;
      st.current.s = s1;
      st.current.x = m.x - px * s1;
      st.current.y = m.y - py * s1;
      if (s1 === 1) { st.current.x = 0; st.current.y = 0; }
      apply();
    } else if (gs.type === 'one') {
      const dx = e.clientX - gs.sx; const dy = e.clientY - gs.sy;
      gs.moved = Math.max(gs.moved, Math.hypot(dx, dy));
      if (st.current.s > 1.01) { st.current.x = gs.x + dx; st.current.y = gs.y + dy; apply(); }
    }
  };
  const up = (e) => {
    const gs = g.current;
    pts.current.delete(e.pointerId);
    if (!gs) return;
    if (gs.type === 'pinch') { g.current = null; pts.current.clear(); return; }
    g.current = null;
    const dx = e.clientX - gs.sx; const dy = e.clientY - gs.sy;
    const dt = Date.now() - gs.t;
    if (st.current.s <= 1.01 && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 900) {
      if (dx > 0) cb.current.onNext(); else cb.current.onPrev();
      return;
    }
    if (gs.moved < 10 && dt < 300) {
      const now = Date.now();
      const lt = lastTap.current;
      if (now - lt.t < 320 && Math.hypot(e.clientX - lt.x, e.clientY - lt.y) < 40) {
        const r = rel(e);
        if (st.current.s > 1.05) zoomAt(1, 0, 0, true); else zoomAt(2.5, r.x, r.y, true);
        lastTap.current = { t: 0, x: 0, y: 0 };
      } else lastTap.current = { t: now, x: e.clientX, y: e.clientY };
    }
  };

  const step = (f) => zoomAt(st.current.s * f, 0, 0, true);
  return (
    <div className="bv">
      <div className="bv-bar">
        <span className="zoom-ctl" role="group" aria-label="Zoom">
          <button className="icon-btn" onClick={() => step(1 / 1.3)} disabled={label <= 100} aria-label="Zoom out">−</button>
          <input type="range" min="100" max="500" step="1" value={label} onChange={(e) => zoomAt(Number(e.target.value) / 100, 0, 0)} aria-label="Zoom" />
          <button className="icon-btn" onClick={() => step(1.3)} disabled={label >= 500} aria-label="Zoom in">+</button>
          <button className="zoom-val" onClick={() => zoomAt(1, 0, 0, true)} aria-label="Fit the page to the screen">{label === 100 ? 'Fit' : `${label}%`}</button>
        </span>
        {extra}
      </div>
      <div ref={box} className="bv-stage" style={h ? { height: h } : undefined} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <img ref={img} className="bv-img" src={src} alt={alt} draggable="false" onLoad={() => apply()} />
        {leaving && <img key={leaving.k} className={`bv-leaf leave-${leaving.dir}`} src={leaving.src} alt="" aria-hidden="true" draggable="false" />}
      </div>
    </div>
  );
}

export function SoundToggle({ on, onChange }) {
  return (
    <button className={on ? 'icon-btn is-on' : 'icon-btn'} onClick={() => onChange(!on)} aria-pressed={on} aria-label={on ? 'Page sound on' : 'Page sound off'}>
      <Icon name="volume" size={18} />
    </button>
  );
}
