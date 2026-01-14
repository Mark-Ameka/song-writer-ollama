// src/hooks/useRhyme.ts
import { useEffect, useState } from "react";
import { RhymeSuggestion } from "../types/suggestion";
import { fetchRhymes } from "../services/rhyme";
import { extractRhymableWord, getSelectedWord } from "../utils/textProcessing";
import { useDebounce } from "./useDebounce";

interface UseRhymeOptions {
  content: string;
  selectedText?: string;
  selectionStart?: number;
  selectionEnd?: number;
}

export function useRhyme({
  content,
  selectedText,
  selectionStart,
  selectionEnd,
}: UseRhymeOptions) {
  const [rhymes, setRhymes] = useState<RhymeSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rhymeSource, setRhymeSource] = useState<"selected" | "auto">("auto");

  // Determine which word to use for rhyming
  let targetWord = "";

  if (
    selectedText &&
    selectionStart !== undefined &&
    selectionEnd !== undefined
  ) {
    const selected = getSelectedWord(content, selectionStart, selectionEnd);
    if (selected) {
      targetWord = selected;
      if (rhymeSource !== "selected") setRhymeSource("selected");
    }
  }

  if (!targetWord) {
    targetWord = extractRhymableWord(content);
    if (rhymeSource !== "auto") setRhymeSource("auto");
  }

  const debouncedWord = useDebounce(targetWord, 800);

  useEffect(() => {
    if (!debouncedWord || debouncedWord.length < 2) {
      setRhymes([]);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);

    fetchRhymes(debouncedWord)
      .then((results) => {
        if (!isCancelled) {
          setRhymes(results);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          console.error("Rhyme fetch error:", error);
          setRhymes([]);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedWord]);

  return { rhymes, isLoading, targetWord: debouncedWord, rhymeSource };
}
