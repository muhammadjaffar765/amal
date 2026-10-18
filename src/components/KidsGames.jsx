import { useEffect, useMemo, useRef, useState } from 'react';
import { MEMORY_PAIRS, ORDER_GAMES, QUIZ } from '../data/kids.js';
import Icon from './Icon.jsx';

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const starsText = (n) => '⭐'.repeat(n) + '☆'.repeat(3 - n);

// ---------- memory match ----------
export function MemoryGame({ kids, award, Head, Badges }) {
  const [pairs, setPairs] = useState(6);
  const [cards, setCards] = useState([]);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [badges, setBadges] = useState([]);
  const lock = useRef(false);

  const deal = (n = pairs) => {
    const chosen = shuffle(MEMORY_PAIRS).slice(0, n);
    setCards(shuffle(chosen.flatMap((p, i) => [{ k: `${i}e`, pair: i, side: 'emoji', p }, { k: `${i}a`, pair: i, side: 'ar', p }])));
    setOpen([]);
    setMatched([]);
    setMoves(0);
    setBadges([]);
    lock.current = false;
  };
  useEffect(() => { deal(pairs); }, [pairs]); // eslint-disable-line react-hooks/exhaustive-deps

  const done = cards.length > 0 && matched.length === cards.length;
  const stars = moves <= pairs * 2 ? 3 : moves <= pairs * 3 ? 2 : 1;
  useEffect(() => {
    if (done) setBadges(award(stars, ['memory']));
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const flip = (i) => {
    if (lock.current || open.includes(i) || matched.includes(i)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next.map((x) => cards[x]);
      if (a.pair === b.pair) {
        setMatched((m) => [...m, ...next]);
        setOpen([]);
      } else {
        lock.current = true;
        setTimeout(() => { setOpen([]); lock.current = false; }, 800);
      }
    }
  };

  return (
    <>
      <Head title="Memory match" sub="Match each picture with its Arabic word." stars={kids.stars} />
      <div className="seg lang-seg" role="group" aria-label="Difficulty">
        <button className={pairs === 6 ? 'is-on' : ''} onClick={() => setPairs(6)} aria-pressed={pairs === 6}>Easy</button>
        <button className={pairs === 8 ? 'is-on' : ''} onClick={() => setPairs(8)} aria-pressed={pairs === 8}>Harder</button>
      </div>
      <p className="moves">Moves: <strong>{moves}</strong></p>
      <div className={pairs === 8 ? 'mem-grid four' : 'mem-grid'}>
        {cards.map((c, i) => {
          const shown = open.includes(i) || matched.includes(i);
          return (
            <button key={c.k} className={`mem-card${shown ? ' is-up' : ''}${matched.includes(i) ? ' is-matched' : ''}`} onClick={() => flip(i)} aria-label={shown ? (c.side === 'emoji' ? c.p.en : c.p.ar) : 'Hidden card'}>
              <span className="mem-face back">?</span>
              <span className="mem-face front">
                {c.side === 'emoji' ? <span className="mem-emoji">{c.p.emoji}</span> : <span className="mem-ar" lang="ar">{c.p.ar}</span>}
                {c.side === 'ar' && <small>{c.p.en}</small>}
              </span>
            </button>
          );
        })}
      </div>
      {done && (
        <div className="result-card" role="status">
          <h2>Well done! 🎉</h2>
          <p className="big-stars">{starsText(stars)}</p>
          <p>You finished in {moves} moves.</p>
          <Badges list={badges} />
          <button className="btn btn-primary" onClick={() => deal()}><Icon name="rotate" size={18} /> Play again</button>
        </div>
      )}
    </>
  );
}

// ---------- quiz ----------
export function QuizGame({ kids, award, Head, Badges }) {
  const make = () => shuffle(QUIZ).slice(0, 8).map((q) => {
    const order = shuffle(q.o.map((text, i) => ({ text, ok: i === q.a })));
    return { q: q.q, o: order };
  });
  const [round, setRound] = useState(make);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [badges, setBadges] = useState([]);
  const finished = i >= round.length;
  const awarded = useRef(false);

  useEffect(() => {
    if (finished && !awarded.current) {
      awarded.current = true;
      const stars = score === round.length ? 3 : score >= 6 ? 2 : score >= 4 ? 1 : 0;
      setBadges(award(stars, ['quiz', ...(score === round.length ? ['perfect'] : [])]));
    }
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (idx) => {
    if (picked !== null) return;
    setPicked(idx);
    if (round[i].o[idx].ok) setScore((s) => s + 1);
  };
  const again = () => { awarded.current = false; setRound(make()); setI(0); setPicked(null); setScore(0); setBadges([]); };
  const stars = score === round.length ? 3 : score >= 6 ? 2 : score >= 4 ? 1 : 0;

  return (
    <>
      <Head title="Islamic quiz" sub="Eight easy questions. Get stars and badges!" stars={kids.stars} />
      {!finished ? (
        <section className="quiz">
          <p className="quiz-count">Question {i + 1} of {round.length}</p>
          <div className="bar" aria-hidden="true"><span style={{ width: `${(i / round.length) * 100}%` }} /></div>
          <h2>{round[i].q}</h2>
          <div className="quiz-options">
            {round[i].o.map((o, idx) => {
              const state = picked === null ? '' : o.ok ? ' is-right' : picked === idx ? ' is-wrong' : '';
              return <button key={idx} className={`quiz-opt${state}`} onClick={() => choose(idx)} disabled={picked !== null && !o.ok && picked !== idx}>{o.text}</button>;
            })}
          </div>
          {picked !== null && (
            <div className="quiz-next">
              <p>{round[i].o[picked].ok ? 'Correct! Masha Allah 🎉' : 'Not this time. The right answer is highlighted.'}</p>
              <button className="btn btn-primary" onClick={() => { setI((n) => n + 1); setPicked(null); }}>{i + 1 === round.length ? 'See my stars' : 'Next question'} <Icon name="arrow-right" size={18} /></button>
            </div>
          )}
        </section>
      ) : (
        <div className="result-card" role="status">
          <h2>{score} out of {round.length}</h2>
          <p className="big-stars">{starsText(stars)}</p>
          <p>{score === round.length ? 'Perfect! Masha Allah!' : score >= 6 ? 'Great job!' : 'Good try. Play again to get more stars!'}</p>
          <Badges list={badges} />
          <button className="btn btn-primary" onClick={again}><Icon name="rotate" size={18} /> Play again</button>
        </div>
      )}
    </>
  );
}

// ---------- put the steps in order ----------
export function OrderGame({ kind, kids, award, Head, Badges }) {
  const game = ORDER_GAMES[kind];
  const start = () => {
    let s = shuffle(game.steps.map((text, i) => ({ text, i })));
    while (s.every((x, k) => x.i === k)) s = shuffle(s);
    return s;
  };
  const [items, setItems] = useState(start);
  const [checked, setChecked] = useState(false);
  const [tries, setTries] = useState(0);
  const [badges, setBadges] = useState([]);
  const allRight = items.every((x, k) => x.i === k);

  useEffect(() => { setItems(start()); setChecked(false); setTries(0); setBadges([]); }, [kind]); // eslint-disable-line react-hooks/exhaustive-deps

  const move = (k, d) => {
    const j = k + d;
    if (j < 0 || j >= items.length) return;
    setChecked(false);
    setItems((arr) => { const a = [...arr]; [a[k], a[j]] = [a[j], a[k]]; return a; });
  };
  const check = () => {
    setChecked(true);
    setTries((t) => t + 1);
    if (allRight) setBadges(award(tries === 0 ? 3 : tries === 1 ? 2 : 1, [kind]));
  };
  const reset = () => { setItems(start()); setChecked(false); setTries(0); setBadges([]); };

  return (
    <>
      <Head title={game.title} sub={game.intro} stars={kids.stars} />
      <p className="hint kids-note">Use the arrows to move a step up or down, then press Check.</p>
      <ol className="order-list">
        {items.map((it, k) => {
          const state = checked ? (it.i === k ? ' is-right' : ' is-wrong') : '';
          return (
            <li key={it.i} className={`order-item${state}`}>
              <span className="order-n">{k + 1}</span>
              <span className="order-text">{it.text}</span>
              <span className="order-btns">
                <button className="icon-btn" onClick={() => move(k, -1)} disabled={k === 0} aria-label={`Move step ${k + 1} up`}><Icon name="arrow-left" size={16} /></button>
                <button className="icon-btn" onClick={() => move(k, 1)} disabled={k === items.length - 1} aria-label={`Move step ${k + 1} down`}><Icon name="arrow-right" size={16} /></button>
              </span>
            </li>
          );
        })}
      </ol>
      {checked && allRight ? (
        <div className="result-card" role="status">
          <h2>Perfect order! 🎉</h2>
          <p className="big-stars">{starsText(tries === 1 ? 3 : tries === 2 ? 2 : 1)}</p>
          <Badges list={badges} />
          <button className="btn btn-primary" onClick={reset}><Icon name="rotate" size={18} /> Play again</button>
        </div>
      ) : (
        <div className="form-actions">
          <button className="btn btn-primary" onClick={check}><Icon name="check" size={18} /> Check</button>
          <button className="btn btn-ghost" onClick={reset}>Shuffle again</button>
          {checked && !allRight && <p className="hint">Some steps are not right yet. The green ones are in the right place.</p>}
        </div>
      )}
    </>
  );
}
