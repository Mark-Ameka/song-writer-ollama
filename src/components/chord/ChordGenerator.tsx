// src/components/chord/ChordGenerator.tsx
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Label } from "../ui/label";
import { useSongStore } from "../../stores/songStore";
import { generateChordProgression } from "../../services/chords";
import { MUSIC_KEYS } from "../../constants/chords";
import { MusicKey } from "../../types/chord";
import { ChordDisplay } from "./ChordDisplay";
import { BLOCK_TYPES } from "../../constants/blockTypes";
import { cn } from "@/lib/utils";

export function ChordGenerator() {
  const { currentSong, setChordProgression, applyChordProgressionToBlocks } =
    useSongStore();
  const [selectedKey, setSelectedKey] = useState<MusicKey>("C");
  const [mode, setMode] = useState<"major" | "minor">("major");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!currentSong) return;

    setIsGenerating(true);
    try {
      const progression = generateChordProgression(
        currentSong.genre,
        selectedKey,
        mode,
      );

      if (selectedBlocks.length > 0) {
        // Apply to selected blocks
        applyChordProgressionToBlocks(selectedBlocks, progression);
      } else {
        // Apply globally
        setChordProgression(progression);
      }

      setSelectedBlocks([]);
    } catch (error) {
      console.error("Chord generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleBlock = (blockId: string) => {
    setSelectedBlocks((prev) =>
      prev.includes(blockId)
        ? prev.filter((id) => id !== blockId)
        : [...prev, blockId],
    );
  };

  if (!currentSong) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Chord Progression</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium mb-1.5 block">Key</label>
            <Select
              value={selectedKey}
              onValueChange={(v) => setSelectedKey(v as MusicKey)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MUSIC_KEYS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block">Mode</label>
            <Select
              value={mode}
              onValueChange={(v) => setMode(v as "major" | "minor")}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {currentSong.blocks.length > 0 && (
          <div>
            <Label className="text-xs font-medium mb-2 block">
              Apply to blocks (optional)
            </Label>
            <ScrollArea className="h-32 border rounded-md p-2">
              <div className="space-y-2">
                {currentSong.blocks.map((block) => {
                  const config = BLOCK_TYPES[block.type];
                  return (
                    <div key={block.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`block-${block.id}`}
                        checked={selectedBlocks.includes(block.id)}
                        onCheckedChange={() => toggleBlock(block.id)}
                      />
                      <label
                        htmlFor={`block-${block.id}`}
                        className="text-sm flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <div
                          className={cn("w-2 h-2 rounded-full", config.color)}
                        />
                        {block.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedBlocks.length === 0
                ? "None selected - will apply globally"
                : `Selected ${selectedBlocks.length} block(s)`}
            </p>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          className="w-full"
          size="sm"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate
            </>
          )}
        </Button>

        {currentSong.chordProgression && (
          <div>
            <p className="text-xs font-medium mb-2">Global Chords:</p>
            <ChordDisplay progression={currentSong.chordProgression} compact />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
