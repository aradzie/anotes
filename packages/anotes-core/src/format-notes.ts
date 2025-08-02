import type { Note } from "./note.js";

function formatNotes(notes: readonly Note[]): string {
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
    id,
    fields: { front = "", back = "" },
  } of notes) {
    if (type !== type0) {
      lines.push(`!type: ${type}`);
    }
    if (deck !== deck0) {
      lines.push(`!deck: ${deck}`);
    }
    if (tags !== tags0) {
      lines.push(`!tags: ${tags}`);
    }
    if (template !== template0) {
      lines.push(`!template: ${template}`);
    }
    lines.push("");

    if (id) {
      lines.push(`!id: ${id}`);
    }

    front = front.trim();
    if (isMultiline(front)) {
      lines.push(`!front:`);
      lines.push(front);
    } else {
      lines.push(`!front: ${front}`);
    }

    back = back.trim();
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

function isMultiline(value: string): boolean {
  return value.includes("\n");
}

export { formatNotes };
