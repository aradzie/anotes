import { type NoteTypeMap } from "@anotes/core";
import vscode from "vscode";
import { ankiNotes } from "./constants.js";
import { type TypeManager } from "./types.js";

export class Completer implements vscode.CompletionItemProvider {
  readonly #context: vscode.ExtensionContext;
  readonly #completions: Completions;

  constructor(context: vscode.ExtensionContext, completions: Completions) {
    this.#context = context;
    this.#completions = completions;
    this.#context.subscriptions.push(this);
    this.#context.subscriptions.push(vscode.languages.registerCompletionItemProvider(ankiNotes, this));
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext,
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
    const list = [];
    if (position.character === 0) {
      // Complete property names.
      // list.push(new vscode.CompletionItem({ label: `!type:`, description: "Property name" }));
      // list.push(new vscode.CompletionItem({ label: `!deck:`, description: "Property name" }));
      // list.push(new vscode.CompletionItem({ label: `!tags:`, description: "Property name" }));
      // Complete field names.
      const fields = new Set();
      for (const type of this.#completions.types()) {
        for (const field of type.fields) {
          fields.add(field.name.toLowerCase());
        }
      }
      for (const field of fields) {
        list.push(new vscode.CompletionItem({ label: `!${field}:`, description: "Field name" }));
      }
    } else {
      // Complete property values.
      const line = document.lineAt(position);
      switch (true) {
        case /^!type:/i.test(line.text): {
          for (const type of this.#completions.types()) {
            list.push(new vscode.CompletionItem({ label: type.name, description: "Type name" }));
          }
          break;
        }
        case /^!deck:/i.test(line.text): {
          for (const deck of this.#completions.decks()) {
            list.push(new vscode.CompletionItem({ label: deck, description: "Deck name" }));
          }
          break;
        }
        case /^!tags:/i.test(line.text): {
          for (const tag of this.#completions.decks()) {
            list.push(new vscode.CompletionItem({ label: tag, description: "Tag name" }));
          }
          break;
        }
      }
    }
    return list;
  }

  dispose() {}
}

export class Completions {
  #types: TypeManager;

  constructor(types: TypeManager) {
    this.#types = types;
  }

  types(): NoteTypeMap {
    return this.#types.build().types;
  }

  decks(): string[] {
    return [];
  }

  tags(): string[] {
    return [];
  }
}
