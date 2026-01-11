export const KEYBOARD_KEYS = [
  { note: "C", octave: 4, isBlack: false },
  { note: "C#", octave: 4, isBlack: true },
  { note: "D", octave: 4, isBlack: false },
  { note: "D#", octave: 4, isBlack: true },
  { note: "E", octave: 4, isBlack: false },
  { note: "F", octave: 4, isBlack: false },
  { note: "F#", octave: 4, isBlack: true },
  { note: "G", octave: 4, isBlack: false },
  { note: "G#", octave: 4, isBlack: true },
  { note: "A", octave: 4, isBlack: false },
  { note: "A#", octave: 4, isBlack: true },
  { note: "B", octave: 4, isBlack: false },
  { note: "C", octave: 5, isBlack: false },
  { note: "C#", octave: 5, isBlack: true },
  { note: "D", octave: 5, isBlack: false },
  { note: "D#", octave: 5, isBlack: true },
  { note: "E", octave: 5, isBlack: false },
  { note: "F", octave: 5, isBlack: false },
  { note: "F#", octave: 5, isBlack: true },
  { note: "G", octave: 5, isBlack: false },
  { note: "G#", octave: 5, isBlack: true },
  { note: "A", octave: 5, isBlack: false },
  { note: "A#", octave: 5, isBlack: true },
  { note: "B", octave: 5, isBlack: false },
];

export const WHITE_KEYS = KEYBOARD_KEYS.filter((k) => !k.isBlack);
export const BLACK_KEYS = KEYBOARD_KEYS.filter((k) => k.isBlack);
export const WHITE_KEY_WIDTH = 48; // pixels
export const BLACK_KEY_WIDTH = 32;

export const TOTAL_WHITE_KEYS = WHITE_KEYS.length;
export const KEYBOARD_WIDTH = TOTAL_WHITE_KEYS * WHITE_KEY_WIDTH;

export function getNotePosition(
  note: string,
  octave: number,
): { x: number; width: number; isBlack: boolean } | null {
  // Find white key index for positioning
  let whiteKeyIndex = 0;
  for (let i = 0; i < KEYBOARD_KEYS.length; i++) {
    const key = KEYBOARD_KEYS[i];
    if (key.note === note && key.octave === octave) {
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
