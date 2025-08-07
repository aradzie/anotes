import { formatMath, renderHtml } from "@anotes/core";
import { memo } from "react";
import * as cn from "./Field.module.css";

export const Field = memo(function Field({ name, value }: { name: string; value: string }) {
  try {
    const html = formatMath(value, renderHtml({ output: "html", throwOnError: false }));
    return (
      <div className={cn.root}>
        <p className={cn.field}>
          <span className={cn.fieldName}>{name}</span>:
        </p>
        <div className={cn.fieldValue} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  } catch (err) {
    return <pre style={{ color: "red" }}>{String(err)}</pre>;
  }
});
