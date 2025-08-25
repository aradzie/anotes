import { type ModelNode } from "@anotes/parser";

export function reformatModelNodes(nodes: Iterable<ModelNode>): ModelNode[] {
  return [...nodes];
}
