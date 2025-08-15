import { type Note } from "@anotes/core";
import { Field1 } from "./Field.js";

export function FieldList1({ note }: { note: Note }) {
  return [...note].map((field, index) => (field.value ? <Field1 key={index} field={field} /> : null));
}
