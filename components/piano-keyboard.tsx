"use client";

import { Note } from "@/lib/music-data";
import { useCallback, useEffect, useState } from "react";

interface PianoKeyboardProps {
  activeNotes: string[];
  highlightedNotes: string[];
  onNotePlay: (note: Note) => void;
  chordName: string;
}

const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_KEYS = ["C#", "D#", null, "F#", "G#", "A#", null];
const OCTAVES = [3, 4, 5];

export function PianoKeyboard({
  activeNotes,
  highlightedNotes,
  onNotePlay,
  chordName,
}: PianoKeyboardProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const isHighlighted = useCallback(
    (note: Note) => {
      const baseNote = note.replace(/[0-9]/g, "");
      return highlightedNotes.some((n) => n.replace(/[0-9]/g, "") === baseNote);
    },
    [highlightedNotes],
  );

  const isActive = useCallback(
    (note: Note) => {
      return activeNotes.includes(note) || pressedKeys.has(note);
    },
    [activeNotes, pressedKeys],
  );

  const handleKeyPress = useCallback(
    (note: Note) => {
      setPressedKeys((prev) => new Set(prev).add(note));
      onNotePlay(note);

      setTimeout(() => {
        setPressedKeys((prev) => {
          const next = new Set(prev);
          next.delete(note);
          return next;
        });
      }, 200);
    },
    [onNotePlay],
  );

  // Keyboard shortcuts for playing
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

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress, pressedKeys]);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-foreground">Piano Keyboard</h2>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">
              Chord notes for {chordName}
            </span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:block">
          Press A-K keys to play
        </span>
      </div>

      <div className="p-4 overflow-x-auto">
        <div className="flex justify-center min-w-150">
          {OCTAVES.map((octave) => (
            <div key={octave} className="relative flex">
              {WHITE_KEYS.map((note, index) => {
                const fullNote = `${note}${octave}`;
                const highlighted = isHighlighted(fullNote);
                const active = isActive(fullNote);

                return (
                  <button
                    key={fullNote}
                    onClick={() => handleKeyPress(fullNote)}
                    className={`
                      relative w-10 sm:w-12 h-32 sm:h-40 border border-border rounded-b-lg
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
                      ${active ? "transform translate-y-1" : ""}
                    `}
                    aria-label={`Play ${fullNote}`}
                  >
                    <span
                      className={`text-xs font-medium ${highlighted ? "text-primary-foreground" : "text-background"}`}
                    >
                      {note}
                    </span>
                    {highlighted && (
                      <span className="absolute top-2 w-2 h-2 rounded-full bg-primary-foreground" />
                    )}
                  </button>
                );
              })}

              {/* Black keys */}
              <div className="absolute top-0 left-0 flex">
                {BLACK_KEYS.map((note, index) => {
                  if (!note)
                    return <div key={index} className="w-10 sm:w-12" />;

                  const fullNote = `${note}${octave}`;
                  const highlighted = isHighlighted(fullNote);
                  const active = isActive(fullNote);
                  const offset =
                    index < 2 ? (index + 1) * 40 - 14 : (index + 1) * 40 - 14;

                  return (
                    <button
                      key={fullNote}
                      onClick={() => handleKeyPress(fullNote)}
                      className={`
                        absolute w-6 sm:w-8 h-20 sm:h-24 rounded-b-md z-10
                        transition-all duration-100 flex flex-col items-center justify-end pb-1
                        ${
                          highlighted
                            ? active
                              ? "bg-primary shadow-[0_0_15px_var(--primary)]"
                              : "bg-primary/60 hover:bg-primary/70"
                            : active
                              ? "bg-muted"
                              : "bg-background hover:bg-muted"
                        }
                        ${active ? "transform translate-y-1" : ""}
                      `}
                      style={{ left: `${offset}px` }}
                      aria-label={`Play ${fullNote}`}
                    >
                      <span
                        className={`text-[10px] font-medium ${highlighted ? "text-primary-foreground" : "text-foreground"}`}
                      >
                        {note}
                      </span>
                      {highlighted && (
                        <span className="absolute top-2 w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
