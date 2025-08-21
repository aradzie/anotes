import { type LocationRange, type NoteNode } from "@anotes/parser";
import { Note } from "./note.js";

export type IdGenerator = (node: NoteNode) => string;

export const guidGenerator: IdGenerator = () => crypto.randomUUID();

const loc = {
  source: "<generated>",
  start: { offset: 0, line: 0, column: 0 },
  end: { offset: 0, line: 0, column: 0 },
} as const satisfies LocationRange;

export function insertNoteId(nodes: NoteNode[], gen: IdGenerator = guidGenerator) {
  for (const node of nodes) {
    let field = node.fields.find(({ name }) => Note.isIdField(name.text));
    if (field == null) {
      node.fields.unshift((field = { name: { text: "id", loc }, value: { text: "", loc }, loc }));
    }
    field.value.text ||= gen(node);
  }
  return nodes;
}
