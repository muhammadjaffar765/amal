const AR_DIGITS = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
const STAR = Array.from({ length: 16 }, (_, i) => {
  const r = i % 2 === 0 ? 11 : 7.5;
  const a = (Math.PI * 2 * i) / 16 - Math.PI / 2;
  return `${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`;
}).join(' ');

// Four small stars in the corners of a Mushaf page.
export function Corners() {
  return ['tl', 'tr', 'bl', 'br'].map((c) => (
    <span key={c} className={`corner ${c}`} aria-hidden="true">
      <svg viewBox="0 0 24 24"><polygon points={STAR} fill="currentColor" /></svg>
    </span>
  ));
}

// The ornamented banner at the start of a surah, like a printed Mushaf:
// number of verses on one side, Makki or Madani on the other, the surah name in the middle.
export function Cartouche({ name, ayahs, type }) {
  return (
    <div className="cartouche">
      <span className="cart-side" lang="ar">{ayahs ? `آياتها ${AR_DIGITS(ayahs)}` : ''}</span>
      <span className="cart-name" lang="ar">{name}</span>
      <span className="cart-side" lang="ar">{type === 'Meccan' ? 'مكية' : type === 'Medinan' ? 'مدنية' : ''}</span>
    </div>
  );
}
