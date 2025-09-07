import { type Model, type Note } from "@anotes/core";

export class Reporter {
  start(): void {}

  syncModel(model: Model): void {}

  syncNote(note: Note): void {}

  end(): void {}
}
