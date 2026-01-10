"use client";

import { useState, useCallback } from "react";
import { Header } from "./header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TheoryTab } from "./tabs/theory-tab";
import { ProgressionsTab } from "./tabs/progressions-tab";
import { RhythmTab } from "./tabs/rhythm-tab";
import { BookOpen, Music, Drum } from "lucide-react";

export function PianoLearningApp() {
  const [activeTab, setActiveTab] = useState("theory");

  const [unlockedChords, setUnlockedChords] = useState<string[]>([
    "C",
    "G",
    "Am",
    "F",
  ]);
  const [masteredChords, setMasteredChords] = useState<string[]>([]);
  const [unlockedProgressions, setUnlockedProgressions] = useState<string[]>([
    "I-V-vi-IV",
  ]);

  const handleChordMastered = useCallback(
    (chord: string) => {
      if (!masteredChords.includes(chord)) {
        setMasteredChords((prev) => [...prev, chord]);
      }
    },
    [masteredChords],
  );

  const handleProgressionUnlocked = useCallback(
    (progression: string) => {
      if (!unlockedProgressions.includes(progression)) {
        setUnlockedProgressions((prev) => [...prev, progression]);
      }
    },
    [unlockedProgressions],
  );

  const handleChordUnlocked = useCallback(
    (chord: string) => {
      if (!unlockedChords.includes(chord)) {
        setUnlockedChords((prev) => [...prev, chord]);
      }
    },
    [unlockedChords],
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 p-4 lg:p-6 max-w-[1600px] mx-auto w-full">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 h-14 bg-card border border-border">
            <TabsTrigger
              value="theory"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Theory</span>
            </TabsTrigger>
            <TabsTrigger
              value="progressions"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">Progressions</span>
            </TabsTrigger>
            <TabsTrigger
              value="rhythm"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Drum className="w-4 h-4" />
              <span className="hidden sm:inline">Rhythm</span>
            </TabsTrigger>
          </TabsList>

          <div className="text-center space-y-1">
            {activeTab === "theory" && (
              <>
                <h2 className="text-xl font-semibold text-foreground">
                  Learn Chord Theory
                </h2>
                <p className="text-sm text-muted-foreground">
                  Understand how chords are built and explore the circle of
                  fifths
                </p>
              </>
            )}
            {activeTab === "progressions" && (
              <>
                <h2 className="text-xl font-semibold text-foreground">
                  Master Progressions
                </h2>
                <p className="text-sm text-muted-foreground">
                  Learn how chords work together in common musical patterns
                </p>
              </>
            )}
            {activeTab === "rhythm" && (
              <>
                <h2 className="text-xl font-semibold text-foreground">
                  Practice Rhythm
                </h2>
                <p className="text-sm text-muted-foreground">
                  Train your timing with falling notes and build muscle memory
                </p>
              </>
            )}
          </div>

          <TabsContent value="theory" className="mt-0">
            <TheoryTab
              unlockedChords={unlockedChords}
              masteredChords={masteredChords}
              onChordMastered={handleChordMastered}
              onChordUnlocked={handleChordUnlocked}
            />
          </TabsContent>

          <TabsContent value="progressions" className="mt-0">
            <ProgressionsTab
              unlockedChords={unlockedChords}
              unlockedProgressions={unlockedProgressions}
              onProgressionUnlocked={handleProgressionUnlocked}
            />
          </TabsContent>

          <TabsContent value="rhythm" className="mt-0">
            <RhythmTab
              unlockedProgressions={unlockedProgressions}
              masteredChords={masteredChords}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
