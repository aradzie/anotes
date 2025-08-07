class NoteList implements Iterable<Note> {
  readonly #notes: Note[] = [];

  add(note: Note): this {
    this.#notes.push(note);
    return this;
  }

  get length(): number {
    return this.#notes.length;
  }

  [Symbol.iterator](): Iterator<Note> {
    return this.#notes[Symbol.iterator]();
  }

  insertId() {
    for (const note of this.#notes) {
      note.id ??= crypto.randomUUID();
    }
  }
}

type Note = {
  type: NoteType;
  deck: string | null;
  tags: string | null;
  template: string | null;
  id: string | null;
  fields: Record<string, string>;
};

type NoteType = {
  readonly name: string;
  readonly fields: readonly {
    readonly name: string;
    readonly required?: boolean;
  }[];
};

class NoteTypeMap implements Iterable<NoteType> {
  static readonly #basic: NoteType = {
    name: "Basic",
    fields: [
      { name: "Front", required: true }, //
      { name: "Back", required: true },
    ],
  };

  static readonly #basicAndReversedCard: NoteType = {
    name: "Basic (and reversed card)",
    fields: [
      { name: "Front", required: true }, //
      { name: "Back", required: true },
    ],
  };

  static readonly #basicOptionalReversedCard: NoteType = {
    name: "Basic (optional reversed card)",
    fields: [
      { name: "Front", required: true }, //
      { name: "Back", required: true },
      { name: "Add Reverse" },
    ],
  };

  static readonly #basicTypeInAnswer: NoteType = {
    name: "Basic (type in the answer)",
    fields: [
      { name: "Front", required: true }, //
      { name: "Back", required: true },
    ],
  };

  static readonly #cloze: NoteType = {
    name: "Cloze",
    fields: [
      { name: "Text", required: true }, //
      { name: "Back Extra" },
    ],
  };

  readonly #map = new Map<string, NoteType>();

  constructor() {
    this.add(NoteTypeMap.#basic);
    this.add(NoteTypeMap.#basicAndReversedCard);
    this.add(NoteTypeMap.#basicOptionalReversedCard);
    this.add(NoteTypeMap.#basicTypeInAnswer);
    this.add(NoteTypeMap.#cloze);
  }

  [Symbol.iterator](): Iterator<NoteType> {
    return this.#map.values();
  }

  add(type: NoteType): this {
    this.#map.set(type.name.toLowerCase(), type);
    return this;
  }

  has(name: string): boolean {
    return this.#map.has(name.toLowerCase());
  }

  get(name: string): NoteType | null {
    return this.#map.get(name.toLowerCase()) ?? null;
  }

  get basic(): NoteType {
    return NoteTypeMap.#basic;
  }
}

const noteTypes = new NoteTypeMap()
  .add({
    name: "Math",
    fields: [
      { name: "Front", required: true }, //
      { name: "Back", required: true },
      { name: "Related" },
      { name: "Example" },
    ],
  })
  .add({
    name: "Math Identity",
    fields: [
      { name: "Front", required: true }, //
      { name: "Back", required: true },
      { name: "Related" },
      { name: "Example" },
    ],
  })
  .add({
    name: "Math Definition",
    fields: [
      { name: "Front", required: true }, //
      { name: "Back", required: true },
      { name: "Related" },
      { name: "Example" },
    ],
  });

export { type Note, NoteList, type NoteType, NoteTypeMap, noteTypes };
