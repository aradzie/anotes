import { type Note, type NoteType } from "./note.js";

function formatNotes(notes: Iterable<Readonly<Note>>): string {
  const lines = [];
  const state = {
    type: { name: "", id: 0, fields: [] } as NoteType,
    deck: "",
    tags: "",
    template: "",
    count: 1,
  };
  for (const note of notes) {
    const { type, deck, tags, template, id } = note;
    if (type !== state.type || deck !== state.deck || tags !== state.tags || template !== state.template) {
      if (state.count > 1) {
        lines.push("");
      }
      if (type !== state.type) {
        lines.push(`!type: ${type.name}`);
        state.type = type;
      }
      if (deck !== state.deck) {
        lines.push(`!deck: ${deck ?? ""}`);
        state.deck = deck;
      }
      if (tags !== state.tags) {
        lines.push(`!tags: ${tags ?? ""}`);
        state.tags = tags;
      }
      if (template !== state.template) {
        lines.push(`!template: ${template ?? ""}`);
        state.template = template;
      }
    }
    lines.push("");
    if (id) {
      lines.push(`!id: ${id}`);
    }
    for (const { name, value } of note) {
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
    state.count += 1;
  }
  lines.push("");
  return lines.join("\n");
}

function isMultiline(value: string): boolean {
  return value.includes("\n");
}

export { formatNotes };
