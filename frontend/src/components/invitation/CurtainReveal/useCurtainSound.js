/**
 * useCurtainSound — Optional audio hook for curtain swish
 *
 * Loads an MP3 from the textures folder (if present) and plays it
 * when triggered. Gracefully no-ops if the file is missing or
 * the browser blocks autoplay.
 *
 * Drop a CC0 "curtain whoosh" MP3 at:
 *   src/components/invitation/CurtainReveal/textures/curtain-whoosh.mp3
 */
import { useRef, useCallback } from 'react';

export default function useCurtainSound() {
  const audioRef = useRef(null);
  const loadedRef = useRef(false);
  const failedRef = useRef(false);

  const play = useCallback(() => {
    if (failedRef.current) return;

    if (!audioRef.current) {
      try {
        // Attempt dynamic import of the sound file
        const audio = new Audio();
        // Use a relative path that Vite can resolve
        // If the file doesn't exist the 'error' event fires and we bail
        audio.src = new URL('./textures/curtain-whoosh.mp3', import.meta.url).href;
        audio.volume = 0;
        audio.preload = 'auto';

        audio.addEventListener('canplaythrough', () => {
          loadedRef.current = true;
        }, { once: true });

        audio.addEventListener('error', () => {
          failedRef.current = true;
        }, { once: true });

        audioRef.current = audio;
      } catch {
        failedRef.current = true;
        return;
      }
    }

    const audio = audioRef.current;
    if (!audio) return;

    // Ramp volume up for cinematic feel
    audio.currentTime = 0;
    audio.volume = 0;
    audio.play().then(() => {
      // Smooth volume ramp over 400ms
      let vol = 0;
      const ramp = setInterval(() => {
        vol += 0.05;
        if (vol >= 0.6) {
          audio.volume = 0.6;
          clearInterval(ramp);
        } else {
          audio.volume = vol;
        }
      }, 30);
    }).catch(() => {
      // Autoplay blocked — silently ignore
      failedRef.current = true;
    });
  }, []);

  return { play };
}
