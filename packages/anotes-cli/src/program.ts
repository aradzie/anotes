import { ParseError } from "@anotes/core";
import { Command } from "commander";
import { exportCmd } from "./cmd-export.js";
import { insertIdCmd } from "./cmd-insert-id.js";
import { pathTo } from "./io.js";

const program = new Command();

program
  .name("anotes")
  .description("Build Anki notes from text files written in a human readable format.")
  .version("0.0.0");

program
  .command("export")
  .description("build and export Anki notes from text files")
  .option("--dir <dir>", "name of the directory with note source files", parsePath, parsePath("."))
  .option("--out <file>", "output file name", parsePath, parsePath("notes.txt"))
  .action(exportCmd);

program
  .command("insert-id")
  .description("insert unique note id to each Anki note, but only if missing")
  .option("--dir <dir>", "name of the directory with note source files", parsePath, parsePath("."))
  .action(insertIdCmd);

try {
  program.parse();
} catch (err) {
  if (err instanceof ParseError) {
    for (const {
      message,
      location: { source, start },
    } of err.errors) {
      console.error(`Error: ${message} at ${String(source)}:${start.line}:${start.column}`);
    }
  } else {
    throw err;
  }
}

function parsePath(value: string): string {
  return pathTo(value);
}
