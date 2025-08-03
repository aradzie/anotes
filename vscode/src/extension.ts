import { commands, ExtensionContext } from "vscode";
import { insertId } from "./commands/insertId.js";
import { openPreview } from "./commands/openPreview.js";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(commands.registerCommand("anki-notes.openPreview", openPreview));
  context.subscriptions.push(commands.registerCommand("anki-notes.openPreviewToTheSide", openPreview));
  context.subscriptions.push(commands.registerCommand("anki-notes.insertId", insertId));
}

export function deactivate() {}
