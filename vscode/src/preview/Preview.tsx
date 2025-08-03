import { Note } from "@anotes/core";
import { Note1 } from "./Note.js";

export function Preview({ notes }: { notes: Note[] }) {
  return (
    <html>
      <head>
        <title>Notes Preview</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: "0", padding: "1rem" }}>
        <main style={{ width: "40rem", margin: "0 auto" }}>
          {notes.map((value, index) => (
            <Note1 key={index} note={value} />
          ))}
        </main>
      </body>
    </html>
  );
}
