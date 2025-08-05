import { Marked } from "marked";
import { mathExtension } from "./marked-math.js";
import type { MathRenderer } from "./math-renderer.js";

function formatMath(value: string, renderer?: MathRenderer): string {
  const parser = new Marked();
  parser.use(mathExtension(renderer));
  return parser.parse(value.trim(), { async: false }).trim();
}

export { formatMath };
