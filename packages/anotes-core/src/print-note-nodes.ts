import { type NoteNode } from "@anotes/parser";
import { Output } from "./output.js";

export function printNoteNodes(nodes: Iterable<NoteNode>): string {
  const out = new Output();
  for (const { properties, fields, end } of nodes) {
    out.separate();
    for (const { name, value } of properties) {
      if (value.text) {
        out.print(`!${name.text}: ${value.text}`);
      } else {
        out.print(`!${name.text}:`);
      }
    }
    out.separate();
    for (const { name, value } of fields) {
      if (value.text) {
        if (value.text.includes("\n")) {
          out.print(`!${name.text}:`);
          out.print(value.text);
        } else {
          out.print(`!${name.text}: ${value.text}`);
        }
      } else {
        out.print(`!${name.text}:`);
      }
    }
    out.print(end.text);
  }
  return String(out);
}
