import { globSync } from "node:fs";
import { join, resolve } from "node:path";

const cwd = process.cwd();

export function pathTo(...file: string[]): string {
  return resolve(cwd, ...file);
}

export function findNoteFiles(dir: string) {
  const notePaths: string[] = [];
  const modelPaths: string[] = [];
  const cwd = pathTo(dir);
  for (const item of globSync("**/*.{note,model}", { cwd })) {
    const path = join(cwd, item);
    switch (true) {
      case item.endsWith(".note"):
        notePaths.push(path);
        break;
      case item.endsWith(".model"):
        modelPaths.push(path);
        break;
    }
  }
  notePaths.sort();
  modelPaths.sort();
  return { notePaths, modelPaths };
}
