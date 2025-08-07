import { formatMath } from "./math/index.js";
import { type Note } from "./note.js";

function exportNotes(notes: Iterable<Readonly<Note>>): string {
  const lines = [];
  lines.push(`#separator:semicolon`);
  lines.push(`#html:true`);
  lines.push(`#guid column:1`);
  lines.push(`#notetype column:2`);
  lines.push(`#deck column:3`);
  lines.push(`#tags column:4`);
  for (const { type, deck, tags, id, fields } of notes) {
    const fmt = [];
    for (const { name } of type.fields) {
      const value = fields[name]?.trim();
      fmt.push(value ? formatMath(value) : "");
    }
    lines.push([id, type.name, deck, tags, ...fmt].map(escape).join(";"));
  }
  lines.push("");
  return lines.join("\n");
}

function escape(value: string | null): string {
  if (value == null) {
    return "";
  }
  if (value.includes(";") || value.includes("\n") || value.includes('"')) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export { exportNotes };
