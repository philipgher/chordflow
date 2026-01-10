"use client";

import { PROGRESSIONS } from "@/lib/music-data";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProgressionSelectorProps {
  selectedProgression: string;
  onSelectProgression: (key: string) => void;
  currentChordIndex: number;
  onChordSelect: (index: number) => void;
}

export function ProgressionSelector({
  selectedProgression,
  onSelectProgression,
  currentChordIndex,
  onChordSelect,
}: ProgressionSelectorProps) {
  const progression = PROGRESSIONS[selectedProgression];

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <span className="font-semibold">{selectedProgression}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {Object.entries(PROGRESSIONS).map(([key, prog]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onSelectProgression(key)}
                  className="flex flex-col items-start"
                >
                  <span className="font-medium">{key}</span>
                  <span className="text-xs text-muted-foreground">
                    {prog.name}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">
              {progression.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {progression.description}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {progression.chords.map((chord, i) => (
            <button
              key={i}
              onClick={() => onChordSelect(i)}
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
  );
}
