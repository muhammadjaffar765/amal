// A short paper sound for turning a page, made with the Web Audio API (no sound file needed).
let ctx = null;
export function playPageSound(volume = 0.4) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = ctx || new AC();
    if (ctx.state === 'suspended') ctx.resume();
    const dur = 0.24;
    const rate = ctx.sampleRate;
    const buf = ctx.createBuffer(1, Math.floor(rate * dur), rate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i += 1) {
      const t = i / d.length;
      const env = Math.pow(1 - t, 2.2) * (t < 0.05 ? t / 0.05 : 1) * (0.7 + 0.3 * Math.sin(t * 40));
      d[i] = (Math.random() * 2 - 1) * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1200;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3200; bp.Q.value = 0.7;
    const g = ctx.createGain(); g.gain.value = volume;
    src.connect(hp); hp.connect(bp); bp.connect(g); g.connect(ctx.destination);
    src.start();
  } catch {
    /* sound is optional */
  }
}
