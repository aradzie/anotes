import { type LocationRange, type NoteNode, parse, SyntaxError } from "@anotes/parser";
import { Note, NoteList, type NoteType, noteTypes } from "./note.js";

type NoteError = {
  message: string;
  location: LocationRange;
};

class ParseError extends Error {
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
  template: string;
};

class NoteParser {
  readonly #notes: NoteList;
  readonly #errors: NoteError[];

  constructor(notes = new NoteList()) {
    this.#notes = notes;
    this.#errors = [];
  }

  parse(source: string, text: string): this {
    this.mapNodes(this.parseNodes(source, text));
    return this;
  }

  parseNodes(source: string, text: string): NoteNode[] {
    try {
      return parse(text, { grammarSource: source });
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

  mapNodes(
    nodes: NoteNode[],
    state: ParseState = {
      type: noteTypes.basic,
      deck: "",
      tags: "",
      template: "",
    },
  ): void {
    for (const node of nodes) {
      const seen = new Set<string>();

      let id = "";

      // Set note properties.
      for (const { name, value, loc } of node.properties) {
        const nameLc = name.toLowerCase();
        if (seen.has(nameLc)) {
          this.#errors.push({ message: `Duplicate property: "${name}"`, location: loc });
          continue;
        }
        seen.add(nameLc);

        switch (nameLc) {
          case "type": {
            const type = noteTypes.get(value);
            if (type == null) {
              this.#errors.push({ message: `Unknown note type: "${value}"`, location: loc });
              continue;
            }
            state.type = type;
            break;
          }
          case "deck": {
            state.deck = value;
            break;
          }
          case "tags": {
            state.tags = value;
            break;
          }
          case "template": {
            state.template = value;
            break;
          }
          case "id": {
            if ((id = value)) {
              if (this.#notes.has(id)) {
                this.#errors.push({ message: `Duplicate ID: "${id}"`, location: loc });
                continue;
              }
            }
            break;
          }
        }
      }

      const note = new Note(state.type);
      note.deck = state.deck;
      note.tags = state.tags;
      note.template = state.template;
      note.id = id;
      note.loc = node.loc;

      // Set note fields.
      for (const { name, value, loc } of node.fields) {
        const nameLc = name.toLowerCase();
        if (seen.has(nameLc)) {
          this.#errors.push({ message: `Duplicate field: "${name}"`, location: loc });
          continue;
        }
        seen.add(nameLc);

        if (note.has(nameLc)) {
          const field = note.get(nameLc);
          field.value = value;
          field.loc = loc;
        } else {
          this.#errors.push({ message: `Unknown field "${name}"`, location: loc });
          continue;
        }
      }

      this.#notes.add(note);
    }
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

  checkErrorsGetNotes(): NoteList | never {
    this.checkErrors();
    return this.#notes;
  }
}

export { type NoteError, NoteParser, ParseError };
