import type { ClozeItem,ModelNode, NoteNode, TemplateItem } from "./nodes.js";
import type { GrammarSource } from "./parser$.js";

export type { GrammarSource, GrammarSourceObject, Location, LocationRange } from "./parser$.js";
export { SyntaxError } from "./parser$.js";

export function parseNoteList(input: string, source?: GrammarSource): NoteNode[];

export function parseModelList(input: string, source?: GrammarSource): ModelNode[];

export function parseTemplate(input: string, source?: GrammarSource): TemplateItem[];

export function parssCloze(input: string, source?: GrammarSource): ClozeItem[];
