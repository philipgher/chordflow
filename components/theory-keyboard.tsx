"use client";

import type { ChordData } from "@/lib/music-data";
import { areEquivalentKeys } from "@/lib/key-identity";
import {
  getNotePosition,
  KEYBOARD_KEYS,
  KEYBOARD_WIDTH,
} from "@/lib/virtual-piano";
import { VirtualPiano } from "./virtual-piano";

interface TheoryKeyboardProps {
  chord: ChordData;
}

export function TheoryKeyboard({ chord }: TheoryKeyboardProps) {
  const findChordNote = (noteInKeyboard: string) => {
    return chord.notes.find((chordNote) =>
      areEquivalentKeys(chordNote, noteInKeyboard),
    );
  };

  const getNoteLabel = (note: string) => {
    const index = chord.notes.findIndex((chordNote) =>
      areEquivalentKeys(chordNote, note),
    );
    if (index === -1) return null;
    const labels = ["Root", "3rd", "5th", "7th"];
    return labels[index];
  };

  const isHighlighted = (note: string) => {
    return (
      chord.notes.find((chordNote) => areEquivalentKeys(chordNote, note)) !==
      undefined
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Interactive Keyboard</h3>
        <p className="text-sm text-muted-foreground">
          Click or tap the highlighted keys to hear the chord
        </p>
      </div>

      <div className="flex justify-center">
        <div style={{ width: KEYBOARD_WIDTH }} className="relative">
          {/* Floating chord notes indicator */}
          <div
            className="relative mb-4"
            style={{ width: KEYBOARD_WIDTH, margin: "0 auto" }}
          >
            <div className="h-16 relative">
              {KEYBOARD_KEYS.map((key) => {
                const chordNote = findChordNote(key.note);
                if (!chordNote) return null;

                const notePosition = getNotePosition(key.note, key.octave);
                if (!notePosition) return null;

                const label = getNoteLabel(key.note);

                return (
                  <div
                    key={key.note + key.octave}
                    className="absolute flex flex-col items-center animate-bounce"
                    style={{
                      left: notePosition.x,
                      width: notePosition.width,
                      animationDuration: "2s",
                    }}
                  >
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-bold shadow-lg shadow-primary/30">
                      {chordNote}
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
          <VirtualPiano
            isHighlighted={isHighlighted}
            // onClickNote={handleKeyClick}
          />
        </div>
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
