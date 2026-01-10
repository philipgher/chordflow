"use client";

import { useState, useCallback } from "react";
import { CHORD_DATA, PROGRESSIONS } from "@/lib/music-data";
import { PianoWithRhythm } from "../piano-with-rhythm";
import { ControlPanel } from "../control-panel";
import { Trophy, Target, Zap, Clock } from "lucide-react";

interface RhythmTabProps {
  unlockedProgressions: string[];
  masteredChords: string[];
}

export function RhythmTab({
  unlockedProgressions,
  masteredChords,
}: RhythmTabProps) {
  const [selectedProgression, setSelectedProgression] = useState("I-V-vi-IV");
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(80);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const progression = PROGRESSIONS[selectedProgression];
  const currentChordName = progression.chords[currentChordIndex];
  const currentChord = CHORD_DATA[currentChordName];

  const handleChordChange = useCallback((index: number) => {
    setCurrentChordIndex(index);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (!prev) {
        // Starting new session
        setScore(0);
        setStreak(0);
      }
      return !prev;
    });
  }, []);

  const handleNoteHit = useCallback(
    (correct: boolean) => {
      if (correct) {
        setScore((prev) => prev + 10 * (streak + 1));
        setStreak((prev) => {
          const newStreak = prev + 1;
          if (newStreak > bestStreak) {
            setBestStreak(newStreak);
          }
          return newStreak;
        });
      } else {
        setStreak(0);
      }
    },
    [streak, bestStreak],
  );

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{score}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{streak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {bestStreak}
            </div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{tempo}</div>
            <div className="text-xs text-muted-foreground">BPM</div>
          </div>
        </div>
      </div>

      {/* Progression quick select */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">
            Progression:
          </span>
          {Object.entries(PROGRESSIONS).map(([key, prog]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedProgression(key);
                setCurrentChordIndex(0);
                setIsPlaying(false);
              }}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${
                  selectedProgression === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
                }
              `}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Current chord indicator */}
      <div className="flex justify-center gap-3">
        {progression.chords.map((chord, i) => (
          <div
            key={i}
            className={`
              px-6 py-3 rounded-xl font-bold text-lg transition-all
              ${
                i === currentChordIndex
                  ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/25"
                  : i < currentChordIndex
                    ? "bg-muted text-muted-foreground"
                    : "bg-secondary text-foreground"
              }
            `}
          >
            {chord}
          </div>
        ))}
      </div>

      {/* Main rhythm game area */}
      <PianoWithRhythm
        progression={progression}
        currentChordIndex={currentChordIndex}
        isPlaying={isPlaying}
        tempo={tempo}
        highlightedNotes={currentChord.notes}
        chordName={currentChordName}
        onChordChange={handleChordChange}
        onNotePlay={() => {}}
      />

      {/* Controls */}
      <ControlPanel
        isPlaying={isPlaying}
        tempo={tempo}
        onTogglePlay={togglePlay}
        onTempoChange={setTempo}
      />

      {/* Tips for rhythm */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-foreground mb-3">Rhythm Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-1">Timing is Key</h4>
            <p className="text-sm text-muted-foreground">
              Hit the keys exactly when the notes reach the line. Start slow and
              gradually increase tempo as you improve.
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-1">Build Streaks</h4>
            <p className="text-sm text-muted-foreground">
              Consecutive correct hits multiply your score. Stay focused and
              maintain rhythm for higher scores.
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-1">Muscle Memory</h4>
            <p className="text-sm text-muted-foreground">
              Regular practice builds automatic chord transitions. Soon you
              won't need to think about finger placement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
