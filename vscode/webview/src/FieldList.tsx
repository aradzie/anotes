import { type Note } from "@anotes/core";
import { Field1 } from "./Field.js";
import { type Selection } from "./selection.js";

export function FieldList1({ note, selection }: { note: Note; selection: Selection }) {
  return [...note].map((field, index) =>
    field.value ? <Field1 key={index} field={field} selection={selection} /> : null,
  );
}
