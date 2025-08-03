import { Note } from "@anotes/core";

export function Meta({ note }: { note: Note }) {
  return (
    <>
      <p style={{ borderBottom: "1px dotted lightgray" }}>
        <strong>id</strong>: {note.id}
      </p>
      <p style={{ borderBottom: "1px dotted lightgray" }}>
        <strong>type</strong>: {note.type}
      </p>
      <p style={{ borderBottom: "1px dotted lightgray" }}>
        <strong>deck</strong>: {note.deck}
      </p>
      <p style={{ borderBottom: "1px dotted lightgray" }}>
        <strong>tags</strong>: {note.tags}
      </p>
      <p style={{ borderBottom: "1px dotted lightgray" }}>
        <strong>template</strong>: {note.template}
      </p>
    </>
  );
}
