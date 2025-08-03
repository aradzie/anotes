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
        backgroundColor: "white",
        color: "black",
        border: "1px dotted gray",
      }}
    >
      <Meta note={note} />
      <FieldList note={note} />
    </section>
  );
}
