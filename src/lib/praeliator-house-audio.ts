import * as Tone from "tone";

const TEMPO_BPM = 96;
const MASTER_GAIN = 0.72;
const SWING_AMOUNT = 0.22;
const HUMANIZE_SECONDS = 0.015;

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

const COMP_PATTERNS = [
  [
    { offset: "0:0:2", duration: "8n.", velocity: 0.58 },
    { offset: "0:2:2", duration: "8n", velocity: 0.52 },
    { offset: "0:3:2", duration: "16n", velocity: 0.44 },
  ],
  [
    { offset: "0:1:0", duration: "8n", velocity: 0.46 },
    { offset: "0:2:2", duration: "8n.", velocity: 0.56 },
  ],
  [
    { offset: "0:0:2", duration: "16n", velocity: 0.44 },
    { offset: "0:1:2", duration: "8n", velocity: 0.52 },
    { offset: "0:3:0", duration: "8n", velocity: 0.48 },
  ],
  [
    { offset: "0:1:2", duration: "8n.", velocity: 0.56 },
    { offset: "0:3:0", duration: "8n", velocity: 0.5 },
  ],
] as const;

const JAZZ_BARS = [
  {
    chord: ["F3", "C4", "E4", "A4"],
    bass: ["D2", "F2", "A2", "C3", "D3", "C3", "A2", "F2"],
    accents: ["A4", "C5", "E5"],
  },
  {
    chord: ["F3", "B3", "E4", "A4"],
    bass: ["G2", "B2", "D3", "F3", "G3", "F3", "D3", "B2"],
    accents: ["A4", "B4", "D5"],
  },
  {
    chord: ["E3", "B3", "D4", "G4"],
    bass: ["C2", "E2", "G2", "B2", "C3", "B2", "G2", "E2"],
    accents: ["G4", "B4", "D5"],
  },
  {
    chord: ["G3", "C#4", "F4", "B4"],
    bass: ["A2", "C#3", "E3", "G3", "A3", "G3", "E3", "C#3"],
    accents: ["B4", "C#5", "E5"],
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
  private compSynth: Tone.PolySynth | null = null;
  private bassSynth: Tone.MonoSynth | null = null;
  private accentSynth: Tone.Synth | null = null;
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
    const toneEQ = new Tone.EQ3({ low: 1.5, mid: 0.4, high: 1.8 });
    const chorus = new Tone.Chorus(2.8, 1.6, 0.18).start();
    const room = new Tone.JCReverb(0.34);
    const slap = new Tone.FeedbackDelay("8n", 0.12);
    slap.wet.value = 0.1;

    const percussionHP = new Tone.Filter(1600, "highpass");
    const percussionRoom = new Tone.JCReverb(0.16);
    percussionRoom.wet.value = 0.1;

    const compSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle4" },
      envelope: {
        attack: 0.02,
        decay: 0.22,
        sustain: 0.32,
        release: 1.8,
      },
    });
    compSynth.volume.value = -5;

    const bassSynth = new Tone.MonoSynth({
      oscillator: { type: "fattriangle", count: 2, spread: 12 },
      envelope: {
        attack: 0.01,
        decay: 0.22,
        sustain: 0.2,
        release: 0.65,
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0.18,
        sustain: 0.2,
        release: 0.55,
        baseFrequency: 65,
        octaves: 2.1,
      },
      filter: {
        type: "lowpass",
        rolloff: -24,
        Q: 1,
      },
    });
    bassSynth.volume.value = -3;

    const accentSynth = new Tone.Synth({
      oscillator: { type: "sine2" },
      envelope: {
        attack: 0.012,
        decay: 0.12,
        sustain: 0.08,
        release: 0.55,
      },
    });
    accentSynth.volume.value = -10;

    const brushSynth = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: {
        attack: 0.001,
        decay: 0.09,
        sustain: 0,
        release: 0.02,
      },
    });
    brushSynth.volume.value = -12;

    compSynth.chain(chorus, toneEQ, masterFilter, slap, room, compressor, master);
    bassSynth.chain(masterFilter, compressor, master);
    accentSynth.chain(chorus, toneEQ, masterFilter, room, compressor, master);
    brushSynth.chain(percussionHP, percussionRoom, compressor, master);

    this.master = master;
    this.compSynth = compSynth;
    this.bassSynth = bassSynth;
    this.accentSynth = accentSynth;
    this.brushSynth = brushSynth;
    this.nodes = [
      master,
      compressor,
      masterFilter,
      toneEQ,
      chorus,
      room,
      slap,
      percussionHP,
      percussionRoom,
      compSynth,
      bassSynth,
      accentSynth,
      brushSynth,
    ];
    this.initialized = true;
  }

  private scheduleBrushBar(time: number) {
    if (!this.brushSynth) return;

    BAR_EIGHTH_OFFSETS.forEach((offset, index) => {
      if (index % 2 === 1 && Math.random() < 0.2) return;

      const hitTime = humanize(time + offsetToSeconds(offset));
      const accent = index === 2 || index === 6 ? 1.1 : index % 2 === 0 ? 0.58 : 0.36;
      this.brushSynth!.triggerAttackRelease("32n", hitTime, accent);
    });
  }

  private scheduleCompBar(time: number, barIndex: number) {
    if (!this.compSynth) return;

    const bar = JAZZ_BARS[barIndex];
    const pattern = COMP_PATTERNS[barIndex % COMP_PATTERNS.length];

    pattern.forEach((hit, hitIndex) => {
      const hitTime = humanize(time + offsetToSeconds(hit.offset));
      const invertedChord =
        hitIndex % 2 === 0
          ? bar.chord
          : ([...bar.chord.slice(1), bar.chord[0]] as string[]);
      this.compSynth!.triggerAttackRelease(
        invertedChord,
        hit.duration,
        hitTime,
        hit.velocity + randomBetween(-0.05, 0.06),
      );
    });
  }

  private scheduleBassBar(time: number, barIndex: number) {
    if (!this.bassSynth) return;

    const bar = JAZZ_BARS[barIndex];
    bar.bass.forEach((note, stepIndex) => {
      const hitTime = humanize(time + offsetToSeconds(BAR_EIGHTH_OFFSETS[stepIndex]));
      const duration = stepIndex % 2 === 0 ? "8n" : "8n.";
      const velocity = stepIndex === 0 ? 0.86 : 0.54 + randomBetween(-0.08, 0.1);
      this.bassSynth!.triggerAttackRelease(note, duration, hitTime, velocity);
    });
  }

  private scheduleAccentBar(time: number, barIndex: number) {
    if (!this.accentSynth) return;
    if (Math.random() < 0.28) return;

    const bar = JAZZ_BARS[barIndex];
    const firstNote = bar.accents[Math.floor(randomBetween(0, bar.accents.length))];
    const secondNote = bar.accents[Math.floor(randomBetween(0, bar.accents.length))];

    this.accentSynth.triggerAttackRelease(
      firstNote,
      "16n",
      humanize(time + offsetToSeconds("0:1:2")),
      0.22 + randomBetween(-0.04, 0.05),
    );

    if (Math.random() > 0.42) {
      this.accentSynth.triggerAttackRelease(
        secondNote,
        "16n",
        humanize(time + offsetToSeconds("0:3:2")),
        0.18 + randomBetween(-0.03, 0.04),
      );
    }
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
    this.compSynth = null;
    this.bassSynth = null;
    this.accentSynth = null;
    this.brushSynth = null;
    this.initialized = false;
  }

  get isActive() {
    return this.started;
  }
}
