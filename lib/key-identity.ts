type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

const KEY_TO_PITCH_CLASS: Record<
  string,
  { pc: PitchClass; quality: "major" | "minor" }
> = {
  // Major
  C: { pc: 0, quality: "major" },
  "C#": { pc: 1, quality: "major" },
  Db: { pc: 1, quality: "major" },
  D: { pc: 2, quality: "major" },
  "D#": { pc: 3, quality: "major" },
  Eb: { pc: 3, quality: "major" },
  E: { pc: 4, quality: "major" },
  F: { pc: 5, quality: "major" },
  "F#": { pc: 6, quality: "major" },
  Gb: { pc: 6, quality: "major" },
  G: { pc: 7, quality: "major" },
  "G#": { pc: 8, quality: "major" },
  Ab: { pc: 8, quality: "major" },
  A: { pc: 9, quality: "major" },
  "A#": { pc: 10, quality: "major" },
  Bb: { pc: 10, quality: "major" },
  B: { pc: 11, quality: "major" },

  // Minor
  Am: { pc: 9, quality: "minor" },
  "A#m": { pc: 10, quality: "minor" },
  Bbm: { pc: 10, quality: "minor" },
  Bm: { pc: 11, quality: "minor" },
  Cm: { pc: 0, quality: "minor" },
  "C#m": { pc: 1, quality: "minor" },
  Dbm: { pc: 1, quality: "minor" },
  Dm: { pc: 2, quality: "minor" },
  "D#m": { pc: 3, quality: "minor" },
  Ebm: { pc: 3, quality: "minor" },
  Em: { pc: 4, quality: "minor" },
  Fm: { pc: 5, quality: "minor" },
  "F#m": { pc: 6, quality: "minor" },
  Gbm: { pc: 6, quality: "minor" },
  Gm: { pc: 7, quality: "minor" },
  "G#m": { pc: 8, quality: "minor" },
  Abm: { pc: 8, quality: "minor" },
};

export function getKeyIdentity(key: string): string | null {
  const entry = KEY_TO_PITCH_CLASS[key];
  if (!entry) return null;
  return `${entry.pc}-${entry.quality}`;
}

export function areEquivalentKeys(a: string, b: string): boolean {
  const aId = getKeyIdentity(a);
  const bId = getKeyIdentity(b);
  return aId !== null && aId === bId;
}
