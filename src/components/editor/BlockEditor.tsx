// src/components/editor/BlockEditor.tsx
import { useSongStore } from "../../stores/songStore";
import { useUIStore } from "../../stores/uiStore";
import { BLOCK_TYPES } from "../../constants/blockTypes";
import { InlineAutocomplete } from "./InlineAutocomplete";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useSuggestions } from "../../hooks/useSuggestions";
import { cn } from "@/lib/utils";

export function BlockEditor() {
  const { currentSong, activeBlockId, updateBlock } = useSongStore();
  const { setTextSelection } = useUIStore();
  const activeBlock = currentSong?.blocks.find((b) => b.id === activeBlockId);

  // Trigger suggestions hook
  useSuggestions(activeBlockId);

  const handleSelectionChange = (
    start: number,
    end: number,
    selectedText: string,
  ) => {
    setTextSelection({ start, end, text: selectedText });
  };

  if (!activeBlock) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">
            Select a block to start writing
          </p>
        </CardContent>
      </Card>
    );
  }

  const blockConfig = BLOCK_TYPES[activeBlock.type];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-3 h-3 rounded-full", blockConfig.color)} />
            <CardTitle className="text-lg">{activeBlock.label}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {activeBlock.wordCount || 0} words
            </Badge>
            <Badge variant="outline" className="text-xs">
              {activeBlock.syllableCount || 0} syllables
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {blockConfig.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 pt-6 overflow-auto">
        <InlineAutocomplete
          value={activeBlock.content}
          onChange={(content) => updateBlock(activeBlock.id, content)}
          onSelectionChange={handleSelectionChange}
          placeholder={`Write your ${blockConfig.label.toLowerCase()} here... Press Tab for AI autocomplete.`}
          className="w-full min-h-[200px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </CardContent>
    </Card>
  );
}
