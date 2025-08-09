import { type Note } from "@anotes/core";
import { FieldList1 } from "./FieldList.js";
import { Meta } from "./Meta.js";
import * as cn from "./Note.module.css";
import { useView } from "./view.js";

export function Note1({ note }: { note: Note }) {
  const { view } = useView();
  return (
    <section
      className={cn.root}
      data-note-id={note.id}
      data-note-type={note.type.name}
      data-note-deck={note.deck}
      data-note-tags={note.tags}
    >
      {view.view === "details" && <Meta note={note} />}
      <FieldList1 note={note} />
    </section>
  );
}
