// src/stores/suggestionStore.ts
import { create } from "zustand";
import { LyricSuggestion } from "../types/suggestion";

interface SuggestionState {
  suggestions: LyricSuggestion[];
  isLoading: boolean;
  error: string | null;

  setSuggestions: (suggestions: LyricSuggestion[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSuggestions: () => void;
}

export const useSuggestionStore = create<SuggestionState>((set) => ({
  suggestions: [],
  isLoading: false,
  error: null,

  setSuggestions: (suggestions) => set({ suggestions, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clearSuggestions: () => set({ suggestions: [], error: null }),
}));
