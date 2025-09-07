import { test } from "node:test";
import { equal } from "rich-assert";
import { type Model, ModelMap } from "./model.js";
import { Note } from "./note.js";
import { CompiledCards } from "./templates.js";

test("render templates", () => {
  const models = new ModelMap([
    {
      name: "Type 1",
      id: 1,
      cloze: false,
      fields: [
        { name: "Front", required: true },
        { name: "Back", required: true },
        { name: "Extra", required: false },
      ],
      cards: [
        {
          name: "Card 1",
          front: `{{Front}}`,
          back:
            `{{FrontSide}}\n` +
            `{{Back}}\n` +
            `Type:{{Type}}\n` +
            `Card:{{Card}}\n` +
            `Deck:{{Deck}}\n` +
            `Subdeck:{{Subdeck}}\n` +
            `Tags:{{Tags}}\n`,
        },
      ],
      styling: "",
    } as const satisfies Model,
  ]);

  const cards = new CompiledCards(models);

  const note = new Note(models.get("Type 1")!);
  note.set("front", "FRONT");
  note.set("back", "BACK");

  equal(
    cards.renderCard(note, "Card 1", "front"), //
    `<p>FRONT</p>`,
  );
  equal(
    cards.renderCard(note, "Card 1", "back"), //
    `<p>FRONT</p>\n` + //
      `<p>BACK</p>\n` +
      `Type:Type 1\n` +
      `Card:Card 1\n` +
      `Deck:\n` +
      `Subdeck:\n` +
      `Tags:\n`,
  );

  note.deck = "Outer::Inner";
  note.tags = "A::B::C Tag1 Tag2";

  equal(
    cards.renderCard(note, "Card 1", "front"), //
    `<p>FRONT</p>`,
  );
  equal(
    cards.renderCard(note, "Card 1", "back"), //
    `<p>FRONT</p>\n` + //
      `<p>BACK</p>\n` +
      `Type:Type 1\n` +
      `Card:Card 1\n` +
      `Deck:Outer::Inner\n` +
      `Subdeck:Inner\n` +
      `Tags:A::B::C Tag1 Tag2\n`,
  );
});

test("conditional", () => {
  const models = new ModelMap([
    {
      name: "Type 1",
      id: 1,
      cloze: false,
      fields: [
        { name: "Front", required: true },
        { name: "Back", required: true },
        { name: "Extra", required: false },
      ],
      cards: [
        {
          name: "Card 1",
          front: `{{Front}}`,
          back:
            `{{FrontSide}}\n` + //
            `{{Back}}\n` +
            `{{#Extra}}{{Extra}}{{/Extra}}\n` +
            `{{^Extra}}???{{/Extra}}\n`,
        },
      ],
      styling: "",
    } as const satisfies Model,
  ]);

  const cards = new CompiledCards(models);

  const note = new Note(models.get("Type 1")!);
  note.set("front", "FRONT");
  note.set("back", "BACK");

  equal(
    cards.renderCard(note, "Card 1", "back"), //
    `<p>FRONT</p>\n<p>BACK</p>\n\n???\n`,
  );

  note.set("extra", "EXTRA");

  equal(
    cards.renderCard(note, "Card 1", "back"), //
    `<p>FRONT</p>\n<p>BACK</p>\n<p>EXTRA</p>\n\n`,
  );
});
