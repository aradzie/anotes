import { type Note, type NoteError, NoteParser } from "@anotes/core";
import { useEffect, useState } from "react";
import { queue } from "./messages.js";
import { vscode } from "./vscode.js";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [errors, setErrors] = useState<NoteError[]>([]);
  useEffect(() => {
    return queue.subscribe((message) => {
      switch (message.type) {
        case "update": {
          // Remember the last message to be able to restore the preview.
          vscode.setState(message);

          // Parse and render the notes.
          const { uri, text } = message;
          const parser = new NoteParser();
          parser.parse(uri, text);
          const { notes, errors } = parser;
          if (errors.length > 0) {
            setErrors([...errors]);
          } else {
            setNotes([...notes]);
            setErrors([]);
          }
          break;
        }
        case "focus": {
          break;
        }
      }
    });
  }, []);
  return [notes, errors] as const;
}
