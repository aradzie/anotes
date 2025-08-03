import { allFields, Note } from "@anotes/core";
import { Field } from "./Field.js";

export function FieldList({ note }: { note: Note }) {
  return [...allFields].map(([name, config], index) => {
    const value = note.fields[name]?.trim();
    if (value) {
      return <Field key={index} note={note} name={name} config={config} value={value} />;
    } else {
      return null;
    }
  });
}
