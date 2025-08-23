import { type TypeDefNode } from "@anotes/parser";

export function reformatTypeNodes(nodes: Iterable<TypeDefNode>): TypeDefNode[] {
  return [...nodes];
}
