import Icon from './Icon.jsx';

export default function PlayerBar({ label, playing, error, onToggle, onPrev, onNext, onClose }) {
  return (
    <div className="player" role="region" aria-label="Audio player">
      <div className="player-info">
        <strong>{label}</strong>
        <span>{error || (playing ? 'Playing' : 'Paused')}</span>
      </div>
      <div className="player-controls">
        <button onClick={onPrev} aria-label="Previous verse"><Icon name="prev" size={20} filled /></button>
        <button className="player-main" onClick={onToggle} aria-label={playing ? 'Pause' : 'Play'}><Icon name={playing ? 'pause' : 'play'} size={22} filled /></button>
        <button onClick={onNext} aria-label="Next verse"><Icon name="next" size={20} filled /></button>
        <button onClick={onClose} aria-label="Close player"><Icon name="close" size={20} /></button>
      </div>
    </div>
  );
}
