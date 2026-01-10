"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Progression } from "@/lib/music-data";

interface PianoWithRhythmProps {
  progression: Progression;
  currentChordIndex: number;
  isPlaying: boolean;
  tempo: number;
  highlightedNotes: string[];
  chordName: string;
  onChordChange: (index: number) => void;
  onNotePlay: (note: string) => void;
}

interface FallingNote {
  id: string;
  note: string;
  y: number;
  hit: boolean;
  chordIndex: number;
}

const KEYBOARD_KEYS = [
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

const WHITE_KEYS = KEYBOARD_KEYS.filter((k) => !k.isBlack);
const WHITE_KEY_WIDTH = 48; // pixels
const BLACK_KEY_WIDTH = 32;

function getNotePosition(
  note: string,
): { x: number; width: number; isBlack: boolean } | null {
  const baseNote = note.replace(/[0-9]/g, "");

  // Find white key index for positioning
  let whiteKeyIndex = 0;
  for (let i = 0; i < KEYBOARD_KEYS.length; i++) {
    const key = KEYBOARD_KEYS[i];
    if (key.note === baseNote) {
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

// Chord to notes mapping with octave info
function getChordNotes(chordName: string): string[] {
  const noteMap: Record<string, string[]> = {
    C: ["C4", "E4", "G4"],
    G: ["G4", "B4", "D5"],
    Am: ["A4", "C5", "E5"],
    F: ["F4", "A4", "C5"],
    Dm: ["D4", "F4", "A4"],
    Em: ["E4", "G4", "B4"],
    D: ["D4", "F#4", "A4"],
    A: ["A4", "C#5", "E5"],
  };
  return noteMap[chordName] || ["C4", "E4", "G4"];
}

export function PianoWithRhythm({
  progression,
  currentChordIndex,
  isPlaying,
  tempo,
  highlightedNotes,
  chordName,
  onChordChange,
  onNotePlay,
}: PianoWithRhythmProps) {
  const [notes, setNotes] = useState<FallingNote[]>([]);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [notesInHitZone, setNotesInHitZone] = useState<string[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const noteIdRef = useRef(0);

  const upcomingChordRef = useRef(0);

  const totalWhiteKeys = WHITE_KEYS.length;
  const keyboardWidth = totalWhiteKeys * WHITE_KEY_WIDTH;

  const isHighlighted = useCallback(
    (note: string) => {
      return notesInHitZone.some((noteInHitZone) => noteInHitZone === note);
    },
    [notesInHitZone],
  );

  const isActive = useCallback(
    (note: string) => {
      return pressedKeys.has(note);
    },
    [pressedKeys],
  );

  const handleKeyPress = useCallback(
    (note: string) => {
      setPressedKeys((prev) => new Set(prev).add(note));
      onNotePlay(note);
    },
    [onNotePlay],
  );

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

  // Spawn and animate falling notes
  const spawnNotes = useCallback((chordIndex: number, chordName: string) => {
    const chordNotes = getChordNotes(chordName);
    const newNotes: FallingNote[] = chordNotes.map((note) => ({
      id: `${noteIdRef.current++}`,
      note,
      y: -50,
      hit: false,
      chordIndex,
    }));
    setNotes((prev) => [...prev, ...newNotes]);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setNotes([]);
      setNotesInHitZone([]);
      return;
    }

    const beatInterval = (60 / tempo) * 1000;
    const fallDistance = 310; // from y=-50 to hit zone at y=260
    const speed = 0.12 * (tempo / 80);
    const fallTime = fallDistance / speed; // milliseconds to fall

    let lastTime = performance.now();
    let timeSinceLastSpawn = beatInterval - fallTime; // Start offset so first note arrives on first beat

    upcomingChordRef.current = currentChordIndex;
    const firstChord = progression.chords[upcomingChordRef.current];
    spawnNotes(upcomingChordRef.current, firstChord);
    upcomingChordRef.current =
      (upcomingChordRef.current + 1) % progression.chords.length;

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      timeSinceLastSpawn += delta;

      if (timeSinceLastSpawn >= beatInterval) {
        timeSinceLastSpawn = 0;
        const chordName = progression.chords[upcomingChordRef.current];
        spawnNotes(upcomingChordRef.current, chordName);
        upcomingChordRef.current =
          (upcomingChordRef.current + 1) % progression.chords.length;
      }

      setNotes((prev) => {
        const updated = prev
          .map((note) => ({ ...note, y: note.y + delta * speed }))
          .filter((note) => note.y < 350);

        const hitZoneTop = 300;
        const hitZoneBottom = 350;
        const inZone = updated
          .filter((n) => !n.hit && n.y >= hitZoneTop && n.y <= hitZoneBottom)
          .map((n) => n.note);

        if (inZone.length > 0) {
          const firstNoteInZone = updated.find(
            (n) => !n.hit && n.y >= hitZoneTop && n.y <= hitZoneBottom,
          );
          if (
            firstNoteInZone &&
            firstNoteInZone.chordIndex !== currentChordIndex
          ) {
            onChordChange(firstNoteInZone.chordIndex);
          }
        }

        setNotesInHitZone(inZone);
        return updated;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [
    isPlaying,
    tempo,
    progression,
    currentChordIndex,
    onChordChange,
    spawnNotes,
  ]);

  // Handle clicking on a falling note lane (hit detection)
  const checkNoteHit = useCallback(
    (noteToCheck: string) => {
      const hitZoneTop = 240;
      const hitZoneBottom = 300;

      setNotes((prev) => {
        const updated = [...prev];
        const noteIndex = updated.findIndex(
          (n) =>
            n.note === noteToCheck &&
            !n.hit &&
            n.y >= hitZoneTop &&
            n.y <= hitZoneBottom,
        );
        if (noteIndex !== -1) {
          updated[noteIndex].hit = true;
          onNotePlay(updated[noteIndex].note);
        }
        return updated;
      });
    },
    [onNotePlay],
  );

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-foreground">Piano & Rhythm</h2>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">
              Playing: {chordName}
            </span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:block">
          Press A-K keys or click keys to play
        </span>
      </div>

      <div className="p-4 overflow-x-auto">
        <div className="flex justify-center">
          <div style={{ width: keyboardWidth }} className="relative">
            {/* Rhythm Lane - falling notes area */}
            <div className="relative h-70 bg-secondary/20 rounded-t-lg border-x border-t border-border/50 overflow-hidden">
              {/* Hit zone indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-primary/10 border-t-2 border-primary/50" />
              <div className="absolute bottom-5 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_var(--primary)]" />

              {/* Lane guides - one per white key */}
              {WHITE_KEYS.map((_, index) => (
                <div
                  key={index}
                  className="absolute top-0 bottom-0 border-r border-border/20"
                  style={{ left: (index + 1) * WHITE_KEY_WIDTH, width: 1 }}
                />
              ))}

              {/* Falling notes */}
              {notes.map((note) => {
                const pos = getNotePosition(note.note);
                if (!pos) return null;

                return (
                  <div
                    key={note.id}
                    className={`absolute rounded-md flex items-center justify-center font-bold text-xs transition-all ${
                      note.hit
                        ? "scale-125 opacity-0"
                        : pos.isBlack
                          ? "bg-chart-2 shadow-lg shadow-chart-2/50"
                          : "bg-primary shadow-lg shadow-primary/50"
                    }`}
                    style={{
                      left: pos.x + (pos.width - (pos.isBlack ? 28 : 40)) / 2,
                      width: pos.isBlack ? 28 : 40,
                      height: 40,
                      top: note.y,
                    }}
                  >
                    <span className="text-primary-foreground">{note.note}</span>
                  </div>
                );
              })}

              {/* Current chord label */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-card rounded-full border border-border shadow-lg">
                <span className="text-sm font-semibold text-foreground">
                  {progression.chords[currentChordIndex]}
                </span>
              </div>
            </div>

            {/* Piano Keyboard */}
            <div className="relative flex">
              {/* White keys */}
              {WHITE_KEYS.map((key, index) => {
                const fullNote = `${key.note}${key.octave}`;
                const highlighted = isHighlighted(fullNote);
                const active = isActive(fullNote);

                return (
                  <button
                    key={fullNote}
                    onClick={() => {
                      handleKeyPress(fullNote);
                      checkNoteHit(fullNote);
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
              {KEYBOARD_KEYS.filter((k) => k.isBlack).map((key) => {
                const fullNote = `${key.note}${key.octave}`;
                const highlighted = isHighlighted(fullNote);
                const active = isActive(fullNote);
                const pos = getNotePosition(key.note);
                if (!pos) return null;

                return (
                  <button
                    key={fullNote}
                    onClick={() => {
                      handleKeyPress(fullNote);
                      checkNoteHit(fullNote);
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
          </div>
        </div>
      </div>
    </div>
  );
}
