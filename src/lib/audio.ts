/**
 * Synthesized Web Audio API sound engine.
 * No audio files required. All sounds are procedurally generated.
 * Sound is opt-in; call unlock() on first user tap.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let enabled = false;

export function unlock() {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.4;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

export function getAudioContext(): AudioContext | null {
  return ctx;
}

export function getMasterGain(): GainNode | null {
  return masterGain;
}

export function setEnabled(val: boolean) {
  enabled = val;
  if (masterGain) masterGain.gain.value = val ? 0.4 : 0;
}

export function isEnabled() { return enabled; }

function playNote(freq: number, type: OscillatorType, start: number, dur: number, gain = 0.5, attack = 0.01, release = 0.1) {
  if (!ctx || !masterGain) return;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  env.gain.setValueAtTime(0, ctx.currentTime + start);
  env.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + attack);
  env.gain.setValueAtTime(gain, ctx.currentTime + start + dur - release);
  env.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);
  osc.connect(env);
  env.connect(masterGain!);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur);
}

/** Two-tone metro door/arrival chime */
export function playChime() {
  if (!ctx) return;
  playNote(659.25, 'sine', 0, 0.6, 0.45);    // E5
  playNote(830.61, 'sine', 0.18, 0.6, 0.35);  // Ab5
  playNote(1046.5, 'sine', 0.36, 0.8, 0.25);  // C6
}

/** Door close warning beeps */
export function playDoorBeep() {
  if (!ctx) return;
  playNote(880, 'square', 0, 0.12, 0.2);
  playNote(880, 'square', 0.2, 0.12, 0.2);
}

/** Soft UI tap */
export function playTap() {
  if (!ctx) return;
  playNote(1200, 'sine', 0, 0.08, 0.15);
}

/** Rhythmic rail clack (call repeatedly during travel) */
export function playRailClack() {
  if (!ctx || !masterGain) return;
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 500);
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 300;
  filter.Q.value = 2;
  const gain = ctx.createGain();
  gain.gain.value = 0.18;
  src.buffer = buf;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain!);
  src.start();
}

/** Heartbeat pulse for the "I LIKE YOU" reveal */
export function playHeartbeat() {
  if (!ctx || !masterGain) return;
  const beat = (t: number) => {
    playNote(60, 'sine', t, 0.12, 0.6);
    playNote(60, 'sine', t + 0.14, 0.12, 0.4);
  };
  beat(0);
  beat(0.9);
}

/** Celebration fanfare */
export function playCelebration() {
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
  notes.forEach((f, i) => {
    playNote(f, 'sine', i * 0.1, 0.6, 0.35, 0.02, 0.15);
    if (i === notes.length - 1) {
      playNote(f * 2, 'sine', i * 0.1 + 0.3, 1.2, 0.2, 0.05, 0.4);
    }
  });
  // Bell shimmer
  [1046.5, 1318.5, 1567.98].forEach((f, i) => {
    playNote(f, 'triangle', 0.5 + i * 0.15, 0.8, 0.15, 0.01, 0.4);
  });
}

/** Soft ambient rail hum (looping) — returns a stop function */
export function startRailHum(): () => void {
  if (!ctx || !masterGain) return () => {};
  const osc = ctx.createOscillator();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.value = 48;
  lfo.type = 'sine';
  lfo.frequency.value = 7.2;
  lfoGain.gain.value = 3;
  gain.gain.value = 0;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  osc.connect(gain);
  gain.connect(masterGain!);
  osc.start();
  lfo.start();
  gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.5);
  return () => {
    if (!ctx) return;
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.6);
    lfo.stop(ctx.currentTime + 0.6);
  };
}

/** Pneumatic air release sound when doors slide */
export function playPneumaticHiss() {
  if (!ctx || !masterGain) return;
  const dur = 0.45;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.16));
  }
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2600, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + dur);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  src.buffer = buf;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  src.start();
}

/** Heavy mechanical door latch / gasket seal click */
export function playDoorLatch() {
  if (!ctx || !masterGain) return;
  playNote(160, 'triangle', 0, 0.08, 0.3, 0.004, 0.04);
  playNote(75, 'sine', 0.02, 0.14, 0.45, 0.005, 0.09);
}
