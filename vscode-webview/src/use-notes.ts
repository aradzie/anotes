import { Note, NoteList, parseNotes } from "@anotes/core";
import { useEffect, useState } from "react";
import { queue } from "./messages.js";
import { vscode } from "./vscode.js";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    return queue.subscribe((message) => {
      switch (message.type) {
        case "update":
          // Remember the last message to be able to restore the preview.
          vscode.setState(message);

          // Parse and render the notes.
          const { uri, text } = message;
          try {
            const notes = new NoteList();
            parseNotes(uri, text, notes);
            setNotes([...notes]);
          } catch (err) {
            console.error("Error parsing notes", err);
          }
          break;
        case "focus":
          break;
      }
    });
  }, []);
  return notes;
}
