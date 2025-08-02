import { allFields } from "./fields.js";
import type { Note } from "./note.js";

function exportNotes(notes: readonly Note[]): string {
  const lines = [];
  lines.push(`#separator:semicolon`);
  lines.push(`#html:true`);
  lines.push(`#guid column:1`);
  lines.push(`#notetype column:2`);
  lines.push(`#deck column:3`);
  lines.push(`#tags column:4`);
  for (const { type, deck, tags, template, id, fields } of notes) {
    const fmt = [];
    for (const [name, config] of allFields) {
      const value = fields[name];
      fmt.push(value ? config.format(value, template) : "");
    }
    lines.push([id, type, deck, tags, ...fmt].map(formatField).join(";"));
  }
  lines.push("");
  return lines.join("\n");
}

function formatField(value: string | null): string {
  if (value === null) {
    return "";
  }
  if (value.includes(";") || value.includes("\n") || value.includes('"')) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function exportNotesJson(notes: readonly Note[]): unknown {
  return notes.map(({ type, deck, tags, template, id, fields }) => {
    const fmt: Record<string, string> = {};
    for (const [name, config] of allFields) {
      const value = fields[name];
      fmt[name] = value ? config.format(value, template) : "";
    }
    return { id, type, deck, tags, fields: fmt };
  });
}

export { exportNotes, exportNotesJson };
