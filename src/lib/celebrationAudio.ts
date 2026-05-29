type Note = number;

const CHORDS: Note[][] = [
  [261.63, 329.63, 392.00, 523.25],
  [349.23, 440.00, 523.25, 698.46],
  [392.00, 493.88, 587.33, 783.99],
  [220.00, 261.63, 329.63, 440.00],
  [293.66, 369.99, 440.00, 587.33],
  [329.63, 392.00, 493.88, 659.25],
];

function hashStringToInt(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

let sharedCtx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedCtx) {
    const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    sharedCtx = new Ctx();
  }
  if (sharedCtx.state === "suspended") {
    sharedCtx.resume().catch(() => {});
  }
  return sharedCtx;
}

function playNote(ctx: AudioContext, freq: number, startAt: number, duration: number, gain: number, type: OscillatorType) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 4000;
  filter.Q.value = 1;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);

  env.gain.setValueAtTime(0, startAt);
  env.gain.linearRampToValueAtTime(gain, startAt + 0.01);
  env.gain.exponentialRampToValueAtTime(0.001, startAt + duration);

  osc.connect(filter);
  filter.connect(env);
  env.connect(ctx.destination);

  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
}

function playChime(ctx: AudioContext, freq: number, startAt: number) {
  playNote(ctx, freq, startAt, 1.4, 0.18, "sine");
  playNote(ctx, freq * 2, startAt, 1.0, 0.08, "sine");
  playNote(ctx, freq * 3, startAt + 0.02, 0.6, 0.04, "triangle");
}

function playSparkle(ctx: AudioContext, baseFreq: number, startAt: number) {
  for (let i = 0; i < 8; i++) {
    const t = startAt + 0.05 + i * 0.04;
    const f = baseFreq * (1 + i * 0.4) + (Math.random() - 0.5) * 30;
    playNote(ctx, f, t, 0.25, 0.04, "sine");
  }
}

export function playCelebrationFor(memberId: string, customAudioUrl?: string) {
  if (customAudioUrl) {
    playCustomAudio(customAudioUrl);
    return;
  }

  const ctx = getCtx();
  if (!ctx) return;

  const idx = hashStringToInt(memberId) % CHORDS.length;
  const chord = CHORDS[idx];
  const now = ctx.currentTime + 0.02;

  chord.forEach((note, i) => {
    playChime(ctx, note, now + i * 0.08);
  });

  playSparkle(ctx, chord[chord.length - 1] * 1.5, now + 0.4);

  const finaleStart = now + 1.0;
  chord.forEach((note) => {
    playChime(ctx, note * 2, finaleStart);
  });
}

let activeCustomAudio: HTMLAudioElement | null = null;

function playCustomAudio(url: string) {
  if (activeCustomAudio) {
    try { activeCustomAudio.pause(); } catch {}
  }
  const audio = new Audio(url);
  audio.volume = 0.7;
  audio.play().catch((e) => console.warn("[celebrationAudio] custom audio play failed:", e));
  activeCustomAudio = audio;
}

export function getCelebrationVariantFor(memberId: string): number {
  return hashStringToInt(memberId) % 6;
}
