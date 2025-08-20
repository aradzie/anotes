import { type LocationRange, type NoteNode } from "@anotes/parser";

export type IdGenerator = (node: NoteNode) => string;

export const guidGenerator: IdGenerator = () => crypto.randomUUID();

const loc = {
  source: "<generated>",
  start: { offset: 0, line: 0, column: 0 },
  end: { offset: 0, line: 0, column: 0 },
} as const satisfies LocationRange;

export function insertNoteId(nodes: NoteNode[], gen: IdGenerator = guidGenerator) {
  for (const node of nodes) {
    let field = node.fields.find(({ name }) => name.text === "id");
    if (field == null) {
      node.fields.unshift((field = { name: { text: "id", loc }, value: { text: "", loc }, loc }));
    }
    let id = field.value.text;
    if (id === "") {
      field.value.text = id = gen(node);
    }
  }
  return nodes;
}
