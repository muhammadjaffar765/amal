import { useEffect, useState } from 'react';

const QUERY = '(prefers-color-scheme: dark)';

export function useSystemDark() {
  const [dark, setDark] = useState(() => window.matchMedia(QUERY).matches);
  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const onChange = (e) => setDark(e.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return dark;
}
