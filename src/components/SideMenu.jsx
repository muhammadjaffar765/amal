import { useEffect } from 'react';
import { FEATURES } from '../data/features.js';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';

const byId = (id) => FEATURES.find((f) => f.id === id);
const GROUPS = [
  { title: 'Main', ids: ['quran', 'prayer', 'calendar', 'adhkar', 'tasbeeh', 'qibla'] },
  { title: 'Read and listen', ids: ['texts', 'manzil', 'salawat', 'duas', 'names', 'hadith', 'kalimas', 'naats'] },
  { title: 'Plan and practise', ids: ['khatm', 'amal', 'hifz', 'umrah', 'hajjplan', 'hajj', 'notes', 'kids'] },
];
const TEXTS = [
  ['#/dalail', 'Dalail al-Khayrat'], ['#/hizbulbahr', 'Hizb al-Bahr'], ['#/burda', 'Qaseeda Burda'],
  ['#/qadria', 'Khatm-e-Qadria'], ['#/wazifa', 'Al-Wazifa-tul-Karima'],
];

// The menu that slides in from the side, with every part of the app in one place.
export default function SideMenu({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="drawer-wrap">
      <button className="drawer-scrim" onClick={onClose} aria-label="Close the menu" />
      <aside className="drawer" role="dialog" aria-label="Menu">
        <div className="drawer-head">
          <a className="brand" href="#/" onClick={onClose}><Logo size={34} /><span className="brand-text"><span className="brand-name">Amal</span><span className="brand-sub">Quran app</span></span></a>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" size={20} /></button>
        </div>
        <nav className="drawer-nav" onClick={(e) => e.target.closest('a') && onClose()}>
          <a className="drawer-link" href="#/"><span className="drawer-ico" style={{ '--hue': 160 }}><Icon name="home" size={20} /></span><span>Home</span></a>
          {GROUPS.map((g) => (
            <div key={g.title}>
              <p className="drawer-title">{g.title}</p>
              {g.ids.map((id) => {
                const f = byId(id);
                if (!f) return null;
                return (
                  <div key={id}>
                    <a className="drawer-link" href={f.href}><span className="drawer-ico" style={{ '--hue': f.hue }}><Icon name={f.icon} size={20} /></span><span>{f.label}</span></a>
                    {id === 'texts' && TEXTS.map(([href, label]) => <a key={href} className="drawer-link sub" href={href}><span>{label}</span></a>)}
                  </div>
                );
              })}
            </div>
          ))}
          <a className="drawer-link" href="#/more"><span className="drawer-ico" style={{ '--hue': 210 }}><Icon name="grid" size={20} /></span><span>Everything (grid view)</span></a>
        </nav>
      </aside>
    </div>
  );
}
