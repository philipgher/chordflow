import { areEquivalentKeys } from "./key-identity";
import { Keys, Note } from "./music-data";

export const KEYBOARD_KEYS: {
  key: Keys;
  octave: number;
  isBlack: boolean;
}[] = [
  { key: "C", octave: 4, isBlack: false },
  { key: "C#", octave: 4, isBlack: true },
  { key: "D", octave: 4, isBlack: false },
  { key: "D#", octave: 4, isBlack: true },
  { key: "E", octave: 4, isBlack: false },
  { key: "F", octave: 4, isBlack: false },
  { key: "F#", octave: 4, isBlack: true },
  { key: "G", octave: 4, isBlack: false },
  { key: "G#", octave: 4, isBlack: true },
  { key: "A", octave: 4, isBlack: false },
  { key: "A#", octave: 4, isBlack: true },
  { key: "B", octave: 4, isBlack: false },
  { key: "C", octave: 5, isBlack: false },
  { key: "C#", octave: 5, isBlack: true },
  { key: "D", octave: 5, isBlack: false },
  { key: "D#", octave: 5, isBlack: true },
  { key: "E", octave: 5, isBlack: false },
  { key: "F", octave: 5, isBlack: false },
  { key: "F#", octave: 5, isBlack: true },
  { key: "G", octave: 5, isBlack: false },
  { key: "G#", octave: 5, isBlack: true },
  { key: "A", octave: 5, isBlack: false },
  { key: "A#", octave: 5, isBlack: true },
  { key: "B", octave: 5, isBlack: false },
];

export const WHITE_KEYS = KEYBOARD_KEYS.filter((k) => !k.isBlack);
export const BLACK_KEYS = KEYBOARD_KEYS.filter((k) => k.isBlack);
export const WHITE_KEY_WIDTH = 48; // pixels
export const BLACK_KEY_WIDTH = 32;

export const TOTAL_WHITE_KEYS = WHITE_KEYS.length;
export const KEYBOARD_WIDTH = TOTAL_WHITE_KEYS * WHITE_KEY_WIDTH;

export function getNotePosition(note: Note): {
  x: number;
  width: number;
  isBlack: boolean;
} | null {
  // Find white key index for positioning
  let whiteKeyIndex = 0;
  for (let i = 0; i < KEYBOARD_KEYS.length; i++) {
    const key = KEYBOARD_KEYS[i];
    if (areEquivalentKeys(key, note)) {
      if (key.isBlack) {
        // Black key position: between the previous and next white keys
        return {
          x: whiteKeyIndex * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2,
          width: BLACK_KEY_WIDTH,
          isBlack: true,
        };
      } else {
        return {
          x: whiteKeyIndex * WHITE_KEY_WIDTH,
          width: WHITE_KEY_WIDTH,
          isBlack: false,
        };
      }
    }
    if (!key.isBlack) {
      whiteKeyIndex++;
    }
  }
  return null;
}
