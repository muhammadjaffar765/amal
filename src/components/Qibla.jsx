import { useEffect, useRef, useState } from 'react';
import { qiblaFrom } from '../prayer.js';
import { usePrayerTimes } from '../hooks/usePrayerTimes.js';
import { buzz } from '../hooks/useDaily.js';
import PageHeader from './PageHeader.jsx';

// Smallest signed angle from a to b, in degrees (-180 to 180).
const diffAngle = (a, b) => ((((b - a) % 360) + 540) % 360) - 180;
const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const dirName = (deg) => DIRS[Math.round((((deg % 360) + 360) % 360) / 45) % 8];

export default function Qibla({ settings }) {
  const p = usePrayerTimes(settings);
  // sensor: idle | waiting | active | none | denied | insecure | unavailable
  const [sensor, setSensor] = useState('idle');
  const [relative, setRelative] = useState(false);
  const [angle, setAngle] = useState(0); // direction the phone points, kept continuous so the dial never spins backwards
  const [manual, setManual] = useState(false);
  const angleRef = useRef(0);
  const firstRef = useRef(true);
  const wasAligned = useRef(false);

  const meta = p.data && p.data.meta;
  const coords = settings.coords || (meta && meta.latitude != null ? { lat: Number(meta.latitude), lng: Number(meta.longitude) } : null);
  const q = coords ? qiblaFrom(coords.lat, coords.lng) : null;

  const setHeading = (raw) => {
    if (!Number.isFinite(raw)) return;
    if (firstRef.current) {
      angleRef.current = raw;
      firstRef.current = false;
    } else {
      angleRef.current += diffAngle(angleRef.current, raw) * 0.35; // smooth the sensor noise
    }
    setAngle(angleRef.current);
  };

  // Listen to the phone's sensors.
  useEffect(() => {
    if (sensor !== 'waiting' && sensor !== 'active') return undefined;
    const onOrient = (e) => {
      let raw = null;
      if (typeof e.webkitCompassHeading === 'number') raw = e.webkitCompassHeading; // iPhone
      else if (e.alpha != null) {
        raw = (360 - e.alpha) % 360;
        if (!(e.absolute === true || e.type === 'deviceorientationabsolute')) setRelative(true);
      }
      if (raw == null) return;
      setSensor('active');
      setHeading(raw);
    };
    window.addEventListener('deviceorientationabsolute', onOrient, true);
    window.addEventListener('deviceorientation', onOrient, true);
    // If no real reading arrives, this device has no compass (most laptops and desktops).
    const timer = setTimeout(() => setSensor((s) => (s === 'waiting' ? 'none' : s)), 3000);
    return () => {
      window.removeEventListener('deviceorientationabsolute', onOrient, true);
      window.removeEventListener('deviceorientation', onOrient, true);
      clearTimeout(timer);
    };
  }, [sensor]);

  const start = async () => {
    firstRef.current = true;
    if (!window.isSecureContext) return setSensor('insecure');
    if (typeof DeviceOrientationEvent === 'undefined') return setSensor('unavailable');
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res !== 'granted') return setSensor('denied');
      } catch {
        return setSensor('denied');
      }
    }
    return setSensor('waiting');
  };

  const live = sensor === 'active';
  const usable = live || manual;
  const bearing = q ? q.bearing : 0;
  const off = q ? diffAngle(angle, bearing) : 180; // how far the Qibla is from straight ahead
  const aligned = usable && q && Math.abs(off) <= 5;

  useEffect(() => {
    if (aligned && !wasAligned.current) buzz(settings, 60);
    wasAligned.current = !!aligned;
  }, [aligned]); // eslint-disable-line react-hooks/exhaustive-deps

  const turn = (deg) => {
    firstRef.current = false;
    angleRef.current = deg;
    setAngle(deg);
  };

  const problem = {
    insecure: 'The compass needs a secure (https) page. On your phone, open the deployed https link, not the local network address.',
    unavailable: 'This browser does not give access to the compass.',
    denied: 'Compass permission was denied. Allow motion and orientation access in your browser settings, then try again.',
    none: 'No compass sensor found. Laptops and desktop computers do not have one. Open Amal on a phone for a live compass, or use the manual dial below.',
  }[sensor];

  return (
    <>
      <PageHeader icon="compass" hue={190} title="Qibla" subtitle="Direction of the Kaaba in Makkah from your location." />
      {!q && p.status === 'error' && (
        <div className="notice"><p>Set your city on the Prayer times page first.</p><a className="btn btn-primary" href="#/prayer">Open prayer times</a></div>
      )}
      {q && (
        <section className="qibla">
          <div className={aligned ? 'compass-wrap is-aligned' : 'compass-wrap'}>
            <svg className="compass" viewBox="0 0 300 300" role="img" aria-label={`Qibla is ${Math.round(q.bearing)} degrees from north`}>
              <g transform={`rotate(${-angle} 150 150)`}>
                <circle cx="150" cy="150" r="140" className="compass-face" />
                {Array.from({ length: 36 }, (_, i) => (
                  <line key={i} x1="150" y1="14" x2="150" y2={i % 9 === 0 ? 34 : 24} className="compass-tick" transform={`rotate(${i * 10} 150 150)`} />
                ))}
                <text x="150" y="60" textAnchor="middle" className="compass-n">N</text>
                <text x="246" y="156" textAnchor="middle" className="compass-dir">E</text>
                <text x="150" y="256" textAnchor="middle" className="compass-dir">S</text>
                <text x="54" y="156" textAnchor="middle" className="compass-dir">W</text>
                <g transform={`rotate(${bearing} 150 150)`}>
                  <line x1="150" y1="150" x2="150" y2="72" className="compass-needle" />
                  <polygon points="150,60 140,82 160,82" className="compass-head" />
                  <rect x="136" y="26" width="28" height="28" rx="3" className="kaaba" />
                  <rect x="136" y="35" width="28" height="5" className="kaaba-band" />
                </g>
              </g>
              <polygon points="150,2 142,16 158,16" className="compass-top" />
              <circle cx="150" cy="150" r="7" className="compass-hub" />
            </svg>
          </div>

          <p className="qibla-deg">{aligned ? 'You are facing the Qibla' : `${Math.round(q.bearing)}° ${dirName(q.bearing)}`}</p>
          <p className="qibla-km">
            {usable && !aligned ? `Turn ${off > 0 ? 'right' : 'left'} about ${Math.round(Math.abs(off))}°. ` : ''}
            About {Math.round(q.km).toLocaleString()} km to the Kaaba
          </p>

          {!live && sensor !== 'waiting' && (
            <button className="btn btn-primary" onClick={start}>Turn on live compass</button>
          )}
          {sensor === 'waiting' && <p className="hint">Move your phone in a figure of eight to start the compass…</p>}
          {live && relative && <p className="hint">This phone only reports a relative direction, so the compass may be a little off. Calibrate it with a figure-of-eight motion.</p>}
          {problem && <p className="notice-inline">{problem}</p>}

          {(sensor === 'none' || sensor === 'insecure' || sensor === 'unavailable' || sensor === 'denied' || manual) && (
            <div className="manual">
              <label className="field">
                Manual dial: the direction you are facing ({Math.round(((angle % 360) + 360) % 360)}° {dirName(angle)})
                <input type="range" min="0" max="359" value={Math.round(((angle % 360) + 360) % 360)} onChange={(e) => { setManual(true); turn(Number(e.target.value)); }} aria-label="Direction you are facing in degrees" />
              </label>
              <p className="hint">Use any compass app or a landmark you know, set the direction you are facing, and turn until the Kaaba mark is at the top.</p>
            </div>
          )}
          {!manual && !live && sensor === 'idle' && (
            <button className="link-btn" onClick={() => setManual(true)}>Or set the direction manually</button>
          )}

          <p className="hint">The Kaaba mark shows the Qibla. When it reaches the top of the dial, you are facing the Qibla. Keep your phone flat and away from metal and magnets.</p>
        </section>
      )}
    </>
  );
}
