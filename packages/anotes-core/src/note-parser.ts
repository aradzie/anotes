import {
  type LocationRange,
  type NoteNode,
  parseNoteList,
  parseTypeDefList,
  SyntaxError,
  type Token,
  type TypeDefNode,
} from "@anotes/parser";
import { Note, type NoteCardType, type NoteFieldType, NoteList, type NoteType, NoteTypeMap } from "./note.js";

const unknown = {
  source: "<unknown>",
  start: { offset: 0, line: 0, column: 0 },
  end: { offset: 0, line: 0, column: 0 },
} as const satisfies LocationRange;

export type NoteError = {
  message: string;
  location: LocationRange;
};

export class ParseError extends Error {
  errors: NoteError[];

  constructor(errors: Iterable<NoteError>) {
    super();
    this.name = "ParseError";
    this.message = "Note parsing error";
    this.errors = [...errors];
  }
}

type ParseState = {
  type: NoteType;
  deck: string;
  tags: string;
};

export class NoteParser {
  readonly #notes: NoteList;
  readonly #errors: NoteError[];

  constructor(notes = new NoteList()) {
    this.#notes = notes;
    this.#errors = [];
  }

  get notes(): NoteList {
    return this.#notes;
  }

  get errors(): NoteError[] {
    return this.#errors;
  }

  checkErrors(): void | never {
    if (this.#errors.length > 0) {
      throw new ParseError(this.#errors);
    }
  }

  checkDuplicates() {
    const byId = new Map<string, Note[]>();
    const byTitle = new Map<string, Note[]>();
    for (const note of this.#notes) {
      const { id } = note;
      if (id) {
        let list = byId.get(id);
        if (list == null) {
          byId.set(id, (list = []));
        }
        list.push(note);
      }
      const { value } = note.first;
      const title = value.trim().replaceAll(/\s+/g, " ");
      if (title) {
        let list = byTitle.get(title);
        if (list == null) {
          byTitle.set(title, (list = []));
        }
        list.push(note);
      }
    }
    for (const [key, list] of byId) {
      if (list.length > 1) {
        for (const note of list) {
          const { node } = note.get("id");
          this.#errors.push({ message: `Duplicate ID: "${key}"`, location: node?.value.loc ?? unknown });
        }
      }
    }
    for (const [key, list] of byTitle) {
      if (list.length > 1) {
        for (const note of list) {
          const { node } = note.first;
          this.#errors.push({ message: `Duplicate note: "${key}"`, location: node?.value.loc ?? unknown });
        }
      }
    }
  }

  parseTypes(path: string, text: string): this {
    this.walkTypeNodes(this.parseTypeNodes(path, text));
    return this;
  }

  parseTypeNodes(path: string, text: string): TypeDefNode[] {
    try {
      return parseTypeDefList(text, path);
    } catch (err) {
      if (err instanceof SyntaxError) {
        const { message, location } = err;
        this.#errors.push({ message, location });
      } else {
        throw err;
      }
      return [];
    }
  }

  walkTypeNodes(nodes: TypeDefNode[]) {
    for (const node of nodes) {
      this.walkTypeNode(node);
    }
  }

  walkTypeNode(node: TypeDefNode) {
    if (this.#notes.types.has(node.name.text)) {
      this.#errors.push({ message: `Duplicate type: "${node.name.text}"`, location: node.name.loc });
      return;
    }

    const fields: NoteFieldType[] = [];
    const seenFields = new SeenNames();
    for (const fieldNode of node.fields) {
      const { name, required } = fieldNode;
      if (seenFields.seen(name)) {
        this.#errors.push({ message: `Duplicate field: "${name.text}"`, location: name.loc });
        return;
      }
      fields.push({
        name: name.text,
        required,
      });
    }

    const cards: NoteCardType[] = [];
    const seenCards = new SeenNames();
    for (const cardNode of node.cards) {
      const { name, front, back } = cardNode;
      if (seenCards.seen(name)) {
        this.#errors.push({ message: `Duplicate card: "${name.text}"`, location: name.loc });
        return;
      }
      cards.push({
        name: name.text,
        front: front?.text ?? "",
        back: back?.text ?? "",
      });
    }

    this.#notes.types.add({
      name: node.name.text,
      id: node.id.value,
      fields,
      cards,
      styling: node.styling?.text ?? "",
    });
  }

  parseNotes(path: string, text: string): this {
    this.walkNoteNodes(this.parseNoteNodes(path, text));
    return this;
  }

  parseNoteNodes(path: string, text: string): NoteNode[] {
    try {
      return parseNoteList(text, path);
    } catch (err) {
      if (err instanceof SyntaxError) {
        const { message, location } = err;
        this.#errors.push({ message, location });
      } else {
        throw err;
      }
      return [];
    }
  }

  walkNoteNodes(
    nodes: NoteNode[],
    state: ParseState = {
      type: NoteTypeMap.basic,
      deck: "",
      tags: "",
    },
  ) {
    for (const noteNode of nodes) {
      this.walkNoteNode(noteNode, state);
    }
  }

  walkNoteNode(noteNode: NoteNode, state: ParseState) {
    const seen = new SeenNames();

    // Set note properties.
    for (const { name, value } of noteNode.properties) {
      if (seen.seen(name)) {
        this.#errors.push({ message: `Duplicate property: "${name.text}"`, location: name.loc });
        return;
      }

      switch (name.text) {
        case "type": {
          const type = this.#notes.types.get(value.text);
          if (type == null) {
            this.#errors.push({ message: `Unknown note type: "${value.text}"`, location: value.loc });
            return;
          }
          state.type = type;
          break;
        }
        case "deck": {
          state.deck = value.text;
          break;
        }
        case "tags": {
          state.tags = value.text;
          break;
        }
      }
    }

    const note = new Note(state.type);
    note.deck = state.deck;
    note.tags = state.tags;
    note.node = noteNode;

    // Set note fields.
    for (const fieldNode of noteNode.fields) {
      const { name, value } = fieldNode;

      if (seen.seen(name)) {
        this.#errors.push({ message: `Duplicate field: "${name.text}"`, location: name.loc });
        return;
      }

      if (note.has(name.text)) {
        const field = note.get(name.text);
        field.value = value.text;
        field.node = fieldNode;
      } else {
        this.#errors.push({ message: `Unknown field: "${name.text}"`, location: name.loc });
        return;
      }
    }

    this.#notes.add(note);
  }
}

class SeenNames {
  readonly #set = new Set<string>();

  seen(name: Token): boolean {
    const key = name.text.toLowerCase();
    if (this.#set.has(key)) {
      return true;
    } else {
      this.#set.add(key);
      return false;
    }
  }
}
