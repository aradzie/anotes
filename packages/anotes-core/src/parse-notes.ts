import { allFields } from "./fields.js";
import type { Note } from "./note.js";

const pattern = /^!(?<name>[a-zA-Z0-9]+):(?<value>.*)$/;

function parseNotes(source: string, text: string, notes: Note[]): void {
  let lineIndex = 0;

  function errorMessage(message: string) {
    return `[${source}:${lineIndex}]: ${message}`;
  }

  function blank(): Pick<Note, "id" | "fields"> {
    return {
      id: null,
      fields: Object.fromEntries([...allFields.keys()].map((name) => [name, ""])),
    };
  }

  let current = {
    type: "Basic",
    deck: "",
    tags: "",
    template: "Basic",
    ...blank(),
  } satisfies Note;

  let state = "card";
  let field = "";
  let seen = new Set();

  function checkUnique(name: string) {
    if (seen.has(name)) {
      throw new SyntaxError(errorMessage(`Duplicate property [${name}]`));
    }
    seen.add(name);
  }

  function setProperty(name: string, value: string) {
    switch (name) {
      case "type":
        checkUnique(name);
        current.type = value.trim();
        return true;
      case "deck":
        checkUnique(name);
        current.deck = value.trim();
        return true;
      case "tags":
        checkUnique(name);
        current.tags = value.trim();
        return true;
      case "template":
        checkUnique(name);
        current.template = value.trim();
        return true;
      case "id":
        checkUnique(name);
        current.id = value.trim();
        return true;
    }
    return false;
  }

  function setField(name: string, value: string) {
    if (allFields.has(name)) {
      checkUnique(name);
      field = name;
      current.fields[field] = value;
      return true;
    }
    return false;
  }

  function appendField(name: string, value: string) {
    if (allFields.has(name)) {
      current.fields[name] += "\n" + value;
      return true;
    }
    return false;
  }

  for (let line of text.split(/\n/g)) {
    lineIndex += 1;

    if (line.startsWith("!#")) {
      continue; // Ignore comment lines.
    }

    if (line.startsWith("~~~")) {
      // Finalize a card.
      notes.push(current);
      current = {
        ...current, // Retain shared properties.
        ...blank(), // Reset fields.
      };
      state = "card";
      field = "";
      seen.clear();
      continue;
    }

    if (state === "card") {
      if (line.trim() === "") {
        continue; // Skip empty lines.
      }

      const m = pattern.exec(line);
      if (m) {
        const { name, value } = m.groups as { name: string; value: string };

        if (setProperty(name, value)) {
          state = "card";
          continue;
        }

        if (setField(name, value)) {
          state = "field";
          continue;
        }

        throw new SyntaxError(errorMessage(`Unknown property [${name}]`));
      }

      throw new SyntaxError(errorMessage(`Line is not a part of a field`));
    }

    if (state === "field") {
      const m = pattern.exec(line);
      if (m) {
        const { name, value } = m.groups as { name: string; value: string };

        if (setProperty(name, value)) {
          state = "card";
          continue;
        }

        if (setField(name, value)) {
          state = "field";
          continue;
        }

        throw new SyntaxError(errorMessage(`Unknown property [${name}]`));
      }

      appendField(field, line);
    }
  }

  if (seen.size > 0) {
    throw new SyntaxError(errorMessage(`Unfinished card`));
  }
}

export { parseNotes };
