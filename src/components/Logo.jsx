import { useId } from 'react';

const STAR = Array.from({ length: 16 }, (_, i) => {
  const r = i % 2 === 0 ? 31 : 23;
  const a = (Math.PI * 2 * i) / 16 - Math.PI / 2;
  return `${(32 + r * Math.cos(a)).toFixed(2)},${(32 + r * Math.sin(a)).toFixed(2)}`;
}).join(' ');

// The Amal mark: an open Quran under a crescent, on an eight-pointed star. It stands for reading, then acting.
export default function Logo({ size = 40 }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="logo" viewBox="0 0 64 64" width={size} height={size} role="img" aria-label="Amal">
      <defs>
        <linearGradient id={`l${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#14a974" />
          <stop offset="1" stopColor="#0a5c41" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#l${id})`} />
      <polygon points={STAR} fill="#fff" fillOpacity="0.13" />
      <path d="M32 47 C26 43 18 42 11 44 V23 C18 21 26 22 32 26 Z" fill="#fff" />
      <path d="M32 47 C38 43 46 42 53 44 V23 C46 21 38 22 32 26 Z" fill="#e9f7f0" />
      <path d="M32 26 V47" stroke="#e2b53d" strokeWidth="1.6" />
      <path d="M16 29 C20 28 24 28.5 28 30 M16 34 C20 33 24 33.5 28 35 M36 30 C40 28.5 44 28 48 29 M36 35 C40 33.5 44 33 48 34" stroke="#0d7a55" strokeOpacity="0.45" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M41.5 8 a8.4 8.4 0 1 0 6.2 14.2 A6.6 6.6 0 0 1 41.5 8z" fill="#f3c34a" />
      <circle cx="50.5" cy="11.5" r="1.7" fill="#f3c34a" />
    </svg>
  );
}
