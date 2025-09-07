import { readFile } from "node:fs/promises";
import { NoteParser } from "@anotes/core";
import { synchronizeNotes } from "@anotes/sync";
import { findNoteFiles } from "./io.js";

export async function syncCmd({ dir }: { dir: string }): Promise<void> {
  const parser = new NoteParser();
  console.log(`Scanning directory "${dir}"...`);
  const { notePaths, modelPaths } = await findNoteFiles(dir);
  for (const path of modelPaths) {
    console.log(`Parsing models file "${path}"...`);
    const text = await readFile(path, "utf-8");
    parser.parseModels(path, text);
  }
  for (const path of notePaths) {
    console.log(`Parsing notes file "${path}"...`);
    const text = await readFile(path, "utf-8");
    parser.parseNotes(path, text);
  }
  parser.checkDuplicates();
  parser.checkErrors();
  const { notes } = parser;
  console.log(`Parsed ${notes.length} note(s).`);
  if (notes.length > 0) {
    await synchronizeNotes(notes, {});
  } else {
    console.warn(`No notes found in "${dir}".`);
  }
}
