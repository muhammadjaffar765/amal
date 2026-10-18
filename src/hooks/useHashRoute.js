import { useEffect, useState } from 'react';

// Tiny hash router: "#/surah/2?ayah=255" -> segments ["surah","2"], params ayah=255.
// Hash routing means the app works on any static host with no rewrite rules.
function parse() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  return {
    segments: path.split('/').filter(Boolean),
    params: new URLSearchParams(query),
  };
}

export function useHashRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
