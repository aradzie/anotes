import { test } from "node:test";
import { deepEqual, equal, isFalse, isTrue, like } from "rich-assert";
import { Note, NoteList, NoteTypeMap } from "./note.js";

test("note list", () => {
  const a = new Note(NoteTypeMap.basic);
  a.id = "1";
  const b = new Note(NoteTypeMap.basic);
  b.id = "2";
  const c = new Note(NoteTypeMap.basic);

  const list = new NoteList();

  deepEqual([...list], []);
  equal(list.length, 0);

  list.add(a);
  list.add(b);
  list.add(c);

  deepEqual([...list], [a, b, c]);
  equal(list.length, 3);
});

test("note fields", () => {
  const note = new Note(NoteTypeMap.basic);

  isTrue(note.has("front"));
  isTrue(note.has("Front"));
  isTrue(note.has("back"));
  isTrue(note.has("Back"));
  isFalse(note.has("xyz"));

  equal(note.get("front"), note.get("FRONT"));
  equal(note.get("back"), note.get("BACK"));

  like(
    [...note],
    [
      { name: "Front", value: "" },
      { name: "Back", value: "" },
    ],
  );
  like(note.get("front"), { name: "Front", value: "" });
  like(note.get("back"), { name: "Back", value: "" });

  note.set("front", "a");

  like(
    [...note],
    [
      { name: "Front", value: "a" },
      { name: "Back", value: "" },
    ],
  );
  like(note.get("front"), { name: "Front", value: "a" });
  like(note.get("back"), { name: "Back", value: "" });
});

test("note type", () => {
  const noteTypes = new NoteTypeMap();
  like(
    [...noteTypes],
    [
      { name: "Basic" },
      { name: "Basic (and reversed card)" },
      { name: "Basic (optional reversed card)" },
      { name: "Basic (type in the answer)" },
      { name: "Cloze" },
    ],
  );
  isFalse(noteTypes.has("abc"));
  equal(noteTypes.get("abc"), null);
  isTrue(noteTypes.has("basic"));
  isTrue(noteTypes.has("BASIC"));
  equal(noteTypes.get("basic"), noteTypes.get("BASIC"));
});
