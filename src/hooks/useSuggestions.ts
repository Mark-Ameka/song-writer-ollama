// src/hooks/useSuggestions.ts
import { useEffect } from "react";
import { useSongStore } from "../stores/songStore";
import { useSuggestionStore } from "../stores/suggestionStore";
import { generateLyricSuggestions } from "../services/ollama";
import { LyricSuggestion } from "../types/suggestion";
import { useDebounce } from "./useDebounce";

export function useSuggestions(blockId: string | null) {
  const currentSong = useSongStore((state) => state.currentSong);
  const { setSuggestions, setLoading, setError } = useSuggestionStore();

  const activeBlock = currentSong?.blocks.find((b) => b.id === blockId);
  const debouncedContent = useDebounce(activeBlock?.content || "", 1500);

  useEffect(() => {
    if (
      !activeBlock ||
      !currentSong ||
      !debouncedContent.trim() ||
      debouncedContent.length < 10
    ) {
      setSuggestions([]);
      return;
    }

    let isCancelled = false;

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);

      try {
        // Generate both continue-line and next-line suggestions
        const [continueLines, nextLines] = await Promise.all([
          generateLyricSuggestions(currentSong, activeBlock, "continue-line"),
          generateLyricSuggestions(currentSong, activeBlock, "next-line"),
        ]);

        if (!isCancelled) {
          const lastLine =
            debouncedContent
              .split("\n")
              .filter((l) => l.trim())
              .pop() || debouncedContent;

          const continueSuggestions: LyricSuggestion[] = continueLines
            .slice(0, 3)
            .map((text, idx) => ({
              id: `${blockId}-continue-${idx}`,
              text: lastLine,
              continuation: text,
              fullLine: `${lastLine.trim()} ${text}`,
              type: "continue-line",
            }));

          const nextSuggestions: LyricSuggestion[] = nextLines
            .slice(0, 2)
            .map((text, idx) => ({
              id: `${blockId}-next-${idx}`,
              text: debouncedContent,
              continuation: text,
              fullLine: text,
              type: "next-line",
            }));

          setSuggestions([...continueSuggestions, ...nextSuggestions]);
        }
      } catch (error) {
        if (!isCancelled) {
          setError("Failed to generate suggestions");
          console.error("Suggestion error:", error);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchSuggestions();

    return () => {
      isCancelled = true;
    };
  }, [debouncedContent, blockId]);
}
