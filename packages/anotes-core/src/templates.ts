import { formatField, renderHtml } from "@anotes/format";
import { parseTemplate, type TemplateItemNode } from "@anotes/parser";
import { type Model, type ModelCard, type ModelMap } from "./model.js";
import { type Note } from "./note.js";

export class CompiledModels {
  readonly #cards = new Map<string, CompiledCard>();

  constructor(models: ModelMap) {
    for (const model of models) {
      for (const card of model.cards) {
        this.#cards.set(`${model.name}-${card.name}`, new CompiledCard(model, card));
      }
    }
  }

  renderCard(note: Note, cardName: string, side: "front" | "back"): string {
    const card = this.#cards.get(`${note.type.name}-${cardName}`);
    if (card == null) {
      throw new Error(`Unknown card: ${cardName}`);
    }
    return card.render(note, side);
  }
}

type FieldValueProvider = {
  getFieldValue(note: Note, field: string): string;
};

class CompiledCard implements FieldValueProvider {
  readonly #model: Model;
  readonly #card: ModelCard;
  readonly #front: CompiledTemplate;
  readonly #back: CompiledTemplate;

  constructor(model: Model, card: ModelCard) {
    this.#model = model;
    this.#card = card;
    this.#front = new CompiledTemplate(card.front);
    this.#back = new CompiledTemplate(card.back);
  }

  get model(): Model {
    return this.#model;
  }

  get card(): ModelCard {
    return this.#card;
  }

  render(note: Note, side: "front" | "back"): string {
    switch (side) {
      case "front":
        return this.renderFront(note);
      case "back":
        return this.renderBack(note);
    }
  }

  renderFront(note: Note): string {
    return this.#front.render(this, note);
  }

  renderBack(note: Note): string {
    return this.#back.render(this, note);
  }

  getFieldValue(note: Note, field: string): string {
    switch (field) {
      case "Type": {
        return escapeHtml(this.model.name);
      }
      case "Card": {
        return escapeHtml(this.card.name);
      }
      case "Deck": {
        return escapeHtml(note.deck);
      }
      case "Subdeck": {
        return escapeHtml(note.deck.split("::").pop() ?? "");
      }
      case "Tags": {
        return escapeHtml(note.tags);
      }
      case "Flags": {
        return "Flags";
      }
      case "FrontSide": {
        return this.renderFront(note);
      }
      case "cloze:Text": {
        return this.#formatField(note, "Text");
      }
    }
    return this.#formatField(note, field);
  }

  #formatField(note: Note, field: string) {
    if (note.has(field)) {
      const { name, value } = note.get(field);
      if (name === field) {
        return formatField(value, renderHtml({ output: "html", throwOnError: false }));
      }
    }
    return `{{${escapeHtml(field)}}}`;
  }
}

type Part =
  | string
  | { readonly type: "field"; readonly field: string }
  | { readonly type: "if"; readonly field: string; readonly parts: readonly Part[] }
  | { readonly type: "if-not"; readonly field: string; readonly parts: readonly Part[] };

class CompiledTemplate {
  readonly #parts: Part[] = [];

  constructor(template: string) {
    this.#parts = this.#compile(parseTemplate(template));
  }

  render(fields: FieldValueProvider, note: Note): string {
    let out = "";

    function visit(parts: readonly Part[]) {
      for (const part of parts) {
        if (typeof part === "string") {
          out += part;
        } else {
          switch (part.type) {
            case "field": {
              out += fields.getFieldValue(note, part.field);
              break;
            }
            case "if": {
              if (fields.getFieldValue(note, part.field)) {
                visit(part.parts);
              }
              break;
            }
            case "if-not": {
              if (!fields.getFieldValue(note, part.field)) {
                visit(part.parts);
              }
              break;
            }
          }
        }
      }
    }

    visit(this.#parts);

    return out;
  }

  #compile(nodes: readonly TemplateItemNode[]): Part[] {
    function mapNodeList(nodes: readonly TemplateItemNode[]) {
      return nodes.map((node) => mapNode(node));
    }

    function mapNode(node: TemplateItemNode): Part {
      switch (node.type) {
        case "text": {
          return node.text;
        }
        case "field": {
          return { type: "field", field: node.field.text };
        }
        case "branch": {
          if (node.cond.not) {
            return { type: "if-not", field: node.cond.field.text, parts: mapNodeList(node.items) };
          } else {
            return { type: "if", field: node.cond.field.text, parts: mapNodeList(node.items) };
          }
        }
      }
    }

    return mapNodeList(nodes);
  }
}

export function escapeHtml(text: string) {
  return String(text)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
