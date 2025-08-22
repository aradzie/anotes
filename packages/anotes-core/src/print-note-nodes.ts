import { type NoteNode } from "@anotes/parser";
import { Output } from "./output.js";

export function printNoteNodes(nodes: Iterable<NoteNode>): string {
  const out = new Output();
  for (const { properties, fields, end } of nodes) {
    out.separate();
    for (const { name, value } of properties) {
      out.push(`!${name.text}: ${value.text}`);
    }
    out.separate();
    for (const { name, value } of fields) {
      if (value.text.includes("\n")) {
        out.push(`!${name.text}:`);
        out.push(value.text);
      } else {
        out.push(`!${name.text}: ${value.text}`);
      }
    }
    out.push(end.text);
  }
  return out.print();
}
