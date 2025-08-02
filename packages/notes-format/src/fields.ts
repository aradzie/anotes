import { Marked } from "marked";
import { latexExtension, type Renderer } from "./marked-latex.js";

type FieldConfig = {
  format: (value: string, template: string, renderer?: Renderer) => string;
};

const frontField = {
  format: (value: string, template: string, renderer?: Renderer) => {
    const parser = new Marked();
    parser.use(latexExtension(renderer));
    value = parser.parse(value.trim(), { async: false }).trim();
    switch (template) {
      case "Basic":
        return `${value}`;
      case "Definition":
        return `${value}`;
      default:
        throw new Error(`Unknown template: ${template}`);
    }
  },
} satisfies FieldConfig;

const backField = {
  format: (value: string, template: string, renderer?: Renderer) => {
    const parser = new Marked();
    parser.use(latexExtension(renderer));
    value = parser.parse(value.trim(), { async: false }).trim();
    switch (template) {
      case "Basic":
        return `${value}`;
      case "Definition":
        return `<section style="text-align: left">${value}</section>`;
      default:
        throw new Error(`Unknown template: ${template}`);
    }
  },
} satisfies FieldConfig;

const exampleField = {
  format: (value: string, template: string, renderer?: Renderer) => {
    const parser = new Marked();
    parser.use(latexExtension(renderer));
    value = parser.parse(value.trim(), { async: false }).trim();
    switch (template) {
      case "Basic":
        return `<section style="text-align: left">${value}</section>`;
      case "Definition":
        return `<section style="text-align: left">${value}</section>`;
      default:
        throw new Error(`Unknown template: ${template}`);
    }
  },
} satisfies FieldConfig;

const allFields = new Map<string, FieldConfig>([
  ["front", frontField],
  ["back", backField],
  // ["example", exampleField],
]);

export { type FieldConfig, allFields };
