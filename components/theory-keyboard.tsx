"use client";

import { useState, useCallback } from "react";
import type { ChordData } from "@/lib/music-data";

interface TheoryKeyboardProps {
  chord: ChordData;
  chordName: string;
}

const PIANO_KEYS = [
  { note: "C", type: "white", offset: 0 },
  { note: "C#", type: "black", offset: 0 },
  { note: "D", type: "white", offset: 1 },
  { note: "D#", type: "black", offset: 1 },
  { note: "E", type: "white", offset: 2 },
  { note: "F", type: "white", offset: 3 },
  { note: "F#", type: "black", offset: 3 },
  { note: "G", type: "white", offset: 4 },
  { note: "G#", type: "black", offset: 4 },
  { note: "A", type: "white", offset: 5 },
  { note: "A#", type: "black", offset: 5 },
  { note: "B", type: "white", offset: 6 },
];

const WHITE_KEY_WIDTH = 60;
const BLACK_KEY_WIDTH = 36;

export function TheoryKeyboard({ chord, chordName }: TheoryKeyboardProps) {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const whiteKeys = PIANO_KEYS.filter((k) => k.type === "white");
  const blackKeys = PIANO_KEYS.filter((k) => k.type === "black");
  const totalWidth = whiteKeys.length * WHITE_KEY_WIDTH;

  const isChordNote = (note: string) => {
    return chord.notes.some(
      (n) => n === note || n === note.replace("#", "") || note === n + "#",
    );
  };

  const handleKeyClick = useCallback((note: string) => {
    setActiveKeys((prev) => [...prev, note]);
    setTimeout(() => {
      setActiveKeys((prev) => prev.filter((n) => n !== note));
    }, 200);
  }, []);

  const getKeyPosition = (key: (typeof PIANO_KEYS)[0]) => {
    if (key.type === "white") {
      const whiteIndex = whiteKeys.findIndex((k) => k.note === key.note);
      return whiteIndex * WHITE_KEY_WIDTH;
    } else {
      return (
        key.offset * WHITE_KEY_WIDTH + WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2
      );
    }
  };

  const getNoteLabel = (note: string) => {
    const index = chord.notes.indexOf(note);
    if (index === -1) return null;
    const labels = ["Root", "3rd", "5th", "7th"];
    return labels[index];
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Interactive Keyboard</h3>
        <p className="text-sm text-muted-foreground">
          Click or tap the highlighted keys to hear the chord
        </p>
      </div>

      {/* Floating chord notes indicator */}
      <div
        className="relative mb-4"
        style={{ width: totalWidth, margin: "0 auto" }}
      >
        <div className="h-16 relative">
          {PIANO_KEYS.map((key) => {
            if (!isChordNote(key.note)) return null;
            const x = getKeyPosition(key);
            const width =
              key.type === "white" ? WHITE_KEY_WIDTH : BLACK_KEY_WIDTH;
            const label = getNoteLabel(key.note);

            return (
              <div
                key={key.note}
                className="absolute flex flex-col items-center animate-bounce"
                style={{
                  left: x,
                  width: width,
                  animationDuration: "2s",
                }}
              >
                <div className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-bold shadow-lg shadow-primary/30">
                  {key.note}
                </div>
                {label && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Piano keyboard */}
      <div
        className="relative mx-auto"
        style={{ width: totalWidth, height: 180 }}
      >
        {/* White keys */}
        {whiteKeys.map((key, i) => {
          const isInChord = isChordNote(key.note);
          const isActive = activeKeys.includes(key.note);

          return (
            <button
              key={key.note}
              onClick={() => handleKeyClick(key.note)}
              className={`
                absolute top-0 border border-border rounded-b-lg transition-all
                ${
                  isActive
                    ? "bg-primary shadow-lg shadow-primary/50"
                    : isInChord
                      ? "bg-primary/30 hover:bg-primary/40"
                      : "bg-white hover:bg-gray-100"
                }
              `}
              style={{
                left: i * WHITE_KEY_WIDTH,
                width: WHITE_KEY_WIDTH - 2,
                height: 180,
              }}
            >
              <span
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-medium ${
                  isInChord ? "text-primary" : "text-gray-400"
                }`}
              >
                {key.note}
              </span>
            </button>
          );
        })}

        {/* Black keys */}
        {blackKeys.map((key) => {
          const isInChord = isChordNote(key.note);
          const isActive = activeKeys.includes(key.note);
          const x = getKeyPosition(key);

          return (
            <button
              key={key.note}
              onClick={() => handleKeyClick(key.note)}
              className={`
                absolute top-0 rounded-b-lg z-10 transition-all
                ${
                  isActive
                    ? "bg-primary shadow-lg shadow-primary/50"
                    : isInChord
                      ? "bg-primary/80 hover:bg-primary"
                      : "bg-gray-900 hover:bg-gray-800"
                }
              `}
              style={{
                left: x,
                width: BLACK_KEY_WIDTH,
                height: 110,
              }}
            />
          );
        })}
      </div>

      {/* Interval visualization */}
      <div className="mt-6 flex justify-center gap-8">
        {chord.intervals.map((interval, i) => (
          <div key={i} className="text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <span className="text-lg font-bold text-primary">
                {chord.notes[i]}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">{interval.name}</div>
            <div className="text-xs text-primary">
              {interval.semitones} semitones
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
