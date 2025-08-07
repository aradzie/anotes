import { Note, NoteList, parseNotes } from "@anotes/core";
import { useEffect, useState } from "react";
import * as cn from "./App.module.css";
import { queue } from "./messages.js";
import { Note1 } from "./Note.js";
import { vscode } from "./state.js";

export function App() {
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
          } catch {}
          break;
        case "focus":
          break;
      }
    });
  }, []);
  return (
    <main className={cn.root}>
      <p>{notes.length} note(s) total</p>
      {notes.map((value, index) => (
        <Note1 key={index} note={value} />
      ))}
    </main>
  );
}
