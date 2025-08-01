import { Model } from "./model.js";

/**
 * Built-in card models similar to genanki.
 */
export const builtin = {
  /**
   * Basic model with Front and Back fields.
   */
  BASIC_MODEL: new Model({
    modelId: 1607392319,
    name: "Basic",
    fields: [{ name: "Front" }, { name: "Back" }],
    templates: [
      {
        name: "Card 1",
        qfmt: "{{Front}}",
        afmt: '{{FrontSide}}<hr id="answer">{{Back}}',
      },
    ],
  }),
  /**
   * Basic model with reversed card.
   */
  BASIC_AND_REVERSED_CARD_MODEL: new Model({
    modelId: 1607392320,
    name: "Basic (and reversed card)",
    fields: [{ name: "Front" }, { name: "Back" }],
    templates: [
      {
        name: "Card 1",
        qfmt: "{{Front}}",
        afmt: '{{FrontSide}}<hr id="answer">{{Back}}',
      },
      {
        name: "Card 2",
        qfmt: "{{Back}}",
        afmt: '{{FrontSide}}<hr id="answer">{{Front}}',
      },
    ],
  }),
  /**
   * Basic model with optional reversed card.
   */
  BASIC_OPTIONAL_REVERSED_CARD_MODEL: new Model({
    modelId: 1607392321,
    name: "Basic (optional reversed card)",
    fields: [{ name: "Front" }, { name: "Back" }, { name: "Add Reverse" }],
    templates: [
      {
        name: "Card 1",
        qfmt: "{{Front}}",
        afmt: '{{FrontSide}}<hr id="answer">{{Back}}',
      },
      {
        name: "Card 2",
        qfmt: "{{#Add Reverse}}{{Back}}{{/Add Reverse}}",
        afmt: '{{FrontSide}}<hr id="answer">{{Front}}',
      },
    ],
  }),
  /**
   * Basic model with type in the answer.
   */
  BASIC_TYPE_IN_THE_ANSWER_MODEL: new Model({
    modelId: 1607392322,
    name: "Basic (type in the answer)",
    fields: [{ name: "Front" }, { name: "Back" }],
    templates: [
      {
        name: "Card 1",
        qfmt: "{{Front}}<br>{{type:Back}}",
        afmt: '{{Front}}<hr id="answer">{{Back}}',
      },
    ],
  }),
  /**
   * Cloze deletion model.
   */
  CLOZE_MODEL: new Model({
    modelId: 1607392323,
    name: "Cloze",
    fields: [{ name: "Text" }, { name: "Back Extra" }],
    templates: [
      {
        name: "Cloze",
        qfmt: "{{cloze:Text}}",
        afmt: "{{cloze:Text}}<br>{{Back Extra}}",
      },
    ],
    type: 1, // Cloze type
  }),
  /**
   * Image occlusion model.
   */
  IMAGE_OCCLUSION_MODEL: new Model({
    modelId: 1607392324,
    name: "Image Occlusion",
    fields: [{ name: "Image" }, { name: "Question" }, { name: "Answer" }, { name: "Remarks" }],
    templates: [
      {
        name: "Card 1",
        qfmt: "{{Image}}<br>{{Question}}",
        afmt: '{{Image}}<hr id="answer">{{Answer}}<br>{{Remarks}}',
      },
    ],
  }),
};
