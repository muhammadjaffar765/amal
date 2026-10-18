import { FEATURES } from '../data/features.js';
import FeatureGrid from './FeatureGrid.jsx';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';

export default function More({ canInstall, onInstall }) {
  return (
    <>
      <PageHeader icon="grid" hue={152} title="Everything in Amal" subtitle="Your daily Islamic companion." />
      <FeatureGrid items={[...FEATURES, { id: 'saved', label: 'Saved verses', desc: 'Your bookmarks', icon: 'bookmark', hue: 300, href: '#/bookmarks' }, { id: 'search', label: 'Search the Quran', desc: 'English, Urdu or Arabic', icon: 'search', hue: 220, href: '#/search' }]} />
      {canInstall && (
        <button className="btn btn-primary wide-btn" onClick={onInstall}>
          <Icon name="download" size={18} /> Install Amal on this device
        </button>
      )}
      <section className="card about">
        <h2>About</h2>
        <p>
          Quran text, translations and audio come from the Al Quran Cloud API. Tafsir comes from the open tafsir_api
          dataset. Prayer times come from AlAdhan. Dhikr and dua texts should always be checked against a printed
          source you trust.
        </p>
      </section>
    </>
  );
}
