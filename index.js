/**
 * A script that processes the input text files and compiles the output deck file.
 * The input files are formatted in a user-readable form.
 * The output file can be imported in Anki.
 */

import { marked } from "marked";
import { globSync, readFileSync, writeFileSync } from "node:fs";
import { formatNotes, parseNotes } from "./lib/anki.js";
import { latexOptions } from "./lib/latex.js";

marked.use(latexOptions);

main("_notes.txt");

function main(deckFile) {
  const notes = [];
  for (const inputFile of globSync("**/*.txt", {
    exclude: [deckFile, "tmp"],
  })) {
    console.log(`Parsing file "${inputFile}"`);
    const text = readFileSync(inputFile, "utf-8");
    parseNotes(text, notes);
  }
  console.log(`Parsed ${notes.length} note(s)`);
  console.log(`Writing file "${deckFile}"`);
  writeFileSync(deckFile, formatNotes(notes));
  writeFileSync("_notes.json", JSON.stringify(notes, null, 2));
}
