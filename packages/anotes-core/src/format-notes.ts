import { type NoteNode } from "@anotes/parser";

function formatNotes(nodes: Iterable<NoteNode>): string {
  const lines = [];
  for (const node of nodes) {
    const { properties, fields, end } = node;
    if (lines.length > 0) {
      lines.push("");
    }
    for (const { name, value } of properties) {
      lines.push(`!${name.text}: ${value.text}`);
    }
    for (const { name, value } of fields) {
      if (value.text.includes("\n")) {
        lines.push(`!${name.text}:`);
        lines.push(value.text);
      } else {
        lines.push(`!${name.text}: ${value.text}`);
      }
    }
    lines.push(end.text);
  }
  lines.push("");
  return lines.join("\n");
}

export { formatNotes };
