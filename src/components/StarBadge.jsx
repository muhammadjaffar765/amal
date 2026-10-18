// An eight-pointed star (the shape used to mark verse ends in many mushafs).
const POINTS = Array.from({ length: 16 }, (_, i) => {
  const r = i % 2 === 0 ? 19 : 14.2;
  const a = (Math.PI * 2 * i) / 16 - Math.PI / 2;
  return `${(20 + r * Math.cos(a)).toFixed(2)},${(20 + r * Math.sin(a)).toFixed(2)}`;
}).join(' ');

export default function StarBadge({ n, size = 40 }) {
  return (
    <span className="star" style={{ width: size, height: size, fontSize: size * 0.33 }}>
      <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
        <polygon points={POINTS} />
      </svg>
      <span className="star-n">{n}</span>
    </span>
  );
}
