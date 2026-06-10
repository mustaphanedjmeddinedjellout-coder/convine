/**
 * useCurtainSound — soft fabric whoosh for the curtain opening.
 *
 * Synthesized with WebAudio (filtered brown noise with a slow swell),
 * so there is no audio asset to load and nothing to 404. Runs only on
 * the user's tap — autoplay policies allow audio started by a gesture.
 * Fails silently anywhere WebAudio is unavailable.
 */
import { useRef, useCallback } from 'react';

const DURATION = 2.6;

export default function useCurtainSound() {
  const playedRef = useRef(false);

  const play = useCallback(() => {
    if (playedRef.current) return;
    playedRef.current = true;

    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const rate = ctx.sampleRate;
      const frames = Math.floor(DURATION * rate);

      // Brown noise — deeper and softer than white, reads as heavy cloth
      const buffer = ctx.createBuffer(1, frames, rate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < frames; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // Band-pass sweep follows the curtain: rises as it opens, falls as it settles
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 0.7;
      const t0 = ctx.currentTime;
      filter.frequency.setValueAtTime(280, t0);
      filter.frequency.exponentialRampToValueAtTime(850, t0 + 1.1);
      filter.frequency.exponentialRampToValueAtTime(220, t0 + DURATION);

      // Gentle swell-and-fade envelope — never startles
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.16, t0 + 0.55);
      gain.gain.exponentialRampToValueAtTime(0.04, t0 + 1.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + DURATION);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(t0);
      source.stop(t0 + DURATION);
      source.onended = () => { ctx.close().catch(() => {}); };
    } catch {
      /* no audio — the reveal works fine in silence */
    }
  }, []);

  return { play };
}
