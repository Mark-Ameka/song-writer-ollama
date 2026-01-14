import { useEffect, useState } from "react";
import { Music } from "lucide-react";
import { MainLayout } from "./components/layout/MainLayout";
import { LeftPanelControls } from "./components/layout/LeftPanelControls";
import { SongStructure } from "./components/structure/SongStructure";
import { BlockEditor } from "./components/editor/BlockEditor";
import { SuggestionPanel } from "./components/suggestions/SuggestionPanel";
import { ChordGenerator } from "./components/chord/ChordGenerator";
import { LyricPreviewDialog } from "./components/preview/LyricPreviewDialog";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Toaster } from "sonner";
import { useSongStore } from "./stores/songStore";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { GENRES } from "./constants/genres";
import { SongSelectorDialog } from "./components/song/SongSelectorDialog";

function NewSongDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("Pop");
  const createNewSong = useSongStore((state) => state.createNewSong);

  const handleCreate = () => {
    if (!title.trim()) return;
    createNewSong(title, artist, genre);
    onOpenChange(false);
    setTitle("");
    setArtist("");
    setGenre("Pop");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && title.trim()) {
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Song</DialogTitle>
          <DialogDescription>
            Enter the details for your new song
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Song Title *
            </label>
            <Input
              placeholder="My Amazing Song"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Artist</label>
            <Input
              placeholder="Your Name"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Genre</label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            Create Song
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WelcomeScreen({
  onLoadSong,
  onCreateNew,
}: {
  onLoadSong: () => void;
  onCreateNew: () => void;
}) {
  const loadSavedSongs = useSongStore((state) => state.loadSavedSongs);
  const savedSongs = loadSavedSongs();
  const hasSavedSongs = savedSongs.length > 0;

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="p-8 bg-primary/10 rounded-full">
            <Music className="h-20 w-20 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Welcome to SongWriter</h2>
          <p className="text-muted-foreground text-lg">
            Your AI-powered songwriting companion
          </p>
        </div>
        <ul className="text-sm text-muted-foreground space-y-2 text-left">
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Generate chord progressions instantly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Get AI-powered lyric suggestions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Find perfect and near rhymes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Structure songs with drag-and-drop</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Per-block chord progressions</span>
          </li>
        </ul>
        <div className="flex gap-3 justify-center">
          {hasSavedSongs && (
            <Button onClick={onLoadSong} variant="outline" size="lg">
              Load Saved Song
            </Button>
          )}
          <Button onClick={onCreateNew} size="lg">
            Create New Song
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const currentSong = useSongStore((state) => state.currentSong);
  const [showNewSongDialog, setShowNewSongDialog] = useState(false);
  const [showSongSelector, setShowSongSelector] = useState(false);

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }

    // Show song selector on initial load if there are saved songs
    const savedSongs = useSongStore.getState().loadSavedSongs();
    if (savedSongs.length > 0 && !currentSong) {
      setShowSongSelector(true);
    }
  }, []);

  return (
    <MainLayout>
      <Toaster />

      {!currentSong ? (
        <>
          <WelcomeScreen
            onLoadSong={() => setShowSongSelector(true)}
            onCreateNew={() => setShowNewSongDialog(true)}
          />
          <SongSelectorDialog
            open={showSongSelector}
            onOpenChange={setShowSongSelector}
            onNewSong={() => setShowNewSongDialog(true)}
          />
          <NewSongDialog
            open={showNewSongDialog}
            onOpenChange={setShowNewSongDialog}
          />
        </>
      ) : (
        <div className="h-full grid grid-cols-12 gap-4 p-4 overflow-hidden">
          {/* Left Panel - Controls + Song Info + Structure */}
          <div className="col-span-3 h-full flex flex-col border rounded-lg bg-card overflow-hidden">
            <LeftPanelControls />

            <div className="flex-1 overflow-auto">
              <div className="p-4 space-y-4">
                {/* Song Meta */}
                <div>
                  <h2 className="text-xl font-bold line-clamp-2">
                    {currentSong.title}
                  </h2>
                  {currentSong.artist && (
                    <p className="text-sm text-muted-foreground">
                      by {currentSong.artist}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Genre: {currentSong.genre}
                  </p>
                </div>

                {/* Chord Generator */}
                <ChordGenerator />

                {/* Song Structure */}
                <div className="flex-1 flex flex-col min-h-0">
                  <h3 className="font-medium mb-3 text-sm">Song Structure</h3>
                  <div className="flex-1 min-h-0">
                    <SongStructure />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - Editor */}
          <div className="col-span-5 h-full overflow-hidden">
            <BlockEditor />
          </div>

          {/* Right Panel - AI Suggestions */}
          <div className="col-span-4 h-full overflow-hidden">
            <SuggestionPanel />
          </div>
        </div>
      )}

      {/* Lyric Preview Dialog */}
      <LyricPreviewDialog />
    </MainLayout>
  );
}
