import { Music, Settings, BookOpen, Drum } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "./ui/tabs";

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
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 h-14 gap-4 bg-card">
            <TabsTrigger
              value="theory"
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary rounded-none"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Theory</span>
            </TabsTrigger>
            <TabsTrigger
              value="progressions"
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary rounded-none"
            >
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">Progressions</span>
            </TabsTrigger>
            <TabsTrigger
              value="rhythm"
              className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-primary rounded-none"
            >
              <Drum className="w-4 h-4" />
              <span className="hidden sm:inline">Rhythm</span>
            </TabsTrigger>
          </TabsList>
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
