// Small flat illustrations used on the home screen and tiles. They follow the theme colours.
const Frame = ({ children, label }) => (
  <svg viewBox="0 0 120 90" className="illus" role="img" aria-label={label}>{children}</svg>
);

export const QuranStand = () => (
  <Frame label="Open Quran on a stand">
    <path d="M32 84 L84 42 M88 84 L36 42" stroke="#b07a33" strokeWidth="6" strokeLinecap="round" />
    <polygon points="6,34 58,44 58,80 6,70" fill="var(--primary)" />
    <polygon points="114,34 62,44 62,80 114,70" fill="var(--primary)" opacity="0.85" />
    <polygon points="10,28 58,38 58,74 10,64" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5" />
    <polygon points="110,28 62,38 62,74 110,64" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="1.5" />
    <path d="M18 38 L50 45 M18 46 L50 53 M18 54 L50 61 M70 45 L102 38 M70 53 L102 46 M70 61 L102 54" stroke="var(--primary)" strokeOpacity="0.4" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M60 38 V76" stroke="var(--accent)" strokeWidth="2" />
    <circle cx="60" cy="16" r="9" fill="#f3c34a" />
    <circle cx="64" cy="13" r="8" fill="var(--surface)" />
  </Frame>
);

export const Beads = () => {
  const beads = Array.from({ length: 16 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 16;
    return [60 + 30 * Math.cos(a), 36 + 24 * Math.sin(a), i % 4 === 0];
  });
  return (
    <Frame label="Tasbeeh beads">
      {beads.map(([x, y, big], i) => <circle key={i} cx={x} cy={y} r={big ? 6 : 4.4} fill={big ? 'var(--accent)' : 'var(--primary)'} />)}
      <path d="M60 62 V78" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
      <path d="M54 78 L56 88 M60 78 V88 M66 78 L64 88" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="60" cy="62" r="4" fill="var(--accent)" />
    </Frame>
  );
};

export const Mat = () => (
  <Frame label="Prayer mat">
    <g transform="rotate(-5 60 45)">
      <rect x="26" y="10" width="68" height="70" rx="8" fill="var(--primary)" />
      <path d="M36 76 V42 a24 24 0 0 1 48 0 V76 Z" fill="var(--surface)" fillOpacity="0.92" />
      <path d="M44 74 V43 a16 16 0 0 1 32 0 V74 Z" fill="var(--primary-soft)" />
      <path d="M60 24 l3 6 6 1 -4.5 4 1.2 6 -5.7 -3.2 -5.7 3.2 1.2 -6 -4.5 -4 6 -1z" fill="var(--accent)" />
      {[32, 40, 48, 56, 64, 72, 80, 88].map((x) => <line key={x} x1={x} y1="80" x2={x} y2="86" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />)}
    </g>
  </Frame>
);

export const NamesStar = () => {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 === 0 ? 38 : 28;
    const a = (Math.PI * 2 * i) / 16 - Math.PI / 2;
    return `${(60 + r * Math.cos(a)).toFixed(1)},${(45 + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return (
    <Frame label="99 names">
      <polygon points={pts} fill="var(--accent)" />
      <circle cx="60" cy="45" r="22" fill="var(--surface)" />
      <text x="60" y="53" textAnchor="middle" fontSize="24" fontWeight="800" fill="var(--primary)" fontFamily="var(--font-ui)">99</text>
    </Frame>
  );
};

export const KaabaArt = () => (
  <Frame label="The Kaaba">
    <ellipse cx="60" cy="74" rx="46" ry="10" fill="none" stroke="var(--primary)" strokeOpacity="0.35" strokeWidth="2" />
    <rect x="38" y="22" width="44" height="50" fill="#1b1b1b" />
    <polygon points="38,22 82,22 77,17 43,17" fill="#3a3a3a" />
    <rect x="38" y="32" width="44" height="6" fill="#e2b53d" />
    <rect x="54" y="48" width="12" height="24" rx="2" fill="#e2b53d" />
    {[[14, 70], [32, 82], [60, 84], [90, 82], [108, 70]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.2" fill="var(--primary)" />)}
  </Frame>
);

export const MoonStars = () => (
  <Frame label="Moon and stars">
    <path d="M70 12 a32 32 0 1 0 22 52 a26 26 0 1 1 -22 -52z" fill="#f3c34a" />
    {[[22, 22, 3], [34, 56, 2.2], [100, 20, 2.6], [96, 70, 2]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="var(--primary)" />)}
  </Frame>
);

export const Hands = () => (
  <Frame label="Dua">
    <path d="M60 74 C40 70 30 56 28 34 C34 38 40 46 46 54 C46 40 52 28 60 16 C68 28 74 40 74 54 C80 46 86 38 92 34 C90 56 80 70 60 74z" fill="var(--primary)" />
    <path d="M60 28 V66" stroke="var(--surface)" strokeOpacity="0.5" strokeWidth="2" />
    <circle cx="60" cy="10" r="4" fill="#f3c34a" />
  </Frame>
);
