import { type Note, parseNotes } from "@anotes/core";
import { renderToString } from "react-dom/server";
import { Preview } from "./Preview.js";

export function renderNotesToHtml(source: string, content: string): string {
  const notes: Note[] = [];
  try {
    parseNotes(source, content, notes);
  } catch (err) {
    console.error("Note parsing error", err);
  }
  return "<!DOCTYPE html>" + renderToString(<Preview notes={notes} />);
}
