import { useRef, useCallback } from 'react';

export type SoundEffect = 
  | 'keystroke'
  | 'file_click'
  | 'folder_expand'
  | 'terminal_command'
  | 'tab_switch'
  | 'error_glitch'
  | 'data_corruption'
  | 'system_boot'
  | 'ambient_hum';

interface AudioCache {
  [key: string]: HTMLAudioElement;
}

export const useAudio = () => {
  const audioCache = useRef<AudioCache>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize audio context for better performance
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Create audio elements with optimized cyberpunk sound effects
  const createAudioElement = useCallback((soundType: SoundEffect): HTMLAudioElement => {
    if (audioCache.current[soundType]) {
      return audioCache.current[soundType];
    }

    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 0.2; // Reduced volume for better balance

    // Generate optimized cyberpunk sounds with shorter durations for responsiveness
    const generateOptimizedTone = (frequency: number, duration: number, type: OscillatorType = 'sine'): string => {
      const audioContext = getAudioContext();
      const sampleRate = 22050; // Reduced sample rate for faster processing
      const samples = Math.floor(duration * sampleRate);
      const buffer = audioContext.createBuffer(1, samples, sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < samples; i++) {
        const t = i / sampleRate;
        let value = 0;
        
        switch (type) {
          case 'sine':
            value = Math.sin(2 * Math.PI * frequency * t);
            break;
          case 'square':
            value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 0.8 : -0.8;
            break;
          case 'sawtooth':
            value = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
            break;
          case 'triangle':
            value = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
            break;
        }
        
        // Quick decay envelope for snappy sounds
        const envelope = Math.exp(-t * 8);
        data[i] = value * envelope * 0.15;
      }
      
      // Convert to WAV format
      const wav = audioBufferToWav(buffer);
      return URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
    };

    // Generate optimized sounds with shorter durations for faster response
    switch (soundType) {
      case 'keystroke':
        audio.src = generateOptimizedTone(900 + Math.random() * 100, 0.03, 'square');
        audio.volume = 0.08;
        break;
      case 'file_click':
        audio.src = generateOptimizedTone(1200, 0.06, 'sine');
        audio.volume = 0.12;
        break;
      case 'folder_expand':
        audio.src = generateOptimizedTone(700, 0.08, 'triangle');
        audio.volume = 0.15;
        break;
      case 'terminal_command':
        audio.src = generateOptimizedTone(500, 0.1, 'sawtooth');
        audio.volume = 0.18;
        break;
      case 'tab_switch':
        audio.src = generateOptimizedTone(1100, 0.04, 'sine');
        audio.volume = 0.1;
        break;
      case 'error_glitch':
        audio.src = generateOptimizedTone(250 + Math.random() * 50, 0.15, 'square');
        audio.volume = 0.2;
        break;
      case 'data_corruption':
        audio.src = generateOptimizedTone(180, 0.25, 'sawtooth');
        audio.volume = 0.15;
        break;
      case 'system_boot':
        audio.src = generateOptimizedTone(880, 0.4, 'sine');
        audio.volume = 0.2;
        break;
      case 'ambient_hum':
        audio.src = generateOptimizedTone(65, 1.0, 'sine');
        audio.volume = 0.05;
        audio.loop = true;
        break;
    }

    audioCache.current[soundType] = audio;
    return audio;
  }, []);

  const playSound = useCallback((soundType: SoundEffect) => {
    try {
      // Resume audio context if suspended (common in browsers)
      const audioContext = getAudioContext();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const audio = createAudioElement(soundType);
      audio.currentTime = 0;
      
      // Use faster playback method
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Silently handle autoplay restrictions
        });
      }
    } catch (error) {
      // Silently handle audio errors
    }
  }, [createAudioElement, getAudioContext]);

  const stopSound = useCallback((soundType: SoundEffect) => {
    const audio = audioCache.current[soundType];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  return { playSound, stopSound };
};

// Utility function to convert AudioBuffer to WAV
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length;
  const arrayBuffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(arrayBuffer);
  const channels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * 2, true);
  
  // Convert float samples to 16-bit PCM
  const samples = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, sample * 0x7FFF, true);
    offset += 2;
  }
  
  return arrayBuffer;
}