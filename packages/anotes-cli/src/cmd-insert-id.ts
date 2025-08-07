import { readFileSync, writeFileSync } from "node:fs";
import { formatNotes, NoteList, parseNotes } from "@anotes/core";
import { findNoteFiles } from "./io.js";

export function insertIdCmd({ dir }: { dir: string }) {
  console.log(`Scanning directory "${dir}"...`);
  for (const file of findNoteFiles(dir)) {
    console.log(`Parsing file "${file}"...`);
    const text = readFileSync(file, "utf-8");
    const notes = new NoteList();
    parseNotes(file, text, notes);
    console.log(`Parsed ${notes.length} note(s).`);
    notes.insertId();
    writeFileSync(file, formatNotes(notes));
  }
}
