import { ChordProgression } from "./chord";

// src/types/song.ts
export type BlockType =
  | "verse"
  | "chorus"
  | "bridge"
  | "pre-chorus"
  | "refrain"
  | "intro"
  | "outro"
  | "hook"
  | "interlude";

export interface SongBlock {
  id: string;
  type: BlockType;
  content: string;
  order: number;
  label?: string;
  wordCount?: number;
  syllableCount?: number;
  chordProgression?: ChordProgression; // Per-block chords
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  blocks: SongBlock[];
  chordProgression?: ChordProgression; // Global chords (optional)
  createdAt: Date;
  updatedAt: Date;
  history: HistoryEntry[];
  historyIndex: number;
}

export interface HistoryEntry {
  blocks: SongBlock[];
  timestamp: number;
}
