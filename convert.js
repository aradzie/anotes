import { globSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseNotes } from "./lib/anki.js";

main();

function main() {
  const cwd = process.cwd();
  for (const item of globSync("notes/**/*.note", { cwd })) {
    const file = join(cwd, item);
    console.log(`Converting file "${file}"`);
    const text = readFileSync(file, "utf-8");
    const notes = [];
    parseNotes(text, notes);
    console.log(`Parsed ${notes.length} note(s)`);
    writeFileSync(file, formatNotes(notes));
  }
}

function formatNotes(notes) {
  const lines = [];
  let type0 = "";
  let deck0 = "";
  let tags0 = "";
  let template0 = "";
  for (let {
    type,
    deck,
    tags,
    template,
    fields: { front, back },
  } of notes) {
    if (type !== type0) {
      lines.push(`!type:${type}`);
    }
    if (deck !== deck0) {
      lines.push(`!deck:${deck}`);
    }
    if (tags !== tags0) {
      lines.push(`!tags:${tags}`);
    }
    if (template !== template0) {
      lines.push(`!template:${template}`);
    }
    front = front.trim();
    back = back.trim();
    lines.push("");
    if (isMultiline(front)) {
      lines.push(`!front:`);
      lines.push(front);
    } else {
      lines.push(`!front: ${front}`);
    }
    if (isMultiline(back)) {
      lines.push(`!back:`);
      lines.push(back);
    } else {
      lines.push(`!back: ${back}`);
    }
    lines.push("~~~");
    type0 = type;
    deck0 = deck;
    tags0 = tags;
    template0 = template;
  }
  lines.push("");
  return lines.join("\n");
}

function isMultiline(value) {
  return value.includes("\n");
}
