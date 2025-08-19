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

export type TypeDefNode = {
  name: Token;
  id: IdNode;
  fields: FieldDefNode[];
  cards: CardDefNode[];
} & Node;

export type IdNode = {
  id: Token;
  value: number;
} & Node;

export type FieldDefNode = {
  name: Token;
  required: boolean;
} & Node;

export type CardDefNode = {
  name: Token;
  front: CardFrontNode;
  back: CardBackNode;
  styling: CardStylingNode | null;
} & Node;

export type CardFrontNode = {
  text: string;
} & Node;

export type CardBackNode = {
  text: string;
} & Node;

export type CardStylingNode = {
  text: string;
} & Node;

export type Token = {
  text: string;
} & Node;
