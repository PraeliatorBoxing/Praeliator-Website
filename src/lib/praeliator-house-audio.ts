const TEMPO_BPM = 72;
const EIGHTH_NOTE_SECONDS = 60 / TEMPO_BPM / 2;
const SCHEDULE_AHEAD_SECONDS = 0.32;
const SCHEDULER_INTERVAL_MS = 110;
const MASTER_VOLUME = 0.46;
const SWING_SECONDS = 0.034;
const HUMANIZE_SECONDS = 0.013;

const CHORD_BARS = [
  { bass: 38, chord: [50, 53, 57, 60] },
  { bass: 43, chord: [55, 59, 62, 65] },
  { bass: 36, chord: [48, 52, 55, 59] },
  { bass: 45, chord: [55, 58, 60, 64] },
];

function midiToFrequency(note: number) {
  return 440 * 2 ** ((note - 69) / 12);
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createNoiseBuffer(context: AudioContext) {
  const buffer = context.createBuffer(1, context.sampleRate * 1.5, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < channel.length; index += 1) {
    channel[index] = (Math.random() * 2 - 1) * 0.7;
  }

  return buffer;
}

function createImpulseBuffer(context: AudioContext) {
  const length = context.sampleRate * 2.4;
  const buffer = context.createBuffer(2, length, context.sampleRate);

  for (let channelIndex = 0; channelIndex < buffer.numberOfChannels; channelIndex += 1) {
    const channel = buffer.getChannelData(channelIndex);
    for (let index = 0; index < length; index += 1) {
      const decay = (1 - index / length) ** 2.4;
      channel[index] = (Math.random() * 2 - 1) * decay * 0.36;
    }
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
  private impulseBuffer: AudioBuffer | null = null;
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
    toneBus.gain.value = 1.36;

    const percussionBus = context.createGain();
    percussionBus.gain.value = 0.72;

    const roomSend = context.createGain();
    roomSend.gain.value = 0.34;

    const roomConvolver = context.createConvolver();
    roomConvolver.buffer = createImpulseBuffer(context);

    const roomReturn = context.createGain();
    roomReturn.gain.value = 0.42;

    const slapDelay = context.createDelay(0.5);
    slapDelay.delayTime.value = 0.18;

    const slapFeedback = context.createGain();
    slapFeedback.gain.value = 0.12;

    const slapTone = context.createBiquadFilter();
    slapTone.type = "lowpass";
    slapTone.frequency.value = 2600;

    const masterFilter = context.createBiquadFilter();
    masterFilter.type = "lowpass";
    masterFilter.frequency.value = 3600;
    masterFilter.Q.value = 0.22;

    const presenceFilter = context.createBiquadFilter();
    presenceFilter.type = "highshelf";
    presenceFilter.frequency.value = 2100;
    presenceFilter.gain.value = 3.2;

    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -22;
    compressor.knee.value = 22;
    compressor.ratio.value = 2.8;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.24;

    toneBus.connect(masterFilter);
    percussionBus.connect(masterFilter);

    toneBus.connect(roomSend);
    percussionBus.connect(roomSend);
    roomSend.connect(roomConvolver);
    roomConvolver.connect(roomReturn);
    roomReturn.connect(masterFilter);

    toneBus.connect(slapDelay);
    slapDelay.connect(slapFeedback);
    slapFeedback.connect(slapTone);
    slapTone.connect(slapDelay);
    slapDelay.connect(masterFilter);

    masterFilter.connect(presenceFilter);
    presenceFilter.connect(compressor);
    compressor.connect(master);
    master.connect(context.destination);

    this.context = context;
    this.master = master;
    this.toneBus = toneBus;
    this.percussionBus = percussionBus;
    this.noiseBuffer = createNoiseBuffer(context);
    this.impulseBuffer = roomConvolver.buffer;

    return context;
  }

  private getStepTime(baseTime: number, beatInBar: number) {
    const swung = beatInBar % 2 === 1 ? SWING_SECONDS : 0;
    const humanized = randomBetween(-HUMANIZE_SECONDS, HUMANIZE_SECONDS);
    return baseTime + swung + humanized;
  }

  private scheduleLoop() {
    if (!this.context || !this.toneBus || !this.percussionBus) return;

    while (this.nextStepTime < this.context.currentTime + SCHEDULE_AHEAD_SECONDS) {
      const barIndex = Math.floor(this.stepIndex / 8) % CHORD_BARS.length;
      const beatInBar = this.stepIndex % 8;
      const bar = CHORD_BARS[barIndex];
      const stepTime = this.getStepTime(this.nextStepTime, beatInBar);

      this.scheduleBrush(stepTime, beatInBar);

      if (beatInBar === 0) {
        this.scheduleChord(bar.chord, stepTime, 1);
        this.scheduleBass(bar.bass, stepTime, 0.92);
      } else if (beatInBar === 4) {
        this.scheduleChord(bar.chord, stepTime, 0.68);
        this.scheduleBass(bar.bass + 5, stepTime, 0.66);
      } else if (beatInBar === 2 || beatInBar === 6) {
        this.scheduleBass(bar.bass, stepTime, 0.34);
      }

      this.nextStepTime += EIGHTH_NOTE_SECONDS;
      this.stepIndex = (this.stepIndex + 1) % (CHORD_BARS.length * 8);
    }
  }

  private scheduleChord(notes: number[], time: number, intensity: number) {
    if (!this.context || !this.toneBus) return;

    const chordGain = this.context.createGain();
    const chordPeak = 0.034 * intensity;
    chordGain.gain.setValueAtTime(0.0001, time);
    chordGain.gain.linearRampToValueAtTime(chordPeak, time + 0.11);
    chordGain.gain.exponentialRampToValueAtTime(0.0001, time + 3.2);

    const filter = this.context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1850, time);
    filter.frequency.linearRampToValueAtTime(1180, time + 2.4);
    filter.Q.value = 0.16;

    const wobble = this.context.createOscillator();
    wobble.type = "sine";
    wobble.frequency.value = randomBetween(0.18, 0.34);

    const wobbleDepth = this.context.createGain();
    wobbleDepth.gain.value = randomBetween(2.4, 5.2);

    wobble.connect(wobbleDepth);
    chordGain.connect(filter);
    filter.connect(this.toneBus);
    wobble.start(time);
    wobble.stop(time + 3.3);

    notes.forEach((note, index) => {
      const voiceTime = time + index * randomBetween(0.012, 0.034);
      const primary = this.context!.createOscillator();
      primary.type = index % 2 === 0 ? "triangle" : "sawtooth";
      primary.frequency.setValueAtTime(midiToFrequency(note), voiceTime);
      primary.detune.setValueAtTime(randomBetween(-6, 6), voiceTime);

      const companion = this.context!.createOscillator();
      companion.type = "sine";
      companion.frequency.setValueAtTime(
        midiToFrequency(note + (index === 0 ? -12 : 0)),
        voiceTime,
      );
      companion.detune.setValueAtTime(randomBetween(-4, 4), voiceTime);

      const voiceGain = this.context!.createGain();
      voiceGain.gain.value = 0.38 + index * 0.02;

      wobbleDepth.connect(primary.detune);
      wobbleDepth.connect(companion.detune);

      primary.connect(voiceGain);
      companion.connect(voiceGain);
      voiceGain.connect(chordGain);
      primary.start(voiceTime);
      companion.start(voiceTime);
      primary.stop(time + 3.2);
      companion.stop(time + 3.15);
    });
  }

  private scheduleBass(note: number, time: number, intensity: number) {
    if (!this.context || !this.toneBus) return;

    const osc = this.context.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(midiToFrequency(note), time);
    osc.frequency.exponentialRampToValueAtTime(
      midiToFrequency(note) * randomBetween(0.992, 0.998),
      time + 0.2,
    );

    const sub = this.context.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(midiToFrequency(note - 12), time);

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.044 * intensity, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.35);

    const filter = this.context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 620;
    filter.Q.value = 0.32;

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(filter);
    filter.connect(this.toneBus);

    osc.start(time);
    sub.start(time);
    osc.stop(time + 1.4);
    sub.stop(time + 1.4);
  }

  private scheduleBrush(time: number, beatInBar: number) {
    if (!this.context || !this.percussionBus || !this.noiseBuffer) return;
    if (beatInBar % 2 === 1 && Math.random() < 0.26) return;

    const source = this.context.createBufferSource();
    source.buffer = this.noiseBuffer;

    const bandPass = this.context.createBiquadFilter();
    bandPass.type = "bandpass";
    bandPass.frequency.value = beatInBar % 2 === 0 ? 2500 : 1900;
    bandPass.Q.value = 0.26;

    const highPass = this.context.createBiquadFilter();
    highPass.type = "highpass";
    highPass.frequency.value = 980;
    highPass.Q.value = 0.18;

    const gain = this.context.createGain();
    const accent =
      beatInBar === 0 || beatInBar === 4 ? randomBetween(0.78, 1) : randomBetween(0.22, 0.52);
    const decay = beatInBar % 2 === 0 ? 0.22 : 0.12;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.012 * accent, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + decay);

    source.connect(bandPass);
    bandPass.connect(highPass);
    highPass.connect(gain);
    gain.connect(this.percussionBus);

    source.start(time);
    source.stop(time + Math.max(0.18, decay + 0.06));
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
        context.currentTime + 0.34,
      );
    }
  }

  async stop() {
    if (!this.context || !this.master) return;

    this.active = false;
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

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
    this.impulseBuffer = null;
  }

  get isActive() {
    return this.active;
  }
}
