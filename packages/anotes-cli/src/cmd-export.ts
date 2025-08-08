import { readFileSync, writeFileSync } from "node:fs";
import { exportNotes, NoteParser } from "@anotes/core";
import { findNoteFiles } from "./io.js";

export function exportCmd({ dir, out }: { dir: string; out: string }) {
  const parser = new NoteParser();
  console.log(`Scanning directory "${dir}"...`);
  for (const file of findNoteFiles(dir)) {
    console.log(`Parsing file "${file}"...`);
    const text = readFileSync(file, "utf-8");
    parser.parse(file, text);
  }
  parser.checkErrors();
  const { notes } = parser;
  console.log(`Parsed ${notes.length} note(s).`);
  if (notes.length > 0) {
    writeFileSync(out, exportNotes(notes));
    console.log(`Exported notes to "${out}".`);
  } else {
    console.warn(`No notes found in "${dir}".`);
  }
}
