import { type Note } from "./note.js";

function formatNotes(notes: Iterable<Readonly<Note>>): string {
  const lines = [];
  let type0 = null;
  let deck0 = null;
  let tags0 = null;
  let template0 = null;
  for (const { type, deck, tags, template, id, fields } of notes) {
    if (type.name !== type0) {
      lines.push(`!type: ${type.name}`);
    }
    if (deck !== deck0) {
      lines.push(`!deck: ${deck ?? ""}`);
    }
    if (tags !== tags0) {
      lines.push(`!tags: ${tags ?? ""}`);
    }
    if (template !== template0) {
      lines.push(`!template: ${template ?? ""}`);
    }
    lines.push("");
    if (id) {
      lines.push(`!id: ${id}`);
    }
    for (const { name } of type.fields) {
      const value = fields[name]?.trim();
      if (value) {
        if (isMultiline(value)) {
          lines.push(`!${name.toLowerCase()}:`);
          lines.push(value);
        } else {
          lines.push(`!${name.toLowerCase()}: ${value}`);
        }
      }
    }
    lines.push("~~~");
    type0 = type.name;
    deck0 = deck;
    tags0 = tags;
    template0 = template;
  }
  lines.push("");
  return lines.join("\n");
}

function isMultiline(value: string): boolean {
  return value.includes("\n");
}

export { formatNotes };
