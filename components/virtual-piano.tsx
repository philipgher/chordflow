import {
  BLACK_KEY_WIDTH,
  BLACK_KEYS,
  getNotePosition,
  KEYBOARD_KEYS,
  WHITE_KEY_WIDTH,
  WHITE_KEYS,
} from "@/lib/virtual-piano";
import { useCallback, useEffect, useState } from "react";

export const VirtualPiano = ({
  isHighlighted,
  onClickNote,
}: {
  isHighlighted?: (note: string) => boolean;
  onClickNote?: (note: string) => void;
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const handleKeyPress = useCallback((note: string) => {
    setPressedKeys((prev) => new Set(prev).add(note));
  }, []);

  const handleKeyRelease = useCallback((note: string) => {
    setPressedKeys((prev) => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const keyMap: Record<string, string> = {
      a: "C4",
      w: "C#4",
      s: "D4",
      e: "D#4",
      d: "E4",
      f: "F4",
      t: "F#4",
      g: "G4",
      y: "G#4",
      h: "A4",
      u: "A#4",
      j: "B4",
      k: "C5",
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const note = keyMap[e.key.toLowerCase()];
      if (note && !pressedKeys.has(note)) {
        handleKeyPress(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = keyMap[e.key.toLowerCase()];
      if (note && !pressedKeys.has(note)) {
        handleKeyRelease(note);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress, handleKeyRelease, pressedKeys]);

  const isActive = useCallback(
    (note: string) => {
      return pressedKeys.has(note);
    },
    [pressedKeys],
  );

  return (
    <div className="relative flex">
      {/* White keys */}
      {WHITE_KEYS.map((key, index) => {
        const fullNote = `${key.note}${key.octave}`;
        const highlighted = isHighlighted?.(fullNote);
        const active = isActive(fullNote);

        return (
          <button
            key={fullNote}
            onClick={() => {
              handleKeyPress(fullNote);
              onClickNote?.(fullNote);
            }}
            className={`
              relative h-36 border border-border rounded-b-lg
              transition-all duration-100 flex flex-col items-center justify-end pb-2
              ${
                highlighted
                  ? active
                    ? "bg-primary shadow-[0_0_20px_var(--primary)]"
                    : "bg-primary/30 hover:bg-primary/40"
                  : active
                    ? "bg-muted"
                    : "bg-foreground hover:bg-foreground/90"
              }
              ${active ? "translate-y-1" : ""}
            `}
            style={{ width: WHITE_KEY_WIDTH }}
            aria-label={`Play ${fullNote}`}
          >
            <span
              className={`text-xs font-medium ${highlighted ? "text-primary-foreground" : "text-background"}`}
            >
              {key.note}
            </span>
            {highlighted && (
              <span className="absolute top-2 w-2 h-2 rounded-full bg-primary-foreground" />
            )}
          </button>
        );
      })}

      {/* Black keys */}
      {BLACK_KEYS.map((key) => {
        const fullNote = `${key.note}${key.octave}`;
        const highlighted = isHighlighted?.(fullNote);
        const active = isActive(fullNote);
        const pos = getNotePosition(key.note, key.octave);
        if (!pos) return null;

        return (
          <button
            key={fullNote}
            onClick={() => {
              handleKeyPress(fullNote);
              onClickNote?.(fullNote);
            }}
            className={`
              absolute h-24 rounded-b-md z-10
              transition-all duration-100 flex flex-col items-center justify-end pb-1
              ${
                highlighted
                  ? active
                    ? "bg-primary shadow-[0_0_15px_var(--primary)]"
                    : "bg-primary/60 hover:bg-primary/70"
                  : active
                    ? "bg-muted"
                    : "bg-background hover:bg-muted border border-border"
              }
              ${active ? "translate-y-1" : ""}
            `}
            style={{
              left: pos.x,
              width: BLACK_KEY_WIDTH,
            }}
            aria-label={`Play ${fullNote}`}
          >
            <span
              className={`text-[10px] font-medium ${highlighted ? "text-primary-foreground" : "text-foreground"}`}
            >
              {key.note}
            </span>
            {highlighted && (
              <span className="absolute top-2 w-1.5 h-1.5 rounded-full bg-primary-foreground" />
            )}
          </button>
        );
      })}
    </div>
  );
};
