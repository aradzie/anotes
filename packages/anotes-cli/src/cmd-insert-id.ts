import { formatNotes, NoteParser } from "@anotes/core";
import { readFileSync, writeFileSync } from "node:fs";
import { findNoteFiles } from "./io.js";

export function insertIdCmd({ dir }: { dir: string }) {
  console.log(`Scanning directory "${dir}"...`);
  const { notePaths } = findNoteFiles(dir);
  for (const file of notePaths) {
    const parser = new NoteParser();
    console.log(`Parsing file "${file}"...`);
    const text = readFileSync(file, "utf-8");
    parser.parseNotes(file, text);
    parser.checkErrors();
    const { notes } = parser;
    console.log(`Parsed ${notes.length} note(s).`);
    notes.insertId();
    writeFileSync(file, formatNotes(notes));
  }
}
