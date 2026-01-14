// src/components/preview/LyricPreviewDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useUIStore } from "../../stores/uiStore";
import { useSongStore } from "../../stores/songStore";
import { BLOCK_TYPES } from "../../constants/blockTypes";
import { ChordDisplay } from "../chord/ChordDisplay";
import { cn } from "@/lib/utils";

export function LyricPreviewDialog() {
  const { showPreview, setShowPreview } = useUIStore();
  const { currentSong } = useSongStore();

  if (!currentSong) return null;

  const totalWords = currentSong.blocks.reduce(
    (sum, block) => sum + (block.wordCount || 0),
    0,
  );
  const totalSyllables = currentSong.blocks.reduce(
    (sum, block) => sum + (block.syllableCount || 0),
    0,
  );

  return (
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{currentSong.title}</DialogTitle>
          <DialogDescription>
            {currentSong.artist && `by ${currentSong.artist} • `}
            {currentSong.genre}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Badge variant="outline">{totalWords} total words</Badge>
          <Badge variant="outline">{totalSyllables} total syllables</Badge>
          <Badge variant="outline">{currentSong.blocks.length} blocks</Badge>
        </div>

        {currentSong.chordProgression && (
          <>
            <div className="space-y-2 p-4 bg-secondary/30 rounded-lg border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                  Global Chord Progression
                </h3>
                <Badge variant="secondary">
                  {currentSong.chordProgression.key}{" "}
                  {currentSong.chordProgression.mode}
                </Badge>
              </div>
              <ChordDisplay
                progression={currentSong.chordProgression}
                compact
              />
            </div>
            <Separator />
          </>
        )}

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {currentSong.blocks.map((block) => {
              const config = BLOCK_TYPES[block.type];
              return (
                <div key={block.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn("w-2 h-2 rounded-full", config.color)}
                      />
                      <h3 className="font-semibold text-sm">{block.label}</h3>
                      {block.wordCount !== undefined && block.wordCount > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {block.wordCount}w • {block.syllableCount}s
                        </Badge>
                      )}
                    </div>
                  </div>

                  {block.chordProgression && (
                    <div className="pl-4">
                      <ChordDisplay
                        progression={block.chordProgression}
                        compact
                      />
                    </div>
                  )}

                  <div className="pl-4">
                    {block.content ? (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {block.content}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        [Empty block]
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
