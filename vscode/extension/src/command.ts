import vscode from "vscode";

export abstract class Command {
  readonly #id: string;

  protected constructor(id: string) {
    this.#id = id;
  }

  attach = (context: vscode.ExtensionContext) => {
    context.subscriptions.push(vscode.commands.registerCommand(this.#id, () => this.execute()));
  };

  abstract execute(): void | Promise<void>;
}
