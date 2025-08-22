import { type Note } from "@anotes/core";
import * as cn from "./Meta.module.css";

export function Meta({ note }: { note: Note }) {
  return (
    <div className={cn.root}>
      <p className={cn.field}>
        <span className={cn.name}>type</span>: {value(note.type.name)}
      </p>
      <p className={cn.field}>
        <span className={cn.name}>deck</span>: {value(note.deck)}
      </p>
      <p className={cn.field}>
        <span className={cn.name}>tags</span>: {value(note.tags)}
      </p>
      <p className={cn.field}>
        <span className={cn.name}>id</span>: {value(note.id)}
      </p>
    </div>
  );
}

function value(value: string) {
  return value ? <span className={cn.value}>{value}</span> : <span className={cn.empty}>empty</span>;
}
