import { marked } from "marked";
import { latexOptions } from "./marked-latex.js";

marked.use(latexOptions);

const frontField = {
  type: "html",
  latex: true,
  format: (value, template) => {
    value = marked.parse(value.trim(), {}).trim();
    switch (template) {
      case "Basic":
        return `${value}`;
      case "Definition":
        return `${value}`;
      default:
        throw new Error(`Unknown template: ${template}`);
    }
  },
};

const backField = {
  type: "html",
  latex: true,
  format: (value, template) => {
    value = marked.parse(value.trim(), {}).trim();
    switch (template) {
      case "Basic":
        return `${value}`;
      case "Definition":
        return `<section style="text-align: left">${value}</section>`;
      default:
        throw new Error(`Unknown template: ${template}`);
    }
  },
};

const exampleField = {
  type: "html",
  latex: true,
  format: (value, template) => {
    value = marked.parse(value.trim(), {}).trim();
    switch (template) {
      case "Basic":
        return `<section style="text-align: left">${value}</section>`;
      case "Definition":
        return `<section style="text-align: left">${value}</section>`;
      default:
        throw new Error(`Unknown template: ${template}`);
    }
  },
};

export const allFields = new Map([
  ["front", frontField],
  ["back", backField],
  // ["example", exampleField],
]);
