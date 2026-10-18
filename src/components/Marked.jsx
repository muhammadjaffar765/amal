// Shows text with the parts the reader highlighted (saved snippets) coloured in.
export default function Marked({ text, snips = [] }) {
  if (!snips.length) return text;
  let parts = [{ t: text }];
  snips.forEach((s) => {
    parts = parts.flatMap((p) => {
      if (p.c) return [p];
      const pieces = p.t.split(s.text);
      return pieces.flatMap((chunk, i) => (i < pieces.length - 1 ? [{ t: chunk }, { t: s.text, c: s.color }] : [{ t: chunk }]));
    });
  });
  return parts.map((p, i) => (p.c ? <mark key={i} className={`hl hl-${p.c}`}>{p.t}</mark> : <span key={i}>{p.t}</span>));
}
