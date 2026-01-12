"use client";

import type React from "react";

import { useState, useCallback, useEffect, useRef, act } from "react";
import { useInterval } from "usehooks-ts";
import { CHORD_DATA, ChordData, Note, PROGRESSIONS } from "@/lib/music-data";
import { SheetMusic } from "../sheet-music";
import {
  ArrowRight,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Layers,
  Music2,
  Hand,
  Sparkles,
  ArrowDown,
} from "lucide-react";
import { VirtualPiano } from "../virtual-piano";
import { areEquivalentKeys } from "@/lib/key-identity";
import { log } from "console";

interface ProgressionsTabProps {
  unlockedProgressions: string[];
  onProgressionUnlocked: (progression: string) => void;
}

type PlayingPattern = "block" | "arpeggio" | "bass-chord" | "broken";

const PATTERNS: {
  id: PlayingPattern;
  name: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "block",
    name: "Block",
    description: "All notes together",
    icon: <Layers className="w-4 h-4" />,
  },
  {
    id: "arpeggio",
    name: "Arpeggio",
    description: "Roll through notes",
    icon: <Music2 className="w-4 h-4" />,
  },
  {
    id: "bass-chord",
    name: "Bass + Chord",
    description: "Root then upper notes",
    icon: <Hand className="w-4 h-4" />,
  },
  {
    id: "broken",
    name: "Broken",
    description: "1-5-8-5 pattern",
    icon: <Sparkles className="w-4 h-4" />,
  },
];

export function ProgressionsTab() {
  const [selectedProgression, setSelectedProgression] = useState("I-V-vi-IV");
  const [isPlaying, setIsPlaying] = useState(false);

  const [tempo, setTempo] = useState(60); // BPM for transitions
  const [pattern, setPattern] = useState<PlayingPattern>("block");

  // Pattern step for animation (for arpeggio, broken, bass-chord)
  const [patternStep, setPatternStep] = useState(0);

  const progression = PROGRESSIONS[selectedProgression];
  const [chordIndex, setChordIndex] = useState(0);
  const chordName = progression.chords[chordIndex];
  const chordToPlay = CHORD_DATA[chordName];

  // Refs to avoid stale closures and double-advance
  const isPlayingRef = useRef(isPlaying);
  const chordIndexRef = useRef(chordIndex);
  const patternStepRef = useRef(patternStep);

  // Guard against double-calls in the same interval tick
  const lastAdvanceTickRef = useRef<number | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    chordIndexRef.current = chordIndex;
  }, [chordIndex]);

  useEffect(() => {
    patternStepRef.current = patternStep;
  }, [patternStep]);

  const manualAdvance = useCallback(
    (tickId?: number) => {
      // If called from interval, guard against double-call in same tick
      if (typeof tickId === "number") {
        if (lastAdvanceTickRef.current === tickId) {
          return; // already advanced for this tick
        }
        lastAdvanceTickRef.current = tickId;
      }

      console.log("ADVANCE CHORD", { tickId });

      setChordIndex((prev) => {
        const next = (prev + 1) % progression.chords.length;
        chordIndexRef.current = next;
        return next;
      });
      setPatternStep(0);
      patternStepRef.current = 0;
    },
    [progression.chords.length],
  );

  // Interval delay in ms for the current pattern (null = no interval)
  const patternDelay: number | null = (() => {
    // if (!isPlaying) return null;
    if (pattern === "block") return null;

    const patternLength = chordToPlay.notes.length;
    const stepDuration = 60000 / tempo / patternLength; // ms per step
    return stepDuration;
  })();

  // Internal counter to identify each tick uniquely
  const tickIdRef = useRef(0);

  // Advance pattern steps and chords using useInterval from usehooks-ts
  useInterval(() => {
    // If not playing or in block pattern, do nothing
    if (!isPlayingRef.current || pattern === "block") {
      return;
    }

    const tickId = ++tickIdRef.current;

    const currentChordIdx = chordIndexRef.current;
    const currentChordName = progression.chords[currentChordIdx];
    const currentChord = CHORD_DATA[currentChordName];
    const patternLength = currentChord.notes.length;

    const nextStep = patternStepRef.current + 1;

    if (nextStep >= patternLength) {
      // End of pattern -> advance chord, reset step
      manualAdvance(tickId);
    } else {
      // Just bump the pattern step
      setPatternStep((prev) => {
        const updated = prev + 1;
        patternStepRef.current = updated;
        return updated;
      });
    }
  }, patternDelay);

  const handleProgressionSelect = useCallback((key: string) => {
    setSelectedProgression(key);
    setChordIndex(0);
    setIsPlaying(false);
  }, []);

  const togglePlay = () => setIsPlaying((prev) => !prev);

  const resetLoop = () => {
    setChordIndex(0);
    setPatternStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Progression selector - compact */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-foreground mb-3">
          Choose a Progression
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PROGRESSIONS).map(([key, prog]) => {
            const isSelected = selectedProgression === key;

            return (
              <button
                key={key}
                onClick={() => handleProgressionSelect(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-muted"
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loop selector */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-foreground mb-3">
          Select Chords to Loop
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Pick any two chords from the progression to practice transitioning
          between them
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Chord:</span>
            <div className="flex gap-1">
              {progression.chords.map((chord, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setChordIndex(i);
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    chordIndex === i
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-muted"
                  }`}
                >
                  {chord}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Playing patterns */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-foreground mb-3">Playing Pattern</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Explore different ways to voice and play the chords
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PATTERNS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPattern(p.id);
                setPatternStep(0);
              }}
              className={`p-3 rounded-lg text-left transition-all ${
                pattern === p.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {p.icon}
                <span className="font-medium text-sm">{p.name}</span>
              </div>
              <p
                className={`text-xs ${pattern === p.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}
              >
                {p.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main transition view */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Transition Practice</h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {(() => {
            // Determine pattern length for current pattern
            const patternLength = pattern === "broken" ? 4 : 3;
            const totalSteps = pattern === "block" ? 1 : patternLength * 2;

            return (
              <MiniKeyboard
                pattern={pattern}
                patternStep={patternStep}
                chord={chordToPlay}
                chordName={chordName}
                isActive={true}
                // movingNotes={movingFromCurrent}
              />
            );
          })()}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              {isPlaying ? "Pause" : "Auto Loop"}
            </button>

            <button
              onClick={manualAdvance}
              className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-lg font-medium hover:bg-muted transition-colors"
            >
              <SkipForward className="w-5 h-5" />
              Next Chord
            </button>

            <button
              onClick={resetLoop}
              className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-lg font-medium hover:bg-muted transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Speed:</span>
            <input
              type="range"
              min={30}
              max={120}
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              className="w-32 accent-primary"
            />
            <span className="text-sm font-medium w-16">{tempo} BPM</span>
          </div>
        </div>
      </div>

      {/* Sheet music comparison */}
      <div className="grid grid-cols-1 gap-4">
        <div className={`transition-all`}>
          <SheetMusic chord={chordToPlay} chordName={chordName} />
        </div>
      </div>

      {/* Voice leading insight */}
      {/*<div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-foreground mb-3">Voice Leading</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeChord.notes.map((note, i) => {
            const targetNote = nextChord.notes[i] || nextChord.notes[0];
            const isCommon = note === targetNote;

            return (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-lg font-bold ${currentChord === "A" ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {activeChord.notes[i].key}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({activeChord.intervals[i]?.name || "note"})
                  </span>
                </div>

                <ArrowRight
                  className={`w-4 h-4 ${isCommon ? "text-green-500" : "text-amber-500"}`}
                />

                <div className="flex items-center gap-2">
                  <span
                    className={`text-lg font-bold ${currentChord === "B" ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {nextChord.notes[i].key || "—"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({nextChord.intervals[i]?.name || "—"})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>*/}
    </div>
  );
}

// Mini keyboard component for transition view
// Accepts stepOffset to allow each keyboard to use a different step
const MiniKeyboard = ({
  pattern,
  patternStep,
  chord,
  chordName,
  isActive,
  stepOffset = 0,
  patternLengthOverride,
}: {
  pattern: PlayingPattern;
  patternStep: number;
  chord: typeof chordA;
  chordName: string;
  isActive: boolean;
  stepOffset?: number;
  patternLengthOverride?: number;
}) => {
  // Accepts an optional stepOverride to allow offsetting the step for each keyboard
  const getActivePatternNotes = (
    note: Note,
    chord: ChordData,
    stepOverride?: number,
  ): boolean => {
    const step = typeof stepOverride === "number" ? stepOverride : patternStep;
    if (pattern === "block") {
      return (
        chord.notes.find((activeChordNote) =>
          areEquivalentKeys(activeChordNote, note),
        ) !== undefined
      );
    }
    if (pattern === "arpeggio") {
      return areEquivalentKeys(note, chord.notes[step % chord.notes.length]);
    }
    if (pattern === "bass-chord") {
      if (step === 0) {
        return areEquivalentKeys(note, chord.notes[0]);
      }
      const chordNotes = chord.notes.slice(1);
      return chordNotes.some((chordNote) => areEquivalentKeys(note, chordNote));
    }
    if (pattern === "broken") {
      // 1-5-8-5 pattern (root, fifth, octave, fifth)
      const patternNotes = [0, 2, 0, 2]; // indices
      return areEquivalentKeys(note, chord.notes[patternNotes[step]]);
    }
    return (
      chord.notes.find((activeChordNote) =>
        areEquivalentKeys(activeChordNote, note),
      ) !== undefined
    );
  };
  return (
    <div
      className={`rounded-xl border p-4 transition-all mx-auto ${isActive ? "bg-card border-primary shadow-lg shadow-primary/20" : "bg-secondary/50 border-border"}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-lg font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}
        >
          {chordName}
        </span>
        <span className="text-sm text-muted-foreground">{chord.fullName}</span>
      </div>

      <VirtualPiano
        isHighlighted={(note: Note) =>
          getActivePatternNotes(
            note,
            chord,
            // Only offset for non-block patterns
            pattern === "block"
              ? undefined
              : (patternStep + stepOffset) % (patternLengthOverride ?? 3),
          )
        }
      />
    </div>
  );
};
