/**
 * A script that processes input text files and compiles an output deck file.
 * The input files are formatted in a user-readable format.
 * The output file can be imported into Anki.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { formatNotes, formatNotesJson, parseNotes } from "./lib/anki.js";
import { findNoteFiles } from "./lib/io.js";

main();

function main() {
  const notes = [];
  const cwd = process.cwd();
  for (const file of findNoteFiles()) {
    console.log(`Parsing file "${file}"`);
    const text = readFileSync(file, "utf-8");
    parseNotes(file, text, notes);
  }
  console.log(`Parsed ${notes.length} note(s)`);
  writeFileSync(join(cwd, "_notes.txt"), formatNotes(notes));
  writeFileSync(join(cwd, "_notes.json"), JSON.stringify(formatNotesJson(notes), null, 2));
}
