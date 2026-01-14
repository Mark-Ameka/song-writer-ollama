// src/services/chords.ts
import { ChordProgression, MusicKey } from "../types/chord";
import { GENRE_PROGRESSIONS } from "../constants/chords";
import { getDiatonicChord, addChordVariations } from "../utils/musicTheory";

export function generateChordProgression(
  genre: string,
  key: MusicKey,
  mode: "major" | "minor" = "major",
): ChordProgression {
  const normalizedGenre =
    Object.keys(GENRE_PROGRESSIONS).find((g) =>
      genre.toLowerCase().includes(g.toLowerCase()),
    ) || "default";

  const progressionOptions =
    GENRE_PROGRESSIONS[normalizedGenre] || GENRE_PROGRESSIONS.default;
  const progression =
    progressionOptions[Math.floor(Math.random() * progressionOptions.length)];

  const isJazz = genre.toLowerCase().includes("jazz");
  let chords = progression.map((degree) =>
    getDiatonicChord(key, degree, mode, isJazz),
  );

  chords = addChordVariations(chords, genre);

  const romanNumerals = chords.map((c) => c.roman).join(" - ");
  const nashvilleNumbers = chords.map((c) => c.nashville).join(" - ");

  return {
    chords,
    key,
    mode,
    genre,
    romanNumerals,
    nashvilleNumbers,
  };
}
