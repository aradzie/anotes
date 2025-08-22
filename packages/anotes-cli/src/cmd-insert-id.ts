import { readFileSync, writeFileSync } from "node:fs";
import { insertNoteId, NoteParser, printNoteNodes } from "@anotes/core";
import { findNoteFiles } from "./io.js";

export function insertIdCmd({ dir }: { dir: string }) {
  console.log(`Scanning directory "${dir}"...`);
  const { notePaths } = findNoteFiles(dir);
  for (const path of notePaths) {
    const parser = new NoteParser();
    console.log(`Parsing notes file "${path}"...`);
    const text = readFileSync(path, "utf-8");
    const nodes = parser.parseNoteNodes(path, text);
    if (parser.errors.length > 0) {
      console.error(`Parse error.`);
    } else {
      if (insertNoteId(nodes)) {
        writeFileSync(path, printNoteNodes(nodes));
      }
    }
  }
}
