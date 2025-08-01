import { globSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function pathTo(...file) {
  return resolve(dirname(fileURLToPath(import.meta.url)), "..", ...file);
}

export function findNoteFiles() {
  const list = [];
  const cwd = pathTo(".");
  for (const item of globSync("notes/**/*.note", { cwd })) {
    list.push(join(cwd, item));
  }
  return list.sort();
}
