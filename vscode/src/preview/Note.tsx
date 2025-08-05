import { Note } from "@anotes/core";
import { FieldList } from "./FieldList.js";
import { Meta } from "./Meta.js";

export function Note1({ note }: { note: Note }) {
  return (
    <section
      style={{
        margin: "1rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        border: "1px dotted gray",
      }}
      data-note-id={note.id}
      data-note-type={note.type}
      data-note-deck={note.deck}
      data-note-tags={note.tags}
      data-note-template={note.template}
    >
      <Meta note={note} />
      <FieldList note={note} />
    </section>
  );
}
