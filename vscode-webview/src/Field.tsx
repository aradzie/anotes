import { formatMath, renderHtml } from "@anotes/core";
import { memo } from "react";
import * as cn from "./Field.module.css";

export const Field = memo(function Field({ name, value }: { name: string; value: string }) {
  const html = formatMath(value, renderHtml({ output: "html", throwOnError: false }));
  return (
    <div className={cn.root}>
      <p className={cn.field}>
        <strong className={cn.name}>{name}</strong>:
      </p>
      <div className={cn.value} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
});
