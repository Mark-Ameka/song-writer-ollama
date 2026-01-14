// src/utils/musicTheory.ts
import { MusicKey, Chord, ChordQuality } from "../types/chord";
import {
  MAJOR_SCALE_INTERVALS,
  MINOR_SCALE_INTERVALS,
} from "../constants/chords";

const NOTE_VALUES: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function getScaleNotes(
  key: MusicKey,
  mode: "major" | "minor" = "major",
): MusicKey[] {
  const rootValue = NOTE_VALUES[key];
  const intervals =
    mode === "major" ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;

  return intervals.map((interval) => {
    const noteValue = (rootValue + interval) % 12;
    return NOTES[noteValue] as MusicKey;
  });
}

export function getDiatonicChord(
  key: MusicKey,
  degree: number,
  mode: "major" | "minor" = "major",
  addExtensions: boolean = false,
): Chord {
  const scaleNotes = getScaleNotes(key, mode);
  const root = scaleNotes[degree - 1];

  let quality: ChordQuality;
  let extensions: string[] = [];

  if (mode === "major") {
    quality = [1, 4, 5].includes(degree)
      ? "major"
      : [2, 3, 6].includes(degree)
        ? "minor"
        : "diminished";

    // Add jazz extensions
    if (addExtensions) {
      if (degree === 5) {
        extensions = ["7"]; // Dominant 7th
        quality = "dominant";
      } else if ([1, 4].includes(degree)) {
        extensions = ["maj7"];
      } else if ([2, 3, 6].includes(degree)) {
        extensions = ["7"];
      }
    }
  } else {
    quality = [3, 6, 7].includes(degree)
      ? "major"
      : [1, 4, 5].includes(degree)
        ? "minor"
        : "diminished";

    if (addExtensions && degree === 5) {
      extensions = ["7"];
      quality = "dominant";
    }
  }

  const qualitySymbol =
    quality === "major"
      ? ""
      : quality === "minor"
        ? "m"
        : quality === "diminished"
          ? "dim"
          : quality === "dominant"
            ? ""
            : "";

  const extSymbol = extensions.length > 0 ? extensions.join("") : "";

  const romanNumerals =
    mode === "major"
      ? ["I", "ii", "iii", "IV", "V", "vi", "vii°"]
      : ["i", "ii°", "III", "iv", "v", "VI", "VII"];

  return {
    root,
    quality,
    extensions,
    display: `${root}${qualitySymbol}${extSymbol}`,
    roman: romanNumerals[degree - 1],
    nashville: degree.toString(),
  };
}

export function addChordVariations(chords: Chord[], genre: string): Chord[] {
  // Add genre-specific variations
  if (genre.toLowerCase().includes("jazz")) {
    return chords.map((chord) => {
      if (chord.quality === "dominant" && !chord.extensions?.includes("9")) {
        return {
          ...chord,
          extensions: [...(chord.extensions || []), "9"],
          display: `${chord.root}9`,
        };
      }
      return chord;
    });
  }

  if (genre.toLowerCase().includes("blues")) {
    return chords.map((chord) => {
      if (chord.quality === "major" && !chord.extensions?.includes("7")) {
        return {
          ...chord,
          extensions: ["7"],
          display: `${chord.root}7`,
          quality: "dominant",
        };
      }
      return chord;
    });
  }

  return chords;
}
