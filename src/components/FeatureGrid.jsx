import Icon from './Icon.jsx';

export default function FeatureGrid({ items }) {
  return (
    <div className="tiles">
      {items.map((f) => (
        <a key={f.id} className="tile" href={f.href} style={{ '--hue': f.hue }}>
          <span className="tile-icon">
            <Icon name={f.icon} size={24} />
          </span>
          <strong>{f.label}</strong>
          <span>{f.desc}</span>
        </a>
      ))}
    </div>
  );
}
