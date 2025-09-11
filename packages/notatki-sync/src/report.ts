import { type Model, type Note } from "@notatki/core";

export class Reporter {
  start(): void {}

  syncModel(model: Model): void {}

  syncNote(note: Note): void {}

  end(): void {}
}
