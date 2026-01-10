import type { ChordData } from "@/lib/music-data"
import { Info, Music2 } from "lucide-react"

interface ChordTheoryPanelProps {
  chord: ChordData
  chordName: string
}

export function ChordTheoryPanel({ chord, chordName }: ChordTheoryPanelProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Info className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-foreground">Chord Theory</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Chord name and type */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{chordName}</h3>
            <p className="text-sm text-muted-foreground">{chord.fullName}</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              chord.type === "major" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
            }`}
          >
            {chord.type}
          </div>
        </div>

        {/* Intervals */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Music2 className="w-4 h-4 text-muted-foreground" />
            Intervals
          </h4>
          <div className="flex gap-2">
            {chord.intervals.map((interval, i) => (
              <div key={i} className="flex-1 bg-secondary rounded-lg p-2 text-center">
                <span className="text-xs text-muted-foreground block">{interval.name}</span>
                <span className="text-sm font-medium text-foreground">{interval.semitones} st</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Notes</h4>
          <div className="flex gap-2">
            {chord.notes.map((note, i) => (
              <div key={i} className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Finger positions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Suggested Fingering</h4>
          <div className="flex gap-4 text-sm">
            {chord.fingering.map((finger, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                  {finger}
                </span>
                <span className="text-muted-foreground">{chord.notes[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="bg-secondary/50 rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Tip:</span> {chord.tip}
          </p>
        </div>
      </div>
    </div>
  )
}
