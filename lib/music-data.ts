export interface ChordData {
  notes: string[];
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
    notes: ["C", "E", "G"],
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
    notes: ["G", "B", "D"],
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
    notes: ["D", "F#", "A"],
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
    notes: ["A", "C#", "E"],
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
    notes: ["E", "G#", "B"],
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
    notes: ["B", "D#", "F#"],
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
    notes: ["F#", "A#", "C#"],
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
    notes: ["Db", "F", "Ab"],
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
    notes: ["Ab", "C", "Eb"],
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
    notes: ["Eb", "G", "Bb"],
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
    notes: ["Bb", "D", "F"],
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
    notes: ["F", "A", "C"],
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
    notes: ["A", "C", "E"],
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
    notes: ["E", "G", "B"],
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
    notes: ["B", "D", "F#"],
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
    notes: ["F#", "A", "C#"],
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
    notes: ["C#", "E", "G#"],
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
    notes: ["G#", "B", "D#"],
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
    notes: ["Bb", "Db", "F"],
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
    notes: ["D#", "F#", "A#"],
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
    notes: ["F", "Ab", "C"],
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
    notes: ["C", "Eb", "G"],
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
    notes: ["G", "Bb", "D"],
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
    notes: ["D", "F", "A"],
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
