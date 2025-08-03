import vscode from "vscode";
import { insertId } from "./insertId.js";
import { PreviewManager } from "./preview.js";

export function activate(context: vscode.ExtensionContext) {
  const manager = new PreviewManager();
  context.subscriptions.push(manager);
  context.subscriptions.push(
    vscode.commands.registerCommand("anki-notes.showPreview", () =>
      manager.showPreview(/* sideBySide = */ false, /* locked= */ false),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("anki-notes.showPreviewToTheSide", () =>
      manager.showPreview(/* sideBySide = */ true, /* locked= */ false),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("anki-notes.showLockedPreviewToTheSide", () =>
      manager.showPreview(/* sideBySide = */ true, /* locked= */ true),
    ),
  );
  context.subscriptions.push(vscode.commands.registerCommand("anki-notes.insertId", insertId));
}

export function deactivate() {}
