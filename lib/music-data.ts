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
    tip: "The foundational chord. Keep your wrist relaxed and fingers curved.",
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
    tip: "Practice smooth transitions between C and G - they're often paired.",
  },
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
    tip: "The relative minor of C major. Notice how it shares two notes with C.",
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
    tip: "The subdominant of C. Creates tension that resolves nicely to C.",
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
    tip: "Creates a melancholic feel. Often resolves to G or Am.",
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
    tip: "The relative minor of G major. Very common in pop progressions.",
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
    tip: "Contains F# - your first sharp note! Listen for the bright sound.",
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
    tip: "Another bright major chord. The dominant of D major.",
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
