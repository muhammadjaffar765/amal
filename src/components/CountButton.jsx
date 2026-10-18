import Icon from './Icon.jsx';

export default function CountButton({ count, target, onTap, onReset }) {
  const done = count >= target;
  const pct = Math.min(100, Math.round((count / target) * 100));
  return (
    <div className="count-row">
      <button className={done ? 'count-btn is-done' : 'count-btn'} onClick={onTap} aria-label={`Count, ${count} of ${target}`}>
        <span className="count-fill" style={{ width: `${pct}%` }} />
        <span className="count-label">
          {done ? (
            <>
              <Icon name="check" size={18} /> Done
            </>
          ) : (
            'Tap to count'
          )}
        </span>
        <span className="count-num">
          {count} / {target}
        </span>
      </button>
      <button className="icon-btn" onClick={onReset} aria-label="Reset counter" disabled={count === 0}>
        <Icon name="rotate" size={18} />
      </button>
    </div>
  );
}
