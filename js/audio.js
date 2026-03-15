/**
 * Audio Manager — generates sounds programmatically using Web Audio API.
 * Falls back gracefully if AudioContext is unavailable.
 */
const AudioManager = (() => {
  let audioCtx = null;

  function getContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  /** Ensure AudioContext is resumed (needed after user gesture on some browsers) */
  function unlock() {
    const ctx = getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  /**
   * Play a success chime — ascending two-tone
   */
  function playSuccess() {
    try {
      const ctx = getContext();
      const now = ctx.currentTime;

      // Tone 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc1.connect(gain1).connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.2);

      // Tone 2 (higher)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.1); // E5
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.setValueAtTime(0.3, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc2.connect(gain2).connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.4);

      // Tone 3 (highest)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gain3.gain.setValueAtTime(0, now);
      gain3.gain.setValueAtTime(0.25, now + 0.2);
      gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc3.connect(gain3).connect(ctx.destination);
      osc3.start(now + 0.2);
      osc3.stop(now + 0.5);
    } catch (e) {
      // Audio not supported — silent fail
    }
  }

  /**
   * Play an error buzz — low descending tone
   */
  function playError() {
    try {
      const ctx = getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      // Audio not supported — silent fail
    }
  }

  /**
   * Play a celebration jingle — happy ascending arpeggio
   */
  function playCelebration() {
    try {
      const ctx = getContext();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5]; // C5-C6

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = now + i * 0.12;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.4);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.4);
      });

      // Final chord
      const chordStart = now + notes.length * 0.12;
      [523.25, 659.25, 783.99, 1046.5].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chordStart);
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.2, chordStart);
        gain.gain.exponentialRampToValueAtTime(0.01, chordStart + 1);
        osc.connect(gain).connect(ctx.destination);
        osc.start(chordStart);
        osc.stop(chordStart + 1);
      });
    } catch (e) {
      // Audio not supported — silent fail
    }
  }

  /** Preloaded applause audio element */
  let applauseAudio = null;

  function preloadApplause() {
    applauseAudio = new Audio('assets/sounds/applause.webm');
    applauseAudio.volume = 1.0;
    applauseAudio.preload = 'auto';
  }

  /**
   * Play sitcom applause from the real audio file.
   */
  function playClapping() {
    try {
      if (!applauseAudio) preloadApplause();
      applauseAudio.currentTime = 0;
      applauseAudio.volume = 1.0;
      applauseAudio.play();
    } catch (e) {
      // Audio not supported — silent fail
    }
  }

  return { unlock, playSuccess, playError, playCelebration, playClapping };
})();
