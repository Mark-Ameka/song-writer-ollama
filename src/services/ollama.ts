// src/services/ollama.ts
import { Song, SongBlock } from "../types/song";

const OLLAMA_BASE_URL =
  import.meta.env.VITE_OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || "llama2";

export interface OllamaStreamResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export async function* streamOllamaCompletion(
  prompt: string,
  systemPrompt?: string,
): AsyncGenerator<string> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      system: systemPrompt,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader available");

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          const json: OllamaStreamResponse = JSON.parse(line);
          yield json.response;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function buildSongContext(song: Song, currentBlock: SongBlock): string {
  let context = `Song: "${song.title}"${song.artist ? ` by ${song.artist}` : ""}\n`;
  context += `Genre: ${song.genre}\n\n`;
  context += `Full Song Structure:\n`;

  song.blocks.forEach((block) => {
    const label = block.label || block.type;
    const content = block.content.trim() || "[empty]";
    const marker = block.id === currentBlock.id ? ">>> CURRENT BLOCK <<<" : "";
    context += `[${label}]${marker}\n${content}\n\n`;
  });

  return context;
}

export async function generateLyricSuggestions(
  song: Song,
  currentBlock: SongBlock,
  type: "continue-line" | "next-line" = "continue-line",
): Promise<string[]> {
  const context = buildSongContext(song, currentBlock);

  const systemPrompt = `You are an expert songwriting assistant specializing in ${song.genre} music. 
You help write lyrics that are emotionally resonant, thematically consistent, and genre-appropriate.
You understand song structure, rhyme schemes, and lyrical flow.`;

  let prompt: string;

  if (type === "continue-line") {
    const lastLine =
      currentBlock.content
        .split("\n")
        .filter((l) => l.trim())
        .pop() || currentBlock.content;

    prompt = `${context}
Task: Continue the current line in the ${currentBlock.label || currentBlock.type}.

Current incomplete line: "${lastLine}"

Generate 5 creative continuations that:
1. Complete this specific line naturally
2. Rhyme with previous lines if part of a rhyme scheme
3. Match the emotional tone and theme of the song
4. Fit the ${song.genre} genre style
5. Have similar rhythm and meter to existing lines

Return ONLY the continuation text (not the full line), one per line, without numbering or explanation.
Each continuation should be 3-8 words that complete the thought.`;
  } else {
    prompt = `${context}
Task: Suggest the next line after the current ${currentBlock.label || currentBlock.type}.

Current block content:
${currentBlock.content}

Generate 5 creative next lines that:
1. Follow naturally from the current content
2. Rhyme appropriately (if a rhyme scheme is established)
3. Advance the song's narrative or emotional arc
4. Match the ${song.genre} genre conventions
5. Maintain consistent rhythm and meter

Return ONLY the next line suggestions, one per line, without numbering or explanation.`;
  }

  // const suggestions: string[] = [];
  let fullResponse = "";

  for await (const chunk of streamOllamaCompletion(prompt, systemPrompt)) {
    fullResponse += chunk;
  }

  const lines = fullResponse
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.match(/^\d+[\.)]/))
    .slice(0, 5);

  return lines.length > 0 ? lines : ["Unable to generate suggestions"];
}

export async function generateAutocomplete(
  textBefore: string,
  genre: string,
): Promise<string> {
  const systemPrompt = `You are a songwriting autocomplete assistant for ${genre} music. 
Complete the current phrase or line naturally and concisely.`;

  const prompt = `Complete this lyric phrase: "${textBefore}"

Return ONLY 3-8 words that naturally complete this phrase. Do not repeat the input.
Make it emotionally resonant and genre-appropriate for ${genre}.`;

  let completion = "";
  for await (const chunk of streamOllamaCompletion(prompt, systemPrompt)) {
    completion += chunk;
  }

  return completion.trim().split("\n")[0] || "";
}

export async function generateChordExplanation(
  chords: string[],
  key: string,
  mode: string,
  genre: string,
): Promise<{ basic: string; intermediate: string; advanced: string }> {
  const systemPrompt = `You are a music theory expert who explains chord progressions at different levels of understanding.`;

  const prompt = `Explain this chord progression in the key of ${key} ${mode} for ${genre} music:
Chords: ${chords.join(" - ")}

Provide three explanations:
1. BASIC: For beginners (2-3 sentences, simple language)
2. INTERMEDIATE: For musicians (3-4 sentences, include theory concepts)
3. ADVANCED: For experts (4-5 sentences, detailed analysis)

Format:
BASIC: [explanation]
INTERMEDIATE: [explanation]
ADVANCED: [explanation]`;

  let response = "";
  for await (const chunk of streamOllamaCompletion(prompt, systemPrompt)) {
    response += chunk;
  }

  const parseExplanation = (text: string, level: string): string => {
    const regex = new RegExp(
      `${level}:\\s*(.+?)(?=\\n(?:BASIC|INTERMEDIATE|ADVANCED):|$)`,
      "is",
    );
    const match = text.match(regex);
    return match
      ? match[1].trim()
      : `This is a ${mode} progression in ${key}, commonly used in ${genre} music.`;
  };

  return {
    basic: parseExplanation(response, "BASIC"),
    intermediate: parseExplanation(response, "INTERMEDIATE"),
    advanced: parseExplanation(response, "ADVANCED"),
  };
}
