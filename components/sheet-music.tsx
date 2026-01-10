import type { ChordData, Progression } from "@/lib/music-data";

interface SheetMusicProps {
  chord: ChordData;
  chordName: string;
  progression?: Progression;
  currentIndex?: number;
}

const STAFF_LINES = 5;
const NOTE_POSITIONS: Record<string, number> = {
  C: 10,
  D: 9,
  E: 8,
  F: 7,
  G: 6,
  A: 5,
  B: 4,
  C5: 3,
  D5: 2,
  E5: 1,
};

export function SheetMusic({
  chord,
  chordName,
  progression,
  currentIndex,
}: SheetMusicProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="font-semibold text-foreground">Sheet Music</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Traditional notation view
        </p>
      </div>

      <div className="p-4">
        {/* Staff */}
        <div className="relative h-32 bg-secondary/20 rounded-lg overflow-hidden">
          {/* Treble clef area */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-4xl text-muted-foreground select-none">
            𝄞
          </div>

          {/* Staff lines */}
          <div className="absolute inset-0 flex flex-col justify-center pl-12 pr-4">
            {Array.from({ length: STAFF_LINES }).map((_, i) => (
              <div key={i} className="h-px bg-muted-foreground/40 my-1.5" />
            ))}
          </div>

          {/* Notes on staff */}
          <div className="absolute inset-0 flex items-center justify-center pl-16 pr-8">
            <div className="flex items-end gap-1">
              {chord.notes.map((note, i) => {
                const baseNote = note.replace(/[0-9#b]/g, "");
                const hasSharp = note.includes("#");
                const position = NOTE_POSITIONS[baseNote] || 6;

                return (
                  <div
                    key={i}
                    className="relative flex flex-col items-center"
                    style={{ marginBottom: `${(10 - position) * 6}px` }}
                  >
                    {hasSharp && (
                      <span className="absolute -left-3 text-xs text-foreground">
                        ♯
                      </span>
                    )}
                    <div className="w-4 h-3 bg-primary rounded-full rotate-[-20deg] shadow-sm" />
                    <div className="w-0.5 h-8 bg-primary -mt-1 ml-3" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chord name */}
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-primary/20 rounded text-xs font-medium text-primary">
            {chordName}
          </div>
        </div>

        {progression && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {progression.chords.map((c, i) => (
              <div
                key={i}
                className={`
                  shrink-0 px-3 py-2 rounded-lg border transition-all
                  ${
                    i === currentIndex
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                <span className="text-sm font-medium">{c}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
