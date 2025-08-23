import { NoteParser, printNoteNodes, printTypeNodes, reformatNoteNodes, reformatTypeNodes } from "@anotes/core";
import { readFileSync, writeFileSync } from "node:fs";
import { findNoteFiles } from "./io.js";

export function reformatCmd({ dir }: { dir: string }) {
  console.log(`Scanning directory "${dir}"...`);
  const { notePaths, typePaths } = findNoteFiles(dir);
  for (const path of typePaths) {
    const parser = new NoteParser();
    console.log(`Parsing types file "${path}"...`);
    const text = readFileSync(path, "utf-8");
    const nodes = parser.parseTypeNodes(path, text);
    if (parser.errors.length > 0) {
      console.error(`Parse error.`);
    } else {
      writeFileSync(path, printTypeNodes(reformatTypeNodes(nodes)));
    }
  }
  for (const path of notePaths) {
    const parser = new NoteParser();
    console.log(`Parsing notes file "${path}"...`);
    const text = readFileSync(path, "utf-8");
    const nodes = parser.parseNoteNodes(path, text);
    if (parser.errors.length > 0) {
      console.error(`Parse error.`);
    } else {
      writeFileSync(path, printNoteNodes(reformatNoteNodes(nodes)));
    }
  }
}
