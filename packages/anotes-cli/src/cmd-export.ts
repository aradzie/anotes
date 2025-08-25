import { readFileSync, writeFileSync } from "node:fs";
import { exportNotes, NoteParser } from "@anotes/core";
import { findNoteFiles } from "./io.js";

export function exportCmd({ dir, out }: { dir: string; out: string }) {
  const parser = new NoteParser();
  console.log(`Scanning directory "${dir}"...`);
  const { notePaths, modelPaths } = findNoteFiles(dir);
  for (const path of modelPaths) {
    console.log(`Parsing models file "${path}"...`);
    const text = readFileSync(path, "utf-8");
    parser.parseModels(path, text);
  }
  for (const path of notePaths) {
    console.log(`Parsing notes file "${path}"...`);
    const text = readFileSync(path, "utf-8");
    parser.parseNotes(path, text);
  }
  parser.checkDuplicates();
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
