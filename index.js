/**
 * A script that processes the input text files and compiles the output deck file.
 * The input files are formatted in a user-readable form.
 * The output file can be imported in Anki.
 */

import { globSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { formatNotes, formatNotesJson, parseNotes } from "./lib/anki.js";

main();

function main() {
  const notes = [];
  const cwd = process.cwd();
  for (const item of globSync("notes/**/*.note", { cwd })) {
    const file = join(cwd, item);
    console.log(`Parsing file "${file}"`);
    const text = readFileSync(file, "utf-8");
    parseNotes(file, text, notes);
  }
  console.log(`Parsed ${notes.length} note(s)`);
  writeFileSync(join(cwd, "_notes.txt"), formatNotes(notes));
  writeFileSync(join(cwd, "_notes.json"), JSON.stringify(formatNotesJson(notes), null, 2));
}
