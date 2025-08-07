import { type NoteNode } from "./nodes.js";
import { type NoteList, noteTypes } from "./note.js";
import { parse, SyntaxError } from "./parser.js";

function parseNotes(source: string, text: string, notes: NoteList): void {
  mapNodes(makeNodes(source, text), notes);
}

function makeNodes(source: string, text: string): NoteNode[] {
  return parse(text, { grammarSource: source }) as NoteNode[];
}

function mapNodes(nodes: NoteNode[], notes: NoteList): void {
  let type = noteTypes.basic;
  let deck = null;
  let tags = null;
  let template = null;

  for (const noteNode of nodes) {
    let id = null;
    const fields: Record<string, string> = {};

    // Set note properties.
    for (const { name, value, loc } of noteNode.properties) {
      switch (name) {
        case "type": {
          const t = noteTypes.get(value);
          if (t == null) {
            throw new SyntaxError(`Unknown note type: "${value}"`, [], null, loc);
          }
          type = t;
          break;
        }
        case "deck":
          deck = value || null;
          break;
        case "tags":
          tags = value || null;
          break;
        case "template":
          template = value || null;
          break;
        case "id":
          id = value || null;
          break;
      }
    }

    // Initialize fields.
    for (const field of type.fields) {
      fields[field.name] = "";
    }

    // Set note fields.
    for (const { name, value, loc } of noteNode.fields) {
      const field = findByName(type.fields, name);
      if (field == null) {
        throw new SyntaxError(`Unknown field "${name}"`, [], null, loc);
      }
      fields[field.name] = value;
    }

    notes.add({ type, deck, tags, template, id, fields, node: noteNode });
  }
}

function findByName<T extends { readonly name: string }>(list: readonly T[], name: string): T | null {
  for (const item of list) {
    if (item.name === name) {
      return item;
    }
  }
  for (const item of list) {
    if (item.name.toLowerCase() === name.toLowerCase()) {
      return item;
    }
  }
  return null;
}

export { makeNodes, mapNodes, parseNotes };
