import { type Note, type NoteError, NoteParser } from "@anotes/core";
import { type ReviveState } from "@anotes/vscode-protocol";
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
          const { uri, locked, text } = message;

          // Remember the preview state to be able to restore the preview by the extension.
          vscode.setState({ type: "revive", uri, locked } as ReviveState);

          // Parse and render the notes.
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
        case "select": {
          const { start, end } = message;
          break;
        }
      }
    });
  }, []);
  return [notes, errors] as const;
}
