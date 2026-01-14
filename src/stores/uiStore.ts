// src/stores/uiStore.ts
import { create } from "zustand";
import { TheoryLevel } from "../types/chord";
import { TextSelection } from "../types/selection";

interface UIState {
  theme: "light" | "dark";
  theoryLevel: TheoryLevel;
  showRhymes: boolean;
  showChords: boolean;
  showPreview: boolean;
  textSelection: TextSelection;

  toggleTheme: () => void;
  setTheoryLevel: (level: TheoryLevel) => void;
  toggleRhymes: () => void;
  toggleChords: () => void;
  setShowPreview: (show: boolean) => void;
  setTextSelection: (selection: TextSelection) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: "dark",
  theoryLevel: "basic",
  showRhymes: true,
  showChords: true,
  showPreview: false,
  textSelection: { start: 0, end: 0, text: "" },

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),

  setTheoryLevel: (theoryLevel) => set({ theoryLevel }),
  toggleRhymes: () => set((state) => ({ showRhymes: !state.showRhymes })),
  toggleChords: () => set((state) => ({ showChords: !state.showChords })),
  setShowPreview: (showPreview) => set({ showPreview }),
  setTextSelection: (selection) => {
    // Only update if selection actually changed to prevent infinite loops
    const current = get().textSelection;
    if (
      current.start !== selection.start ||
      current.end !== selection.end ||
      current.text !== selection.text
    ) {
      set({ textSelection: selection });
    }
  },
}));
