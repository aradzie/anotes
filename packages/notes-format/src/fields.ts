import { Marked } from "marked";
import { latexExtension } from "./marked-latex.js";

type FieldConfig = {
  type: "html" | "text";
  format: (value: string, template: string) => string;
};

const frontField = {
  type: "html",
  format: (value: string, template: string) => {
    const parser = new Marked();
    parser.use(latexExtension);
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
  type: "html",
  format: (value: string, template: string) => {
    const parser = new Marked();
    parser.use(latexExtension);
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
  type: "html",
  format: (value: string, template: string) => {
    const parser = new Marked();
    parser.use(latexExtension);
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
