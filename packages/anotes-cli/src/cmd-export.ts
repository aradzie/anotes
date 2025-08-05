import { exportNotes, NoteList, parseNotes } from "@anotes/core";
import { readFileSync, writeFileSync } from "node:fs";
import { findNoteFiles } from "./io.js";

export function exportCmd({ dir, out }: { dir: string; out: string }) {
  console.log(`Scanning directory "${dir}"...`);
  const notes = new NoteList();
  for (const file of findNoteFiles(dir)) {
    console.log(`Parsing file "${file}"...`);
    const text = readFileSync(file, "utf-8");
    parseNotes(file, text, notes);
  }
  console.log(`Parsed ${notes.length} note(s).`);
  if (notes.length > 0) {
    writeFileSync(out, exportNotes(notes));
    console.log(`Exported notes to "${out}".`);
  } else {
    console.warn(`No notes found in "${dir}".`);
  }
}
