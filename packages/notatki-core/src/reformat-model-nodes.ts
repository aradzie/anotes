import { type ModelNode } from "@notatki/parser";

export function reformatModelNodes(nodes: Iterable<ModelNode>): ModelNode[] {
  return [...nodes];
}
