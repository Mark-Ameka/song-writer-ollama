// src/services/rhyme.ts
import { RhymeSuggestion } from "../types/suggestion";
import { syllableCount } from "../utils/textProcessing";

const DATAMUSE_API = "https://api.datamuse.com/words";

export async function fetchRhymes(word: string): Promise<RhymeSuggestion[]> {
  if (!word || word.length < 2) return [];

  try {
    const [perfectRhymes, nearRhymes] = await Promise.all([
      fetch(`${DATAMUSE_API}?rel_rhy=${encodeURIComponent(word)}&max=20`).then(
        (r) => r.json(),
      ),
      fetch(`${DATAMUSE_API}?rel_nry=${encodeURIComponent(word)}&max=15`).then(
        (r) => r.json(),
      ),
    ]);

    const perfect: RhymeSuggestion[] = perfectRhymes.map((item: any) => ({
      word: item.word,
      type: "perfect" as const,
      syllables: syllableCount(item.word),
    }));

    const near: RhymeSuggestion[] = nearRhymes
      .filter(
        (item: any) => !perfectRhymes.find((p: any) => p.word === item.word),
      )
      .map((item: any) => ({
        word: item.word,
        type: "near" as const,
        syllables: syllableCount(item.word),
      }));

    return [...perfect, ...near].slice(0, 30);
  } catch (error) {
    console.error("Rhyme fetch error:", error);
    return [];
  }
}
