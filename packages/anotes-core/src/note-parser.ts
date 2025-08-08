import { type LocationRange, type NoteNode, parse, SyntaxError } from "@anotes/parser";
import { NoteList, noteTypes } from "./note.js";

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

class NoteParser {
  readonly #notes: NoteList;
  readonly #errors: NoteError[];
  readonly #id = new Map<string, LocationRange>();

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

  mapNodes(nodes: NoteNode[]): void {
    let type = noteTypes.basic;
    let deck = null;
    let tags = null;
    let template = null;

    for (const noteNode of nodes) {
      let id = null;
      const fields: Record<string, string> = {};
      const seen = new Set<string>();

      // Set note properties.
      for (const { name, value, loc } of noteNode.properties) {
        if (seen.has(name)) {
          this.#errors.push({ message: `Duplicate property: "${name}"`, location: loc });
          continue;
        }
        seen.add(name);
        switch (name) {
          case "type": {
            const t = noteTypes.get(value);
            if (t == null) {
              this.#errors.push({ message: `Unknown note type: "${value}"`, location: loc });
              continue;
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
            if (id) {
              if (this.#id.has(id)) {
                this.#errors.push({ message: `Duplicate ID: "${id}"`, location: loc });
                continue;
              } else {
                this.#id.set(id, loc);
              }
            }
            break;
        }
      }

      // Initialize fields.
      for (const field of type.fields) {
        fields[field.name] = "";
      }

      // Set note fields.
      for (const { name, value, loc } of noteNode.fields) {
        if (seen.has(name)) {
          this.#errors.push({ message: `Duplicate field: "${name}"`, location: loc });
          continue;
        }
        seen.add(name);
        const field = findByName(type.fields, name);
        if (field == null) {
          this.#errors.push({ message: `Unknown field "${name}"`, location: loc });
          continue;
        }
        fields[field.name] = value;
      }

      this.#notes.add({ type, deck, tags, template, id, fields, node: noteNode });
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

export { type NoteError, NoteParser, ParseError };
