// src/constants/blockTypes.ts
import { BlockType } from "../types/song";

export const BLOCK_TYPES: Record<
  BlockType,
  { label: string; color: string; description: string }
> = {
  verse: {
    label: "Verse",
    color: "bg-blue-500",
    description: "Main storytelling section",
  },
  chorus: {
    label: "Chorus",
    color: "bg-purple-500",
    description: "Repeated main hook",
  },
  bridge: {
    label: "Bridge",
    color: "bg-green-500",
    description: "Contrasting section",
  },
  "pre-chorus": {
    label: "Pre-Chorus",
    color: "bg-yellow-500",
    description: "Build-up to chorus",
  },
  refrain: {
    label: "Refrain",
    color: "bg-pink-500",
    description: "Repeated phrase",
  },
  intro: {
    label: "Intro",
    color: "bg-gray-500",
    description: "Opening section",
  },
  outro: {
    label: "Outro",
    color: "bg-gray-600",
    description: "Closing section",
  },
  hook: {
    label: "Hook",
    color: "bg-red-500",
    description: "Catchy memorable part",
  },
  interlude: {
    label: "Interlude",
    color: "bg-indigo-500",
    description: "Instrumental break",
  },
};
