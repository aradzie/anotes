import { formatField, renderHtml } from "@anotes/format";
import { type Note } from "./note.js";

type Part = string | { field: string };

export function interpolateTemplate(template: string, note: Note) {
  return parseTemplate(template)
    .map((part) => {
      if (typeof part === "string") {
        return part;
      }
      const { field } = part;
      switch (field) {
        case "Type": {
          return escapeHtml(note.type.name);
        }
        case "Tags": {
          return escapeHtml(note.tags);
        }
        case "Deck": {
          return escapeHtml(note.deck);
        }
        case "FrontSide": {
          return "Front Side";
        }
        case "cloze:Text": {
          return fieldValue(note, "Text");
        }
      }
      return fieldValue(note, field);
    })
    .join("");
}

export function escapeHtml(text: string) {
  return String(text)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parseTemplate(template: string): Part[] {
  const parts = [];
  const regex = /{{\s*([^{}]+?)\s*}}/g;
  let index = 0;
  let match;
  while ((match = regex.exec(template)) != null) {
    if (index < match.index) {
      parts.push(template.substring(index, match.index));
    }
    parts.push({ field: match[1] as string });
    index = match.index + match[0].length;
  }
  if (index < template.length) {
    parts.push(template.substring(index, template.length));
  }
  return parts;
}

function fieldValue(note: Note, field: string) {
  if (note.has(field)) {
    const { value } = note.get(field);
    return formatField(value, renderHtml({ output: "html", throwOnError: false }));
  }
  return `{{${field}}}`;
}
