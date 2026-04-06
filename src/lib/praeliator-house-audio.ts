import * as Tone from "tone";

const TEMPO_BPM = 112;
const MASTER_GAIN = 0.24;
const SWING_AMOUNT = 0.22;
const TIGHT_HUMANIZE_SECONDS = 0.0015;
const LOOSE_HUMANIZE_SECONDS = 0.005;
const PIANO_BASE_URL = "https://tonejs.github.io/audio/salamander/";
const PIANO_SAMPLE_URLS = {
  A1: "A1.mp3",
  C2: "C2.mp3",
  "D#2": "Ds2.mp3",
  "F#2": "Fs2.mp3",
  A2: "A2.mp3",
  C3: "C3.mp3",
  "D#3": "Ds3.mp3",
  "F#3": "Fs3.mp3",
  A3: "A3.mp3",
  C4: "C4.mp3",
  "D#4": "Ds4.mp3",
  "F#4": "Fs4.mp3",
  A4: "A4.mp3",
  C5: "C5.mp3",
  "D#5": "Ds5.mp3",
  "F#5": "Fs5.mp3",
  A5: "A5.mp3",
} as const;

const EIGHTH_OFFSETS = [
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
const RIDE_PATTERN = ["0:0:0", "0:1:2", "0:2:0", "0:3:2"] as const;
const HAT_OFFSETS = ["0:1:0", "0:3:0"] as const;
const FILL_OFFSETS = ["0:2:2", "0:3:0", "0:3:2"] as const;
const SHAKER_OFFSETS = ["0:0:2", "0:1:2", "0:2:2", "0:3:2"] as const;
const KICK_OFFSETS = ["0:0:0", "0:2:0"] as const;
const SNARE_OFFSETS = ["0:1:0", "0:3:0"] as const;

const COMP_PATTERNS = [
  [
    { offset: "0:1:0", duration: "8n.", velocity: 0.48 },
    { offset: "0:3:0", duration: "8n", velocity: 0.58 },
  ],
  [
    { offset: "0:0:2", duration: "8n", velocity: 0.38 },
    { offset: "0:1:0", duration: "8n", velocity: 0.46 },
    { offset: "0:3:0", duration: "8n.", velocity: 0.56 },
  ],
  [
    { offset: "0:1:0", duration: "4n", velocity: 0.52 },
    { offset: "0:3:0", duration: "8n", velocity: 0.54 },
  ],
  [
    { offset: "0:1:0", duration: "8n", velocity: 0.46 },
    { offset: "0:2:2", duration: "8n", velocity: 0.36 },
    { offset: "0:3:0", duration: "8n", velocity: 0.58 },
  ],
] as const;

const PHRASE_SECTIONS = [
  {
    compPatternOffset: 0,
    brushDensity: 0.8,
    rideDensity: 0.62,
    hatVelocity: 0.2,
    allowFill: false,
    bassVelocityScale: 0.94,
    compVelocityScale: 0.92,
  },
  {
    compPatternOffset: 1,
    brushDensity: 0.9,
    rideDensity: 0.8,
    hatVelocity: 0.24,
    allowFill: true,
    bassVelocityScale: 1,
    compVelocityScale: 1,
  },
  {
    compPatternOffset: 2,
    brushDensity: 0.72,
    rideDensity: 0.68,
    hatVelocity: 0.18,
    allowFill: false,
    bassVelocityScale: 0.92,
    compVelocityScale: 0.9,
  },
  {
    compPatternOffset: 3,
    brushDensity: 1,
    rideDensity: 0.92,
    hatVelocity: 0.28,
    allowFill: true,
    bassVelocityScale: 1.06,
    compVelocityScale: 1.04,
  },
] as const;

const JAZZ_FORM = [
  {
    name: "Dm9",
    chord: ["F3", "C4", "E4", "A4"],
    bass: ["D2", "F2", "A2", "C3"],
    pickup: "C#3",
  },
  {
    name: "G13",
    chord: ["F3", "B3", "E4", "A4"],
    bass: ["G2", "B2", "D3", "F3"],
    pickup: "B2",
  },
  {
    name: "Cmaj9",
    chord: ["E3", "B3", "D4", "G4"],
    bass: ["C2", "E2", "G2", "B2"],
    pickup: "A2",
  },
  {
    name: "A7alt",
    chord: ["G3", "C#4", "F4", "Bb4"],
    bass: ["A2", "C#3", "E3", "G3"],
    pickup: "C#3",
    fill: ["C#5", "E5", "G5"],
  },
  {
    name: "Dm9",
    chord: ["F3", "C4", "E4", "A4"],
    bass: ["D2", "F2", "A2", "C3"],
    pickup: "B2",
  },
  {
    name: "G13",
    chord: ["F3", "B3", "E4", "A4"],
    bass: ["G2", "A2", "B2", "D3"],
    pickup: "G2",
  },
  {
    name: "Cmaj9",
    chord: ["E3", "B3", "D4", "G4"],
    bass: ["C2", "E2", "G2", "A2"],
    pickup: "B2",
  },
  {
    name: "C6/9",
    chord: ["E3", "A3", "D4", "G4"],
    bass: ["C2", "E2", "G2", "A2"],
    pickup: "A2",
    fill: ["G4", "A4", "B4"],
  },
  {
    name: "Fmaj9",
    chord: ["A3", "E4", "G4", "C5"],
    bass: ["F2", "A2", "C3", "E3"],
    pickup: "Ab2",
  },
  {
    name: "Fm9",
    chord: ["Ab3", "Eb4", "G4", "C5"],
    bass: ["F2", "Ab2", "C3", "Eb3"],
    pickup: "E2",
  },
  {
    name: "Em7b5",
    chord: ["G3", "D4", "F4", "Bb4"],
    bass: ["E2", "G2", "Bb2", "D3"],
    pickup: "C#3",
  },
  {
    name: "A7b9",
    chord: ["G3", "C#4", "E4", "Bb4"],
    bass: ["A2", "C#3", "E3", "G3"],
    pickup: "C#3",
    fill: ["C#5", "Bb4", "A4"],
  },
  {
    name: "Dm9",
    chord: ["F3", "C4", "E4", "A4"],
    bass: ["D2", "F2", "A2", "C3"],
    pickup: "C#3",
  },
  {
    name: "G13",
    chord: ["F3", "B3", "E4", "A4"],
    bass: ["G2", "B2", "D3", "F3"],
    pickup: "B2",
  },
  {
    name: "Cmaj9",
    chord: ["E3", "B3", "D4", "G4"],
    bass: ["C2", "E2", "G2", "B2"],
    pickup: "A2",
  },
  {
    name: "A7alt",
    chord: ["G3", "C#4", "F4", "Bb4"],
    bass: ["A2", "C#3", "E3", "G3"],
    pickup: "C#3",
    fill: ["G4", "E4", "C4"],
  },
] as const;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function humanize(time: number, amount = LOOSE_HUMANIZE_SECONDS) {
  return time + randomBetween(-amount, amount);
}

function offsetToSeconds(offset: string) {
  return Tone.Time(offset).toSeconds();
}

function getPhraseSection(barCounter: number) {
  return PHRASE_SECTIONS[Math.floor((barCounter % JAZZ_FORM.length) / 4) % PHRASE_SECTIONS.length];
}

function getArrangementStage(barCounter: number) {
  if (barCounter < 4) {
    return {
      kick: true,
      snare: false,
      ride: false,
      hat: false,
      shaker: false,
      pad: false,
      fill: false,
      compScale: 0.92,
      bassScale: 0.94,
    };
  }

  if (barCounter < 8) {
    return {
      kick: true,
      snare: true,
      ride: true,
      hat: true,
      shaker: false,
      pad: false,
      fill: false,
      compScale: 0.98,
      bassScale: 1,
    };
  }

  if (barCounter < 16) {
    return {
      kick: true,
      snare: true,
      ride: true,
      hat: true,
      shaker: true,
      pad: true,
      fill: true,
      compScale: 1,
      bassScale: 1.02,
    };
  }

  return {
    kick: true,
    snare: true,
    ride: true,
    hat: true,
    shaker: true,
    pad: true,
    fill: true,
    compScale: 1.04,
    bassScale: 1.04,
  };
}

function liftChord(notes: readonly string[], semitones: number) {
  return notes.map((note) => Tone.Frequency(note).transpose(semitones).toNote());
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
  private kickSynth: Tone.MembraneSynth | null = null;
  private snareSynth: Tone.NoiseSynth | null = null;
  private rideSynth: Tone.MetalSynth | null = null;
  private hatSynth: Tone.MetalSynth | null = null;
  private shakerSynth: Tone.NoiseSynth | null = null;
  private airPad: Tone.PolySynth | null = null;
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
    const compressor = new Tone.Compressor(-22, 2.2);
    const masterFilter = new Tone.Filter(4200, "lowpass");
    const toneEQ = new Tone.EQ3({ low: 0.45, mid: 0.1, high: 0.1 });
    const room = new Tone.JCReverb(0.18);
    room.wet.value = 0.16;
    const accentDelay = new Tone.FeedbackDelay("8n", 0.05);
    accentDelay.wet.value = 0.035;
    const bassFilter = new Tone.Filter(460, "lowpass");
    const bassEQ = new Tone.EQ3({ low: 1.6, mid: -0.35, high: -8 });

    const percussionHP = new Tone.Filter(1900, "highpass");
    const percussionRoom = new Tone.JCReverb(0.1);
    percussionRoom.wet.value = 0.04;
    const kickLP = new Tone.Filter(180, "lowpass");
    const snareHP = new Tone.Filter(1200, "highpass");
    const rideHP = new Tone.Filter(2500, "highpass");
    const hatHP = new Tone.Filter(3200, "highpass");
    const shakerHP = new Tone.Filter(4200, "highpass");
    const padFilter = new Tone.Filter(1800, "lowpass");
    const padRoom = new Tone.JCReverb(0.28);
    padRoom.wet.value = 0.35;

    const compPiano = new Tone.Sampler({
      urls: PIANO_SAMPLE_URLS,
      baseUrl: PIANO_BASE_URL,
      release: 1.1,
    });
    compPiano.volume.value = -8.5;

    const bassPiano = new Tone.Sampler({
      urls: PIANO_SAMPLE_URLS,
      baseUrl: PIANO_BASE_URL,
      release: 0.88,
    });
    bassPiano.volume.value = -6.5;

    const accentPiano = new Tone.Sampler({
      urls: PIANO_SAMPLE_URLS,
      baseUrl: PIANO_BASE_URL,
      release: 0.78,
    });
    accentPiano.volume.value = -14;

    const brushSynth = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: {
        attack: 0.001,
        decay: 0.075,
        sustain: 0,
        release: 0.018,
      },
    });
    brushSynth.volume.value = -14.5;

    const kickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.03,
      octaves: 4,
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.001,
        decay: 0.22,
        sustain: 0,
        release: 0.08,
      },
    });
    kickSynth.volume.value = -18;

    const snareSynth = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: {
        attack: 0.001,
        decay: 0.08,
        sustain: 0,
        release: 0.02,
      },
    });
    snareSynth.volume.value = -18.5;

    const rideSynth = new Tone.MetalSynth({
      frequency: 320,
      envelope: {
        attack: 0.001,
        decay: 0.09,
        release: 0.02,
      },
      harmonicity: 3.3,
      modulationIndex: 12,
      resonance: 1800,
      octaves: 1.2,
    });
    rideSynth.volume.value = -24.5;

    const hatSynth = new Tone.MetalSynth({
      frequency: 200,
      envelope: {
        attack: 0.001,
        decay: 0.045,
        release: 0.01,
      },
      harmonicity: 2.6,
      modulationIndex: 10,
      resonance: 1400,
      octaves: 1,
    });
    hatSynth.volume.value = -23.5;

    const shakerSynth = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: {
        attack: 0.001,
        decay: 0.04,
        sustain: 0,
        release: 0.01,
      },
    });
    shakerSynth.volume.value = -22.5;

    const airPad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle6" },
      envelope: {
        attack: 0.35,
        decay: 0.2,
        sustain: 0.45,
        release: 1.8,
      },
    });
    airPad.volume.value = -24;

    compPiano.chain(toneEQ, masterFilter, room, compressor, master);
    bassPiano.chain(bassFilter, bassEQ, compressor, master);
    accentPiano.chain(toneEQ, masterFilter, accentDelay, room, compressor, master);
    brushSynth.chain(percussionHP, percussionRoom, compressor, master);
    kickSynth.chain(kickLP, compressor, master);
    snareSynth.chain(snareHP, percussionRoom, compressor, master);
    rideSynth.chain(rideHP, percussionRoom, compressor, master);
    hatSynth.chain(hatHP, percussionRoom, compressor, master);
    shakerSynth.chain(shakerHP, percussionRoom, compressor, master);
    airPad.chain(padFilter, padRoom, compressor, master);

    this.master = master;
    this.compPiano = compPiano;
    this.bassPiano = bassPiano;
    this.accentPiano = accentPiano;
    this.brushSynth = brushSynth;
    this.kickSynth = kickSynth;
    this.snareSynth = snareSynth;
    this.rideSynth = rideSynth;
    this.hatSynth = hatSynth;
    this.shakerSynth = shakerSynth;
    this.airPad = airPad;
    this.nodes = [
      master,
      compressor,
      masterFilter,
      toneEQ,
      room,
      accentDelay,
      bassFilter,
      bassEQ,
      percussionHP,
      percussionRoom,
      kickLP,
      snareHP,
      rideHP,
      hatHP,
      shakerHP,
      padFilter,
      padRoom,
      compPiano,
      bassPiano,
      accentPiano,
      brushSynth,
      kickSynth,
      snareSynth,
      rideSynth,
      hatSynth,
      shakerSynth,
      airPad,
    ];
    this.initialized = true;
  }

  private scheduleBrushBar(time: number, phraseSection: (typeof PHRASE_SECTIONS)[number]) {
    if (!this.brushSynth) return;

    EIGHTH_OFFSETS.forEach((offset, index) => {
      const isBackbeat = index === 2 || index === 6;
      const isQuarter = index % 2 === 0;
      const skipChance = isQuarter
        ? Math.max(0.02, 0.08 - phraseSection.brushDensity * 0.04)
        : Math.max(0.14, 0.42 - phraseSection.brushDensity * 0.18);

      if (!isBackbeat && Math.random() < skipChance) return;

      const velocity = isBackbeat ? 0.32 : isQuarter ? 0.18 : 0.11;
      this.brushSynth.triggerAttackRelease(
        "64n",
        humanize(time + offsetToSeconds(offset)),
        velocity * phraseSection.brushDensity,
      );
    });
  }

  private scheduleKickBar(time: number) {
    if (!this.kickSynth) return;

    KICK_OFFSETS.forEach((offset, index) => {
      this.kickSynth!.triggerAttackRelease(
        index === 0 ? "C1" : "G0",
        "8n",
        humanize(time + offsetToSeconds(offset), TIGHT_HUMANIZE_SECONDS),
        index === 0 ? 0.52 : 0.36,
      );
    });
  }

  private scheduleSnareBar(time: number) {
    if (!this.snareSynth) return;

    SNARE_OFFSETS.forEach((offset, index) => {
      this.snareSynth!.triggerAttackRelease(
        "32n",
        humanize(time + offsetToSeconds(offset), TIGHT_HUMANIZE_SECONDS),
        index === 0 ? 0.22 : 0.26,
      );
    });
  }

  private scheduleRideBar(time: number, phraseSection: (typeof PHRASE_SECTIONS)[number]) {
    if (!this.rideSynth) return;

    RIDE_PATTERN.forEach((offset, index) => {
      const velocity = (index % 2 === 0 ? 0.22 : 0.17) * phraseSection.rideDensity;
      this.rideSynth!.triggerAttackRelease(
        "32n",
        humanize(time + offsetToSeconds(offset), TIGHT_HUMANIZE_SECONDS),
        velocity,
      );
    });
  }

  private scheduleHatBar(time: number, phraseSection: (typeof PHRASE_SECTIONS)[number]) {
    if (!this.hatSynth) return;

    HAT_OFFSETS.forEach((offset) => {
      this.hatSynth!.triggerAttackRelease(
        "64n",
        humanize(time + offsetToSeconds(offset), TIGHT_HUMANIZE_SECONDS),
        phraseSection.hatVelocity,
      );
    });
  }

  private scheduleShakerBar(time: number) {
    if (!this.shakerSynth) return;

    SHAKER_OFFSETS.forEach((offset, index) => {
      this.shakerSynth!.triggerAttackRelease(
        "64n",
        humanize(time + offsetToSeconds(offset), TIGHT_HUMANIZE_SECONDS),
        0.12 + (index % 2 === 0 ? 0.02 : 0),
      );
    });
  }

  private schedulePadBar(time: number, barIndex: number) {
    if (!this.airPad) return;
    if (barIndex % 2 !== 0) return;

    const bar = JAZZ_FORM[barIndex];
    const nextBar = JAZZ_FORM[(barIndex + 1) % JAZZ_FORM.length];
    const padNotes = [
      ...liftChord(bar.chord.slice(1), 12),
      Tone.Frequency(nextBar.chord[nextBar.chord.length - 1]).transpose(12).toNote(),
    ];

    this.airPad.triggerAttackRelease(
      padNotes,
      "2m",
      humanize(time, TIGHT_HUMANIZE_SECONDS),
      0.16,
    );
  }

  private scheduleCompBar(
    time: number,
    barIndex: number,
    phraseSection: (typeof PHRASE_SECTIONS)[number],
  ) {
    if (!this.compPiano) return;

    const bar = JAZZ_FORM[barIndex];
    const pattern =
      COMP_PATTERNS[(barIndex + phraseSection.compPatternOffset) % COMP_PATTERNS.length];

    pattern.forEach((hit) => {
      const hitTime = humanize(time + offsetToSeconds(hit.offset), TIGHT_HUMANIZE_SECONDS);
      this.compPiano!.triggerAttackRelease(
        bar.chord,
        hit.duration,
        hitTime,
        hit.velocity * phraseSection.compVelocityScale,
      );
    });
  }

  private scheduleBassBar(
    time: number,
    barIndex: number,
    phraseSection: (typeof PHRASE_SECTIONS)[number],
  ) {
    if (!this.bassPiano) return;

    const bar = JAZZ_FORM[barIndex];
    bar.bass.forEach((note, stepIndex) => {
      const hitTime = humanize(
        time + offsetToSeconds(QUARTER_OFFSETS[stepIndex]),
        TIGHT_HUMANIZE_SECONDS,
      );
      const velocity = (stepIndex === 0 ? 0.72 : 0.58) * phraseSection.bassVelocityScale;
      this.bassPiano!.triggerAttackRelease(note, "4n", hitTime, velocity);
    });

    this.bassPiano.triggerAttackRelease(
      bar.pickup,
      "8n",
      humanize(time + offsetToSeconds("0:3:2"), TIGHT_HUMANIZE_SECONDS),
      0.44 * phraseSection.bassVelocityScale,
    );
  }

  private scheduleFillBar(
    time: number,
    barIndex: number,
    phraseSection: (typeof PHRASE_SECTIONS)[number],
  ) {
    if (!this.accentPiano || !phraseSection.allowFill) return;

    const bar = JAZZ_FORM[barIndex];
    if (!bar.fill) return;

    bar.fill.forEach((note, index) => {
      this.accentPiano!.triggerAttackRelease(
        note,
        index === bar.fill!.length - 1 ? "8n." : "8n",
        humanize(time + offsetToSeconds(FILL_OFFSETS[index]), TIGHT_HUMANIZE_SECONDS),
        0.12 + index * 0.02,
      );
    });
  }

  private scheduleBar = (time: number) => {
    const barIndex = this.barCounter % JAZZ_FORM.length;
    const phraseSection = getPhraseSection(this.barCounter);
    const arrangementStage = getArrangementStage(this.barCounter);
    this.scheduleBrushBar(time, phraseSection);
    if (arrangementStage.kick) {
      this.scheduleKickBar(time);
    }
    if (arrangementStage.snare) {
      this.scheduleSnareBar(time);
    }
    if (arrangementStage.ride) {
      this.scheduleRideBar(time, phraseSection);
    }
    if (arrangementStage.hat) {
      this.scheduleHatBar(time, phraseSection);
    }
    if (arrangementStage.shaker) {
      this.scheduleShakerBar(time);
    }
    if (arrangementStage.pad) {
      this.schedulePadBar(time, barIndex);
    }
    this.scheduleCompBar(time, barIndex, {
      ...phraseSection,
      compVelocityScale: phraseSection.compVelocityScale * arrangementStage.compScale,
    });
    this.scheduleBassBar(time, barIndex, {
      ...phraseSection,
      bassVelocityScale: phraseSection.bassVelocityScale * arrangementStage.bassScale,
    });
    if (arrangementStage.fill) {
      this.scheduleFillBar(time, barIndex, phraseSection);
    }
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
    this.kickSynth = null;
    this.snareSynth = null;
    this.rideSynth = null;
    this.hatSynth = null;
    this.shakerSynth = null;
    this.airPad = null;
    this.initialized = false;
  }

  get isActive() {
    return this.started;
  }
}
