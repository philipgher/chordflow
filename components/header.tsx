import { Music, Settings, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1800px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Music className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">ChordFlow</h1>
            <p className="text-xs text-muted-foreground">
              Visual Piano Learning
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Chords
          </button>
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Progressions
          </button>
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Rhythm
          </button>
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Theory
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Open theory guide">
            <BookOpen className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
