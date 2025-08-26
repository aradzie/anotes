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

export type ModelNode = {
  name: Token;
  id: ModelIdNode;
  cloze: Token;
  fields: ModelFieldNode[];
  cards: ModelCardNode[];
  styling: CardStylingNode | null;
} & Node;

export type ModelIdNode = {
  id: Token;
  value: number;
} & Node;

export type ModelFieldNode = {
  name: Token;
  required: boolean;
} & Node;

export type ModelCardNode = {
  name: Token;
  front: CardFrontNode;
  back: CardBackNode;
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
