// src/utils/textProcessing.ts
export function getLastWord(text: string): string {
  const words = text.trim().split(/\s+/);
  return words[words.length - 1] || "";
}

export function getLastSentence(text: string): string {
  const sentences = text.split(/[.!?]+/);
  return sentences[sentences.length - 1]?.trim() || text;
}

export function extractRhymableWord(text: string): string {
  const lastLine =
    text
      .split("\n")
      .filter((l) => l.trim())
      .pop() || "";
  const words = lastLine.trim().split(/\s+/);

  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i].replace(/[^\w]/g, "");
    if (word.length > 2) return word.toLowerCase();
  }
  return "";
}

export function syllableCount(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;

  const vowels = "aeiouy";
  let count = 0;
  let previousWasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }

  if (word.endsWith("e")) count--;
  if (word.endsWith("le") && word.length > 2) count++;

  return Math.max(1, count);
}

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export function countSyllables(text: string): number {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  return words.reduce((total, word) => total + syllableCount(word), 0);
}

export function getSelectedWord(
  text: string,
  selectionStart: number,
  selectionEnd: number,
): string {
  if (selectionStart === selectionEnd) return "";

  const selectedText = text.substring(selectionStart, selectionEnd).trim();
  const words = selectedText.split(/\s+/);

  // Return the last word if multiple words selected
  const word = words[words.length - 1].replace(/[^\w]/g, "");
  return word.length > 2 ? word.toLowerCase() : "";
}
