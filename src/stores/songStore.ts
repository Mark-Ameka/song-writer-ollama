// src/stores/songStore.ts
import { create } from "zustand";
import { Song, SongBlock, BlockType, HistoryEntry } from "../types/song";
import { ChordProgression } from "../types/chord";
import { countWords, countSyllables } from "../utils/textProcessing";

const MAX_HISTORY = 50;

interface SongState {
  currentSong: Song | null;
  activeBlockId: string | null;

  // Actions
  createNewSong: (title: string, artist: string, genre: string) => void;
  loadSong: (song: Song) => void;
  updateSongMeta: (
    updates: Partial<Pick<Song, "title" | "artist" | "genre">>,
  ) => void;
  addBlock: (type: BlockType) => void;
  addBlocksFromTemplate: (blocks: BlockType[]) => void;
  duplicateBlock: (id: string) => void;
  updateBlock: (id: string, content: string) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (blockIds: string[]) => void;
  setActiveBlock: (id: string | null) => void;
  setChordProgression: (progression: ChordProgression) => void;
  setBlockChordProgression: (
    blockId: string,
    progression: ChordProgression,
  ) => void;
  applyChordProgressionToBlocks: (
    blockIds: string[],
    progression: ChordProgression,
  ) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveSong: () => void;
  loadSavedSongs: () => Song[];
  deleteSavedSong: (songId: string) => void;
}

function addToHistory(song: Song): Song {
  const entry: HistoryEntry = {
    blocks: JSON.parse(JSON.stringify(song.blocks)),
    timestamp: Date.now(),
  };

  const history = song.history.slice(0, song.historyIndex + 1);
  history.push(entry);

  if (history.length > MAX_HISTORY) {
    history.shift();
  }

  return {
    ...song,
    history,
    historyIndex: history.length - 1,
  };
}

export const useSongStore = create<SongState>((set, get) => ({
  currentSong: null,
  activeBlockId: null,

  createNewSong: (title, artist, genre) => {
    const newSong: Song = {
      id: crypto.randomUUID(),
      title,
      artist,
      genre,
      blocks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      history: [],
      historyIndex: -1,
    };
    set({ currentSong: newSong, activeBlockId: null });
  },

  loadSong: (song) => {
    set({ currentSong: song, activeBlockId: null });
  },

  updateSongMeta: (updates) => {
    set((state) => ({
      currentSong: state.currentSong
        ? {
          ...state.currentSong,
          ...updates,
          updatedAt: new Date(),
        }
        : null,
    }));
  },

  addBlock: (type) => {
    set((state) => {
      if (!state.currentSong) return state;

      const existingBlocks = state.currentSong.blocks.filter(
        (b) => b.type === type,
      );
      const count = existingBlocks.length + 1;

      const newBlock: SongBlock = {
        id: crypto.randomUUID(),
        type,
        content: "",
        order: state.currentSong.blocks.length,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${count}`,
        wordCount: 0,
        syllableCount: 0,
      };

      let updatedSong = {
        ...state.currentSong,
        blocks: [...state.currentSong.blocks, newBlock],
        updatedAt: new Date(),
      };

      updatedSong = addToHistory(updatedSong);

      return {
        currentSong: updatedSong,
        activeBlockId: newBlock.id,
      };
    });
  },

  addBlocksFromTemplate: (blockTypes) => {
    set((state) => {
      if (!state.currentSong) return state;

      const typeCounts: Record<string, number> = {};

      const newBlocks: SongBlock[] = blockTypes.map((type, index) => {
        typeCounts[type] = (typeCounts[type] || 0) + 1;

        return {
          id: crypto.randomUUID(),
          type,
          content: "",
          order: state.currentSong!.blocks.length + index,
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${typeCounts[type]}`,
          wordCount: 0,
          syllableCount: 0,
        };
      });

      let updatedSong = {
        ...state.currentSong,
        blocks: [...state.currentSong.blocks, ...newBlocks],
        updatedAt: new Date(),
      };

      updatedSong = addToHistory(updatedSong);

      return {
        currentSong: updatedSong,
        activeBlockId: newBlocks[0]?.id || null,
      };
    });
  },

  duplicateBlock: (id) => {
    set((state) => {
      if (!state.currentSong) return state;

      const block = state.currentSong.blocks.find((b) => b.id === id);
      if (!block) return state;

      const sameTypeBlocks = state.currentSong.blocks.filter(
        (b) => b.type === block.type,
      );
      const count = sameTypeBlocks.length + 1;

      const duplicated: SongBlock = {
        ...block,
        id: crypto.randomUUID(),
        order: state.currentSong.blocks.length,
        label: `${block.type.charAt(0).toUpperCase() + block.type.slice(1)} ${count}`,
      };

      let updatedSong = {
        ...state.currentSong,
        blocks: [...state.currentSong.blocks, duplicated],
        updatedAt: new Date(),
      };

      updatedSong = addToHistory(updatedSong);

      return {
        currentSong: updatedSong,
        activeBlockId: duplicated.id,
      };
    });
  },

  updateBlock: (id, content) => {
    set((state) => {
      if (!state.currentSong) return state;

      const wordCount = countWords(content);
      const syllableCount = countSyllables(content);

      let updatedSong = {
        ...state.currentSong,
        blocks: state.currentSong.blocks.map((block) =>
          block.id === id
            ? { ...block, content, wordCount, syllableCount }
            : block,
        ),
        updatedAt: new Date(),
      };

      updatedSong = addToHistory(updatedSong);

      return { currentSong: updatedSong };
    });
  },

  deleteBlock: (id) => {
    set((state) => {
      if (!state.currentSong) return state;

      const blocks = state.currentSong.blocks
        .filter((b) => b.id !== id)
        .map((b, idx) => ({ ...b, order: idx }));

      let updatedSong = {
        ...state.currentSong,
        blocks,
        updatedAt: new Date(),
      };

      updatedSong = addToHistory(updatedSong);

      return {
        currentSong: updatedSong,
        activeBlockId: state.activeBlockId === id ? null : state.activeBlockId,
      };
    });
  },

  reorderBlocks: (blockIds) => {
    set((state) => {
      if (!state.currentSong) return state;

      const blockMap = new Map(state.currentSong.blocks.map((b) => [b.id, b]));
      const reorderedBlocks = blockIds
        .map((id) => blockMap.get(id))
        .filter((b): b is SongBlock => b !== undefined)
        .map((b, idx) => ({ ...b, order: idx }));

      let updatedSong = {
        ...state.currentSong,
        blocks: reorderedBlocks,
        updatedAt: new Date(),
      };

      updatedSong = addToHistory(updatedSong);

      return { currentSong: updatedSong };
    });
  },

  setActiveBlock: (id) => {
    set({ activeBlockId: id });
  },

  setChordProgression: (progression) => {
    set((state) => ({
      currentSong: state.currentSong
        ? {
          ...state.currentSong,
          chordProgression: progression,
          updatedAt: new Date(),
        }
        : null,
    }));
  },

  setBlockChordProgression: (blockId, progression) => {
    set((state) => {
      if (!state.currentSong) return state;

      let updatedSong = {
        ...state.currentSong,
        blocks: state.currentSong.blocks.map((block) =>
          block.id === blockId
            ? { ...block, chordProgression: progression }
            : block,
        ),
        updatedAt: new Date(),
      };

      updatedSong = addToHistory(updatedSong);

      return { currentSong: updatedSong };
    });
  },

  applyChordProgressionToBlocks: (blockIds, progression) => {
    set((state) => {
      if (!state.currentSong) return state;

      let updatedSong = {
        ...state.currentSong,
        blocks: state.currentSong.blocks.map((block) =>
          blockIds.includes(block.id)
            ? { ...block, chordProgression: progression }
            : block,
        ),
        updatedAt: new Date(),
      };

      updatedSong = addToHistory(updatedSong);

      return { currentSong: updatedSong };
    });
  },

  undo: () => {
    set((state) => {
      if (!state.currentSong || state.currentSong.historyIndex <= 0)
        return state;

      const newIndex = state.currentSong.historyIndex - 1;
      const historyEntry = state.currentSong.history[newIndex];

      return {
        currentSong: {
          ...state.currentSong,
          blocks: JSON.parse(JSON.stringify(historyEntry.blocks)),
          historyIndex: newIndex,
        },
      };
    });
  },

  redo: () => {
    set((state) => {
      if (
        !state.currentSong ||
        state.currentSong.historyIndex >= state.currentSong.history.length - 1
      ) {
        return state;
      }

      const newIndex = state.currentSong.historyIndex + 1;
      const historyEntry = state.currentSong.history[newIndex];

      return {
        currentSong: {
          ...state.currentSong,
          blocks: JSON.parse(JSON.stringify(historyEntry.blocks)),
          historyIndex: newIndex,
        },
      };
    });
  },

  canUndo: () => {
    const { currentSong } = get();
    return currentSong ? currentSong.historyIndex > 0 : false;
  },

  canRedo: () => {
    const { currentSong } = get();
    return currentSong
      ? currentSong.historyIndex < currentSong.history.length - 1
      : false;
  },

  saveSong: () => {
    const { currentSong } = get();
    if (!currentSong) return;

    const saved = localStorage.getItem("songs");
    const songs: Song[] = saved ? JSON.parse(saved) : [];

    const existing = songs.findIndex((s) => s.id === currentSong.id);
    if (existing >= 0) {
      songs[existing] = currentSong;
    } else {
      songs.push(currentSong);
    }

    localStorage.setItem("songs", JSON.stringify(songs));
  },

  loadSavedSongs: () => {
    const saved = localStorage.getItem("songs");
    return saved ? JSON.parse(saved) : [];
  },

  deleteSavedSong: (songId) => {
    const saved = localStorage.getItem("songs");
    const songs: Song[] = saved ? JSON.parse(saved) : [];
    const filtered = songs.filter((s) => s.id !== songId);
    localStorage.setItem("songs", JSON.stringify(filtered));
  },
}));
