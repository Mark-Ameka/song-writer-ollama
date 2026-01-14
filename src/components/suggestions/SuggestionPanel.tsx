// src/components/suggestions/SuggestionPanel.tsx
import { RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useSuggestionStore } from "../../stores/suggestionStore";
import { useSongStore } from "../../stores/songStore";
import { useUIStore } from "../../stores/uiStore";
import { useRhyme } from "../../hooks/useRhyme";
import { SuggestionItem } from "./SuggestionItem";
import { SuggestionSkeleton } from "./SuggestionSkeleton";
import { RhymePanel } from "./RhymePanel";
import { generateLyricSuggestions } from "../../services/ollama";

export function SuggestionPanel() {
  const { suggestions, isLoading, setSuggestions, setLoading } =
    useSuggestionStore();
  const { currentSong, activeBlockId } = useSongStore();
  const { textSelection } = useUIStore();
  const activeBlock = currentSong?.blocks.find((b) => b.id === activeBlockId);

  const {
    rhymes,
    isLoading: rhymesLoading,
    targetWord,
    rhymeSource,
  } = useRhyme({
    content: activeBlock?.content || "",
    selectedText: textSelection.text,
    selectionStart: textSelection.start,
    selectionEnd: textSelection.end,
  });

  const handleRegenerate = async () => {
    if (!activeBlock || !currentSong) return;

    setLoading(true);
    try {
      const [continueLines, nextLines] = await Promise.all([
        generateLyricSuggestions(currentSong, activeBlock, "continue-line"),
        generateLyricSuggestions(currentSong, activeBlock, "next-line"),
      ]);

      const lastLine =
        activeBlock.content
          .split("\n")
          .filter((l) => l.trim())
          .pop() || activeBlock.content;

      const continueSuggestions = continueLines
        .slice(0, 3)
        .map((text, idx) => ({
          id: `${activeBlock.id}-continue-${idx}-${Date.now()}`,
          text: lastLine,
          continuation: text,
          fullLine: `${lastLine.trim()} ${text}`,
          type: "continue-line" as const,
        }));

      const nextSuggestions = nextLines.slice(0, 2).map((text, idx) => ({
        id: `${activeBlock.id}-next-${idx}-${Date.now()}`,
        text: activeBlock.content,
        continuation: text,
        fullLine: text,
        type: "next-line" as const,
      }));

      setSuggestions([...continueSuggestions, ...nextSuggestions]);
    } catch (error) {
      console.error("Regenerate error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b shrink-0">
        <CardTitle className="text-lg">AI Assistance</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto pt-6 space-y-6">
        {/* Lyric Suggestions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Lyric Suggestions</h3>
            {suggestions.length > 0 && !isLoading && (
              <Button variant="ghost" size="sm" onClick={handleRegenerate}>
                <RefreshCw className="h-3 w-3 mr-2" />
                Regenerate
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="relative">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Generating suggestions...
                  </p>
                </div>
              </div>
              <SuggestionSkeleton />
            </div>
          ) : suggestions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8 border rounded-lg">
              Start writing to get AI suggestions
            </p>
          ) : (
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <SuggestionItem key={suggestion.id} suggestion={suggestion} />
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Rhyme Suggestions */}
        <RhymePanel
          rhymes={rhymes}
          isLoading={rhymesLoading}
          targetWord={targetWord}
          rhymeSource={rhymeSource}
        />
      </CardContent>
    </Card>
  );
}
