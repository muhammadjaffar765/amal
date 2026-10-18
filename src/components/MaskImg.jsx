// A single-colour image used as a mask, so the text takes the colour of the current theme (works in dark mode).
export default function MaskImg({ img, scale = 100, className = '', label }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`maskimg ${className}`}
      style={{
        '--mw': img.w,
        width: `min(100%, ${(img.w * scale) / 100}px)`,
        aspectRatio: `${img.w} / ${img.h}`,
        WebkitMaskImage: `url(${img.src})`,
        maskImage: `url(${img.src})`,
      }}
    />
  );
}

export function SizeControl({ settings, onSettings, max = 100 }) {
  const v = settings.imgSize;
  const set = (n) => onSettings({ imgSize: Math.max(50, Math.min(max, n)) });
  return (
    <span className="size-ctl">
      <button className="icon-btn" onClick={() => set(v - 10)} aria-label="Smaller text" disabled={v <= 50}>A−</button>
      <button className="icon-btn" onClick={() => set(v + 10)} aria-label="Larger text" disabled={v >= max}>A+</button>
    </span>
  );
}

export function TranslationSwitch({ settings, onSettings, label = 'Transliteration and translation' }) {
  return (
    <label className="switch-row">
      <input type="checkbox" checked={settings.sacredTranslation} onChange={(e) => onSettings({ sacredTranslation: e.target.checked })} />
      <span>{label}</span>
    </label>
  );
}
