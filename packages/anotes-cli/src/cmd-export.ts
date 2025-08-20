import { exportNotes, NoteParser } from "@anotes/core";
import { readFileSync, writeFileSync } from "node:fs";
import { findNoteFiles } from "./io.js";

export function exportCmd({ dir, out }: { dir: string; out: string }) {
  const parser = new NoteParser();
  console.log(`Scanning directory "${dir}"...`);
  const { notePaths, typePaths } = findNoteFiles(dir);
  for (const path of typePaths) {
    console.log(`Parsing types file "${path}"...`);
    const text = readFileSync(path, "utf-8");
    parser.parseTypes(path, text);
  }
  for (const path of notePaths) {
    console.log(`Parsing notes file "${path}"...`);
    const text = readFileSync(path, "utf-8");
    parser.parseNotes(path, text);
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
