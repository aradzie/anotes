import { Note } from "@anotes/core";

export function Meta({ note }: { note: Note }) {
  return (
    <>
      <p
        style={{
          marginBottom: "0.5rem",
          borderBottom: "1px dotted lightgray",
        }}
      >
        <strong>id</strong>: {note.id}
      </p>
      <p
        style={{
          marginTop: "0.5rem",
          marginBottom: "0.5rem",
          borderBottom: "1px dotted lightgray",
        }}
      >
        <strong>type</strong>: {note.type.name}
      </p>
      <p
        style={{
          marginTop: "0.5rem",
          marginBottom: "0.5rem",
          borderBottom: "1px dotted lightgray",
        }}
      >
        <strong>deck</strong>: {note.deck}
      </p>
      <p
        style={{
          marginTop: "0.5rem",
          borderBottom: "1px dotted lightgray",
        }}
      >
        <strong>tags</strong>: {note.tags}
      </p>
    </>
  );
}
