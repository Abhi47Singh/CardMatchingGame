let audioCtx = null;
let masterGain = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.12;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

function playOsc({ frequency = 440, type = 'sine', duration = 0.12, volume = 1, detune = 0 }) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = frequency;
  o.detune.value = detune;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(volume, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  o.connect(g);
  g.connect(masterGain);
  o.start(now);
  o.stop(now + duration + 0.02);
}

export function playFlip() {
  playOsc({ frequency: 700, type: 'sawtooth', duration: 0.12, volume: 0.9 });
}

export function playClick() {
  playOsc({ frequency: 1100, type: 'square', duration: 0.08, volume: 0.6 });
}

export function playMatch() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  // simple chord
  const freqs = [520, 660, 780];
  freqs.forEach((f, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = i === 1 ? 'sine' : 'triangle';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.8 / (i + 1), now + 0.02 + i * 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.45 + i * 0.02);
    o.connect(g);
    g.connect(masterGain);
    o.start(now + i * 0.02);
    o.stop(now + 0.5 + i * 0.02);
  });
}

export function resumeIfNeeded() {
  try {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  } catch (e) {}
}
