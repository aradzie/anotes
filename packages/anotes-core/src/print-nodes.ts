import { type NoteNode } from "@anotes/parser";

export function printNodes(nodes: Iterable<NoteNode>): string {
  const lines = [];
  let space = false;
  for (const node of nodes) {
    const { properties, fields, end } = node;
    if (space) {
      lines.push("");
      space = false;
    }
    for (const { name, value } of properties) {
      lines.push(`!${name.text}: ${value.text}`);
      space = true;
    }
    if (space) {
      lines.push("");
      space = false;
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
    space = true;
  }
  lines.push("");
  return lines.join("\n");
}
