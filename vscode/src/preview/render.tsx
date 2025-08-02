import { type Note, parseNotes } from "@anki-xyz/notes-format";
import { renderToString } from "react-dom/server";
import { Preview } from "./Preview.js";

export function renderNotesToHtml(source: string, content: string): string {
  const notes: Note[] = [];
  parseNotes(source, content, notes);
  return "<!DOCTYPE html>" + renderToString(<Preview notes={notes} />);
}
