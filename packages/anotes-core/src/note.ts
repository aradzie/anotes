import { type FieldNode, type NoteNode, type PropertyNode } from "@anotes/parser";
import { loc } from "./nodes.js";

export class NoteList implements Iterable<Note> {
  readonly #types: ModelMap;
  readonly #notes: Note[];

  constructor(types = new ModelMap()) {
    this.#types = types;
    this.#notes = [];
  }

  get types(): ModelMap {
    return this.#types;
  }

  [Symbol.iterator](): Iterator<Note> {
    return this.#notes[Symbol.iterator]();
  }

  get length(): number {
    return this.#notes.length;
  }

  add(note: Note): void {
    this.#notes.push(note);
  }
}

export class Note implements Iterable<NoteField> {
  readonly #type: Model;
  #deck: string = "";
  #tags: string = "";
  readonly #id = new NoteField({ name: "ID", required: false });
  readonly #fields = new Map<string, NoteField>();
  #node: NoteNode | null = null;

  constructor(type: Model) {
    this.#type = type;
    for (const field of type.fields) {
      this.#fields.set(field.name.toLowerCase(), new NoteField(field));
    }
  }

  get type(): Model {
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

  get id(): string {
    return this.#id.value;
  }

  set id(value: string | null) {
    this.#id.value = value;
  }

  [Symbol.iterator](): Iterator<NoteField> {
    return this.#fields.values();
  }

  has(fieldName: string): boolean {
    const key = fieldName.toLowerCase();
    if (key === "id") {
      return true;
    }
    return this.#fields.has(key);
  }

  get(fieldName: string): NoteField {
    return this.#getField(fieldName);
  }

  set(fieldName: string, value: string | null): void {
    this.#getField(fieldName).value = value;
  }

  #getField(fieldName: string): NoteField {
    const key = fieldName.toLowerCase();
    if (key === "id") {
      return this.#id;
    }
    const field = this.#fields.get(key);
    if (field != null) {
      return field;
    }
    throw new Error(`Unknown field: "${fieldName}"`);
  }

  get first(): NoteField {
    const [first] = this.#fields.values();
    if (first != null) {
      return first;
    }
    throw new Error("No fields");
  }

  get node(): NoteNode | null {
    return this.#node;
  }

  set node(value: NoteNode | null) {
    this.#node = value;
  }

  toNode(): NoteNode {
    const properties: PropertyNode[] = [];
    properties.push({ name: { text: "type", loc }, value: { text: this.#type.name, loc }, loc });
    properties.push({ name: { text: "deck", loc }, value: { text: this.#deck, loc }, loc });
    properties.push({ name: { text: "tags", loc }, value: { text: this.#tags, loc }, loc });
    const fields: FieldNode[] = [];
    if (this.#id.value) {
      fields.push(this.#id.toNode());
    }
    for (const field of this.#fields.values()) {
      if (field.value) {
        fields.push(field.toNode());
      }
    }
    return {
      properties,
      fields,
      end: { text: "~~~", loc },
      loc,
    };
  }

  static isIdField(fieldName: string): boolean {
    return fieldName.toLowerCase() === "id";
  }
}

export class NoteField {
  readonly #type: ModelField;
  #value: string = "";
  #node: FieldNode | null = null;

  constructor(type: ModelField) {
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

  toNode(): FieldNode {
    return {
      name: { text: this.#type.name.toLowerCase(), loc },
      value: { text: this.#value, loc },
      loc,
    };
  }
}

export type Model = {
  readonly name: string;
  readonly id: number;
  readonly cloze: boolean;
  readonly fields: readonly ModelField[];
  readonly cards: readonly ModelCard[];
  readonly styling: string;
};

export type ModelField = {
  readonly name: string;
  readonly required: boolean;
};

export type ModelCard = {
  readonly name: string;
  readonly front: string;
  readonly back: string;
};

export class ModelMap implements Iterable<Model> {
  static readonly basic = {
    name: "Basic",
    id: 1607392319,
    cloze: false,
    fields: [
      { name: "Front", required: true },
      { name: "Back", required: true },
    ],
    cards: [
      {
        name: "Card 1",
        front: "{{Front}}",
        back: '{{FrontSide}}<hr id="answer">{{Back}}',
      },
    ],
    styling: "",
  } as const satisfies Model;

  static readonly basicAndReversedCard = {
    name: "Basic (and reversed card)",
    id: 1607392320,
    cloze: false,
    fields: [
      { name: "Front", required: true },
      { name: "Back", required: true },
    ],
    cards: [
      {
        name: "Card 1",
        front: "{{Front}}",
        back: '{{FrontSide}}<hr id="answer">{{Back}}',
      },
      {
        name: "Card 2",
        front: "{{Back}}",
        back: '{{FrontSide}}<hr id="answer">{{Front}}',
      },
    ],
    styling: "",
  } as const satisfies Model;

  static readonly basicOptionalReversedCard = {
    name: "Basic (optional reversed card)",
    id: 1607392321,
    cloze: false,
    fields: [
      { name: "Front", required: true },
      { name: "Back", required: true },
      { name: "Add Reverse", required: false },
    ],
    cards: [
      {
        name: "Card 1",
        front: "{{Front}}",
        back: '{{FrontSide}}<hr id="answer">{{Back}}',
      },
      {
        name: "Card 2",
        front: "{{#Add Reverse}}{{Back}}{{/Add Reverse}}",
        back: '{{FrontSide}}<hr id="answer">{{Front}}',
      },
    ],
    styling: "",
  } as const satisfies Model;

  static readonly basicTypeInAnswer = {
    name: "Basic (type in the answer)",
    id: 1607392322,
    cloze: false,
    fields: [
      { name: "Front", required: true },
      { name: "Back", required: true },
    ],
    cards: [
      {
        name: "Card 1",
        front: "{{Front}}<br>{{type:Back}}",
        back: '{{Front}}<hr id="answer">{{Back}}',
      },
    ],
    styling: "",
  } as const satisfies Model;

  static readonly cloze = {
    name: "Cloze",
    id: 1607392323,
    cloze: true,
    fields: [
      { name: "Text", required: true },
      { name: "Back Extra", required: false },
    ],
    cards: [
      {
        name: "Cloze",
        front: "{{cloze:Text}}",
        back: "{{cloze:Text}}<br>{{Back Extra}}",
      },
    ],
    styling: "",
  } as const satisfies Model;

  readonly #map = new Map<string, Model>();

  constructor(
    initial: Iterable<Model> = [
      ModelMap.basic,
      ModelMap.basicAndReversedCard,
      ModelMap.basicOptionalReversedCard,
      ModelMap.basicTypeInAnswer,
      ModelMap.cloze,
    ],
  ) {
    for (const model of initial) {
      this.add(model);
    }
  }

  [Symbol.iterator](): Iterator<Model> {
    return this.#map.values();
  }

  add(model: Model): this {
    this.#map.set(model.name.toLowerCase(), model);
    return this;
  }

  has(name: string): boolean {
    return this.#map.has(name.toLowerCase());
  }

  get(name: string): Model | null {
    return this.#map.get(name.toLowerCase()) ?? null;
  }
}
