"use client";

import { Play, Pause, SkipBack, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ControlPanelProps {
  isPlaying: boolean;
  tempo: number;
  onTogglePlay: () => void;
  onTempoChange: (tempo: number) => void;
}

export function ControlPanel({
  isPlaying,
  tempo,
  onTogglePlay,
  onTempoChange,
}: ControlPanelProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 h-fit">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Playback controls */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Reset">
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            size="lg"
            onClick={onTogglePlay}
            className="w-14 h-14 rounded-full"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>
        </div>

        {/* Tempo control */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Tempo
          </span>
          <Slider
            value={[tempo]}
            onValueChange={([value]) => onTempoChange(value)}
            min={40}
            max={160}
            step={5}
            className="flex-1"
            aria-label="Tempo control"
          />
          <span className="text-sm font-medium text-foreground w-16">
            {tempo} BPM
          </span>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <Slider
            defaultValue={[75]}
            max={100}
            step={1}
            className="w-24"
            aria-label="Volume control"
          />
        </div>
      </div>
    </div>
  );
}
