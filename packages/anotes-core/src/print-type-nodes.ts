import { type TypeDefNode } from "@anotes/parser";
import { Output } from "./output.js";

export function printTypeNodes(nodes: Iterable<TypeDefNode>) {
  const out = new Output();
  for (const { name, id, fields, cards, styling } of nodes) {
    out.separate();
    out.push(`type ${name.text}`);
    out.separate();
    out.push(`id ${id.value}`);
    out.separate();
    for (const { name, required } of fields) {
      out.push(`field ${name.text}${required ? "" : "?"}`);
    }
    out.separate();
    for (const { name, front, back } of cards) {
      out.push(`card ${name.text}`);
      out.separate();
      out.push("front");
      out.push(front.text);
      out.push("~~~");
      out.separate();
      out.push("back");
      out.push(back.text);
      out.push("~~~");
      out.separate();
    }
    if (styling != null) {
      out.push("styling");
      out.push(styling.text);
      out.push("~~~");
    }
  }
  return out.print();
}
