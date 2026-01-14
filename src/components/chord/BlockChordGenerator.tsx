// src/components/chord/BlockChordGenerator.tsx
import { useState } from "react";
import { Music2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import { useSongStore } from "../../stores/songStore";
import { generateChordProgression } from "../../services/chords";
import { MUSIC_KEYS } from "../../constants/chords";
import { MusicKey } from "../../types/chord";
import { SongBlock } from "../../types/song";

interface BlockChordGeneratorProps {
  block: SongBlock;
}

export function BlockChordGenerator({ block }: BlockChordGeneratorProps) {
  const { currentSong, setBlockChordProgression } = useSongStore();
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<MusicKey>("C");
  const [mode, setMode] = useState<"major" | "minor">("major");

  const handleGenerate = () => {
    if (!currentSong) return;

    const progression = generateChordProgression(
      currentSong.genre,
      selectedKey,
      mode,
    );

    setBlockChordProgression(block.id, progression);
    setOpen(false);
  };

  const handleRemove = () => {
    setBlockChordProgression(block.id, undefined as any);
  };

  return (
    <div className="flex items-center gap-2">
      {block.chordProgression ? (
        <>
          <div className="flex flex-wrap gap-1 flex-1">
            {block.chordProgression.chords.map((chord, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs px-1.5 py-0"
              >
                {chord.display}
              </Badge>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleRemove}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7">
              <Music2 className="h-3 w-3 mr-1" />
              Add Chords
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Generate Chords</h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs mb-1 block">Key</label>
                  <Select
                    value={selectedKey}
                    onValueChange={(v) => setSelectedKey(v as MusicKey)}
                  >
                    <SelectTrigger className="h-8">
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
                  <label className="text-xs mb-1 block">Mode</label>
                  <Select
                    value={mode}
                    onValueChange={(v) => setMode(v as "major" | "minor")}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleGenerate} size="sm" className="w-full">
                Generate
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
