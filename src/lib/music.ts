import type { ChapterSong } from '../config/content';
import { getAudioContext, getMasterGain, unlock } from './audio';

interface AudioSlot {
  audio: HTMLAudioElement;
  source: MediaElementAudioSourceNode | null;
  gain: GainNode | null;
  timer: ReturnType<typeof setTimeout> | null;
  loopTimer: ReturnType<typeof setTimeout> | null;
  config: ChapterSong | null;
  isPlaying: boolean;
}

let slotA: AudioSlot | null = null;
let slotB: AudioSlot | null = null;
let activeSlotIndex: 'A' | 'B' = 'A';
let musicMasterGain: GainNode | null = null;
let audioBlockedCallback: (() => void) | null = null;
let isTabPaused = false;

function createSlot(audio: HTMLAudioElement): AudioSlot {
  return {
    audio,
    source: null,
    gain: null,
    timer: null,
    loopTimer: null,
    config: null,
    isPlaying: false,
  };
}

export function initMusicEngine() {
  if (musicMasterGain) return;
  const ctx = getAudioContext();
  const master = getMasterGain();
  if (!ctx || !master) return;

  // Music mixed at 0.7 relative to SFX so chimes and rail sounds remain audible
  musicMasterGain = ctx.createGain();
  musicMasterGain.gain.value = 0.7;
  musicMasterGain.connect(master);

  const audioElA = new Audio();
  audioElA.crossOrigin = 'anonymous';
  (audioElA as any).playsInline = true;

  const audioElB = new Audio();
  audioElB.crossOrigin = 'anonymous';
  (audioElB as any).playsInline = true;

  const sourceA = ctx.createMediaElementSource(audioElA);
  const gainA = ctx.createGain();
  gainA.gain.value = 0;
  sourceA.connect(gainA);
  gainA.connect(musicMasterGain);

  const sourceB = ctx.createMediaElementSource(audioElB);
  const gainB = ctx.createGain();
  gainB.gain.value = 0;
  sourceB.connect(gainB);
  gainB.connect(musicMasterGain);

  slotA = createSlot(audioElA);
  slotA.source = sourceA;
  slotA.gain = gainA;

  slotB = createSlot(audioElB);
  slotB.source = sourceB;
  slotB.gain = gainB;

  // Listen to visibilitychange for clean pause/resume
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }
}

function handleVisibilityChange() {
  const activeSlot = activeSlotIndex === 'A' ? slotA : slotB;
  if (!activeSlot || !activeSlot.isPlaying) return;

  if (document.hidden) {
    isTabPaused = true;
    try {
      activeSlot.audio.pause();
    } catch (e) {}
  } else {
    if (isTabPaused) {
      isTabPaused = false;
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      try {
        activeSlot.audio.play().catch(() => {});
      } catch (e) {}
    }
  }
}

export function setOnAudioBlocked(cb: (() => void) | null) {
  audioBlockedCallback = cb;
}

export function preloadChapterSong(src: string) {
  if (!src) return;
  initMusicEngine();
  // Preload on the inactive slot
  const inactiveSlot = activeSlotIndex === 'A' ? slotB : slotA;
  if (inactiveSlot && (!inactiveSlot.isPlaying || inactiveSlot.audio.src !== src)) {
    inactiveSlot.audio.preload = 'auto';
    inactiveSlot.audio.src = src;
  }
}

export function fadeOutActiveSong(fadeDuration = 1.5) {
  const activeSlot = activeSlotIndex === 'A' ? slotA : slotB;
  if (!activeSlot || !activeSlot.gain || !activeSlot.isPlaying) return;

  const ctx = getAudioContext();
  if (activeSlot.timer) clearTimeout(activeSlot.timer);
  if (activeSlot.loopTimer) clearTimeout(activeSlot.loopTimer);
  activeSlot.timer = null;
  activeSlot.loopTimer = null;
  activeSlot.isPlaying = false;

  if (ctx) {
    const now = ctx.currentTime;
    activeSlot.gain.gain.cancelScheduledValues(now);
    activeSlot.gain.gain.setValueAtTime(activeSlot.gain.gain.value, now);
    activeSlot.gain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
  }

  setTimeout(() => {
    try {
      activeSlot.audio.pause();
      if (activeSlot.gain) activeSlot.gain.gain.value = 0;
    } catch (e) {}
  }, fadeDuration * 1000 + 50);
}

function scheduleWindow(slot: AudioSlot, config: ChapterSong) {
  const ctx = getAudioContext();
  if (!ctx || !slot.gain) return;

  const duration = config.duration || 30;
  const fadeOut = config.fadeOut || 2;
  const fadeIn = config.fadeIn || 1.2;
  const fadeStartTimeMs = Math.max(0, (duration - fadeOut) * 1000);

  // Clear previous timers
  if (slot.timer) clearTimeout(slot.timer);
  if (slot.loopTimer) clearTimeout(slot.loopTimer);

  // Schedule fade out
  slot.timer = setTimeout(() => {
    if (!slot.isPlaying || !slot.gain) return;
    const now = ctx.currentTime;
    slot.gain.gain.cancelScheduledValues(now);
    slot.gain.gain.setValueAtTime(slot.gain.gain.value, now);
    slot.gain.gain.linearRampToValueAtTime(0.0001, now + fadeOut);
  }, fadeStartTimeMs);

  // Schedule window end or loop
  slot.loopTimer = setTimeout(() => {
    if (!slot.isPlaying || !slot.gain) return;

    if (config.loop) {
      // Loop softly: seek to startAt, fade in again
      try {
        slot.audio.currentTime = config.startAt || 0;
      } catch (e) {}
      const now = ctx.currentTime;
      slot.gain.gain.cancelScheduledValues(now);
      slot.gain.gain.setValueAtTime(0, now);
      slot.gain.gain.linearRampToValueAtTime(1, now + fadeIn);
      scheduleWindow(slot, config);
    } else {
      // Stop
      slot.isPlaying = false;
      try {
        slot.audio.pause();
      } catch (e) {}
    }
  }, duration * 1000);
}

export function playChapterSong(songConfig: ChapterSong) {
  if (!songConfig || !songConfig.src) return;

  unlock();
  initMusicEngine();

  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  // Fade out old active slot
  const oldSlot = activeSlotIndex === 'A' ? slotA : slotB;
  if (oldSlot && oldSlot.isPlaying) {
    fadeOutActiveSong(1.5);
  }

  // Swap active slot
  activeSlotIndex = activeSlotIndex === 'A' ? 'B' : 'A';
  const newSlot = activeSlotIndex === 'A' ? slotA : slotB;
  if (!newSlot || !newSlot.gain) return;

  newSlot.config = songConfig;
  newSlot.isPlaying = true;
  newSlot.audio.src = songConfig.src;
  newSlot.audio.preload = 'auto';

  // Ensure gain is zero before fade in
  if (ctx) {
    newSlot.gain.gain.cancelScheduledValues(ctx.currentTime);
    newSlot.gain.gain.setValueAtTime(0, ctx.currentTime);
  }

  let started = false;
  const startPlayback = () => {
    if (started) return;
    started = true;

    try {
      if (songConfig.startAt > 0) {
        newSlot.audio.currentTime = songConfig.startAt;
      }
    } catch (e) {}

    const playPromise = newSlot.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (!newSlot.isPlaying || !newSlot.gain) return;
          const currentCtx = getAudioContext();
          if (currentCtx) {
            const now = currentCtx.currentTime;
            newSlot.gain.gain.cancelScheduledValues(now);
            newSlot.gain.gain.setValueAtTime(0, now);
            newSlot.gain.gain.linearRampToValueAtTime(1.0, now + (songConfig.fadeIn || 1.2));
            scheduleWindow(newSlot, songConfig);
          }
        })
        .catch((err) => {
          console.warn('Audio play was prevented or failed:', err);
          if (audioBlockedCallback) audioBlockedCallback();
        });
    }
  };

  // If metadata ready, start immediately; otherwise wait for loadedmetadata/canplay
  if (newSlot.audio.readyState >= 1) {
    startPlayback();
  } else {
    const handleReady = () => {
      newSlot.audio.removeEventListener('loadedmetadata', handleReady);
      newSlot.audio.removeEventListener('canplay', handleReady);
      startPlayback();
    };
    newSlot.audio.addEventListener('loadedmetadata', handleReady, { once: true });
    newSlot.audio.addEventListener('canplay', handleReady, { once: true });
    newSlot.audio.load();
  }
}

export function stopAllMusic() {
  if (slotA) {
    if (slotA.timer) clearTimeout(slotA.timer);
    if (slotA.loopTimer) clearTimeout(slotA.loopTimer);
    slotA.isPlaying = false;
    try {
      slotA.audio.pause();
      if (slotA.gain) slotA.gain.gain.value = 0;
    } catch (e) {}
  }
  if (slotB) {
    if (slotB.timer) clearTimeout(slotB.timer);
    if (slotB.loopTimer) clearTimeout(slotB.loopTimer);
    slotB.isPlaying = false;
    try {
      slotB.audio.pause();
      if (slotB.gain) slotB.gain.gain.value = 0;
    } catch (e) {}
  }
}
