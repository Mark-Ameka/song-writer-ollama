// src/constants/templates.ts
import { SongTemplate } from "../types/template";

export const SONG_TEMPLATES: SongTemplate[] = [
  {
    id: "standard-pop",
    name: "Standard Pop",
    description: "Classic pop song structure",
    structure: ["verse", "chorus", "verse", "chorus", "bridge", "chorus"],
  },
  {
    id: "verse-chorus",
    name: "Verse-Chorus",
    description: "Simple alternating structure",
    structure: ["verse", "chorus", "verse", "chorus"],
  },
  {
    id: "intro-outro",
    name: "Full Song",
    description: "Complete song with intro and outro",
    structure: [
      "intro",
      "verse",
      "chorus",
      "verse",
      "chorus",
      "bridge",
      "chorus",
      "outro",
    ],
  },
  {
    id: "ballad",
    name: "Ballad",
    description: "Emotional ballad structure",
    structure: [
      "verse",
      "verse",
      "chorus",
      "verse",
      "bridge",
      "chorus",
      "chorus",
    ],
  },
  {
    id: "hip-hop",
    name: "Hip-Hop",
    description: "Typical hip-hop structure",
    structure: [
      "intro",
      "verse",
      "hook",
      "verse",
      "hook",
      "verse",
      "hook",
      "outro",
    ],
  },
  {
    id: "rock",
    name: "Rock",
    description: "Classic rock arrangement",
    structure: [
      "intro",
      "verse",
      "verse",
      "chorus",
      "verse",
      "chorus",
      "interlude",
      "chorus",
      "outro",
    ],
  },
];
