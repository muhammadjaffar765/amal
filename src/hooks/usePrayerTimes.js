import { useEffect, useMemo, useState } from 'react';
import { buildPrayerData, statusAt } from '../prayerCalc.js';

// Prayer times are calculated on the device (see prayerCalc.js), so they work offline and include seconds.
export function usePrayerTimes(settings) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const key = JSON.stringify([settings.city, settings.coords, settings.method, settings.school, settings.elevation, settings.hijriOffset, new Date(now).toDateString()]);
  const data = useMemo(() => buildPrayerData(settings, new Date(now)), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const st = statusAt(data, now);
  return { status: 'ready', data, next: st.next, current: st.current, now, error: '', retry: () => {} };
}
