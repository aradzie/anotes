/**
 * A script which automatically inserts unique identifiers to notes.
 */

import { formatNotes, parseNotes } from "@anki-xyz/notes-format";
import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { findNoteFiles } from "./lib/io.js";

main();

function main() {
  for (const file of findNoteFiles()) {
    console.log(`Parsing file "${file}"`);
    const text = readFileSync(file, "utf-8");
    const notes = [];
    parseNotes(file, text, notes);
    console.log(`Parsed ${notes.length} note(s)`);
    for (const note of notes) {
      note.id ??= randomUUID();
    }
    writeFileSync(file, formatNotes(notes));
  }
}
