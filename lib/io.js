import { globSync } from "node:fs";
import { join } from "node:path";

export function findNoteFiles() {
  const list = [];
  const cwd = process.cwd();
  for (const item of globSync("notes/**/*.note", { cwd })) {
    list.push(join(cwd, item));
  }
  return list.sort();
}
