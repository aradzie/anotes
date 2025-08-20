import { readFileSync, writeFileSync } from "node:fs";
import { insertNoteId, NoteParser, printNodes } from "@anotes/core";
import { findNoteFiles } from "./io.js";

export function insertIdCmd({ dir }: { dir: string }) {
  console.log(`Scanning directory "${dir}"...`);
  const { notePaths } = findNoteFiles(dir);
  for (const file of notePaths) {
    const parser = new NoteParser();
    console.log(`Parsing file "${file}"...`);
    const text = readFileSync(file, "utf-8");
    const nodes = parser.parseNoteNodes(file, text);
    parser.checkErrors();
    console.log(`Parsed ${nodes.length} note(s).`);
    writeFileSync(file, printNodes(insertNoteId(nodes)));
  }
}
