"use client";

import { useState, useCallback } from "react";
import { CHORD_DATA } from "@/lib/music-data";
import { ChordTheoryPanel } from "../chord-theory-panel";
import { SheetMusic } from "../sheet-music";
import { TheoryKeyboard } from "../theory-keyboard";
import { CircleOfFifths } from "../circle-of-fifths";
import { Lock, CheckCircle2, Sparkles } from "lucide-react";

interface TheoryTabProps {
  unlockedChords: string[];
  masteredChords: string[];
  onChordMastered: (chord: string) => void;
  onChordUnlocked: (chord: string) => void;
}

const ALL_CHORDS = ["C", "G", "D", "A", "E", "F", "Am", "Em", "Dm"];

export function TheoryTab({
  unlockedChords,
  masteredChords,
  onChordMastered,
  onChordUnlocked,
}: TheoryTabProps) {
  const [selectedChord, setSelectedChord] = useState("C");
  const [showCircleOfFifths, setShowCircleOfFifths] = useState(false);

  const currentChord = CHORD_DATA[selectedChord];
  const isUnlocked = unlockedChords.includes(selectedChord);
  const isMastered = masteredChords.includes(selectedChord);

  const handleChordSelect = useCallback(
    (chord: string) => {
      if (unlockedChords.includes(chord)) {
        setSelectedChord(chord);
      }
    },
    [unlockedChords],
  );

  return (
    <div className="space-y-6">
      {/* Chord selector grid */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">
            Select a Chord to Study
          </h3>
          <button
            onClick={() => setShowCircleOfFifths(!showCircleOfFifths)}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            {showCircleOfFifths ? "Hide" : "Show"} Circle of Fifths
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {ALL_CHORDS.map((chord) => {
            const unlocked = unlockedChords.includes(chord);
            const mastered = masteredChords.includes(chord);
            const isSelected = selectedChord === chord;

            return (
              <button
                key={chord}
                onClick={() => handleChordSelect(chord)}
                disabled={!unlocked}
                className={`
                  relative p-3 rounded-lg font-medium text-sm transition-all
                  ${
                    !unlocked
                      ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                      : isSelected
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-secondary text-foreground hover:bg-muted"
                  }
                `}
              >
                {!unlocked && (
                  <Lock className="w-3 h-3 absolute top-1 right-1" />
                )}
                {mastered && (
                  <CheckCircle2 className="w-3 h-3 absolute top-1 right-1 text-green-500" />
                )}
                <span className="block text-lg">{chord}</span>
                <span className="block text-xs opacity-70">
                  {CHORD_DATA[chord]?.type || "chord"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Circle of Fifths (collapsible) */}
      {showCircleOfFifths && (
        <CircleOfFifths
          selectedChord={selectedChord}
          onChordSelect={handleChordSelect}
          unlockedChords={unlockedChords}
        />
      )}

      {/* Main content */}
      {isUnlocked && currentChord && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left: Theory info */}
          <div className="xl:col-span-1 space-y-4">
            <SheetMusic chord={currentChord} chordName={selectedChord} />
            <ChordTheoryPanel chord={currentChord} chordName={selectedChord} />

            {/* Practice button */}
            {!isMastered && (
              <button
                onClick={() => onChordMastered(selectedChord)}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Mark as Practiced
              </button>
            )}
          </div>

          {/* Right: Interactive keyboard */}
          <div className="xl:col-span-3">
            <TheoryKeyboard chord={currentChord} chordName={selectedChord} />
          </div>
        </div>
      )}

      {/* Learning tips */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-foreground mb-3">
          Theory Fundamentals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-1">Major vs Minor</h4>
            <p className="text-sm text-muted-foreground">
              Major chords sound bright and happy (4 semitones to 3rd). Minor
              chords sound sad and moody (3 semitones to 3rd).
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-1">
              Building Triads
            </h4>
            <p className="text-sm text-muted-foreground">
              Every basic chord has 3 notes: Root, 3rd, and 5th. The distance
              between them defines the chord quality.
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-1">Relative Minor</h4>
            <p className="text-sm text-muted-foreground">
              Every major key has a relative minor (6th scale degree). C major's
              relative minor is Am - they share the same notes!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
