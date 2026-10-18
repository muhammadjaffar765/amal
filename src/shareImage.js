// Draws a verse card as a PNG so it can be shared or downloaded.
function wrap(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function makeVerseImage({ arabic, english, reference }) {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  try {
    await Promise.all([document.fonts.load('48px "Amiri Quran"'), document.fonts.load('32px "Figtree"')]);
  } catch {
    /* fall back to system fonts */
  }
  const css = getComputedStyle(document.documentElement);
  const c = (name, fallback) => css.getPropertyValue(name).trim() || fallback;

  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, c('--hero-a', '#0a5c41'));
  g.addColorStop(1, c('--hero-b', '#0d7a55'));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // faint star pattern
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 2;
  for (let y = 0; y < H + 90; y += 90) {
    for (let x = 0; x < W + 90; x += 90) {
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeRect(-24, -24, 48, 48);
      ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-24, -24, 48, 48);
      ctx.restore();
    }
  }

  // frame
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, W - 96, H - 96);
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(64, 64, W - 128, H - 128);

  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'alphabetic';

  // Arabic, shrinking until it fits
  const maxArabicH = 560;
  let arabicSize = 64;
  let arabicLines = [];
  ctx.direction = 'rtl';
  for (; arabicSize >= 26; arabicSize -= 4) {
    ctx.font = `${arabicSize}px "Amiri Quran", "Noto Naskh Arabic", serif`;
    arabicLines = wrap(ctx, arabic, W - 220);
    if (arabicLines.length * arabicSize * 1.9 <= maxArabicH) break;
  }
  const arabicLH = arabicSize * 1.9;

  // English, shrinking until it fits
  const maxEnglishH = 300;
  let englishSize = 36;
  let englishLines = [];
  ctx.direction = 'ltr';
  let text = english || '';
  for (; englishSize >= 22; englishSize -= 2) {
    ctx.font = `500 ${englishSize}px "Figtree", system-ui, sans-serif`;
    englishLines = wrap(ctx, text, W - 240);
    if (englishLines.length * englishSize * 1.45 <= maxEnglishH) break;
  }
  const maxLines = Math.floor(maxEnglishH / (englishSize * 1.45));
  if (englishLines.length > maxLines) {
    englishLines = englishLines.slice(0, maxLines);
    englishLines[maxLines - 1] = `${englishLines[maxLines - 1].replace(/[\s.,;:-]+$/, '')}…`;
  }
  const englishLH = englishSize * 1.45;

  const total = arabicLines.length * arabicLH + 50 + englishLines.length * englishLH;
  let y = Math.max(190, (H - total) / 2 + arabicSize);

  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.font = `${arabicSize}px "Amiri Quran", "Noto Naskh Arabic", serif`;
  for (const line of arabicLines) {
    ctx.fillText(line, W / 2, y);
    y += arabicLH;
  }

  y += 10;
  ctx.direction = 'ltr';
  ctx.font = `500 ${englishSize}px "Figtree", system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  for (const line of englishLines) {
    ctx.fillText(line, W / 2, y);
    y += englishLH;
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 32px "Figtree", system-ui, sans-serif';
  ctx.fillText(reference, W / 2, H - 150);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '600 26px "Figtree", system-ui, sans-serif';
  ctx.fillText('Amal', W / 2, H - 105);

  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not create image'))), 'image/png');
  });
}
