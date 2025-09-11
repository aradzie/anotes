import { type LocationRange } from "@notatki/parser";

export const loc = {
  source: "<unknown>",
  start: { offset: 0, line: 0, column: 0 },
  end: { offset: 0, line: 0, column: 0 },
} as const satisfies LocationRange;
