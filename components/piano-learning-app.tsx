"use client";

import { useState, useCallback } from "react";
import { Header } from "./header";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TheoryTab } from "./tabs/theory-tab";
import { ProgressionsTab } from "./tabs/progressions-tab";
import { RhythmTab } from "./tabs/rhythm-tab";

export function PianoLearningApp() {
  const [activeTab, setActiveTab] = useState("theory");

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

  return (
    <Tabs
      className="min-h-screen bg-background flex flex-col"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <Header />

      <main className="flex-1 p-4 lg:p-6 max-w-400 mx-auto w-full">
        <div className="space-y-6">
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
              masteredChords={masteredChords}
              onChordMastered={handleChordMastered}
            />
          </TabsContent>

          <TabsContent value="progressions" className="mt-0">
            <ProgressionsTab
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
        </div>
      </main>
    </Tabs>
  );
}
