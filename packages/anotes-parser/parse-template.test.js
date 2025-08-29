import { test } from "node:test";
import { like, throws } from "rich-assert";
import { parseTemplate } from "./parser.js";

test("parse mixed", () => {
  like(parseTemplate(""), []);
  like(parseTemplate("text"), ["text"]);
  like(parseTemplate("{{a}}{{b}}{{c}}"), [
    { type: "field", field: { text: "a" } },
    { type: "field", field: { text: "b" } },
    { type: "field", field: { text: "c" } },
  ]);
  like(parseTemplate("1{{a}}2{{b}}3{{c}}4"), [
    "1",
    { type: "field", field: { text: "a" } },
    "2",
    { type: "field", field: { text: "b" } },
    "3",
    { type: "field", field: { text: "c" } },
    "4",
  ]);
  like(parseTemplate("{{#a}}text{{/a}}"), [
    {
      type: "branch",
      cond: { field: { text: "a" }, not: false },
      end: { field: { text: "a" } },
      items: ["text"],
    },
  ]);
  like(parseTemplate("{{^a}}text{{/a}}"), [
    {
      type: "branch",
      cond: { field: { text: "a" }, not: true },
      end: { field: { text: "a" } },
      items: ["text"],
    },
  ]);
  like(parseTemplate("{{#a}}{{#b}}{{#c}}1{{a}}2{{b}}3{{c}}4{{/c}}{{/b}}{{/a}}"), [
    {
      type: "branch",
      cond: { field: { text: "a" }, not: false },
      end: { field: { text: "a" } },
      items: [
        {
          type: "branch",
          cond: { field: { text: "b" }, not: false },
          end: { field: { text: "b" } },
          items: [
            {
              type: "branch",
              cond: { field: { text: "c" }, not: false },
              end: { field: { text: "c" } },
              items: [
                "1",
                { type: "field", field: { text: "a" } },
                "2",
                { type: "field", field: { text: "b" } },
                "3",
                { type: "field", field: { text: "c" } },
                "4",
              ],
            },
          ],
        },
      ],
    },
  ]);
});

test("parse field names", () => {
  like(parseTemplate("{{abc}}"), [{ type: "field", field: { text: "abc" } }]);
  like(parseTemplate("{{ABC}}"), [{ type: "field", field: { text: "ABC" } }]);
  like(parseTemplate("{{123}}"), [{ type: "field", field: { text: "123" } }]);
  like(parseTemplate("{{  ABC  xyz  123  }}"), [{ type: "field", field: { text: "ABC xyz 123" } }]);
  like(parseTemplate("{{  cloze:Text  }}"), [{ type: "field", field: { text: "cloze:Text" } }]);
});

test("errors", () => {
  throws(
    () => {
      parseTemplate("{{");
    },
    { message: `Expected "#", "^", or any character but end of input found.` },
  );
  throws(
    () => {
      parseTemplate("{{a");
    },
    { message: `Expected "}}" or any character but end of input found.` },
  );
  throws(
    () => {
      parseTemplate("{{#a}}x{{/b}}");
    },
    { message: `Expected "a" but got "b".` },
  );
});
