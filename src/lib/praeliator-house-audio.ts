const TEMPO_BPM = 74;
const EIGHTH_NOTE_SECONDS = 60 / TEMPO_BPM / 2;
const SCHEDULE_AHEAD_SECONDS = 0.28;
const SCHEDULER_INTERVAL_MS = 110;
const MASTER_VOLUME = 0.3;

const CHORD_BARS = [
  {
    bass: 38,
    chord: [50, 53, 57, 60],
  },
  {
    bass: 43,
    chord: [55, 59, 62, 65],
  },
  {
    bass: 36,
    chord: [48, 52, 55, 59],
  },
  {
    bass: 45,
    chord: [55, 58, 60, 64],
  },
];

function midiToFrequency(note: number) {
  return 440 * 2 ** ((note - 69) / 12);
}

function createNoiseBuffer(context: AudioContext) {
  const buffer = context.createBuffer(1, context.sampleRate * 1.5, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < channel.length; index += 1) {
    channel[index] = (Math.random() * 2 - 1) * 0.7;
  }

  return buffer;
}

function getAudioContextConstructor() {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext ||
    null
  );
}

export class PraeliatorHouseAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private toneBus: GainNode | null = null;
  private percussionBus: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private schedulerId: number | null = null;
  private nextStepTime = 0;
  private stepIndex = 0;
  private active = false;

  private ensureContext() {
    if (this.context) return this.context;

    const AudioContextConstructor = getAudioContextConstructor();
    if (!AudioContextConstructor) {
      throw new Error("Web Audio is not available in this browser.");
    }

    const context = new AudioContextConstructor();
    const master = context.createGain();
    master.gain.value = 0;

    const toneBus = context.createGain();
    toneBus.gain.value = 1.35;

    const percussionBus = context.createGain();
    percussionBus.gain.value = 1.06;

    const masterFilter = context.createBiquadFilter();
    masterFilter.type = "lowpass";
    masterFilter.frequency.value = 4200;
    masterFilter.Q.value = 0.24;

    const presenceFilter = context.createBiquadFilter();
    presenceFilter.type = "highshelf";
    presenceFilter.frequency.value = 2200;
    presenceFilter.gain.value = 3.8;

    toneBus.connect(masterFilter);
    percussionBus.connect(masterFilter);
    masterFilter.connect(presenceFilter);
    presenceFilter.connect(master);
    master.connect(context.destination);

    this.context = context;
    this.master = master;
    this.toneBus = toneBus;
    this.percussionBus = percussionBus;
    this.noiseBuffer = createNoiseBuffer(context);

    return context;
  }

  private scheduleLoop() {
    if (!this.context || !this.toneBus || !this.percussionBus) return;

    while (this.nextStepTime < this.context.currentTime + SCHEDULE_AHEAD_SECONDS) {
      const barIndex = Math.floor(this.stepIndex / 8) % CHORD_BARS.length;
      const beatInBar = this.stepIndex % 8;
      const bar = CHORD_BARS[barIndex];

      this.scheduleBrush(this.nextStepTime, beatInBar);

      if (beatInBar === 0) {
        this.scheduleChord(bar.chord, this.nextStepTime, 1);
        this.scheduleBass(bar.bass, this.nextStepTime, 1);
      } else if (beatInBar === 4) {
        this.scheduleChord(bar.chord, this.nextStepTime, 0.72);
        this.scheduleBass(bar.bass + 7, this.nextStepTime, 0.8);
      } else if (beatInBar === 2 || beatInBar === 6) {
        this.scheduleBass(bar.bass, this.nextStepTime, 0.38);
      }

      this.nextStepTime += EIGHTH_NOTE_SECONDS;
      this.stepIndex = (this.stepIndex + 1) % (CHORD_BARS.length * 8);
    }
  }

  private scheduleChord(notes: number[], time: number, intensity: number) {
    if (!this.context || !this.toneBus) return;

    const chordGain = this.context.createGain();
    chordGain.gain.setValueAtTime(0.0001, time);
    chordGain.gain.linearRampToValueAtTime(0.034 * intensity, time + 0.04);
    chordGain.gain.exponentialRampToValueAtTime(0.0001, time + 2.2);

    const filter = this.context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2400, time);
    filter.frequency.linearRampToValueAtTime(1500, time + 1.5);
    filter.Q.value = 0.18;

    chordGain.connect(filter);
    filter.connect(this.toneBus);

    notes.forEach((note, index) => {
      const osc = this.context!.createOscillator();
      osc.type = index % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(midiToFrequency(note), time);

      const detune = (index - (notes.length - 1) / 2) * 3.6;
      osc.detune.setValueAtTime(detune, time);

      const voiceGain = this.context!.createGain();
      voiceGain.gain.value = 0.62;

      osc.connect(voiceGain);
      voiceGain.connect(chordGain);
      osc.start(time);
      osc.stop(time + 2.5);
    });
  }

  private scheduleBass(note: number, time: number, intensity: number) {
    if (!this.context || !this.toneBus) return;

    const osc = this.context.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(midiToFrequency(note), time);

    const sub = this.context.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(midiToFrequency(note - 12), time);

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.04 * intensity, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.9);

    const filter = this.context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 760;
    filter.Q.value = 0.4;

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(filter);
    filter.connect(this.toneBus);

    osc.start(time);
    sub.start(time);
    osc.stop(time + 1);
    sub.stop(time + 1);
  }

  private scheduleBrush(time: number, beatInBar: number) {
    if (!this.context || !this.percussionBus || !this.noiseBuffer) return;

    const source = this.context.createBufferSource();
    source.buffer = this.noiseBuffer;

    const bandPass = this.context.createBiquadFilter();
    bandPass.type = "bandpass";
    bandPass.frequency.value = beatInBar % 2 === 0 ? 3200 : 2400;
    bandPass.Q.value = 0.34;

    const highPass = this.context.createBiquadFilter();
    highPass.type = "highpass";
    highPass.frequency.value = 1200;
    highPass.Q.value = 0.2;

    const gain = this.context.createGain();
    const accent = beatInBar === 0 || beatInBar === 4 ? 1 : 0.56;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.014 * accent, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);

    source.connect(bandPass);
    bandPass.connect(highPass);
    highPass.connect(gain);
    gain.connect(this.percussionBus);

    source.start(time);
    source.stop(time + 0.16);
  }

  async start() {
    const context = this.ensureContext();
    if (context.state === "suspended") {
      await context.resume();
    }

    this.active = true;

    if (this.schedulerId === null) {
      this.nextStepTime = context.currentTime + 0.02;
      this.stepIndex = 0;
      this.scheduleLoop();
      this.schedulerId = window.setInterval(
        () => this.scheduleLoop(),
        SCHEDULER_INTERVAL_MS,
      );
    }

    if (this.master) {
      this.master.gain.cancelScheduledValues(context.currentTime);
      this.master.gain.setValueAtTime(this.master.gain.value, context.currentTime);
      this.master.gain.linearRampToValueAtTime(
        MASTER_VOLUME,
        context.currentTime + 0.28,
      );
    }
  }

  async stop() {
    if (!this.context || !this.master) return;

    this.active = false;
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
  }

  async destroy() {
    await this.stop();
    if (this.context && this.context.state !== "closed") {
      await this.context.close();
    }
    this.context = null;
    this.master = null;
    this.toneBus = null;
    this.percussionBus = null;
    this.noiseBuffer = null;
  }

  get isActive() {
    return this.active;
  }
}
