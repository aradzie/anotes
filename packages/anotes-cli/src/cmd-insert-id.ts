import { formatNotes, type Note, parseNotes } from "@anotes/core";
import { readFileSync, writeFileSync } from "node:fs";
import { findNoteFiles } from "./io.js";

export function insertIdCmd({ dir }: { dir: string }) {
  console.log(`Scanning directory "${dir}"...`);
  for (const file of findNoteFiles(dir)) {
    console.log(`Parsing file "${file}"...`);
    const text = readFileSync(file, "utf-8");
    const notes: Note[] = [];
    parseNotes(file, text, notes);
    console.log(`Parsed ${notes.length} note(s).`);
    for (const note of notes) {
      note.id ??= crypto.randomUUID();
    }
    writeFileSync(file, formatNotes(notes));
  }
}
