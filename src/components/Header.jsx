import Icon from './Icon.jsx';
import Logo from './Logo.jsx';

export const NAV = [
  { key: '', label: 'Home', href: '#/', icon: 'home' },
  { key: 'quran', label: 'Quran', href: '#/quran', icon: 'book-open' },
  { key: 'prayer', label: 'Prayer', href: '#/prayer', icon: 'clock' },
  { key: 'calendar', label: 'Calendar', href: '#/calendar', icon: 'calendar' },
  { key: 'adhkar', label: 'Adhkar', href: '#/adhkar', icon: 'sun' },
  { key: 'more', label: 'More', href: '#/more', icon: 'grid' },
];

export default function Header({ active, onOpenSettings, showBack, onBack, onOpenMenu }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        {onOpenMenu && (
          <button className="icon-btn menu-btn" onClick={onOpenMenu} aria-label="Open the menu">
            <Icon name="menu" size={22} />
          </button>
        )}
        {showBack && (
          <button className="icon-btn back-btn" onClick={onBack} aria-label="Go back">
            <Icon name="chevron-left" size={22} />
          </button>
        )}
        <a className="brand" href="#/" aria-label="Amal home">
          <Logo size={38} />
          <span className="brand-text">
            <span className="brand-name">Amal</span>
            <span className="brand-sub">Quran app</span>
          </span>
        </a>
        <nav className="nav-desktop" aria-label="Main">
          {NAV.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={active === item.key ? 'nav-link is-active' : 'nav-link'}
              aria-current={active === item.key ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button className="icon-btn" onClick={onOpenSettings} aria-label="Open display settings">
          <Icon name="sliders" />
        </button>
      </div>
    </header>
  );
}

const MOBILE_NAV = NAV.filter((n) => ['', 'quran', 'prayer', 'calendar'].includes(n.key));

export function MobileNav({ active, onOpenMenu }) {
  return (
    <nav className="nav-mobile" aria-label="Main">
      {MOBILE_NAV.map((item) => (
        <a
          key={item.key}
          href={item.href}
          className={active === item.key ? 'is-active' : undefined}
          aria-current={active === item.key ? 'page' : undefined}
        >
          <span className="nav-pill"><Icon name={item.icon} size={22} /></span>
          <span>{item.label}</span>
        </a>
      ))}
      <button type="button" className={active === 'more' ? 'is-active' : undefined} onClick={onOpenMenu} aria-label="Open the menu">
        <span className="nav-pill"><Icon name="menu" size={22} /></span>
        <span>Menu</span>
      </button>
    </nav>
  );
}
