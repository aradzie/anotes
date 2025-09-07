import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { exportNotes, NoteParser } from "@anotes/core";
import { generatePreview } from "@anotes/preview";
import { findNoteFiles } from "./io.js";

export async function exportCmd({ dir, out, preview }: { dir: string; out: string; preview: boolean }): Promise<void> {
  const parser = new NoteParser();
  console.log(`Scanning directory "${dir}"...`);
  const { notePaths, modelPaths } = await findNoteFiles(dir);
  for (const path of modelPaths) {
    console.log(`Parsing models file "${path}"...`);
    const text = await readFile(path, "utf-8");
    parser.parseModels(path, text);
  }
  for (const path of notePaths) {
    console.log(`Parsing notes file "${path}"...`);
    const text = await readFile(path, "utf-8");
    parser.parseNotes(path, text);
  }
  parser.checkDuplicates();
  parser.checkErrors();
  const { notes } = parser;
  console.log(`Parsed ${notes.length} note(s).`);
  if (notes.length > 0) {
    await writeFile(out, exportNotes(notes));
    console.log(`Exported notes to "${out}".`);
    if (preview) {
      const previewOut = path.format({ ...path.parse(out), base: undefined, ext: ".html" });
      await writeFile(previewOut, generatePreview(notes));
      console.log(`Generated preview to "${previewOut}".`);
    }
  } else {
    console.warn(`No notes found in "${dir}".`);
  }
}
