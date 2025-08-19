import { test } from "node:test";
import { like, throws } from "rich-assert";
import { parseNoteList } from "./parser.js";

test("parse whitespace", () => {
  like(parseNoteList(""), []);
  like(parseNoteList(" "), []);
  like(parseNoteList("\t"), []);
  like(parseNoteList(" \n"), []);
  like(parseNoteList("\t\n"), []);
  like(parseNoteList(" \n \n \n "), []);
  like(parseNoteList("\t\n\t\n\t\n\t"), []);
  like(parseNoteList("!a:1\n~~~"), [{ fields: [{ name: { text: "a" } }] }]);
  like(parseNoteList("\n!a:1\n~~~"), [{ fields: [{ name: { text: "a" } }] }]);
  like(parseNoteList("\n \n!a:1\n~~~"), [{ fields: [{ name: { text: "a" } }] }]);
  like(parseNoteList("\n\t\n!a:1\n~~~"), [{ fields: [{ name: { text: "a" } }] }]);
  like(parseNoteList("!a:1\n~~~"), [{ fields: [{ name: { text: "a" } }] }]);
  like(parseNoteList("!a:1\n~~~ "), [{ fields: [{ name: { text: "a" } }] }]);
  like(parseNoteList("!a:1\n~~~\n"), [{ fields: [{ name: { text: "a" } }] }]);
  like(parseNoteList("!a:1\n~~~\n\n"), [{ fields: [{ name: { text: "a" } }] }]);
  like(parseNoteList("!a:1\n~~~ \n \n"), [{ fields: [{ name: { text: "a" } }] }]);
  like(parseNoteList("!a:1\n~~~ \n \n "), [{ fields: [{ name: { text: "a" } }] }]);
  like(parseNoteList("!a:1\n~~~\t\n\t\n\t"), [{ fields: [{ name: { text: "a" } }] }]);
  like(parseNoteList("\n!a:1\n~~~\t\n\t\n\t"), [{ fields: [{ name: { text: "a" } }] }]);
  like(parseNoteList("\n \n!a:1\n~~~\t\n\t\n\t"), [{ fields: [{ name: { text: "a" } }] }]);
  like(parseNoteList("\n\t\n!a:1\n~~~\t\n\t\n\t"), [{ fields: [{ name: { text: "a" } }] }]);
  like(parseNoteList("\n\t\n!a:1\n~~~\n!a:2\n~~~\t\n\t\n\t"), [
    { fields: [{ name: { text: "a" }, value: { text: "1" } }] },
    { fields: [{ name: { text: "a" }, value: { text: "2" } }] },
  ]);
  like(parseNoteList("\n\t\n!a:1\n \t \n~~~ \t \n!a:2\n~~~\t\n\t\n\t"), [
    { fields: [{ name: { text: "a" }, value: { text: "1" } }] },
    { fields: [{ name: { text: "a" }, value: { text: "2" } }] },
  ]);
});

test("parse cr lf", () => {
  like(parseNoteList("\r\n!a:1\r\n!b:2\r\n~~~\r\n"), [
    {
      fields: [
        { name: { text: "a" }, value: { text: "1" } },
        { name: { text: "b" }, value: { text: "2" } },
      ],
    },
  ]);
});

test("parse properties", () => {
  like(parseNoteList("!id:\n!a:1\n~~~"), [
    {
      properties: [{ name: { text: "id" }, value: { text: "" } }],
      fields: [{ name: { text: "a" } }],
    },
  ]);
  like(parseNoteList("!id: \t xyz \t \n!a:1\n~~~"), [
    {
      properties: [{ name: { text: "id" }, value: { text: "xyz" } }],
      fields: [{ name: { text: "a" } }],
    },
  ]);
  like(parseNoteList("!tags:x\n!a:1\n~~~"), [
    {
      properties: [{ name: { text: "tags" }, value: { text: "x" } }],
      fields: [{ name: { text: "a" } }],
    },
  ]);
  like(parseNoteList("!Tags:x\n!a:1\n~~~"), [
    {
      properties: [{ name: { text: "tags" }, value: { text: "x" } }],
      fields: [{ name: { text: "a" } }],
    },
  ]);
  like(parseNoteList("!TAGS:x\n!a:1\n~~~"), [
    {
      properties: [{ name: { text: "tags" }, value: { text: "x" } }],
      fields: [{ name: { text: "a" } }],
    },
  ]);
  like(parseNoteList("!deck:a\n \n!tags:b\n \n!a:1\n~~~"), [
    {
      properties: [
        { name: { text: "deck" }, value: { text: "a" } },
        { name: { text: "tags" }, value: { text: "b" } },
      ],
      fields: [{ name: { text: "a" } }],
    },
  ]);
});

test("parse field names", () => {
  like(parseNoteList("!a:1\n~~~"), [
    {
      fields: [
        {
          name: { text: "a", loc: { start: { offset: 0 }, end: { offset: 3 } } },
          value: { text: "1" },
        },
      ],
    },
  ]);
  like(parseNoteList("!a b:1\n~~~"), [
    {
      fields: [
        {
          name: { text: "a b", loc: { start: { offset: 0 }, end: { offset: 5 } } },
          value: { text: "1" },
        },
      ],
    },
  ]);
  like(parseNoteList("!A_B \t C \t 0-9:1\n~~~"), [
    {
      fields: [
        {
          name: { text: "A_B C 0-9", loc: { start: { offset: 0 }, end: { offset: 15 } } },
          value: { text: "1" },
        },
      ],
    },
  ]);
});

test("parse field values", () => {
  like(parseNoteList("!a:\n~~~"), [
    {
      fields: [
        {
          name: { text: "a" },
          value: { text: "", loc: { start: { offset: 3 }, end: { offset: 3 } } },
        },
      ],
    },
  ]);
  like(parseNoteList("!a: \t \n\n~~~"), [
    {
      fields: [
        {
          name: { text: "a" },
          value: { text: "", loc: { start: { offset: 6 }, end: { offset: 7 } } },
        },
      ],
    },
  ]);
  like(parseNoteList("!a:abc\n~~~"), [
    {
      fields: [
        {
          name: { text: "a" },
          value: { text: "abc", loc: { start: { offset: 3 }, end: { offset: 6 } } },
        },
      ],
    },
  ]);
  like(parseNoteList("!a: \t abc \n\n~~~"), [
    {
      fields: [
        {
          name: { text: "a" },
          value: { text: "abc", loc: { start: { offset: 6 }, end: { offset: 11 } } },
        },
      ],
    },
  ]);
  like(parseNoteList("!a:abc\nxyz\n~~~"), [
    {
      fields: [
        {
          name: { text: "a" },
          value: { text: "abc\nxyz", loc: { start: { offset: 3 }, end: { offset: 10 } } },
        },
      ],
    },
  ]);
  like(parseNoteList("!a: \t abc\nxyz \n\n~~~"), [
    {
      fields: [
        {
          name: { text: "a" },
          value: { text: "abc\nxyz", loc: { start: { offset: 6 }, end: { offset: 15 } } },
        },
      ],
    },
  ]);
  like(parseNoteList("!a: \t abc\nxyz \n \n~~~"), [
    {
      fields: [
        {
          name: { text: "a" },
          value: { text: "abc\nxyz", loc: { start: { offset: 6 }, end: { offset: 16 } } },
        },
      ],
    },
  ]);
});

test("provide locations", () => {
  like(parseNoteList("!id:1\n!a:1\n~~~"), [
    {
      properties: [
        {
          name: {
            text: "id",
            loc: { start: { offset: 0 }, end: { offset: 4 } },
          },
          value: {
            text: "1",
            loc: { start: { offset: 4 }, end: { offset: 5 } },
          },
          loc: { start: { offset: 0 }, end: { offset: 5 } },
        },
      ],
      fields: [
        {
          name: {
            text: "a",
            loc: { start: { offset: 6 }, end: { offset: 9 } },
          },
          value: {
            text: "1",
            loc: { start: { offset: 9 }, end: { offset: 10 } },
          },
          loc: { start: { offset: 6 }, end: { offset: 10 } },
        },
      ],
      end: { text: "~~~", loc: { start: { offset: 11 }, end: { offset: 14 } } },
      loc: { start: { offset: 0 }, end: { offset: 14 } },
    },
  ]);
});

test("report errors", () => {
  throws(
    () => {
      parseNoteList(" x");
    },
    { message: 'Expected end of input or newline but "x" found.' },
  );
  throws(
    () => {
      parseNoteList(" \n x");
    },
    { message: 'Expected end of input or newline but "x" found.' },
  );
  throws(
    () => {
      parseNoteList("!a:abc");
    },
    { message: "Expected newline but end of input found." },
  );
  throws(
    () => {
      parseNoteList("!a:abc\n x");
    },
    { message: "Expected newline but end of input found." },
  );
  throws(
    () => {
      parseNoteList("!a:abc\n");
    },
    { message: 'Expected "~~~", field, or newline but end of input found.' },
  );
  throws(
    () => {
      parseNoteList("!a:abc\n~~~x");
    },
    { message: 'Expected end of input or newline but "x" found.' },
  );
  throws(
    () => {
      parseNoteList("~~~");
    },
    { message: 'Expected end of input, field, newline, or property but "~" found.' },
  );
});
