import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFitHeight } from '../hooks/useFitHeight.js';
import { useSwipe } from '../hooks/useSwipe.js';
import Icon from './Icon.jsx';

// Text cut into screen-sized pages. Swipe to turn the page; nothing scrolls.
// Pages are made with CSS columns, so they change by themselves when the text size or the screen changes.
export default function PagedText({ children, rtl = true, dep, className = '', onEdge, resume }) {
  const [box, boxH] = useFitHeight(64, [dep]);
  const flow = useRef(null);
  const [w, setW] = useState(0);
  const [page, setPage] = useState(() => {
    try { return resume ? Number(localStorage.getItem(resume)) || 0 : 0; } catch { return 0; }
  });
  const [count, setCount] = useState(1);

  const measure = useCallback(() => {
    if (!box.current || !flow.current) return;
    const bw = box.current.clientWidth;
    setW(bw);
    requestAnimationFrame(() => {
      if (!flow.current) return;
      const total = Math.max(1, Math.round(flow.current.scrollWidth / bw));
      setCount(total);
      setPage((p) => Math.min(p, total - 1));
    });
  }, []);

  useLayoutEffect(() => { measure(); }, [measure, dep, boxH]);
  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [measure]);
  useEffect(() => {
    if (resume) { try { localStorage.setItem(resume, String(page)); } catch { /* storage can be blocked */ } }
  }, [page, resume]);

  const go = (n) => {
    if (n < 0) { if (onEdge) onEdge(-1); return; }
    if (n > count - 1) { if (onEdge) onEdge(1); return; }
    setPage(n);
  };
  // like a book: in a right-to-left text, swiping right turns to the next page
  const swipe = useSwipe(() => go(rtl ? page - 1 : page + 1), () => go(rtl ? page + 1 : page - 1));
  const shift = (rtl ? 1 : -1) * page * 100;

  return (
    <div className={`paged-wrap ${className}`}>
      <div className="paged" ref={box} style={boxH ? { height: boxH } : undefined} {...swipe}>
        <div
          ref={flow}
          className="paged-flow"
          dir={rtl ? 'rtl' : 'ltr'}
          style={{ columnWidth: w ? `${w}px` : undefined, transform: `translateX(${shift}%)` }}
        >
          {children}
        </div>
      </div>
      <div className="paged-nav">
        <button className="icon-btn" onClick={() => go(rtl ? page + 1 : page - 1)} aria-label="Next page" disabled={rtl ? page >= count - 1 : page <= 0}><Icon name="chevron-left" size={20} /></button>
        <span>{page + 1} / {count}</span>
        <button className="icon-btn" onClick={() => go(rtl ? page - 1 : page + 1)} aria-label="Previous page" disabled={rtl ? page <= 0 : page >= count - 1}><Icon name="chevron-right" size={20} /></button>
      </div>
    </div>
  );
}
