let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function note(freq, duration, startTime, ctx, type = 'square', gain = 0.12) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, startTime);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.05);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

const N = {
  E4: 329.63, C4: 261.63, D4: 293.66, G3: 196.00,
  G4: 392.00, A4: 440.00, B4: 493.88, F4: 349.23,
  Fs4: 369.99, C5: 523.25, D5: 587.33, E5: 659.25,
  Bb4: 466.16, A3: 220.00, B3: 246.94, E3: 164.81,
  Fs3: 185.00, D3: 146.83, A2: 110.00, E2: 82.41,
  Cs5: 554.37, C3: 130.81, G2: 98.00, R: null,
};

const T = 0.13;

const melody = [
  [N.E4, T], [N.E4, T], [N.R, T], [N.E4, T], [N.R, T],
  [N.C4, T], [N.E4, T], [N.R, T], [N.G4, T], [N.R, T * 2],
  [N.G3, T * 1.5], [N.R, T * 1.5],
  [N.C4, T * 0.8], [N.R, T * 0.3], [N.G3, T * 0.5], [N.R, T * 0.3],
  [N.E3, T * 0.8], [N.R, T * 0.3],
  [N.A3, T], [N.B4, T], [N.Bb4, T], [N.A4, T],
  [N.G3, T * 0.5], [N.E4, T * 0.5], [N.G4, T], [N.A4, T],
  [N.F4, T], [N.G4, T], [N.R, T],
  [N.E4, T], [N.C4, T], [N.D4, T], [N.B3, T * 2],
  [N.R, T * 2],
  [N.C4, T * 0.8], [N.R, T * 0.3], [N.G3, T * 0.5], [N.R, T * 0.3],
  [N.E3, T * 0.8], [N.R, T * 0.3],
  [N.A3, T], [N.B4, T], [N.Bb4, T], [N.A4, T],
  [N.G3, T * 0.5], [N.E4, T * 0.5], [N.G4, T], [N.A4, T],
  [N.F4, T], [N.G4, T], [N.R, T],
  [N.E4, T], [N.C4, T], [N.D4, T], [N.B3, T * 2],
];

const matchJingle = [
  [N.E5, T * 0.6], [N.D5, T * 0.3], [N.C5, T * 0.3],
  [N.B4, T * 0.3], [N.A4, T * 0.3], [N.G4, T * 0.3],
  [N.C5, T * 0.8], [N.E5, T],
  [N.R, T * 0.3],
  [N.D5, T * 0.8], [N.C5, T * 0.8],
  [N.G4, T * 1.5],
];

export function playMoveSound() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.02;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.15, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(N.C5, start);
  osc.frequency.setValueAtTime(N.E5, start + 0.04);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 0.12);
}

export function playMarioTheme() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.1;
  melody.forEach(([freq, dur], i) => {
    if (freq) note(freq, dur, start + melody.slice(0, i).reduce((s, [, d]) => s + d, 0), ctx, 'square', 0.08);
  });
}

export function playMatchStartJingle() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.05;
  matchJingle.forEach(([freq, dur], i) => {
    if (freq) note(freq, dur, start + matchJingle.slice(0, i).reduce((s, [, d]) => s + d, 0), ctx, 'square', 0.1);
  });
}

export function playSafePressSound() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.02;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.12, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, start);
  osc.frequency.exponentialRampToValueAtTime(1320, start + 0.15);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 0.2);
}

export function playExplosionSound() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.02;

  const bufferSize = ctx.sampleRate * 0.5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.25, start);
  ng.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
  noise.connect(ng);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, start);
  filter.frequency.exponentialRampToValueAtTime(100, start + 0.4);
  ng.connect(filter);
  filter.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(80, start);
  osc.frequency.exponentialRampToValueAtTime(30, start + 0.5);
  const og = ctx.createGain();
  og.gain.setValueAtTime(0.3, start);
  og.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
  osc.connect(og);
  og.connect(ctx.destination);

  osc.start(start);
  osc.stop(start + 0.5);
  noise.start(start);
  noise.stop(start + 0.5);

  playMarioDeathSound();
}

export function playMarioDeathSound() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.15;
  const deathMelody = [
    [N.E4, 0.18], [N.C4, 0.15], [N.G3, 0.28],
    [N.E3, 0.18], [N.C3, 0.15], [N.G2, 0.5],
  ];
  deathMelody.forEach(([freq, dur], i) => {
    if (freq) note(freq, dur, start + deathMelody.slice(0, i).reduce((s, [, d]) => s + d, 0), ctx, 'square', 0.1);
  });
}

export function playCountdownTick() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.01;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.1, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + 0.08);
  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(880, start);
  osc.frequency.setValueAtTime(660, start + 0.04);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 0.08);
}

export function playCoinSound() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.02;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.12, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(988, start);
  osc.frequency.setValueAtTime(1319, start + 0.06);
  osc.frequency.setValueAtTime(1568, start + 0.12);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 0.25);
}