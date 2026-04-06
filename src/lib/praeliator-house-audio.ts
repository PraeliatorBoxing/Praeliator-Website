import * as Tone from "tone";

const TEMPO_BPM = 108;
const MASTER_GAIN = 0.24;
const SWING_AMOUNT = 0.18;
const HUMANIZE_SECONDS = 0.008;
const PIANO_BASE_URL = "https://tonejs.github.io/audio/salamander/";
const PIANO_SAMPLE_URLS = {
  C2: "C2.mp3",
  "D#2": "Ds2.mp3",
  "F#2": "Fs2.mp3",
  A2: "A2.mp3",
  C4: "C4.mp3",
  "D#4": "Ds4.mp3",
  "F#4": "Fs4.mp3",
  A4: "A4.mp3",
} as const;

const BAR_EIGHTH_OFFSETS = [
  "0:0:0",
  "0:0:2",
  "0:1:0",
  "0:1:2",
  "0:2:0",
  "0:2:2",
  "0:3:0",
  "0:3:2",
] as const;

const QUARTER_OFFSETS = ["0:0:0", "0:1:0", "0:2:0", "0:3:0"] as const;

const COMP_PATTERNS = [
  [
    { offset: "0:1:2", duration: "8n", velocity: 0.5 },
    { offset: "0:3:0", duration: "8n", velocity: 0.56 },
  ],
  [
    { offset: "0:0:2", duration: "8n", velocity: 0.44 },
    { offset: "0:2:2", duration: "8n", velocity: 0.56 },
  ],
  [
    { offset: "0:1:2", duration: "8n.", velocity: 0.5 },
    { offset: "0:3:0", duration: "8n", velocity: 0.46 },
  ],
  [
    { offset: "0:0:2", duration: "8n", velocity: 0.44 },
    { offset: "0:2:0", duration: "8n", velocity: 0.54 },
    { offset: "0:3:2", duration: "16n", velocity: 0.42 },
  ],
] as const;

const JAZZ_BARS = [
  {
    name: "Dm9",
    chord: ["F3", "C4", "E4", "A4"],
    bass: ["D2", "F2", "A2", "B2"],
    pickup: "C#3",
    accents: ["A4", "C5"],
  },
  {
    name: "G13",
    chord: ["F3", "B3", "E4", "A4"],
    bass: ["G2", "B2", "D3", "E3"],
    pickup: "B2",
    accents: ["A4", "B4"],
  },
  {
    name: "Cmaj9",
    chord: ["E3", "B3", "D4", "G4"],
    bass: ["C2", "E2", "G2", "A2"],
    pickup: "G#2",
    accents: ["G4", "B4"],
  },
  {
    name: "A7alt",
    chord: ["G3", "C#4", "F4", "Bb4"],
    bass: ["A2", "C#3", "E3", "G3"],
    pickup: "C#3",
    accents: ["Bb4", "C#5"],
  },
] as const;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function humanize(time: number) {
  return time + randomBetween(-HUMANIZE_SECONDS, HUMANIZE_SECONDS);
}

function offsetToSeconds(offset: string) {
  return Tone.Time(offset).toSeconds();
}

export class PraeliatorHouseAudio {
  private started = false;
  private initialized = false;
  private barCounter = 0;

  private master: Tone.Gain | null = null;
  private compPiano: Tone.Sampler | null = null;
  private bassPiano: Tone.Sampler | null = null;
  private accentPiano: Tone.Sampler | null = null;
  private brushSynth: Tone.NoiseSynth | null = null;
  private nodes: Array<{ dispose(): void }> = [];
  private eventIds: number[] = [];

  private ensureGraph() {
    if (this.initialized) return;

    Tone.getContext().lookAhead = 0.08;
    Tone.Transport.bpm.value = TEMPO_BPM;
    Tone.Transport.swing = SWING_AMOUNT;
    Tone.Transport.swingSubdivision = "8n";
    Tone.Transport.timeSignature = 4;

    const master = new Tone.Gain(0).toDestination();
    const compressor = new Tone.Compressor(-20, 2.6);
    const masterFilter = new Tone.Filter(3400, "lowpass");
    const toneEQ = new Tone.EQ3({ low: 0.6, mid: 0.15, high: 0.35 });
    const chorus = new Tone.Chorus(1.2, 0.9, 0.04).start();
    const room = new Tone.JCReverb(0.16);
    const slap = new Tone.FeedbackDelay("8n", 0.08);
    slap.wet.value = 0.025;
    const bassFilter = new Tone.Filter(520, "lowpass");
    const bassEQ = new Tone.EQ3({ low: 1.8, mid: -0.4, high: -8 });

    const percussionHP = new Tone.Filter(1600, "highpass");
    const percussionRoom = new Tone.JCReverb(0.12);
    percussionRoom.wet.value = 0.06;

    const compPiano = new Tone.Sampler({
      urls: PIANO_SAMPLE_URLS,
      baseUrl: PIANO_BASE_URL,
      release: 1.05,
    });
    compPiano.volume.value = -8.5;

    const bassPiano = new Tone.Sampler({
      urls: PIANO_SAMPLE_URLS,
      baseUrl: PIANO_BASE_URL,
      release: 0.82,
    });
    bassPiano.volume.value = -8;

    const accentPiano = new Tone.Sampler({
      urls: PIANO_SAMPLE_URLS,
      baseUrl: PIANO_BASE_URL,
      release: 0.72,
    });
    accentPiano.volume.value = -16;

    const brushSynth = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: {
        attack: 0.001,
        decay: 0.09,
        sustain: 0,
        release: 0.02,
      },
    });
    brushSynth.volume.value = -16;

    compPiano.chain(chorus, toneEQ, masterFilter, slap, room, compressor, master);
    bassPiano.chain(bassFilter, bassEQ, compressor, master);
    accentPiano.chain(chorus, toneEQ, masterFilter, room, compressor, master);
    brushSynth.chain(percussionHP, percussionRoom, compressor, master);

    this.master = master;
    this.compPiano = compPiano;
    this.bassPiano = bassPiano;
    this.accentPiano = accentPiano;
    this.brushSynth = brushSynth;
    this.nodes = [
      master,
      compressor,
      masterFilter,
      toneEQ,
      chorus,
      room,
      slap,
      bassFilter,
      bassEQ,
      percussionHP,
      percussionRoom,
      compPiano,
      bassPiano,
      accentPiano,
      brushSynth,
    ];
    this.initialized = true;
  }

  private scheduleBrushBar(time: number) {
    if (!this.brushSynth) return;

    BAR_EIGHTH_OFFSETS.forEach((offset, index) => {
      if (index % 2 === 1 && Math.random() < 0.2) return;

      const hitTime = humanize(time + offsetToSeconds(offset));
      const accent =
        index === 0 || index === 4
          ? 0.54
          : index === 2 || index === 6
            ? 0.76
            : 0.28;
      this.brushSynth!.triggerAttackRelease("64n", hitTime, accent);
    });
  }

  private scheduleCompBar(time: number, barIndex: number) {
    if (!this.compPiano) return;

    const bar = JAZZ_BARS[barIndex];
    const pattern = COMP_PATTERNS[barIndex % COMP_PATTERNS.length];

    pattern.forEach((hit, hitIndex) => {
      const hitTime = humanize(time + offsetToSeconds(hit.offset));
      const invertedChord =
        hitIndex % 2 === 0
          ? bar.chord
          : ([...bar.chord.slice(1), bar.chord[0]] as string[]);
      this.compPiano!.triggerAttackRelease(
        invertedChord,
        hit.duration,
        hitTime,
        hit.velocity + randomBetween(-0.02, 0.02),
      );
    });
  }

  private scheduleBassBar(time: number, barIndex: number) {
    if (!this.bassPiano) return;

    const bar = JAZZ_BARS[barIndex];
    bar.bass.forEach((note, stepIndex) => {
      const hitTime = humanize(time + offsetToSeconds(QUARTER_OFFSETS[stepIndex]));
      const duration = stepIndex === 3 ? "8n" : "4n";
      const velocity = stepIndex === 0 ? 0.76 : 0.56 + randomBetween(-0.05, 0.06);
      this.bassPiano!.triggerAttackRelease(note, duration, hitTime, velocity);
    });

    this.bassPiano.triggerAttackRelease(
      bar.pickup,
      "8n",
      humanize(time + offsetToSeconds("0:3:2")),
      0.42,
    );
  }

  private scheduleAccentBar(time: number, barIndex: number) {
    if (!this.accentPiano) return;
    if (this.barCounter % 4 !== 3) return;

    const bar = JAZZ_BARS[barIndex];
    const firstNote = bar.accents[0];
    const secondNote = bar.accents[1] ?? bar.accents[0];

    this.accentPiano.triggerAttackRelease(
      firstNote,
      "8n",
      humanize(time + offsetToSeconds("0:2:2")),
      0.14,
    );

    this.accentPiano.triggerAttackRelease(
      secondNote,
      "8n",
      humanize(time + offsetToSeconds("0:3:2")),
      0.12,
    );
  }

  private scheduleBar = (time: number) => {
    const barIndex = this.barCounter % JAZZ_BARS.length;
    this.scheduleBrushBar(time);
    this.scheduleCompBar(time, barIndex);
    this.scheduleBassBar(time, barIndex);
    this.scheduleAccentBar(time, barIndex);
    this.barCounter += 1;
  };

  private clearTransport() {
    this.eventIds.forEach((id) => Tone.Transport.clear(id));
    this.eventIds = [];
    Tone.Transport.cancel(0);
  }

  async start() {
    this.ensureGraph();
    await Tone.start();
    await Tone.loaded();

    if (this.started) {
      this.master?.gain.rampTo(MASTER_GAIN, 0.25);
      if (Tone.Transport.state !== "started") {
        Tone.Transport.start("+0.02");
      }
      return;
    }

    this.started = true;
    this.barCounter = 0;
    this.clearTransport();
    this.master?.gain.cancelScheduledValues(Tone.now());
    this.master?.gain.rampTo(MASTER_GAIN, 0.32);

    this.eventIds.push(Tone.Transport.scheduleRepeat(this.scheduleBar, "1m", 0));
    Tone.Transport.start("+0.03");
  }

  async stop() {
    if (!this.initialized) return;
    this.started = false;
    this.master?.gain.rampTo(0.0001, 0.28);
    Tone.Transport.stop("+0.02");
    this.clearTransport();
  }

  async destroy() {
    await this.stop();
    this.nodes.forEach((node) => node.dispose());
    this.nodes = [];
    this.master = null;
    this.compPiano = null;
    this.bassPiano = null;
    this.accentPiano = null;
    this.brushSynth = null;
    this.initialized = false;
  }

  get isActive() {
    return this.started;
  }
}
