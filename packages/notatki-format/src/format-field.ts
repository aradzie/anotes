import { Marked } from "marked";
import { mathExtension } from "./marked-math.js";
import { type MathRenderer } from "./math-renderer.js";

export function formatField(value: string, renderer?: MathRenderer): string {
  const parser = new Marked();
  parser.use(mathExtension(renderer));
  return parser.parse(value.trim(), { async: false }).trim();
}
