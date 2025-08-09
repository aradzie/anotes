import { type LocationRange } from "./parser.js";

export type Node = {
  loc: LocationRange;
};

export type NoteNode = {
  properties: PropertyNode[];
  fields: FieldNode[];
  end: Token;
} & Node;

export type PropertyNode = {
  name: "type" | "deck" | "tags" | "template" | "id";
  value: string;
} & Node;

export type FieldNode = {
  name: string;
  value: string;
} & Node;

export type Token = {
  text: string;
} & Node;
