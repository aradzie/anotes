import { test } from "node:test";
import { like } from "rich-assert";
import { parseTypeDefList } from "./parser.js";

test("parse whitespace", () => {
  like(parseTypeDefList(""), []);
  like(parseTypeDefList(" "), []);
  like(parseTypeDefList("\t"), []);
  like(parseTypeDefList(" \n"), []);
  like(parseTypeDefList("\t\n"), []);
  like(parseTypeDefList(" \n \n \n "), []);
  like(parseTypeDefList("\t\n\t\n\t\n\t"), []);
});

test("parse types", () => {
  like(
    parseTypeDefList(`
type Type 1
id 123
field Front
field Back
field Back Extra?
card Card 1
front
[front]
~~~
back
[back]
~~~
styling
[styling]
~~~
`),
    [
      {
        name: {
          text: "Type 1",
        },
        id: {
          id: {
            text: "123",
          },
          value: 123,
        },
        fields: [
          {
            name: {
              text: "Front",
            },
            required: true,
          },
          {
            name: {
              text: "Back",
            },
            required: true,
          },
          {
            name: {
              text: "Back Extra",
            },
            required: false,
          },
        ],
        cards: [
          {
            name: {
              text: "Card 1",
            },
            front: {
              text: "[front]",
            },
            back: {
              text: "[back]",
            },
          },
        ],
        styling: {
          text: "[styling]",
        },
      },
    ],
  );
});
