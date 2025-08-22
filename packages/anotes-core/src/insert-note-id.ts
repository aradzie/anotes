import { type NoteNode } from "@anotes/parser";
import { loc } from "./loc.js";
import { Note } from "./note.js";

export type IdGenerator = (node: NoteNode) => string;

export const guidGenerator: IdGenerator = () => crypto.randomUUID();

export function insertNoteId(nodes: NoteNode[], gen: IdGenerator = guidGenerator): boolean {
  let changed = false;
  for (const node of nodes) {
    let field = node.fields.find(({ name }) => Note.isIdField(name.text));
    if (field == null) {
      node.fields.unshift((field = { name: { text: "id", loc }, value: { text: "", loc }, loc }));
    }
    const { value } = field;
    if (!value.text) {
      value.text = gen(node);
      changed = true;
    }
  }
  return changed;
}
