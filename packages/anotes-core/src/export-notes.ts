import { formatField } from "@anotes/format";
import { type Note } from "./note.js";

export function exportNotes(notes: Iterable<Note>): string {
  const lines = [];
  lines.push(`#separator:semicolon`);
  lines.push(`#html:true`);
  lines.push(`#guid column:1`);
  lines.push(`#notetype column:2`);
  lines.push(`#deck column:3`);
  lines.push(`#tags column:4`);
  for (const note of notes) {
    lines.push(
      [note.id, note.type.name, note.deck, note.tags, ...[...note].map(({ value }) => formatField(value))]
        .map(escape)
        .join(";"),
    );
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
