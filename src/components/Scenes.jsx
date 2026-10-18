import { useId } from 'react';

// Small illustrations for the Hajj and Umrah guide. They use the app's theme colours.
const GOLD = '#e2bd62';

function Frame({ children, label }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="scene" viewBox="0 0 320 150" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--hero-a)" />
          <stop offset="1" stopColor="var(--hero-b)" />
        </linearGradient>
      </defs>
      <rect width="320" height="150" rx="16" fill={`url(#g${id})`} />
      {children}
    </svg>
  );
}

const Stars = ({ pts }) => pts.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity="0.8" />);

function Kaaba({ cx = 160 }) {
  return (
    <g>
      <rect x={cx - 26} y="42" width="52" height="58" fill="#1a1a1a" />
      <polygon points={`${cx - 26},42 ${cx + 26},42 ${cx + 20},36 ${cx - 20},36`} fill="#333" />
      <rect x={cx - 26} y="54" width="52" height="7" fill={GOLD} />
      <rect x={cx - 6} y="74" width="12" height="26" rx="2" fill={GOLD} opacity="0.9" />
    </g>
  );
}

const SCENES = {
  kaaba: (
    <Frame label="Pilgrims circling the Kaaba">
      <ellipse cx="160" cy="112" rx="132" ry="28" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="2" />
      <ellipse cx="160" cy="108" rx="96" ry="21" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" />
      <Kaaba />
      {[[48, 112], [92, 130], [160, 139], [236, 128], [276, 110], [236, 92], [88, 92]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#fff" />
      ))}
      <path d="M262 78 q14 12 6 28" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
      <polygon points="270,108 262,100 274,98" fill={GOLD} />
    </Frame>
  ),
  safa: (
    <Frame label="Walking between the hills of Safa and Marwah">
      <polygon points="0,120 70,50 140,120" fill="#fff" opacity="0.22" />
      <polygon points="180,120 250,50 320,120" fill="#fff" opacity="0.22" />
      <rect x="0" y="118" width="320" height="32" fill="#000" opacity="0.18" />
      <path d="M62 128 H258" stroke="#fff" strokeWidth="3" strokeDasharray="7 7" />
      <circle cx="140" cy="128" r="5" fill="#35d07f" />
      <circle cx="180" cy="128" r="5" fill="#35d07f" />
      {[[96, 124], [120, 124], [206, 124], [232, 124]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="#fff" />)}
      <text x="42" y="30" fill="#fff" fontSize="14" fontWeight="700">Safa</text>
      <text x="236" y="30" fill="#fff" fontSize="14" fontWeight="700">Marwah</text>
    </Frame>
  ),
  ihram: (
    <Frame label="Two white cloths of ihram">
      <rect x="62" y="30" width="90" height="92" rx="8" fill="#fff" />
      <rect x="170" y="38" width="90" height="84" rx="8" fill="#fff" opacity="0.92" />
      {[48, 62, 76, 90, 104].map((y) => <line key={y} x1="70" y1={y} x2="144" y2={y} stroke="#cfe7da" strokeWidth="2" />)}
      {[56, 70, 84, 98, 112].map((y) => <line key={y} x1="178" y1={y} x2="252" y2={y} stroke="#cfe7da" strokeWidth="2" />)}
      <path d="M120 30 q-8 -14 4 -22 M200 38 q-8 -14 4 -22" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
    </Frame>
  ),
  mina: (
    <Frame label="Tents of Mina">
      <circle cx="262" cy="36" r="14" fill={GOLD} opacity="0.9" />
      <rect x="0" y="116" width="320" height="34" fill="#000" opacity="0.18" />
      {[10, 66, 122, 178, 234, 290].map((x, i) => (
        <g key={x}>
          <polygon points={`${x},118 ${x + 28},${70 - (i % 2) * 8} ${x + 56},118`} fill="#fff" opacity={i % 2 ? 0.85 : 0.95} />
          <polygon points={`${x + 20},118 ${x + 28},96 ${x + 36},118`} fill="#9ec9b4" />
        </g>
      ))}
    </Frame>
  ),
  arafah: (
    <Frame label="The plain and Mount of Mercy at Arafah">
      <circle cx="160" cy="44" r="22" fill={GOLD} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i * 36 * Math.PI) / 180;
        return <line key={i} x1={160 + Math.cos(a) * 28} y1={44 + Math.sin(a) * 28} x2={160 + Math.cos(a) * 40} y2={44 + Math.sin(a) * 40} stroke={GOLD} strokeWidth="3" strokeLinecap="round" />;
      })}
      <path d="M0 130 Q80 80 160 92 Q240 80 320 130 V150 H0 Z" fill="#fff" opacity="0.28" />
      <polygon points="110,128 160,78 210,128" fill="#fff" opacity="0.9" />
      <rect x="157" y="62" width="6" height="18" fill="#fff" />
      <polygon points="157,62 160,54 163,62" fill="#fff" />
      {[[40, 134], [72, 138], [250, 136], [284, 132]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="#fff" />)}
    </Frame>
  ),
  muzdalifah: (
    <Frame label="Night at Muzdalifah, collecting pebbles">
      <rect width="320" height="150" rx="16" fill="#0a1830" opacity="0.55" />
      <path d="M262 24 a18 18 0 1 0 14 28 a14 14 0 1 1 -14 -28z" fill={GOLD} />
      <Stars pts={[[30, 26, 2], [70, 50, 1.5], [110, 20, 2], [150, 44, 1.5], [200, 24, 2], [226, 58, 1.5], [60, 80, 1.5], [296, 84, 1.5]]} />
      <rect x="0" y="112" width="320" height="38" fill="#000" opacity="0.25" />
      {[[40, 126, 5], [64, 134, 4], [92, 124, 5], [124, 136, 4], [156, 128, 5], [190, 134, 4], [222, 124, 5], [252, 134, 4], [282, 126, 5]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r - 1} fill="#d8d2c2" />
      ))}
    </Frame>
  ),
  jamarat: (
    <Frame label="Stoning the pillars at the Jamarat">
      {[[70, 70, 22, 52], [160, 62, 24, 60], [250, 46, 30, 76]].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x - w / 2} y={y + 8} width={w} height={h} fill="#fff" opacity={0.78 + i * 0.07} />
          <ellipse cx={x} cy={y + 8} rx={w / 2} ry="5" fill="#fff" />
        </g>
      ))}
      <rect x="0" y="126" width="320" height="24" fill="#000" opacity="0.2" />
      {[[20, 118, 100, 78], [24, 124, 188, 70], [18, 112, 276, 60]].map(([sx, sy, ex, ey], i) => (
        <path key={i} d={`M${sx} ${sy} Q${(sx + ex) / 2} ${Math.min(sy, ey) - 34} ${ex} ${ey}`} fill="none" stroke={GOLD} strokeWidth="2.5" strokeDasharray="2 6" strokeLinecap="round" />
      ))}
      {[[100, 78], [188, 70], [276, 60]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill={GOLD} />)}
    </Frame>
  ),
};

export default function Scene({ kind }) {
  return SCENES[kind] || SCENES.kaaba;
}

// The Hajj route: Makkah, Mina, Arafah, Muzdalifah, and back.
export function HajjRoute() {
  const nodes = [
    { x: 50, y: 118, label: 'Makkah' },
    { x: 150, y: 58, label: 'Mina' },
    { x: 310, y: 118, label: 'Muzdalifah' },
    { x: 440, y: 58, label: 'Arafah' },
  ];
  return (
    <svg className="route" viewBox="0 0 500 170" role="img" aria-label="Hajj route: Makkah to Mina, Arafah, Muzdalifah, Mina, Makkah">
      <path d="M50 118 Q96 30 150 58 T310 118 T440 58" fill="none" stroke="var(--primary)" strokeOpacity="0.35" strokeWidth="4" strokeDasharray="2 9" strokeLinecap="round" />
      {nodes.map((n, i) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="14" fill="var(--primary)" />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fill="var(--on-primary)" fontSize="13" fontWeight="800">{i === 0 ? 'M' : i === 1 ? 'Mi' : i === 2 ? 'Mu' : 'A'}</text>
          <text x={n.x} y={n.y + (i % 2 === 0 ? 36 : -22)} textAnchor="middle" fill="var(--ink)" fontSize="14" fontWeight="700">{n.label}</text>
        </g>
      ))}
      <text x="100" y="26" fill="var(--muted)" fontSize="12">8th</text>
      <text x="230" y="76" fill="var(--muted)" fontSize="12">9th morning</text>
      <text x="390" y="112" fill="var(--muted)" fontSize="12">9th night</text>
      <text x="236" y="150" fill="var(--muted)" fontSize="12">10th to 13th: Mina, Makkah</text>
    </svg>
  );
}
