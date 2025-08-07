import { Note } from "@anotes/core";
import { Field } from "./Field.js";

export function FieldList({ note }: { note: Note }) {
  return note.type.fields.map(({ name }, index) => {
    const value = note.fields[name]?.trim();
    if (value) {
      return <Field key={index} name={name} value={value} />;
    } else {
      return null;
    }
  });
}
