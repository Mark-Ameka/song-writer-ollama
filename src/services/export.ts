// src/services/export.ts
import jsPDF from "jspdf";
import { Song } from "../types/song";
import { BLOCK_TYPES } from "../constants/blockTypes";

export function exportToText(song: Song): void {
  let content = `${song.title}\n`;
  if (song.artist) content += `by ${song.artist}\n`;
  content += `Genre: ${song.genre}\n\n`;

  if (song.chordProgression) {
    content += `Global Chords: ${song.chordProgression.chords.map((c) => c.display).join(" - ")}\n`;
    content += `Key: ${song.chordProgression.key} ${song.chordProgression.mode}\n\n`;
  }

  song.blocks.forEach((block) => {
    content += `[${block.label || BLOCK_TYPES[block.type].label}]\n`;

    if (block.chordProgression) {
      content += `Chords: ${block.chordProgression.chords.map((c) => c.display).join(" - ")}\n`;
    }

    content += `${block.content}\n\n`;
  });

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${song.title.replace(/\s+/g, "_")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToPDF(song: Song): void {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(20);
  doc.text(song.title, 20, y);
  y += 10;

  if (song.artist) {
    doc.setFontSize(12);
    doc.text(`by ${song.artist}`, 20, y);
    y += 10;
  }

  doc.setFontSize(10);
  doc.text(`Genre: ${song.genre}`, 20, y);
  y += 15;

  if (song.chordProgression) {
    doc.text(
      `Global Chords: ${song.chordProgression.chords.map((c) => c.display).join(" - ")}`,
      20,
      y,
    );
    y += 5;
    doc.text(
      `Key: ${song.chordProgression.key} ${song.chordProgression.mode}`,
      20,
      y,
    );
    y += 15;
  }

  song.blocks.forEach((block) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setFont("", "bold");
    doc.text(`[${block.label || BLOCK_TYPES[block.type].label}]`, 20, y);
    y += 7;

    if (block.chordProgression) {
      doc.setFont("", "italic");
      doc.setFontSize(9);
      doc.text(
        `${block.chordProgression.chords.map((c) => c.display).join(" - ")}`,
        20,
        y,
      );
      y += 5;
    }

    doc.setFont("", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(block.content, 170);
    lines.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 20, y);
      y += 5;
    });
    y += 10;
  });

  doc.save(`${song.title.replace(/\s+/g, "_")}.pdf`);
}
