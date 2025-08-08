import { type NoteError } from "@anotes/core";
import * as cn from "./ErrorList.module.css";

export function ErrorList({ errors }: { errors: NoteError[] }) {
  return (
    <div className={cn.root}>
      {errors.map(({ message, location: { source, start } }, index) => (
        <p key={index} className={cn.error}>
          <strong>{message}</strong>
          {" at "}
          {String(source)}:{start.line}:{start.column}
        </p>
      ))}
    </div>
  );
}
