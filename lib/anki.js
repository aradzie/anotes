import { marked } from "marked";
import { withTemplate } from "./templates.js";

function parseNotes(text, notes) {
  let type = "Basic";
  let deck = "";
  let tags = "";
  let template = "Basic";

  let state = "front";

  let front = "";
  let back = "";

  for (let line of text.split(/\n/g)) {
    if (line.startsWith("#")) {
      continue;
    }
    if (line.startsWith("!type:")) {
      type = line.substring(6).trim();
      continue;
    }
    if (line.startsWith("!deck:")) {
      deck = line.substring(6).trim();
      continue;
    }
    if (line.startsWith("!tags:")) {
      tags = line.substring(6).trim();
      continue;
    }
    if (line.startsWith("!template:")) {
      template = line.substring(10).trim();
      continue;
    }
    if (line.startsWith("---")) {
      state = "back";
      continue;
    }
    if (line.startsWith("===")) {
      front = marked.parse(front.trim()).trim();
      back = marked.parse(back.trim()).trim();
      back = withTemplate(back, template);
      notes.push({ type, deck, tags, front, back });
      state = "front";
      front = "";
      back = "";
      continue;
    }
    switch (state) {
      case "front":
        if (front) {
          front += "\n";
        }
        front += line;
        break;
      case "back":
        if (back) {
          back += "\n";
        }
        back += line;
        break;
    }
  }
}

function formatNotes(notes) {
  const lines = [];
  lines.push(`#separator:semicolon`);
  lines.push(`#html:true`);
  lines.push(`#notetype column:1`);
  lines.push(`#deck column:2`);
  lines.push(`#tags column:3`);
  for (const { type, deck, tags, front, back } of notes) {
    lines.push([type, deck, tags, front, back].map(formatField).join(";"));
  }
  lines.push("");
  return lines.join("\n");
}

function formatField(value) {
  if (value.includes(";") || value.includes("\n") || value.includes('"')) {
    return `"${value.replaceAll('"', '""')}"`;
  } else {
    return value;
  }
}

export { parseNotes, formatNotes };
