"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Progression } from "@/lib/music-data";
import {
  getNotePosition,
  KEYBOARD_WIDTH,
  WHITE_KEY_WIDTH,
  WHITE_KEYS,
} from "@/lib/virtual-piano";
import { VirtualPiano } from "./virtual-piano";
import { areEquivalentKeys } from "@/lib/key-identity";

interface PianoWithRhythmProps {
  progression: Progression;
  currentChordIndex: number;
  isPlaying: boolean;
  tempo: number;
  chordName: string;
  onChordChange: (index: number) => void;
}

interface FallingNote {
  id: string;
  note: { note: string; octave: number };
  y: number;
  hit: boolean;
  chordIndex: number;
}

// Chord to notes mapping with octave info
function getChordNotes(chordName: string): { note: string; octave: number }[] {
  const noteMap: Record<string, { note: string; octave: number }[]> = {
    C: [
      {
        note: "C",
        octave: 4,
      },
      {
        note: "E",
        octave: 4,
      },
      {
        note: "G",
        octave: 4,
      },
    ],
    G: [
      {
        note: "G",
        octave: 4,
      },
      {
        note: "B",
        octave: 4,
      },
      {
        note: "D",
        octave: 5,
      },
    ],
    Am: [
      {
        note: "A",
        octave: 4,
      },
      {
        note: "C",
        octave: 5,
      },
      {
        note: "E",
        octave: 5,
      },
    ],
    F: [
      {
        note: "F",
        octave: 4,
      },
      {
        note: "A",
        octave: 4,
      },
      {
        note: "C",
        octave: 5,
      },
    ],
    Dm: [
      {
        note: "D",
        octave: 4,
      },
      {
        note: "F",
        octave: 4,
      },
      {
        note: "A",
        octave: 4,
      },
    ],
    Em: [
      {
        note: "E",
        octave: 4,
      },
      {
        note: "G",
        octave: 4,
      },
      {
        note: "B",
        octave: 4,
      },
    ],
    D: [
      {
        note: "D",
        octave: 4,
      },
      {
        note: "F#",
        octave: 4,
      },
      {
        note: "A",
        octave: 4,
      },
    ],
    A: [
      {
        note: "A",
        octave: 4,
      },
      {
        note: "C#",
        octave: 5,
      },
      {
        note: "E",
        octave: 5,
      },
    ],
  };

  return (
    noteMap[chordName] || [
      {
        note: "C",
        octave: 4,
      },
      {
        note: "E",
        octave: 4,
      },
      {
        note: "G",
        octave: 4,
      },
    ]
  );
}

export function PianoWithRhythm({
  progression,
  currentChordIndex,
  isPlaying,
  tempo,
  chordName,
  onChordChange,
}: PianoWithRhythmProps) {
  const [notes, setNotes] = useState<FallingNote[]>([]);
  const [notesInHitZone, setNotesInHitZone] = useState<
    { note: string; octave: number }[]
  >([]);
  const animationRef = useRef<number | undefined>(undefined);
  const noteIdRef = useRef(0);

  const upcomingChordRef = useRef(0);

  const currentChordNotes = getChordNotes(chordName);

  const isHighlighted = useCallback(
    (note: string) => {
      if (!isPlaying) {
        return currentChordNotes.some((currentChordNote) => {
          const fullCurrentChordNote = `${currentChordNote.note}${currentChordNote.octave}`;
          return areEquivalentKeys(fullCurrentChordNote, note);
        });
      }
      return notesInHitZone.some((noteInHitZone) => {
        const fullNoteInHitZone = `${noteInHitZone.note}${noteInHitZone.octave}`;
        return areEquivalentKeys(fullNoteInHitZone, note);
      });
    },
    [notesInHitZone, isPlaying, currentChordNotes],
  );

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
  const checkNoteHit = useCallback((noteToCheck: string) => {
    const hitZoneTop = 240;
    const hitZoneBottom = 300;

    setNotes((prev) => {
      const updated = [...prev];
      const noteIndex = updated.findIndex((n) => {
        const fullNote = `${n.note.note}${n.note.octave}`;
        return (
          fullNote === noteToCheck &&
          !n.hit &&
          n.y >= hitZoneTop &&
          n.y <= hitZoneBottom
        );
      });
      if (noteIndex !== -1) {
        updated[noteIndex].hit = true;
      }
      return updated;
    });
  }, []);

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
          <div style={{ width: KEYBOARD_WIDTH }} className="relative">
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

              {!isPlaying &&
                currentChordNotes.map((note, idx) => {
                  const pos = getNotePosition(note.note, note.octave);
                  if (!pos) return null;

                  return (
                    <div
                      key={`static-${note}`}
                      className={`absolute rounded-md flex items-center justify-center font-bold text-xs animate-bounce ${
                        pos.isBlack
                          ? "bg-chart-2 shadow-lg shadow-chart-2/50"
                          : "bg-primary shadow-lg shadow-primary/50"
                      }`}
                      style={{
                        left: pos.x + (pos.width - (pos.isBlack ? 28 : 40)) / 2,
                        width: pos.isBlack ? 28 : 40,
                        height: 40,
                        bottom: 50,
                        animationDelay: `${idx * 100}ms`,
                        animationDuration: "1.5s",
                      }}
                    >
                      <span className="text-primary-foreground">
                        {note.note}
                        {note.octave}
                      </span>
                    </div>
                  );
                })}

              {/* Falling notes - only shown when playing */}
              {isPlaying &&
                notes.map((note) => {
                  const pos = getNotePosition(note.note.note, note.note.octave);
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
                      <span className="text-primary-foreground">
                        {note.note.note}
                        {note.note.octave}
                      </span>
                    </div>
                  );
                })}

              {/* Current chord label */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-card rounded-full border border-border shadow-lg">
                <span className="text-sm font-semibold text-foreground">
                  {progression.chords[currentChordIndex]}
                </span>
              </div>

              {!isPlaying && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-secondary/50 rounded-full">
                  <span className="text-xs text-muted-foreground">
                    Press Play to start rhythm practice
                  </span>
                </div>
              )}
            </div>

            {/* Piano Keyboard */}
            <VirtualPiano
              isHighlighted={isHighlighted}
              onClickNote={checkNoteHit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
