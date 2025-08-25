import { parse, SyntaxError } from "./parser$.js";

function parseNoteList(input, grammarSource) {
  return parse(input, { grammarSource, startRule: "NoteList" });
}

function parseModelList(input, grammarSource) {
  return parse(input, { grammarSource, startRule: "ModelList" });
}

export { parseNoteList, parseModelList, SyntaxError };
