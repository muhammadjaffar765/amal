import Icon from './Icon.jsx';

export default function PageHeader({ icon, title, subtitle, hue = 152, back, children }) {
  return (
    <header className="page-head" style={{ '--hue': hue }}>
      {back && (
        <a className="page-back" href={back.href} onClick={back.onClick}>
          <Icon name="arrow-left" size={16} /> {back.label}
        </a>
      )}
      <div className="page-head-main">
        <span className="tile-icon big">
          <Icon name={icon} size={26} />
        </span>
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {children}
    </header>
  );
}
