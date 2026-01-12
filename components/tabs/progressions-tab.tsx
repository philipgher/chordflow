"use client";

import type React from "react";

import { useState, useCallback, useEffect, useRef } from "react";
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

export function ProgressionsTab({
  unlockedProgressions,
  onProgressionUnlocked,
}: ProgressionsTabProps) {
  const [selectedProgression, setSelectedProgression] = useState("I-V-vi-IV");
  const [loopChordA, setLoopChordA] = useState(0);
  const [loopChordB, setLoopChordB] = useState(1);
  const [currentChord, setCurrentChord] = useState<"A" | "B">("A");
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(60); // BPM for transitions
  const [pattern, setPattern] = useState<PlayingPattern>("block");
  const [patternStep, setPatternStep] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const patternIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const progression = PROGRESSIONS[selectedProgression];
  const chordAName = progression.chords[loopChordA];
  const chordBName = progression.chords[loopChordB];
  const chordA = CHORD_DATA[chordAName];
  const chordB = CHORD_DATA[chordBName];

  const activeChordName = currentChord === "A" ? chordAName : chordBName;
  const activeChord = currentChord === "A" ? chordA : chordB;
  const nextChordName = currentChord === "A" ? chordBName : chordAName;
  const nextChord = currentChord === "A" ? chordB : chordA;

  // Find common tones between current and next chord
  const commonTones = activeChord.notes.filter((note) =>
    nextChord.notes.includes(note),
  );
  const movingFromCurrent = activeChord.notes.filter(
    (note) => !nextChord.notes.includes(note),
  );
  const movingToNext = nextChord.notes.filter(
    (note) => !activeChord.notes.includes(note),
  );

  // Pattern animation
  useEffect(() => {
    if (pattern !== "block") {
      const patternLength = pattern === "broken" ? 4 : 3;
      const stepDuration = 60000 / tempo / patternLength;

      patternIntervalRef.current = setInterval(() => {
        setPatternStep((prev) => (prev + 1) % patternLength);
      }, stepDuration);

      return () => {
        if (patternIntervalRef.current)
          clearInterval(patternIntervalRef.current);
      };
    } else {
      setPatternStep(0);
    }
  }, [pattern, tempo]);

  // Auto-advance loop
  useEffect(() => {
    if (isPlaying) {
      const transitionTime = (60000 / tempo) * 4; // 4 beats per chord
      intervalRef.current = setInterval(() => {
        setCurrentChord((prev) => (prev === "A" ? "B" : "A"));
        setPatternStep(0);
      }, transitionTime);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, tempo]);

  const handleProgressionSelect = useCallback(
    (key: string) => {
      setSelectedProgression(key);
      setLoopChordA(0);
      setLoopChordB(1);
      setCurrentChord("A");
      setIsPlaying(false);
      if (!unlockedProgressions.includes(key)) {
        onProgressionUnlocked(key);
      }
    },
    [unlockedProgressions, onProgressionUnlocked],
  );

  const togglePlay = () => setIsPlaying((prev) => !prev);

  const manualAdvance = () => {
    setCurrentChord((prev) => (prev === "A" ? "B" : "A"));
    setPatternStep(0);
  };

  const resetLoop = () => {
    setCurrentChord("A");
    setPatternStep(0);
    setIsPlaying(false);
  };

  // Get which notes should be highlighted based on pattern
  const getActivePatternNotes = (note: Note, chord: ChordData): boolean => {
    if (pattern === "block") {
      return (
        chord.notes.find((activeChordNote) =>
          areEquivalentKeys(activeChordNote, note),
        ) !== undefined
      );
    }
    if (pattern === "arpeggio") {
      return areEquivalentKeys(
        note,
        chord.notes[patternStep % chord.notes.length],
      );
    }
    if (pattern === "bass-chord") {
      if (patternStep === 0) {
        return areEquivalentKeys(note, chord.notes[0]);
      }
      return areEquivalentKeys(note, chord.notes.slice(1)[0]);
    }
    if (pattern === "broken") {
      // 1-5-8-5 pattern (root, fifth, octave, fifth)
      const patternNotes = [0, 2, 0, 2]; // indices
      return areEquivalentKeys(note, chord.notes[patternNotes[patternStep]]);
    }
    return (
      chord.notes.find((activeChordNote) =>
        areEquivalentKeys(activeChordNote, note),
      ) !== undefined
    );
  };

  // Mini keyboard component for transition view
  const MiniKeyboard = ({
    chord,
    chordName,
    isActive,
    commonTones: common,
    movingNotes,
  }: {
    chord: typeof chordA;
    chordName: string;
    isActive: boolean;
    commonTones: Note[];
    movingNotes: Note[];
  }) => (
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
        isHighlighted={(note: Note) => getActivePatternNotes(note, chord)}
      />

      {/* Note labels */}
      <div className="flex justify-center gap-2 mt-3">
        {chord.notes.map((note, i) => {
          const isCommon = common.includes(note);
          const isMoving = movingNotes.includes(note);

          return (
            <div
              key={i}
              className={`px-2 py-1 rounded text-xs font-medium ${
                isCommon
                  ? "bg-green-500/20 text-green-400 border border-green-500/50"
                  : isMoving
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                    : "bg-primary/20 text-primary"
              }`}
            >
              {note.key}
              {isCommon && " (stays)"}
            </div>
          );
        })}
      </div>
    </div>
  );

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
            <span className="text-sm text-muted-foreground">Chord A:</span>
            <div className="flex gap-1">
              {progression.chords.map((chord, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setLoopChordA(i);
                    if (i === loopChordB)
                      setLoopChordB((i + 1) % progression.chords.length);
                    setCurrentChord("A");
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    loopChordA === i
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-muted"
                  }`}
                >
                  {chord}
                </button>
              ))}
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-muted-foreground" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Chord B:</span>
            <div className="flex gap-1">
              {progression.chords.map((chord, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setLoopChordB(i);
                    if (i === loopChordA)
                      setLoopChordA((i + 1) % progression.chords.length);
                  }}
                  disabled={i === loopChordA}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    loopChordB === i
                      ? "bg-primary text-primary-foreground"
                      : i === loopChordA
                        ? "bg-muted opacity-50 cursor-not-allowed"
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
          <div>
            <h3 className="font-semibold text-foreground">
              Transition Practice
            </h3>
            <p className="text-sm text-muted-foreground">
              {commonTones.length > 0
                ? `${commonTones.length} note${commonTones.length > 1 ? "s" : ""} stay in place (green)`
                : "No common tones - all fingers move"}
            </p>
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500/40 border border-green-500" />
              <span className="text-muted-foreground">Stays</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-amber-500/40 border border-amber-500" />
              <span className="text-muted-foreground">Moves</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <MiniKeyboard
            chord={chordA}
            chordName={chordAName}
            isActive={currentChord === "A"}
            commonTones={commonTones}
            movingNotes={
              currentChord === "A" ? movingFromCurrent : movingToNext
            }
          />

          <div className="hidden md:flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <ArrowDown
                className={`w-8 h-8 transition-all ${currentChord === "A" ? "text-primary animate-pulse" : "text-muted-foreground"}`}
              />
              <span className="text-xs text-muted-foreground">Transition</span>
            </div>
          </div>

          <MiniKeyboard
            chord={chordB}
            chordName={chordBName}
            isActive={currentChord === "B"}
            commonTones={commonTones}
            movingNotes={
              currentChord === "B" ? movingFromCurrent : movingToNext
            }
          />
        </div>

        {/* Transition tips */}
        {commonTones.length > 0 && (
          <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
            <p className="text-sm text-green-400">
              <strong>Tip:</strong> Keep your finger on{" "}
              {commonTones.join(" and ")} -{" "}
              {commonTones.length === 1 ? "it stays" : "they stay"} the same!
              Only move {movingFromCurrent.join(" and ")} to{" "}
              {movingToNext.join(" and ")}.
            </p>
          </div>
        )}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`transition-all ${currentChord === "A" ? "ring-2 ring-primary rounded-xl" : ""}`}
        >
          <SheetMusic chord={chordA} chordName={chordAName} />
        </div>
        <div
          className={`transition-all ${currentChord === "B" ? "ring-2 ring-primary rounded-xl" : ""}`}
        >
          <SheetMusic chord={chordB} chordName={chordBName} />
        </div>
      </div>

      {/* Voice leading insight */}
      <div className="bg-card rounded-xl border border-border p-4">
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
      </div>
    </div>
  );
}
