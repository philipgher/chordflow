import { Note } from "@/lib/music-data";
import {
  BLACK_KEY_WIDTH,
  BLACK_KEYS,
  getNotePosition,
  WHITE_KEY_WIDTH,
  WHITE_KEYS,
} from "@/lib/virtual-piano";
import { useCallback, useEffect, useState } from "react";

export const VirtualPiano = ({
  isHighlighted,
  onClickNote,
}: {
  isHighlighted?: (note: Note) => boolean;
  onClickNote?: (note: Note) => void;
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<Note>>(new Set());

  const handleKeyPress = useCallback((note: Note) => {
    setPressedKeys((prev) => new Set(prev).add(note));
  }, []);

  const handleKeyRelease = useCallback((note: Note) => {
    setPressedKeys((prev) => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const keyMap: Record<string, Note> = {
      a: {
        key: "C",
        octave: 4,
      },
      w: {
        key: "C#",
        octave: 4,
      },
      s: {
        key: "D",
        octave: 4,
      },
      e: {
        key: "D#",
        octave: 4,
      },
      d: {
        key: "E",
        octave: 4,
      },
      f: {
        key: "F",
        octave: 4,
      },
      t: {
        key: "F#",
        octave: 4,
      },
      g: {
        key: "G",
        octave: 4,
      },
      y: {
        key: "G#",
        octave: 4,
      },
      h: {
        key: "A",
        octave: 4,
      },
      u: {
        key: "A#",
        octave: 4,
      },
      j: {
        key: "B",
        octave: 4,
      },
      k: {
        key: "C",
        octave: 5,
      },
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
    (note: Note) => {
      return pressedKeys.has(note);
    },
    [pressedKeys],
  );

  return (
    <div className="relative flex">
      {/* White keys */}
      {WHITE_KEYS.map((key, index) => {
        const highlighted = isHighlighted?.(key);
        const active = isActive(key);

        return (
          <button
            key={key.key + key.octave}
            onClick={() => {
              handleKeyPress(key);
              onClickNote?.(key);
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
            aria-label={`Play ${key.key}${key.octave}`}
          >
            <span
              className={`text-xs font-medium ${highlighted ? "text-primary-foreground" : "text-background"}`}
            >
              {key.key}
            </span>
            {highlighted && (
              <span className="absolute top-2 w-2 h-2 rounded-full bg-primary-foreground" />
            )}
          </button>
        );
      })}

      {/* Black keys */}
      {BLACK_KEYS.map((key) => {
        const highlighted = isHighlighted?.(key);
        const active = isActive(key);
        const pos = getNotePosition(key);
        if (!pos) return null;

        return (
          <button
            key={key.key + key.octave}
            onClick={() => {
              handleKeyPress(key);
              onClickNote?.(key);
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
            aria-label={`Play ${key.key}${key.octave}`}
          >
            <span
              className={`text-[10px] font-medium ${highlighted ? "text-primary-foreground" : "text-foreground"}`}
            >
              {key.key}
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
