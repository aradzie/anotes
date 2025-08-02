/**
 * A script that processes input text files and compiles an output deck file.
 * The input files are formatted in a user-readable format.
 * The output file can be imported into Anki.
 */

import { exportNotes, exportNotesJson, parseNotes } from "@anki-xyz/notes-format";
import { readFileSync, writeFileSync } from "node:fs";
import { findNoteFiles, pathTo } from "./lib/io.js";

main();

function main() {
  const notes = [];
  for (const file of findNoteFiles()) {
    console.log(`Parsing file "${file}"`);
    const text = readFileSync(file, "utf-8");
    parseNotes(file, text, notes);
  }
  console.log(`Parsed ${notes.length} note(s)`);
  writeFileSync(pathTo("_notes.txt"), exportNotes(notes));
  writeFileSync(pathTo("_notes.json"), JSON.stringify(exportNotesJson(notes), null, 2));
}
