let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function note(freq, duration, startTime, ctx, type = 'square', gain = 0.12, opts = {}) {
  if (!freq || duration <= 0) return null;

  const attack = Math.min(opts.attack ?? 0.012, duration * 0.25);
  const release = Math.min(opts.release ?? 0.06, duration * 0.45);
  const sustainEnd = Math.max(startTime + attack + 0.002, startTime + duration - release);

  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  // Soften the harsh square wave so notes blend instead of clicking.
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(opts.cutoff ?? 5200, startTime);
  filter.Q.value = 0.4;

  // Attack → sustain → release. The sustain plateau is what was missing:
  // without it every note decayed from its first sample and long notes
  // faded out before their slot ended, sounding like the music was cut.
  g.gain.setValueAtTime(0.0001, startTime);
  g.gain.exponentialRampToValueAtTime(gain, startTime + attack);
  g.gain.setValueAtTime(gain, sustainEnd);
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(filter);
  filter.connect(g);
  g.connect(opts.destination || ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
  return { osc, gain: g };
}

function playSequence(sequence, { start, ctx, type = 'square', gain = 0.09, cutoff, track } = {}) {
  let time = start;
  for (const [freq, duration] of sequence) {
    if (freq) {
      const voice = note(freq, duration, time, ctx, type, gain, { cutoff });
      if (track && voice) track.push(voice);
    }
    time += duration;
  }
  return time;
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
  [N.E4, T], [N.C4, T], [N.D4, T], [N.B3, T * 4],
];

let themeVoices = [];

export function stopMarioTheme(fade = 0.08) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  for (const { osc, gain } of themeVoices) {
    try {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + fade);
      osc.stop(now + fade + 0.02);
    } catch {
      // The voice already finished — nothing to stop.
    }
  }
  themeVoices = [];
}

const matchJingle = [
  [N.E5, T * 0.6], [N.D5, T * 0.3], [N.C5, T * 0.3],
  [N.B4, T * 0.3], [N.A4, T * 0.3], [N.G4, T * 0.3],
  [N.C5, T * 0.8], [N.E5, T],
  [N.R, T * 0.3],
  [N.D5, T * 0.8], [N.C5, T * 0.8],
  [N.G4, T * 1.5],
];

export function playJumpSound(doubleJump = false) {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.005;
  const base = doubleJump ? 620 : 380;
  const duration = doubleJump ? 0.13 : 0.18;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = 'square';
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3200, start);
  osc.frequency.setValueAtTime(base, start);
  osc.frequency.exponentialRampToValueAtTime(base * (doubleJump ? 1.65 : 1.95), start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(doubleJump ? 0.09 : 0.115, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);

  if (doubleJump) {
    const sparkle = ctx.createOscillator();
    const sg = ctx.createGain();
    sparkle.type = 'triangle';
    sparkle.frequency.setValueAtTime(base * 2.1, start + 0.02);
    sparkle.frequency.exponentialRampToValueAtTime(base * 2.8, start + 0.1);
    sg.gain.setValueAtTime(0.035, start + 0.02);
    sg.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
    sparkle.connect(sg);
    sg.connect(ctx.destination);
    sparkle.start(start + 0.02);
    sparkle.stop(start + 0.15);
  }
}

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
  stopMarioTheme(0.03);
  const start = ctx.currentTime + 0.08;
  playSequence(melody, { start, ctx, type: 'square', gain: 0.07, cutoff: 4200, track: themeVoices });
}

// --- Boss battle music -------------------------------------------------------
// Procedural loop with a distinct tempo, key, scale and drum feel per boss.

const BOSS_MUSIC = {
  grass: {
    tempo: 138, root: 146.83,
    leadType: 'triangle', bassType: 'triangle', leadGain: 0.055, leadDur: 0.16,
    pattern: [0, 7, 12, 7, 3, 10, 12, 15, 0, 7, 5, 12, 10, 7, 3, 0],
    bass: [0, 5, 3, 7], hatEvery: 2, snare: true,
  },
  cave: {
    tempo: 116, root: 110,
    leadType: 'sine', bassType: 'triangle', leadGain: 0.07, leadDur: 0.23,
    pattern: [0, 3, 7, 10, 12, 10, 7, 3, 0, 7, 10, 14, 12, 10, 7, 3],
    bass: [0, 3, 5, 3], hatEvery: 4, snare: false,
  },
  sky: {
    tempo: 158, root: 164.81,
    leadType: 'square', bassType: 'square', leadGain: 0.04, leadDur: 0.1,
    pattern: [0, 7, 12, 19, 12, 7, 5, 12, 0, 7, 10, 12, 15, 12, 7, 5],
    bass: [0, 7, 5, 3], hatEvery: 1, snare: true,
  },
  castle: {
    tempo: 176, root: 130.81,
    leadType: 'sawtooth', bassType: 'square', leadGain: 0.045, leadDur: 0.12,
    pattern: [0, 5, 7, 12, 7, 5, 3, 7, 0, 12, 10, 7, 5, 3, 2, 0],
    bass: [0, 5, 3, 7], hatEvery: 1, snare: true,
  },
  pac: {
    tempo: 148, root: 196.00,
    leadType: 'square', bassType: 'triangle', leadGain: 0.05, leadDur: 0.09,
    pattern: [0, 4, 7, 12, 7, 4, 2, 7, 0, 12, 11, 7, 4, 2, 0, 7],
    bass: [0, 7, 4, 2], hatEvery: 1, snare: false,
  },
  koopa: {
    tempo: 132, root: 98.00,
    leadType: 'sawtooth', bassType: 'square', leadGain: 0.055, leadDur: 0.16,
    pattern: [0, 3, 5, 7, 10, 7, 5, 3, 0, 12, 10, 7, 5, 3, 1, 0],
    bass: [0, 5, 3, 7], hatEvery: 2, snare: true,
  },
  water: {
    tempo: 100, root: 87.31,
    leadType: 'sine', bassType: 'triangle', leadGain: 0.075, leadDur: 0.28,
    pattern: [0, 3, 7, 10, 14, 10, 7, 3, 0, 5, 8, 12, 10, 7, 3, 0],
    bass: [0, 3, 5, 3], hatEvery: 4, snare: false,
  },
};

let bossMusicTimer = null;
let bossMusicTheme = null;
let bossMusicNextTime = 0;
let bossMusicStep = 0;
let bossMusicVoices = new Set();
let bossNoiseBuffer = null;

function bossSemitone(root, semis) {
  return root * Math.pow(2, semis / 12);
}

function getBossNoiseBuffer(ctx) {
  if (bossNoiseBuffer && bossNoiseBuffer.sampleRate === ctx.sampleRate) return bossNoiseBuffer;
  const size = Math.floor(ctx.sampleRate * 0.4);
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  bossNoiseBuffer = buffer;
  return buffer;
}

function bossKick(ctx, time, gain = 0.09) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, time);
  osc.frequency.exponentialRampToValueAtTime(38, time + 0.13);
  g.gain.setValueAtTime(gain, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
  osc.connect(g); g.connect(ctx.destination);
  osc.start(time); osc.stop(time + 0.17);
}

function bossNoiseHit(ctx, time, gain, freq, type = 'highpass', duration = 0.07) {
  const src = ctx.createBufferSource();
  src.buffer = getBossNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(freq, time);
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + duration);
  src.connect(filter); filter.connect(g); g.connect(ctx.destination);
  src.start(time); src.stop(time + duration + 0.02);
}

function bossVoice(freq, duration, time, ctx, type, gain, cutoff) {
  const voice = note(freq, duration, time, ctx, type, gain, { cutoff });
  if (voice) {
    bossMusicVoices.add(voice);
    voice.osc.onended = () => bossMusicVoices.delete(voice);
  }
}

function scheduleBossMusic() {
  const ctx = audioCtx;
  const cfg = BOSS_MUSIC[bossMusicTheme] || BOSS_MUSIC.grass;
  if (!ctx) return;
  const horizon = ctx.currentTime + 0.5;
  const stepTime = 60 / cfg.tempo / 2;
  while (bossMusicNextTime < horizon) {
    const step = bossMusicStep % 16;
    const t = bossMusicNextTime;

    if (step % 4 === 0) {
      const bassSemis = cfg.bass[(bossMusicStep / 4) % cfg.bass.length | 0] || 0;
      bossVoice(bossSemitone(cfg.root, bassSemis) / 2, stepTime * 1.8, t, ctx, cfg.bassType, 0.055, 900);
      bossKick(ctx, t, 0.08);
    }
    if (cfg.snare && (step === 4 || step === 12)) bossNoiseHit(ctx, t, 0.045, 1700, 'bandpass', 0.09);
    if (step % cfg.hatEvery === 0) bossNoiseHit(ctx, t, 0.018, 7000, 'highpass', 0.045);

    if (step % 2 === 0) {
      const semis = cfg.pattern[step];
      bossVoice(bossSemitone(cfg.root, semis), cfg.leadDur, t, ctx, cfg.leadType, cfg.leadGain, 3200);
    }
    if (step === 8) {
      const semis = cfg.pattern[0];
      bossVoice(bossSemitone(cfg.root, semis + 12), cfg.leadDur * 1.6, t, ctx, cfg.leadType, cfg.leadGain * 0.8, 3200);
    }

    bossMusicNextTime += stepTime;
    bossMusicStep++;
  }
}

export function startBossMusic(theme = 'grass') {
  if (bossMusicTimer && bossMusicTheme === theme) return;
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  stopBossMusic(0.04);
  stopMarioTheme(0.12);
  bossMusicTheme = BOSS_MUSIC[theme] ? theme : 'grass';
  bossMusicStep = 0;
  bossMusicNextTime = ctx.currentTime + 0.12;
  scheduleBossMusic();
  bossMusicTimer = setInterval(scheduleBossMusic, 90);
}

export function stopBossMusic(fade = 0.12) {
  if (bossMusicTimer) {
    clearInterval(bossMusicTimer);
    bossMusicTimer = null;
  }
  bossMusicTheme = null;
  bossMusicStep = 0;
  if (audioCtx) {
    const now = audioCtx.currentTime;
    for (const { osc, gain } of bossMusicVoices) {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + fade);
        osc.stop(now + fade + 0.02);
      } catch {
        // Voice already ended.
      }
    }
  }
  bossMusicVoices.clear();
}

export function playMatchStartJingle() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.05;
  playSequence(matchJingle, { start, ctx, type: 'square', gain: 0.1, cutoff: 5200 });
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
  playSequence(deathMelody, { start, ctx, type: 'square', gain: 0.1, cutoff: 3600 });
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

export function playOneUpSound() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.04;
  const notes = [659.25, 783.99, 1318.51, 1046.5, 1174.66, 1567.98];
  notes.forEach((freq, i) => note(freq, 0.12, start + i * 0.09, ctx, 'square', 0.1));
}

export function playQuestionHitSound() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.01;
  note(170, 0.13, start, ctx, 'square', 0.14);
  note(120, 0.16, start + 0.04, ctx, 'triangle', 0.1);
}

export function playQuestionRewardSound(reward) {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.04;
  const sets = {
    coins: [988, 1319, 1568],
    life: [660, 880, 1320],
    enemy: [220, 180, 140],
    star: [880, 1108, 1318, 1760],
  };
  const freqs = sets[reward] || sets.coins;
  const type = reward === 'enemy' ? 'sawtooth' : 'square';
  freqs.forEach((freq, i) => {
    note(freq, reward === 'enemy' ? 0.16 : 0.1, start + i * (reward === 'enemy' ? 0.13 : 0.085), ctx, type, 0.1);
  });
}

export function playBossIntroSound() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.02;
  const notes = [110, 146.83, 164.81, 196, 220];
  notes.forEach((freq, i) => note(freq, i === notes.length - 1 ? 0.42 : 0.16, start + i * 0.14, ctx, i === notes.length - 1 ? 'sawtooth' : 'square', 0.09, { cutoff: 1400 }));
  note(55, 0.55, start, ctx, 'triangle', 0.12, { cutoff: 600 });
}

export function playBossHitSound() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.005;
  note(220, 0.12, start, ctx, 'square', 0.14, { cutoff: 2200 });
  note(90, 0.18, start + 0.03, ctx, 'triangle', 0.13, { cutoff: 900 });
  const size = Math.floor(ctx.sampleRate * 0.07);
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / size, 2);
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.1, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + 0.07);
  noise.connect(gain);
  gain.connect(ctx.destination);
  noise.start(start);
  noise.stop(start + 0.07);
}

export function playFireworkSound() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.01;
  const size = Math.floor(ctx.sampleRate * 0.16);
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / size, 2);
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(1200, start);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.07, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
  noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  noise.start(start); noise.stop(start + 0.16);
  note(900, 0.18, start, ctx, 'sine', 0.035, { cutoff: 2800 });
}

export function playGameOverSound() {  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.03;
  const notes = [392, 329.63, 261.63, 196, 130.81];
  notes.forEach((freq, i) => {
    note(freq, i === notes.length - 1 ? 0.7 : 0.2, start + i * 0.17, ctx, i < 2 ? 'square' : 'sawtooth', 0.085, { cutoff: 1800 });
  });
  note(65.41, 1.1, start + 0.55, ctx, 'triangle', 0.11, { cutoff: 500 });
}

export function playBossShotSound(type) {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.005;
  if (type === 'beam') {
    note(110, 0.72, start, ctx, 'sawtooth', 0.07, { cutoff: 1200 });
    note(220, 0.52, start + 0.12, ctx, 'square', 0.06, { cutoff: 2000 });
    note(880, 0.18, start + 0.72, ctx, 'sawtooth', 0.08, { cutoff: 3000 });
    return;
  }
  const sets = {
    turnip: [330, 262],
    crystal: [1046, 784],
    bolt: [1760, 880],
    ki: [660, 988],
    fire: [260, 170],
    pellet: [880, 660],
    ink: [200, 130],
    spirit: [196, 294],
    shockwave: [180, 120],
  };
  const freqs = sets[type] || sets.ki;
  freqs.forEach((freq, i) => note(freq, 0.09, start + i * 0.05, ctx, type === 'shockwave' ? 'triangle' : 'square', 0.06, { cutoff: 2600 }));
}

export function playBossDefeatSound() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.03;
  [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((freq, i) => {
    note(freq, i === 4 ? 0.55 : 0.14, start + i * 0.12, ctx, 'square', 0.1, { cutoff: 4200 });
  });
  note(261.63, 0.7, start, ctx, 'triangle', 0.08, { cutoff: 1200 });
}

export function playEnemyStompSound() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime + 0.01;

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.16, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(460, start);
  osc.frequency.exponentialRampToValueAtTime(110, start + 0.16);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 0.2);

  // A short crunchy noise layer for the squash.
  const size = Math.floor(ctx.sampleRate * 0.08);
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / size, 2);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.09, start);
  ng.gain.exponentialRampToValueAtTime(0.001, start + 0.08);
  noise.connect(ng);
  ng.connect(ctx.destination);
  noise.start(start);
  noise.stop(start + 0.08);
}