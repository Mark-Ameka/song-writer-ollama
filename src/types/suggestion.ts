// src/types/suggestion.ts
export interface LyricSuggestion {
  id: string;
  text: string;
  continuation: string;
  fullLine: string;
  type: "continue-line" | "next-line";
  confidence?: number;
}

export interface RhymeSuggestion {
  word: string;
  type: "perfect" | "near" | "slant";
  syllables: number;
}

export interface AutocompleteOption {
  text: string;
  type: "word" | "line";
  context?: string;
}
