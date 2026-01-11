export type Keys =
  | "C"
  | "Cm"
  | "C#"
  | "C#m"
  | "Db"
  | "Dbm"
  | "D"
  | "Dm"
  | "D#"
  | "D#m"
  | "Eb"
  | "Ebm"
  | "E"
  | "Em"
  | "F"
  | "Fm"
  | "F#"
  | "F#m"
  | "Gb"
  | "Gbm"
  | "G"
  | "Gm"
  | "G#"
  | "G#m"
  | "Ab"
  | "Abm"
  | "A"
  | "Am"
  | "A#"
  | "A#m"
  | "Bb"
  | "Bbm"
  | "B"
  | "Bm";

export type Note = {
  key: Keys;
  octave: number;
};

export interface ChordData {
  notes: Note[];
  fullName: string;
  type: "major" | "minor" | "diminished" | "augmented" | "7th";
  intervals: { name: string; semitones: number }[];
  fingering: number[];
  tip: string;
}

export interface Progression {
  name: string;
  description: string;
  chords: string[];
  key: string;
}

export const CHORD_DATA: Record<string, ChordData> = {
  // ===== MAJOR KEYS =====
  C: {
    notes: [
      {
        key: "C",
        octave: 4,
      },
      {
        key: "E",
        octave: 4,
      },
      {
        key: "G",
        octave: 4,
      },
    ],
    fullName: "C Major",
    type: "major",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Major 3rd", semitones: 4 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "No sharps or flats. The center of the circle of fifths.",
  },

  G: {
    notes: [
      {
        key: "G",
        octave: 4,
      },
      {
        key: "B",
        octave: 4,
      },
      {
        key: "D",
        octave: 5,
      },
    ],
    fullName: "G Major",
    type: "major",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Major 3rd", semitones: 4 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "One sharp (F#). Very common in pop and rock.",
  },

  D: {
    notes: [
      {
        key: "D",
        octave: 4,
      },
      {
        key: "F#",
        octave: 4,
      },
      {
        key: "A",
        octave: 4,
      },
    ],
    fullName: "D Major",
    type: "major",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Major 3rd", semitones: 4 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Two sharps (F#, C#). Bright and open.",
  },

  A: {
    notes: [
      {
        key: "A",
        octave: 4,
      },
      {
        key: "C#",
        octave: 5,
      },
      {
        key: "E",
        octave: 5,
      },
    ],
    fullName: "A Major",
    type: "major",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Major 3rd", semitones: 4 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Three sharps. Dominant of D major.",
  },

  E: {
    notes: [
      {
        key: "E",
        octave: 4,
      },
      {
        key: "G#",
        octave: 4,
      },
      {
        key: "B",
        octave: 4,
      },
    ],
    fullName: "E Major",
    type: "major",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Major 3rd", semitones: 4 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Four sharps. Very resonant on guitar.",
  },

  B: {
    notes: [
      {
        key: "B",
        octave: 4,
      },
      {
        key: "D#",
        octave: 5,
      },
      {
        key: "F#",
        octave: 5,
      },
    ],
    fullName: "B Major",
    type: "major",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Major 3rd", semitones: 4 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Five sharps. Enharmonic with Cb major.",
  },

  "F#": {
    notes: [
      {
        key: "F#",
        octave: 4,
      },
      {
        key: "A#",
        octave: 4,
      },
      {
        key: "C#",
        octave: 5,
      },
    ],
    fullName: "F# Major",
    type: "major",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Major 3rd", semitones: 4 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Six sharps. Enharmonic with Gb major.",
  },

  Db: {
    notes: [
      {
        key: "Db",
        octave: 4,
      },
      {
        key: "F",
        octave: 4,
      },
      {
        key: "Ab",
        octave: 4,
      },
    ],
    fullName: "Db Major",
    type: "major",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Major 3rd", semitones: 4 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Five flats. Preferred over C# major in notation.",
  },

  Ab: {
    notes: [
      {
        key: "Ab",
        octave: 4,
      },
      {
        key: "C",
        octave: 5,
      },
      {
        key: "Eb",
        octave: 5,
      },
    ],
    fullName: "Ab Major",
    type: "major",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Major 3rd", semitones: 4 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Four flats. Warm and lyrical sound.",
  },

  Eb: {
    notes: [
      {
        key: "Eb",
        octave: 4,
      },
      {
        key: "G",
        octave: 4,
      },
      {
        key: "Bb",
        octave: 4,
      },
    ],
    fullName: "Eb Major",
    type: "major",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Major 3rd", semitones: 4 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Three flats. Common in jazz and brass music.",
  },

  Bb: {
    notes: [
      {
        key: "Bb",
        octave: 4,
      },
      {
        key: "D",
        octave: 5,
      },
      {
        key: "F",
        octave: 5,
      },
    ],
    fullName: "Bb Major",
    type: "major",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Major 3rd", semitones: 4 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Two flats. Very common in band music.",
  },

  F: {
    notes: [
      {
        key: "F",
        octave: 4,
      },
      {
        key: "A",
        octave: 4,
      },
      {
        key: "C",
        octave: 5,
      },
    ],
    fullName: "F Major",
    type: "major",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Major 3rd", semitones: 4 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "One flat (Bb). Subdominant of C.",
  },

  // ===== RELATIVE MINORS =====

  Am: {
    notes: [
      {
        key: "A",
        octave: 4,
      },
      {
        key: "C",
        octave: 5,
      },
      {
        key: "E",
        octave: 5,
      },
    ],
    fullName: "A Minor",
    type: "minor",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Minor 3rd", semitones: 3 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Relative minor of C major.",
  },

  Em: {
    notes: [
      {
        key: "E",
        octave: 4,
      },
      {
        key: "G",
        octave: 4,
      },
      {
        key: "B",
        octave: 4,
      },
    ],
    fullName: "E Minor",
    type: "minor",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Minor 3rd", semitones: 3 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Relative minor of G major.",
  },

  Bm: {
    notes: [
      {
        key: "B",
        octave: 4,
      },
      {
        key: "D",
        octave: 5,
      },
      {
        key: "F#",
        octave: 5,
      },
    ],
    fullName: "B Minor",
    type: "minor",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Minor 3rd", semitones: 3 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Relative minor of D major.",
  },

  "F#m": {
    notes: [
      {
        key: "F#",
        octave: 4,
      },
      {
        key: "A",
        octave: 4,
      },
      {
        key: "C#",
        octave: 5,
      },
    ],
    fullName: "F# Minor",
    type: "minor",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Minor 3rd", semitones: 3 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Relative minor of A major.",
  },

  "C#m": {
    notes: [
      {
        key: "C#",
        octave: 4,
      },
      {
        key: "E",
        octave: 4,
      },
      {
        key: "G#",
        octave: 4,
      },
    ],
    fullName: "C# Minor",
    type: "minor",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Minor 3rd", semitones: 3 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Relative minor of E major.",
  },

  "G#m": {
    notes: [
      {
        key: "G#",
        octave: 4,
      },
      {
        key: "B",
        octave: 4,
      },
      {
        key: "D#",
        octave: 5,
      },
    ],
    fullName: "G# Minor",
    type: "minor",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Minor 3rd", semitones: 3 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Relative minor of B major.",
  },

  Bbm: {
    notes: [
      {
        key: "Bb",
        octave: 4,
      },
      {
        key: "Db",
        octave: 5,
      },
      {
        key: "F",
        octave: 5,
      },
    ],
    fullName: "Bb Minor",
    type: "minor",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Minor 3rd", semitones: 3 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Relative minor of Db major.",
  },

  "D#m": {
    notes: [
      {
        key: "D#",
        octave: 4,
      },
      {
        key: "F#",
        octave: 4,
      },
      {
        key: "A#",
        octave: 4,
      },
    ],
    fullName: "D# Minor",
    type: "minor",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Minor 3rd", semitones: 3 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Relative minor of F# major. Enharmonic with Eb minor.",
  },

  Fm: {
    notes: [
      {
        key: "F",
        octave: 4,
      },
      {
        key: "Ab",
        octave: 4,
      },
      {
        key: "C",
        octave: 5,
      },
    ],
    fullName: "F Minor",
    type: "minor",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Minor 3rd", semitones: 3 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Relative minor of Ab major.",
  },

  Cm: {
    notes: [
      {
        key: "C",
        octave: 4,
      },
      {
        key: "Eb",
        octave: 4,
      },
      {
        key: "G",
        octave: 4,
      },
    ],
    fullName: "C Minor",
    type: "minor",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Minor 3rd", semitones: 3 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Relative minor of Eb major.",
  },

  Gm: {
    notes: [
      {
        key: "G",
        octave: 4,
      },
      {
        key: "Bb",
        octave: 4,
      },
      {
        key: "D",
        octave: 5,
      },
    ],
    fullName: "G Minor",
    type: "minor",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Minor 3rd", semitones: 3 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Relative minor of Bb major.",
  },

  Dm: {
    notes: [
      {
        key: "D",
        octave: 4,
      },
      {
        key: "F",
        octave: 4,
      },
      {
        key: "A",
        octave: 4,
      },
    ],
    fullName: "D Minor",
    type: "minor",
    intervals: [
      { name: "Root", semitones: 0 },
      { name: "Minor 3rd", semitones: 3 },
      { name: "Perfect 5th", semitones: 7 },
    ],
    fingering: [1, 3, 5],
    tip: "Relative minor of F major.",
  },
};

export const PROGRESSIONS: Record<string, Progression> = {
  "I-V-vi-IV": {
    name: "The Pop Progression",
    description: "The most common progression in pop music",
    chords: ["C", "G", "Am", "F"],
    key: "C Major",
  },
  "I-IV-V-I": {
    name: "The Classic",
    description: "Traditional blues and rock foundation",
    chords: ["C", "F", "G", "C"],
    key: "C Major",
  },
  "ii-V-I": {
    name: "Jazz Standard",
    description: "The essential jazz progression",
    chords: ["Dm", "G", "C", "C"],
    key: "C Major",
  },
  "I-vi-IV-V": {
    name: "50s Progression",
    description: "Classic doo-wop and early rock",
    chords: ["C", "Am", "F", "G"],
    key: "C Major",
  },
  "vi-IV-I-V": {
    name: "Emotional Minor",
    description: "Starting on minor creates tension",
    chords: ["Am", "F", "C", "G"],
    key: "C Major",
  },
  "I-V-vi-iii-IV": {
    name: "Canon Progression",
    description: "Based on Pachelbel's Canon",
    chords: ["C", "G", "Am", "Em"],
    key: "C Major",
  },
};
