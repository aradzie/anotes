import { Marked } from "marked";
import { latexExtension, type Renderer } from "./marked-latex.js";

function formatField(value: string, renderer?: Renderer): string {
  const parser = new Marked();
  parser.use(latexExtension(renderer));
  return parser.parse(value.trim(), { async: false }).trim();
}

export { formatField };
