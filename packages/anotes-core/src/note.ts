type Note = {
  type: NoteType;
  deck: string;
  tags: string;
  template: string;
  id: string | null;
  fields: Record<string, string>;
};

type NoteType = {
  name: string;
  fields: NoteField[];
};

type NoteField = {
  name: string;
  required?: boolean;
};

const basicNoteType = {
  name: "Basic",
  fields: [
    { name: "Front", required: true }, //
    { name: "Back", required: true },
  ],
} as const satisfies NoteType;

const basicReversedNoteType = {
  name: "Basic (and reversed card)",
  fields: [
    { name: "Front", required: true }, //
    { name: "Back", required: true },
  ],
} as const satisfies NoteType;

const clozeNoteType = {
  name: "Cloze",
  fields: [
    { name: "Text", required: true }, //
    { name: "Back Extra" },
  ],
} as const satisfies NoteType;

const noteTypes: readonly NoteType[] = [
  basicNoteType,
  basicReversedNoteType,
  clozeNoteType,
  {
    name: "Math",
    fields: [
      { name: "Front", required: true }, //
      { name: "Back", required: true },
      { name: "Related" },
      { name: "Example" },
    ],
  },
  {
    name: "Math Identity",
    fields: [
      { name: "Front", required: true }, //
      { name: "Back", required: true },
      { name: "Related" },
      { name: "Example" },
    ],
  },
  {
    name: "Math Definition",
    fields: [
      { name: "Front", required: true }, //
      { name: "Back", required: true },
      { name: "Related" },
      { name: "Example" },
    ],
  },
];

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

export {
  type Note,
  type NoteType,
  type NoteField,
  noteTypes,
  basicNoteType,
  basicReversedNoteType,
  clozeNoteType,
  findByName,
};
