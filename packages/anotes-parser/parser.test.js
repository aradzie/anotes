import { test } from "node:test";
import { like, throws } from "rich-assert";
import { parse } from "./parser.js";

test("parse cr lf", () => {
  parse("!a:abc\r\n!b: xyz\r\n~~~\r\n\r\n");
});

test("parse empty", () => {
  parse("");
  parse(" ");
  parse("\t");
  parse(" \n");
  parse("\t\n");
  parse(" \n \n \n ");
  parse("\t\n\t\n\t\n\t");
});

test("parse whitespace", () => {
  parse("!a:abc\n~~~");
  parse("\n!a:abc\n~~~");
  parse("\n \n!a:abc\n~~~");
  parse("\n\t\n!a:abc\n~~~");
  parse("!a:abc\n~~~");
  parse("!a:abc\n~~~ ");
  parse("!a:abc\n~~~\n");
  parse("!a:abc\n~~~\n\n");
  parse("!a:abc\n~~~ \n \n");
  parse("!a:abc\n~~~ \n \n ");
  parse("!a:abc\n~~~\t\n\t\n\t");
});

test("parse properties", () => {
  like(parse("!id:\n!a:\n~~~"), [{ properties: [{ name: "id", value: "" }] }]);
  like(parse("!id: \t xyz \t \n!a:\n~~~"), [{ properties: [{ name: "id", value: "xyz" }] }]);
  like(parse("!tags:x\n!a:\n~~~"), [{ properties: [{ name: "tags", value: "x" }] }]);
  like(parse("!Tags:x\n!a:\n~~~"), [{ properties: [{ name: "tags", value: "x" }] }]);
  like(parse("!TAGS:x\n!a:\n~~~"), [{ properties: [{ name: "tags", value: "x" }] }]);
  like(parse("!deck:a\n \n!tags:b\n \n!a:x\n~~~"), [
    {
      properties: [
        { name: "deck", value: "a" },
        { name: "tags", value: "b" },
      ],
      fields: [{ name: "a", value: "x" }],
    },
  ]);
});

test("parse field names", () => {
  like(parse("!a:x\n~~~"), [{ fields: [{ name: "a", value: "x" }] }]);
  like(parse("!a b:x\n~~~"), [{ fields: [{ name: "a b", value: "x" }] }]);
  like(parse("!A_B C 0-9:x\n~~~"), [{ fields: [{ name: "A_B C 0-9", value: "x" }] }]);
});

test("parse field values", () => {
  like(parse("!a:\n~~~"), [{ fields: [{ name: "a", value: "" }] }]);
  like(parse("!a: \t \n\n~~~"), [{ fields: [{ name: "a", value: "" }] }]);
  like(parse("!a:abc\n~~~"), [{ fields: [{ name: "a", value: "abc" }] }]);
  like(parse("!a: \t abc \n\n~~~"), [{ fields: [{ name: "a", value: "abc" }] }]);
  like(parse("!a:abc\nxyz\n~~~"), [{ fields: [{ name: "a", value: "abc\nxyz" }] }]);
  like(parse("!a: \t abc\nxyz \n\n~~~"), [{ fields: [{ name: "a", value: "abc\nxyz" }] }]);
});

test("parse note list", () => {
  like(parse(""), []);
  like(parse(" \n \n "), []);
  like(parse("!a:1\n~~~\n!a:2\n~~~"), [
    { fields: [{ name: "a", value: "1" }] },
    { fields: [{ name: "a", value: "2" }] },
  ]);
  like(parse(" \n\n!a:1\n~~~ \n\n!a:2\n~~~ \n\n"), [
    { fields: [{ name: "a", value: "1" }] },
    { fields: [{ name: "a", value: "2" }] },
  ]);
});

test("report errors", () => {
  throws(
    () => {
      parse(" x");
    },
    { message: 'Expected end of input or newline but "x" found.' },
  );
  throws(
    () => {
      parse(" \n x");
    },
    { message: 'Expected end of input or newline but "x" found.' },
  );
  throws(
    () => {
      parse("!a:abc");
    },
    { message: "Expected newline but end of input found." },
  );
  throws(
    () => {
      parse("!a:abc\n x");
    },
    { message: "Expected newline but end of input found." },
  );
  throws(
    () => {
      parse("!a:abc\n~~~x");
    },
    { message: 'Expected end of input or newline but "x" found.' },
  );
  throws(
    () => {
      parse("~~~");
    },
    { message: 'Expected end of input, field, newline, or property but "~" found.' },
  );
});
