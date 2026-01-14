// src/components/suggestions/SuggestionItem.tsx
import { Copy, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { LyricSuggestion } from "../../types/suggestion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useSongStore } from "../../stores/songStore";

interface SuggestionItemProps {
  suggestion: LyricSuggestion;
}

export function SuggestionItem({ suggestion }: SuggestionItemProps) {
  const [copied, setCopied] = useState(false);
  const { activeBlockId, updateBlock, currentSong } = useSongStore();

  const handleApply = () => {
    if (!activeBlockId) return;
    const block = currentSong?.blocks.find((b) => b.id === activeBlockId);
    if (!block) return;

    let newContent = "";
    if (suggestion.type === "continue-line") {
      // Replace the last line with the completed version
      const lines = block.content.split("\n");
      lines[lines.length - 1] = suggestion.fullLine;
      newContent = lines.join("\n");
    } else {
      // Add as next line
      newContent = block.content.trim() + "\n" + suggestion.fullLine;
    }

    updateBlock(activeBlockId, newContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group p-3 border rounded-lg hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-2 mb-2">
        <Badge
          variant={
            suggestion.type === "continue-line" ? "default" : "secondary"
          }
          className="text-xs shrink-0"
        >
          {suggestion.type === "continue-line" ? "Continue" : "Next Line"}
        </Badge>
        {suggestion.type === "next-line" && (
          <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
        )}
      </div>
      <p className="text-sm leading-relaxed mb-2">{suggestion.fullLine}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleApply}
        className="w-full justify-center"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 mr-2" />
            Applied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3 mr-2" />
            Apply
          </>
        )}
      </Button>
    </div>
  );
}
