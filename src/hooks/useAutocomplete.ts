// src/hooks/useAutocomplete.ts
import { useState, useCallback } from "react";
import { generateAutocomplete } from "../services/ollama";
import { useSongStore } from "../stores/songStore";

export function useAutocomplete() {
  const [suggestion, setSuggestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const currentSong = useSongStore((state) => state.currentSong);

  const fetchAutocomplete = useCallback(
    async (textBefore: string) => {
      if (!textBefore.trim() || textBefore.length < 3) {
        setSuggestion("");
        return;
      }

      setIsLoading(true);
      try {
        const completion = await generateAutocomplete(
          textBefore,
          currentSong?.genre || "Pop",
        );
        setSuggestion(completion);
      } catch (error) {
        console.error("Autocomplete error:", error);
        setSuggestion("");
      } finally {
        setIsLoading(false);
      }
    },
    [currentSong?.genre],
  );

  const clearSuggestion = useCallback(() => {
    setSuggestion("");
  }, []);

  return {
    suggestion,
    isLoading,
    fetchAutocomplete,
    clearSuggestion,
  };
}
