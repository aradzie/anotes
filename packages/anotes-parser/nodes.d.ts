import { type LocationRange } from "./parser.js";

export type NoteNode = {
  properties: PropertyNode[];
  fields: FieldNode[];
  loc: LocationRange;
};

export type PropertyNode = {
  name: "type" | "deck" | "tags" | "template" | "id";
  value: string;
  loc: LocationRange;
};

export type FieldNode = {
  name: string;
  value: string;
  loc: LocationRange;
};

export type Token = {
  text: string;
  loc: LocationRange;
};
