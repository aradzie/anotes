import vscode from "vscode";
import { Completer, Completions } from "./completions.js";
import { ErrorChecker } from "./errors.js";
import { exportNotesCommand } from "./export-notes.js";
import { NotesFormatter, TypesFormatter } from "./format.js";
import { insertIdCommand, insertIdOnSave } from "./note-id.js";
import { PreviewManager } from "./preview.js";
import { TypeManager } from "./types.js";

export function activate(context: vscode.ExtensionContext) {
  const types = new TypeManager(context);
  new ErrorChecker(context, types);
  new Completer(context, new Completions(types));
  new NotesFormatter(context);
  new TypesFormatter(context);
  const previews = new PreviewManager(context, types);
  context.subscriptions.push(
    vscode.commands.registerCommand("anki-notes.showPreview", () =>
      previews.showPreview(/* sideBySide = */ false, /* locked= */ false),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("anki-notes.showPreviewToTheSide", () =>
      previews.showPreview(/* sideBySide = */ true, /* locked= */ false),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("anki-notes.showLockedPreviewToTheSide", () =>
      previews.showPreview(/* sideBySide = */ true, /* locked= */ true),
    ),
  );
  context.subscriptions.push(vscode.commands.registerCommand("anki-notes.insertId", insertIdCommand));
  context.subscriptions.push(vscode.commands.registerCommand("anki-notes.exportNotes", exportNotesCommand));
  context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(insertIdOnSave));
}

export function deactivate() {}
