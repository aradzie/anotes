import "./App.css";
import { Note, NoteList, parseNotes } from "@anotes/core";
import { useEffect, useState } from "react";
import { Message, UpdateMessage } from "./messages.js";
import { Note1 } from "./Note.js";

export function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    const listener = ({ data }: MessageEvent<Message>) => {
      switch (data.type) {
        case "update":
          setNotes(parse(data));
          break;
        case "focus":
          break;
      }
    };
    addEventListener("message", listener);
    return () => {
      removeEventListener("message", listener);
    };
  });
  return (
    <main>
      <p>{notes.length} note(s) total</p>
      {notes.map((value, index) => (
        <Note1 key={index} note={value} />
      ))}
    </main>
  );
}

function parse(message: UpdateMessage) {
  const { uri, text } = message;
  const notes = new NoteList();
  try {
    parseNotes(uri, text, notes);
  } catch {}
  return [...notes];
}
