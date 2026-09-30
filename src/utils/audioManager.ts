import { getAudioConfig } from '../data/siteContent';

type AudioStateListener = (isPlaying: boolean) => void;

class GlobalAudioManager {
  private audio: HTMLAudioElement | null = null;
  private listeners: Set<AudioStateListener> = new Set();
  private isInitialized = false;

  private initAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;

    if (!this.audio) {
      const config = getAudioConfig();
      const src = config.src || '';
      if (!src.trim()) return null;

      const audio = new Audio();
      audio.src = src;
      audio.preload = 'auto';
      audio.loop = !!config.loop;
      audio.volume = typeof config.volume === 'number' ? config.volume : 0.4;

      audio.addEventListener('play', () => this.notify(true));
      audio.addEventListener('pause', () => this.notify(false));
      audio.addEventListener('ended', () => {
        // Automatically turns off when playback finishes (if not loop)
        this.notify(false);
      });
      audio.addEventListener('error', (e) => {
        console.warn('Audio playback error:', e);
        this.notify(false);
      });

      this.audio = audio;
      this.isInitialized = true;
    }

    return this.audio;
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    if (this.audio) {
      listener(!this.audio.paused);
    } else {
      listener(false);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(isPlaying: boolean) {
    this.listeners.forEach((listener) => {
      try {
        listener(isPlaying);
      } catch (err) {
        console.error('Audio listener error:', err);
      }
    });
  }

  /**
   * Starts playback synchronously within a user gesture.
   */
  public play(): Promise<boolean> {
    const audio = this.initAudio();
    if (!audio) return Promise.resolve(false);

    // Ensure volume and loop are synchronized with config
    const config = getAudioConfig();
    audio.loop = !!config.loop;
    if (typeof config.volume === 'number') {
      audio.volume = config.volume;
    }

    try {
      const promise = audio.play();
      if (promise !== undefined) {
        return promise
          .then(() => {
            this.notify(true);
            return true;
          })
          .catch((err) => {
            console.warn('Audio play request blocked or failed:', err);
            this.notify(false);
            return false;
          });
      }
      this.notify(true);
      return Promise.resolve(true);
    } catch (err) {
      console.warn('Direct audio play exception:', err);
      return Promise.resolve(false);
    }
  }

  public pause() {
    if (!this.audio) return;
    try {
      this.audio.pause();
    } catch (err) {
      console.warn('Audio pause error:', err);
    }
    this.notify(false);
  }

  public toggle(): Promise<boolean> {
    const audio = this.initAudio();
    if (!audio) return Promise.resolve(false);

    if (audio.paused) {
      return this.play();
    } else {
      this.pause();
      return Promise.resolve(false);
    }
  }

  public isPlaying(): boolean {
    return !!(this.audio && !this.audio.paused);
  }
}

export const audioManager = new GlobalAudioManager();

if (typeof window !== 'undefined') {
  (window as any).__ollaAudioManager = audioManager;
  (window as any).__ollaPlayAudio = () => audioManager.play();
  (window as any).__ollaPauseAudio = () => audioManager.pause();
  (window as any).__ollaToggleAudio = () => audioManager.toggle();
}
