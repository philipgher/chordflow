"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { Progression } from "@/lib/music-data"

interface RhythmLaneProps {
  progression: Progression
  currentChordIndex: number
  isPlaying: boolean
  tempo: number
  onChordChange: (index: number) => void
  onNoteHit: (note: string) => void
}

interface FallingNote {
  id: string
  note: string
  lane: number
  y: number
  hit: boolean
  chordIndex: number
}

const LANE_COLORS = ["bg-primary", "bg-accent", "bg-chart-3", "bg-chart-4"]

export function RhythmLane({
  progression,
  currentChordIndex,
  isPlaying,
  tempo,
  onChordChange,
  onNoteHit,
}: RhythmLaneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [notes, setNotes] = useState<FallingNote[]>([])
  const animationRef = useRef<number | undefined>(undefined)
  const lastSpawnRef = useRef(0)
  const noteIdRef = useRef(0)

  const spawnNotes = useCallback((chordIndex: number, chordNotes: string[]) => {
    const newNotes: FallingNote[] = chordNotes.slice(0, 4).map((note, i) => ({
      id: `${noteIdRef.current++}`,
      note,
      lane: i,
      y: -60,
      hit: false,
      chordIndex,
    }))
    setNotes((prev) => [...prev, ...newNotes])
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      return
    }

    const beatInterval = (60 / tempo) * 1000
    let lastTime = performance.now()
    let timeSinceLastBeat = 0
    let currentBeatChord = currentChordIndex

    const animate = (time: number) => {
      const delta = time - lastTime
      lastTime = time
      timeSinceLastBeat += delta

      // Spawn new notes on beat
      if (timeSinceLastBeat >= beatInterval) {
        timeSinceLastBeat = 0
        const chordName = progression.chords[currentBeatChord]
        // Simplified chord notes for lanes
        const laneNotes = getLaneNotes(chordName)
        spawnNotes(currentBeatChord, laneNotes)

        currentBeatChord = (currentBeatChord + 1) % progression.chords.length
        onChordChange(currentBeatChord)
      }

      // Update note positions
      setNotes((prev) => {
        const speed = 0.15 * (tempo / 80)
        return prev
          .map((note) => ({
            ...note,
            y: note.y + delta * speed,
          }))
          .filter((note) => note.y < 500)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, tempo, progression, currentChordIndex, onChordChange, spawnNotes])

  const handleLaneClick = (lane: number) => {
    const hitZoneTop = 340
    const hitZoneBottom = 400

    setNotes((prev) => {
      const updated = [...prev]
      const noteIndex = updated.findIndex((n) => n.lane === lane && !n.hit && n.y >= hitZoneTop && n.y <= hitZoneBottom)
      if (noteIndex !== -1) {
        updated[noteIndex].hit = true
        onNoteHit(updated[noteIndex].note)
      }
      return updated
    })
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Rhythm Practice</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Hit the notes when they reach the line</span>
        </div>
      </div>

      <div ref={containerRef} className="relative h-[400px] bg-secondary/30">
        {/* Lane dividers */}
        <div className="absolute inset-0 flex">
          {[0, 1, 2, 3].map((lane) => (
            <button
              key={lane}
              onClick={() => handleLaneClick(lane)}
              className="flex-1 border-r border-border/50 last:border-r-0 hover:bg-muted/20 transition-colors focus:outline-none focus:bg-muted/30"
              aria-label={`Lane ${lane + 1}`}
            >
              <div className="h-full flex flex-col items-center pt-4">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${LANE_COLORS[lane]} text-primary-foreground opacity-60`}
                >
                  {["Root", "3rd", "5th", "Oct"][lane]}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Hit zone line */}
        <div className="absolute bottom-[30px] left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_var(--primary)]" />
        <div className="absolute bottom-[20px] left-0 right-0 h-[30px] bg-primary/10 border-y border-primary/30" />

        {/* Falling notes */}
        {notes.map((note) => (
          <div
            key={note.id}
            className={`absolute w-[calc(25%-8px)] mx-1 h-14 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
              note.hit ? "scale-110 opacity-0" : `${LANE_COLORS[note.lane]} shadow-lg`
            }`}
            style={{
              left: `${note.lane * 25}%`,
              top: `${note.y}px`,
              transform: note.hit ? "scale(1.2)" : "scale(1)",
            }}
          >
            <span className="text-primary-foreground">{note.note}</span>
          </div>
        ))}

        {/* Current chord indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-card rounded-full border border-border">
          <span className="text-sm font-medium text-foreground">{progression.chords[currentChordIndex]}</span>
        </div>
      </div>
    </div>
  )
}

function getLaneNotes(chordName: string): string[] {
  const noteMap: Record<string, string[]> = {
    C: ["C", "E", "G", "C"],
    G: ["G", "B", "D", "G"],
    Am: ["A", "C", "E", "A"],
    F: ["F", "A", "C", "F"],
    Dm: ["D", "F", "A", "D"],
    Em: ["E", "G", "B", "E"],
    D: ["D", "F#", "A", "D"],
    A: ["A", "C#", "E", "A"],
  }
  return noteMap[chordName] || ["C", "E", "G", "C"]
}
