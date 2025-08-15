import { type FieldNode, type NoteNode } from "@anotes/parser";

class NoteList implements Iterable<Note> {
  readonly #notes: Note[] = [];
  readonly #map = new Map<string, Note>();

  [Symbol.iterator](): Iterator<Note> {
    return this.#notes[Symbol.iterator]();
  }

  get length(): number {
    return this.#notes.length;
  }

  has(id: string): boolean {
    return this.#map.has(id);
  }

  get(id: string): Note | null {
    return this.#map.get(id) || null;
  }

  add(note: Note): void {
    this.#notes.push(note);
    if (note.id) {
      this.#map.set(note.id, note);
    }
  }

  insertId(gen: () => string = () => crypto.randomUUID()): void {
    for (const note of this.#notes) {
      if (!note.id) {
        note.id = gen();
        this.#map.set(note.id, note);
      }
    }
  }
}

class Note implements Iterable<NoteField> {
  readonly #type: NoteType;
  #deck: string = "";
  #tags: string = "";
  #template: string = "";
  #id: string = "";
  readonly #fields = new Map<string, NoteField>();
  #node: NoteNode | null = null;

  constructor(type: NoteType) {
    this.#type = type;
    for (const field of type.fields) {
      this.#fields.set(field.name.toLowerCase(), new NoteField(field));
    }
  }

  get type(): NoteType {
    return this.#type;
  }

  get deck(): string {
    return this.#deck;
  }

  set deck(value: string | null) {
    this.#deck = value ?? "";
  }

  get tags(): string {
    return this.#tags;
  }

  set tags(value: string | null) {
    this.#tags = value ?? "";
  }

  get template(): string {
    return this.#template;
  }

  set template(value: string | null) {
    this.#template = value ?? "";
  }

  get id(): string {
    return this.#id;
  }

  set id(value: string | null) {
    this.#id = value ?? "";
  }

  [Symbol.iterator](): Iterator<NoteField> {
    return this.#fields.values();
  }

  has(fieldName: string): boolean {
    return this.#fields.has(fieldName.toLowerCase());
  }

  get(fieldName: string): NoteField {
    const field = this.#fields.get(fieldName.toLowerCase());
    if (field == null) {
      throw new Error(`Unknown field: "${fieldName}"`);
    }
    return field;
  }

  set(fieldName: string, value: string | null): void {
    const field = this.#fields.get(fieldName.toLowerCase());
    if (field == null) {
      throw new Error(`Unknown field: "${fieldName}"`);
    }
    field.value = value;
  }

  get node(): NoteNode | null {
    return this.#node;
  }

  set node(value: NoteNode | null) {
    this.#node = value;
  }
}

class NoteField {
  readonly #type: NoteFieldType;
  #value: string = "";
  #node: FieldNode | null = null;

  constructor(type: NoteFieldType) {
    this.#type = type;
  }

  get name(): string {
    return this.#type.name;
  }

  get required(): boolean {
    return this.#type.required ?? false;
  }

  get value(): string {
    return this.#value;
  }

  set value(value: string | null) {
    this.#value = value ?? "";
  }

  get node(): FieldNode | null {
    return this.#node;
  }

  set node(value: FieldNode | null) {
    this.#node = value;
  }
}

type NoteType = {
  readonly name: string;
  readonly fields: readonly NoteFieldType[];
};

type NoteFieldType = {
  readonly name: string;
  readonly required?: boolean;
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

const noteTypes = new NoteTypeMap();

export { Note, NoteField, type NoteFieldType, NoteList, type NoteType, NoteTypeMap, noteTypes };
