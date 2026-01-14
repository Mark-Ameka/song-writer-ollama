// src/types/chord.ts
export type MusicKey =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab"
  | "A"
  | "A#"
  | "Bb"
  | "B";

export type ChordQuality =
  | "major"
  | "minor"
  | "diminished"
  | "augmented"
  | "dominant"
  | "suspended";

export interface Chord {
  root: MusicKey;
  quality: ChordQuality;
  extensions?: string[];
  display: string;
  nashville?: string;
  roman?: string;
}

export interface ChordProgression {
  chords: Chord[];
  key: MusicKey;
  mode: "major" | "minor";
  genre: string;
  romanNumerals: string;
  nashvilleNumbers: string;
}

export type TheoryLevel = "basic" | "intermediate" | "advanced";
