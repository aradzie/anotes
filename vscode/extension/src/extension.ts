import vscode from "vscode";
import { Completer } from "./completions.js";
import { ErrorChecker } from "./errors.js";
import { exportNotesCommand } from "./export-notes.js";
import { NotesFormatter, TypesFormatter } from "./format.js";
import { insertIdCommand, insertIdOnSave } from "./note-id.js";
import { PreviewManager } from "./preview.js";

export function activate(context: vscode.ExtensionContext) {
  new ErrorChecker(context);
  new Completer(context);
  new NotesFormatter(context);
  new TypesFormatter(context);
  const previewManager = new PreviewManager(context);
  context.subscriptions.push(
    vscode.commands.registerCommand("anki-notes.showPreview", () =>
      previewManager.showPreview(/* sideBySide = */ false, /* locked= */ false),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("anki-notes.showPreviewToTheSide", () =>
      previewManager.showPreview(/* sideBySide = */ true, /* locked= */ false),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("anki-notes.showLockedPreviewToTheSide", () =>
      previewManager.showPreview(/* sideBySide = */ true, /* locked= */ true),
    ),
  );
  context.subscriptions.push(vscode.commands.registerCommand("anki-notes.insertId", insertIdCommand));
  context.subscriptions.push(vscode.commands.registerCommand("anki-notes.exportNotes", exportNotesCommand));
  context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(insertIdOnSave));
}

export function deactivate() {}
