import { NoteParser, printNoteNodes, printModelNodes, reformatNoteNodes, reformatModelNodes } from "@anotes/core";
import { readFileSync, writeFileSync } from "node:fs";
import { findNoteFiles } from "./io.js";

export function reformatCmd({ dir }: { dir: string }) {
  console.log(`Scanning directory "${dir}"...`);
  const { notePaths, modelPaths } = findNoteFiles(dir);
  for (const path of modelPaths) {
    const parser = new NoteParser();
    console.log(`Parsing models file "${path}"...`);
    const text = readFileSync(path, "utf-8");
    const nodes = parser.parseModelNodes(path, text);
    if (parser.errors.length > 0) {
      console.error(`Parse error.`);
    } else {
      writeFileSync(path, printModelNodes(reformatModelNodes(nodes)));
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
