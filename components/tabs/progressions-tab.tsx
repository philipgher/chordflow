"use client";

import { useState, useCallback } from "react";
import { CHORD_DATA, PROGRESSIONS } from "@/lib/music-data";
import { PianoWithRhythm } from "../piano-with-rhythm";
import { SheetMusic } from "../sheet-music";
import { ChordTheoryPanel } from "../chord-theory-panel";
import { ControlPanel } from "../control-panel";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface ProgressionsTabProps {
  unlockedProgressions: string[];
  onProgressionUnlocked: (progression: string) => void;
}

export function ProgressionsTab({
  unlockedProgressions,
  onProgressionUnlocked,
}: ProgressionsTabProps) {
  const [selectedProgression, setSelectedProgression] = useState("I-V-vi-IV");
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(80);

  const progression = PROGRESSIONS[selectedProgression];
  const currentChordName = progression.chords[currentChordIndex];
  const currentChord = CHORD_DATA[currentChordName];

  const handleProgressionSelect = useCallback(
    (key: string) => {
      setSelectedProgression(key);
      setCurrentChordIndex(0);
      setIsPlaying(false);
      if (!unlockedProgressions.includes(key)) {
        onProgressionUnlocked(key);
      }
    },
    [unlockedProgressions, onProgressionUnlocked],
  );

  const handleChordChange = useCallback((index: number) => {
    setCurrentChordIndex(index);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return (
    <div className="space-y-6">
      {/* Progression selector */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-foreground mb-4">
          Choose a Progression
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(PROGRESSIONS).map(([key, prog]) => {
            const isSelected = selectedProgression === key;
            const isUnlocked = unlockedProgressions.includes(key);

            return (
              <button
                key={key}
                onClick={() => handleProgressionSelect(key)}
                className={`
                  relative p-4 rounded-lg text-left transition-all
                  ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-secondary hover:bg-muted"
                  }
                `}
              >
                {isUnlocked && !isSelected && (
                  <CheckCircle2 className="w-4 h-4 absolute top-2 right-2 text-green-500" />
                )}

                <div className="font-bold text-lg">{key}</div>
                <div
                  className={`text-sm ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  {prog.name}
                </div>

                {/* Chord preview */}
                <div className="flex items-center gap-1 mt-2">
                  {prog.chords.map((chord, i) => (
                    <span key={i} className="flex items-center">
                      <span
                        className={`text-xs font-medium ${
                          isSelected
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {chord}
                      </span>
                      {i < prog.chords.length - 1 && (
                        <ArrowRight
                          className={`w-3 h-3 mx-0.5 ${
                            isSelected
                              ? "text-primary-foreground/50"
                              : "text-muted-foreground"
                          }`}
                        />
                      )}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active progression display */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-foreground">
              {progression.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {progression.description}
            </p>
          </div>

          {/* Chord buttons */}
          <div className="flex gap-2">
            {progression.chords.map((chord, i) => (
              <button
                key={i}
                onClick={() => handleChordChange(i)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${
                    i === currentChordIndex
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
                  }
                `}
              >
                {chord}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main learning area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left: Sheet Music & Theory */}
        <div className="xl:col-span-1 space-y-4">
          <SheetMusic
            chord={currentChord}
            chordName={currentChordName}
            progression={progression}
            currentIndex={currentChordIndex}
          />
          <ChordTheoryPanel chord={currentChord} chordName={currentChordName} />
        </div>

        {/* Right: Piano with floating notes */}
        <div className="xl:col-span-3">
          <PianoWithRhythm
            progression={progression}
            currentChordIndex={currentChordIndex}
            isPlaying={isPlaying}
            tempo={tempo}
            chordName={currentChordName}
            onChordChange={handleChordChange}
          />
        </div>
      </div>

      {/* Controls */}
      <ControlPanel
        isPlaying={isPlaying}
        tempo={tempo}
        onTogglePlay={togglePlay}
        onTempoChange={setTempo}
      />

      {/* Progression theory tips */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-foreground mb-3">
          Understanding {selectedProgression}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-1">Why It Works</h4>
            <p className="text-sm text-muted-foreground">
              {selectedProgression === "I-V-vi-IV" &&
                "The tension from V to vi creates an emotional hook, while IV provides resolution. This is why it's in thousands of pop songs."}
              {selectedProgression === "I-IV-V-I" &&
                "The classic I-IV-V creates the fundamental tension and release. IV builds anticipation, V creates tension, and returning to I resolves it."}
              {selectedProgression === "ii-V-I" &&
                "The ii chord sets up the V, which strongly resolves to I. This is the backbone of jazz harmony."}
              {selectedProgression === "I-vi-IV-V" &&
                "Starting bright (I), moving to minor (vi), then building through IV to V creates a nostalgic, hopeful feeling."}
              {selectedProgression === "vi-IV-I-V" &&
                "Starting on the minor vi creates immediate tension and drama before resolving through the major chords."}
              {selectedProgression === "I-V-vi-iii-IV" &&
                "This extended progression adds the iii chord for extra movement before the familiar IV resolution."}
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-1">Practice Tips</h4>
            <p className="text-sm text-muted-foreground">
              Start slowly and focus on smooth transitions between chords. Count
              "1-2-3-4" for each chord, then try with a metronome. Once
              comfortable, experiment with different rhythms and voicings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
