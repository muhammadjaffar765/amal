import { ADHKAR_CATEGORIES, getCategory } from '../data/adhkar.js';
import { buzz, useDaily } from '../hooks/useDaily.js';
import CountButton from './CountButton.jsx';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';
import TextBlock from './TextBlock.jsx';
import ListenBar from './ListenBar.jsx';

const doneCount = (cat, counts) => cat.items.filter((i) => (counts[`${cat.id}:${i.id}`] || 0) >= i.count).length;

export function AdhkarIndex() {
  const [counts] = useDaily('noor:adhkar');
  return (
    <>
      <PageHeader icon="sun" hue={36} title="Daily adhkar" subtitle="Tap a set, then count each dhikr as you recite. Progress resets every day." />
      <ListenBar id="adhkar" title="the adhkar" query="morning evening adhkar recitation" />
      <div className="cat-list">
        {ADHKAR_CATEGORIES.map((cat) => {
          const done = doneCount(cat, counts);
          const pct = Math.round((done / cat.items.length) * 100);
          return (
            <a key={cat.id} className="cat-card" href={`#/adhkar/${cat.id}`} style={{ '--hue': cat.hue }}>
              <span className="tile-icon big">
                <Icon name={cat.icon} size={26} />
              </span>
              <span className="cat-body">
                <strong>{cat.title}</strong>
                <span>{cat.desc}</span>
                <span className="bar" aria-hidden="true">
                  <span style={{ width: `${pct}%` }} />
                </span>
              </span>
              <span className="cat-meta">
                {done}/{cat.items.length}
              </span>
            </a>
          );
        })}
      </div>
    </>
  );
}

export function AdhkarCategory({ id, settings }) {
  const cat = getCategory(id);
  const [counts, update] = useDaily('noor:adhkar');

  if (!cat) {
    return (
      <div className="empty-card">
        <p>That set of adhkar does not exist.</p>
        <a className="btn btn-primary" href="#/adhkar">
          Back to adhkar
        </a>
      </div>
    );
  }

  const keyOf = (item) => `${cat.id}:${item.id}`;
  const tap = (item) => {
    const k = keyOf(item);
    const next = (counts[k] || 0) + 1;
    update((d) => ({ ...d, [k]: next }));
    buzz(settings, next === item.count ? 40 : 10);
  };
  const reset = (item) => update((d) => ({ ...d, [keyOf(item)]: 0 }));
  const done = doneCount(cat, counts);

  return (
    <>
      <PageHeader
        icon={cat.icon}
        hue={cat.hue}
        title={cat.title}
        subtitle={cat.desc}
        back={{ href: '#/adhkar', label: 'All adhkar' }}
      >
        <div className="page-progress">
          <span className="bar" aria-hidden="true">
            <span style={{ width: `${Math.round((done / cat.items.length) * 100)}%` }} />
          </span>
          <span>
            {done} of {cat.items.length} complete
          </span>
        </div>
      </PageHeader>
      {cat.note && <p className="note">{cat.note}</p>}

      {cat.items.map((item, idx) => {
        const count = counts[keyOf(item)] || 0;
        const isDone = count >= item.count;
        const groupInfo = item.group && cat.groups ? cat.groups[item.group] : null;
        const showGroup = groupInfo && (idx === 0 || cat.items[idx - 1].group !== item.group);
        return (
          <div key={item.id}>
          {showGroup && (
            <div className="group-head">
              <h2>{groupInfo.title}</h2>
              {groupInfo.note && <p>{groupInfo.note}</p>}
            </div>
          )}
          <article className={isDone ? 'dhikr is-done' : 'dhikr'}>
            <div className="dhikr-top">
              <h2>{item.title}</h2>
              <span className="tag">Recite {item.count}x</span>
            </div>
            <TextBlock item={item} settings={settings} />
            {item.source && <p className="source">Source: {item.source}</p>}
            <CountButton count={count} target={item.count} onTap={() => tap(item)} onReset={() => reset(item)} />
          </article>
          </div>
        );
      })}
    </>
  );
}
