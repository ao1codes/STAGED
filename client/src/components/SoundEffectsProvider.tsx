import { useEffect } from 'react';
import { useAudio } from '../hooks/useAudio';

interface SoundEffectsProviderProps {
  children: React.ReactNode;
}

export default function SoundEffectsProvider({ children }: SoundEffectsProviderProps) {
  const { playSound } = useAudio();

  useEffect(() => {
    // Throttled keyboard sounds to prevent audio spam
    let lastKeystroke = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastKeystroke > 50) { // Throttle keystrokes to max 20 per second
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          if (e.key.length === 1) {
            playSound('keystroke');
            lastKeystroke = now;
          }
        }
      }
    };

    // Optimized click handler with reduced frequency
    let lastClick = 0;
    const handleClick = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastClick > 100) { // Throttle clicks
        const target = e.target as HTMLElement;
        
        // Only play sounds for specific UI elements to reduce noise
        if (target.closest('.error-text') || target.closest('.corrupted')) {
          playSound('error_glitch');
          lastClick = now;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, [playSound]);

  return <>{children}</>;
}