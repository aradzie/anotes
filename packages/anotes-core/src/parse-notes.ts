import { basicNoteType, findByName, type Note, noteTypes } from "./note.js";

const pattern = /^!(?<name>[a-zA-Z0-9]+):(?<value>.*)$/;

function parseNotes(source: string, text: string, notes: Note[]): void {
  let lineIndex = 0;

  function errorMessage(message: string) {
    return `[${source}:${lineIndex}]: ${message}`;
  }

  let note: Note = {
    type: basicNoteType,
    deck: "",
    tags: "",
    template: "Basic",
    id: null,
    fields: {},
  };

  let state = "card";
  let fieldName = "";
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
        const type = findByName(noteTypes, value);
        if (type == null) {
          throw new SyntaxError(errorMessage(`Unknown note type [${value}]`));
        }
        note.type = type;
        return true;
      case "deck":
        checkUnique(name);
        note.deck = value;
        return true;
      case "tags":
        checkUnique(name);
        note.tags = value;
        return true;
      case "template":
        checkUnique(name);
        note.template = value;
        return true;
      case "id":
        checkUnique(name);
        note.id = value;
        return true;
    }
    return false;
  }

  function setField(name: string, value: string) {
    const field = findByName(note.type.fields, name);
    if (field != null) {
      checkUnique(field.name);
      fieldName = field.name;
      note.fields[fieldName] = value;
      return true;
    }
    return false;
  }

  function appendField(value: string) {
    note.fields[fieldName] += "\n" + value;
  }

  for (let line of text.split(/\n/g)) {
    lineIndex += 1;

    if (line.startsWith("!#")) {
      continue; // Ignore comment lines.
    }

    if (line.startsWith("~~~")) {
      // Finalize a card.
      notes.push(note);
      note = {
        ...note, // Retain shared properties.
        id: null,
        fields: {},
      };
      state = "card";
      fieldName = "";
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

        if (setProperty(name, value.trim())) {
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

        if (setProperty(name, value.trim())) {
          state = "card";
          continue;
        }

        if (setField(name, value)) {
          state = "field";
          continue;
        }

        throw new SyntaxError(errorMessage(`Unknown property [${name}]`));
      }

      appendField(line);
    }
  }

  if (seen.size > 0) {
    throw new SyntaxError(errorMessage(`Unfinished card`));
  }
}

export { parseNotes };
