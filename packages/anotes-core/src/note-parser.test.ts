import { test } from "node:test";
import { like } from "rich-assert";
import { Note, NoteList, noteTypes } from "./note.js";
import { NoteParser } from "./note-parser.js";

test("parse", () => {
  const parser = new NoteParser();

  parser.parse(
    "example.notes",
    `
!type: basic
!deck: example
!tags: tag1 tag2
!id: 123
!front: 123-abc
!back: 123-xyz
~~~
!id: 456
!front: 456-abc
!back: 456-xyz
~~~`,
  );

  like([...parser.errors], []);
  like(
    [...parser.notes].map((note) => ({
      type: note.type,
      deck: note.deck,
      tags: note.tags,
      id: note.id,
      fields: [...note],
    })),
    [
      {
        type: { name: "Basic" },
        deck: "example",
        tags: "tag1 tag2",
        id: "123",
        fields: [
          { name: "Front", value: "123-abc" },
          { name: "Back", value: "123-xyz" },
        ],
      },
      {
        type: { name: "Basic" },
        deck: "example",
        tags: "tag1 tag2",
        id: "456",
        fields: [
          { name: "Front", value: "456-abc" },
          { name: "Back", value: "456-xyz" },
        ],
      },
    ],
  );
});

test("error: syntax", () => {
  const parser = new NoteParser();

  parser.parse("example.notes", `!type: basic\n!a:1\n!b:2\n`);

  like([...parser.errors], [{ message: 'Expected "~~~" or field but end of input found.' }]);
});

test("error: unknown note type", () => {
  const parser = new NoteParser();

  parser.parse("example.notes", `!type: haha\n!a:1\n!b:2\n~~~`);

  like(
    [...parser.errors],
    [{ message: 'Unknown note type: "haha"' }, { message: 'Unknown field: "a"' }, { message: 'Unknown field: "b"' }],
  );
});

test("error: unknown field", () => {
  const parser = new NoteParser();

  parser.parse("example.notes", `!type: basic\n!a:1\n!b:2\n~~~`);

  like([...parser.errors], [{ message: 'Unknown field: "a"' }, { message: 'Unknown field: "b"' }]);
});

test("error: duplicate field", () => {
  const parser = new NoteParser();

  parser.parse("example.notes", `!type: basic\n!front:1\n!front:2\n~~~`);

  like([...parser.errors], [{ message: 'Duplicate field: "front"' }]);
});

test("error: duplicate id", () => {
  const note = new Note(noteTypes.basic);
  note.id = "123";
  const list = new NoteList();
  list.add(note);
  const parser = new NoteParser(list);

  parser.parse("example.notes", `!type: basic\n!id:123\n!front:1\n!back:2\n~~~`);

  like([...parser.errors], [{ message: 'Duplicate ID: "123"' }]);
});
