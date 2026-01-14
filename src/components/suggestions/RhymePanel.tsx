// src/components/suggestions/RhymePanel.tsx
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { RhymeSuggestion } from "../../types/suggestion";
import { Loader2, MousePointerClick } from "lucide-react";

interface RhymePanelProps {
  rhymes: RhymeSuggestion[];
  isLoading: boolean;
  targetWord: string;
  rhymeSource: "selected" | "auto";
}

export function RhymePanel({
  rhymes,
  isLoading,
  targetWord,
  rhymeSource,
}: RhymePanelProps) {
  const perfectRhymes = rhymes.filter((r) => r.type === "perfect");
  const nearRhymes = rhymes.filter((r) => r.type === "near");

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">
            Rhymes for:{" "}
            <span className="text-primary">{targetWord || "none"}</span>
          </h4>
          {rhymeSource === "selected" && (
            <Badge variant="outline" className="text-xs">
              <MousePointerClick className="h-3 w-3 mr-1" />
              Selected
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {rhymeSource === "selected"
            ? "Showing rhymes for your selected word"
            : "Auto-detecting from last word"}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : rhymes.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          {targetWord ? "No rhymes found" : "Type to find rhymes"}
        </p>
      ) : (
        <ScrollArea className="h-[300px]">
          <div className="space-y-4 pr-4">
            {perfectRhymes.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-muted-foreground mb-2">
                  Perfect Rhymes ({perfectRhymes.length})
                </h5>
                <div className="flex flex-wrap gap-2">
                  {perfectRhymes.map((rhyme) => (
                    <Badge
                      key={rhyme.word}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {rhyme.word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {nearRhymes.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-muted-foreground mb-2">
                  Near Rhymes ({nearRhymes.length})
                </h5>
                <div className="flex flex-wrap gap-2">
                  {nearRhymes.map((rhyme) => (
                    <Badge
                      key={rhyme.word}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary transition-colors"
                    >
                      {rhyme.word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
