import { type Note } from "@notatki/core";
import { FieldList1 } from "./FieldList.js";
import { Meta } from "./Meta.js";
import * as cn from "./Note.module.css";
import { type Selection } from "./selection.js";
import { useView } from "./view.js";

export function Note1({ note, selection }: { note: Note; selection: Selection }) {
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
      <FieldList1 note={note} selection={selection} />
    </section>
  );
}
