import { parse, SyntaxError } from "./parser$.js";

function parseNoteList(input, grammarSource) {
  return parse(input, { grammarSource, startRule: "NoteList" });
}

function parseTypeDefList(input, grammarSource) {
  return parse(input, { grammarSource, startRule: "TypeDefList" });
}

export { parseNoteList, parseTypeDefList, SyntaxError };
