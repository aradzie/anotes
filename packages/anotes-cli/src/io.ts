import { globSync } from "node:fs";
import { join, resolve } from "node:path";

const cwd = process.cwd();

export function pathTo(...file: string[]): string {
  return resolve(cwd, ...file);
}

export function findNoteFiles(dir: string): string[] {
  const files: string[] = [];
  const cwd = pathTo(dir);
  for (const item of globSync("**/*.note", { cwd })) {
    files.push(join(cwd, item));
  }
  return files.sort();
}
