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
  name: Token;
  value: Token;
} & Node;

export type FieldNode = {
  name: Token;
  value: Token;
} & Node;

export type Token = {
  text: string;
} & Node;
