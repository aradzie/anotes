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
    for (const noteNode of nodes) {
      const seen = new Set<string>();

      let id = "";

      // Set note properties.
      for (const { name, value } of noteNode.properties) {
        const nameLc = name.text.toLowerCase();
        if (seen.has(nameLc)) {
          this.#errors.push({ message: `Duplicate property: "${name.text}"`, location: name.loc });
          continue;
        }
        seen.add(nameLc);

        switch (nameLc) {
          case "type": {
            const type = noteTypes.get(value.text);
            if (type == null) {
              this.#errors.push({ message: `Unknown note type: "${value.text}"`, location: value.loc });
              continue;
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
          case "template": {
            state.template = value.text;
            break;
          }
          case "id": {
            if ((id = value.text)) {
              if (this.#notes.has(id)) {
                this.#errors.push({ message: `Duplicate ID: "${value.text}"`, location: value.loc });
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
      note.node = noteNode;

      // Set note fields.
      for (const fieldNode of noteNode.fields) {
        const { name, value } = fieldNode;
        const nameLc = name.text.toLowerCase();
        if (seen.has(nameLc)) {
          this.#errors.push({ message: `Duplicate field: "${name.text}"`, location: name.loc });
          continue;
        }
        seen.add(nameLc);

        if (note.has(nameLc)) {
          const field = note.get(nameLc);
          field.value = value.text;
          field.node = fieldNode;
        } else {
          this.#errors.push({ message: `Unknown field: "${name.text}"`, location: name.loc });
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
