import { formatMath, type NoteField, renderHtml } from "@anotes/core";
import { useMemo } from "react";
import * as cn from "./Field.module.css";
import { revealRange } from "./navigate.js";

export function Field1({ field }: { field: NoteField }) {
  return (
    <div
      className={cn.root}
      onClick={() => {
        const { loc } = field;
        if (loc) {
          revealRange(loc);
        }
      }}
    >
      <p className={cn.field}>
        <strong className={cn.name}>{field.name}</strong>:
      </p>
      <FieldValue value={field.value} />
    </div>
  );
}

function FieldValue({ value }: { value: string }) {
  const html = useMemo(() => formatMath(value, renderHtml({ output: "html", throwOnError: false })), [value]);
  return <div className={cn.value} dangerouslySetInnerHTML={{ __html: html }} />;
}
