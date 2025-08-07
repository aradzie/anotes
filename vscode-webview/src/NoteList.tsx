import { Note } from "@anotes/core";
import { clsx } from "clsx";
import { Note1 } from "./Note.js";
import * as cn from "./NoteList.module.css";
import { useView } from "./view.js";

export function NoteList1({ notes }: { notes: Note[] }) {
  const { view } = useView();
  return (
    <div className={cn.root}>
      <div
        className={clsx({
          [cn.alignLeft]: view.align === "left",
          [cn.alignCenter]: view.align === "center",
          [cn.alignWidth]: view.align === "width",
        })}
      >
        <p>{notes.length} note(s)</p>
        {notes.map((value, index) => (
          <Note1 key={index} note={value} />
        ))}
      </div>
    </div>
  );
}
