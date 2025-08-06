import vscode from "vscode";
import { insertIdCommand, insertIdOnSave } from "./note-id.js";
import { PreviewManager } from "./preview.js";

export function activate(context: vscode.ExtensionContext) {
  const manager = new PreviewManager(context);
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
  context.subscriptions.push(vscode.commands.registerCommand("anki-notes.insertId", insertIdCommand));
  context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(insertIdOnSave));
}

export function deactivate() {}
