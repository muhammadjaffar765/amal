import { useLayoutEffect, useRef, useState } from 'react';

// Gives an element exactly the height that is left on the screen below it, so a page fits without scrolling.
// `extra` is the space to keep free under it (a row of buttons, for example).
export function useFitHeight(extra = 0, deps = []) {
  const ref = useRef(null);
  const [h, setH] = useState(null);
  useLayoutEffect(() => {
    const calc = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const nav = document.querySelector('.nav-mobile');
      const navH = nav && getComputedStyle(nav).display !== 'none' ? nav.offsetHeight : 0;
      setH(Math.max(260, Math.floor(window.innerHeight - top - navH - extra)));
    };
    calc();
    window.addEventListener('resize', calc);
    window.addEventListener('orientationchange', calc);
    return () => {
      window.removeEventListener('resize', calc);
      window.removeEventListener('orientationchange', calc);
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return [ref, h];
}
