// src/components/song/SongSelectorDialog.tsx
import { useState, useMemo } from "react";
import { Search, Trash2, Music, Calendar, Tag, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSongStore } from "../../stores/songStore";
import { Song } from "../../types/song";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SongSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewSong: () => void;
}

export function SongSelectorDialog({
  open,
  onOpenChange,
  onNewSong,
}: SongSelectorDialogProps) {
  const { loadSong, loadSavedSongs, deleteSavedSong } = useSongStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  const songs = loadSavedSongs();

  const filteredAndSortedSongs = useMemo(() => {
    let filtered = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.genre.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return filtered.sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }
      return a.title.localeCompare(b.title);
    });
  }, [songs, searchQuery, sortBy]);

  const handleSelectSong = (song: Song) => {
    loadSong(song);
    onOpenChange(false);
  };

  const handleDeleteSong = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this song?")) {
      deleteSavedSong(songId);
    }
  };

  const getPreview = (song: Song): string => {
    const firstBlock = song.blocks[0];
    if (!firstBlock || !firstBlock.content) return "No lyrics yet";
    const preview = firstBlock.content.slice(0, 100);
    return preview + (firstBlock.content.length > 100 ? "..." : "");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Load Song</DialogTitle>
          <DialogDescription>
            Select a saved song to continue working on it
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="title">Sort by Title</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1">
          {filteredAndSortedSongs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Music className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No songs found" : "No saved songs"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first song to get started"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => {
                    onOpenChange(false);
                    onNewSong();
                  }}
                >
                  Create New Song
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2 pr-4">
              {filteredAndSortedSongs.map((song) => (
                <div
                  key={song.id}
                  onClick={() => handleSelectSong(song)}
                  className={cn(
                    "group p-4 border rounded-lg cursor-pointer transition-all",
                    "hover:border-primary hover:bg-primary/5",
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{song.title}</h3>
                      {song.artist && (
                        <p className="text-sm text-muted-foreground">
                          by {song.artist}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteSong(e, song.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {song.genre}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      {song.blocks.length} blocks
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(song.updatedAt), "MMM d, yyyy")}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {getPreview(song)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onNewSong();
            }}
          >
            Create New Song
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
