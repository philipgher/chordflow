"use client";

import { useState, useCallback } from "react";
import { Header } from "./header";
import { PianoWithRhythm } from "./piano-with-rhythm";
import { SheetMusic } from "./sheet-music";
import { ChordTheoryPanel } from "./chord-theory-panel";
import { ProgressionSelector } from "./progression-selector";
import { ControlPanel } from "./control-panel";
import { CHORD_DATA, PROGRESSIONS } from "@/lib/music-data";

export function PianoLearningApp() {
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [selectedProgression, setSelectedProgression] = useState("I-V-vi-IV");
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(80);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);

  const progression = PROGRESSIONS[selectedProgression];
  const currentChordName = progression.chords[currentChordIndex];
  const currentChord = CHORD_DATA[currentChordName];

  const handleNotePlay = useCallback((note: string) => {
    setActiveNotes((prev) => [...prev, note]);
    setTimeout(() => {
      setActiveNotes((prev) => prev.filter((n) => n !== note));
    }, 300);
  }, []);

  const handleChordChange = useCallback((index: number) => {
    setCurrentChordIndex(index);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-400 mx-auto w-full">
        {/* Progression Selector */}
        <ProgressionSelector
          selectedProgression={selectedProgression}
          onSelectProgression={setSelectedProgression}
          currentChordIndex={currentChordIndex}
          onChordSelect={handleChordChange}
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
          {/* Left sidebar: Sheet Music & Theory */}
          <div className="xl:col-span-1 space-y-4">
            <SheetMusic
              chord={currentChord}
              chordName={currentChordName}
              progression={progression}
              currentIndex={currentChordIndex}
            />
            <ChordTheoryPanel
              chord={currentChord}
              chordName={currentChordName}
            />
          </div>

          {/* Main area: Combined Piano with Rhythm Lane */}
          <div className="xl:col-span-3">
            <PianoWithRhythm
              progression={progression}
              currentChordIndex={currentChordIndex}
              isPlaying={isPlaying}
              tempo={tempo}
              highlightedNotes={currentChord.notes}
              chordName={currentChordName}
              onChordChange={handleChordChange}
              onNotePlay={handleNotePlay}
            />
            {/* Control Panel */}
            <ControlPanel
              isPlaying={isPlaying}
              tempo={tempo}
              onTogglePlay={togglePlay}
              onTempoChange={setTempo}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
