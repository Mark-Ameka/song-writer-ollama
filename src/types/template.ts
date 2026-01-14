import { BlockType } from "./song";

// src/types/template.ts
export interface SongTemplate {
  id: string;
  name: string;
  description: string;
  structure: BlockType[];
}
