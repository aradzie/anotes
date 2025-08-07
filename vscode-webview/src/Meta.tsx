import { Note } from "@anotes/core";
import * as cn from "./Meta.module.css";

export function Meta({ note }: { note: Note }) {
  return (
    <div className={cn.root}>
      <p className={cn.field}>
        <strong className={cn.name}>id</strong>: <span className={cn.value}>{note.id}</span>
      </p>
      <p className={cn.field}>
        <strong className={cn.name}>type</strong>: <span className={cn.value}>{note.type.name}</span>
      </p>
      <p className={cn.field}>
        <strong className={cn.name}>deck</strong>: <span className={cn.value}>{note.deck}</span>
      </p>
      <p className={cn.field}>
        <strong className={cn.name}>tags</strong>: <span className={cn.value}>{note.tags}</span>
      </p>
    </div>
  );
}
