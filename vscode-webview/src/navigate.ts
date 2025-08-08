import { type LocationRange } from "@anotes/parser";
import { type RevealRangeMessage } from "./messages.js";
import { vscode } from "./vscode.js";

export function revealRange({ source, start, end }: LocationRange): void {
  vscode.postMessage({
    type: "reveal-range",
    uri: String(source),
    start: start.offset,
    end: end.offset,
  } satisfies RevealRangeMessage);
}
