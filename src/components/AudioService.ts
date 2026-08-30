// Browser-based Web Audio API sound generator for the LATENT experience.
// No asset loading required, works completely offline and instantly.

class AudioService {
  private ctx: AudioContext | null = null;
  private muted: boolean = true; // default muted to respect browser autoplay policies

  private initContext() {
    if (!this.ctx) {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (!this.muted) {
      this.initContext();
      this.playClick();
    }
    return this.muted;
  }

  public playClick() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  public playReveal() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    // A low frequency resonant rumble
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note
    
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(110, this.ctx.currentTime); // A2 note

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, this.ctx.currentTime);
    filter.Q.setValueAtTime(5, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.9);
    osc2.stop(this.ctx.currentTime + 0.9);
  }

  public playSweep() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    // Cinematic digital filter sweep
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.4);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.55);
  }
}

export const audio = new AudioService();
