import type { NoteNode, TypeDefNode } from "./nodes.js";
import type { GrammarSource } from "./parser$.js";

export type { GrammarSource, GrammarSourceObject, Location, LocationRange } from "./parser$.js";
export { SyntaxError } from "./parser$.js";

export function parseNoteList(input: string, source?: GrammarSource): NoteNode[];

export function parseTypeDefList(input: string, source?: GrammarSource): TypeDefNode[];
