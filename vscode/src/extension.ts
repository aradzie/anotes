import vscode from "vscode";
import { checkErrors, diagnosticCollection } from "./check-errors.js";
import { exportNotesCommand } from "./export-notes.js";
import { insertIdCommand, insertIdOnSave } from "./note-id.js";
import { PreviewManager } from "./preview.js";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(diagnosticCollection);
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
  context.subscriptions.push(vscode.commands.registerCommand("anki-notes.exportNotes", exportNotesCommand));
  context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(insertIdOnSave));
  context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(checkErrors));
  context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(checkErrors));
}

export function deactivate() {}
