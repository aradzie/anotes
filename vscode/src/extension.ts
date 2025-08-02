import { commands, ExtensionContext } from "vscode";
import { previewCommand } from "./previewCommand.js";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(commands.registerCommand("anki-notes.showPreview", previewCommand));
}

export function deactivate() {}
