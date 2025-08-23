import vscode from "vscode";
import { Completer, Completions } from "./completions.js";
import { ErrorChecker } from "./errors.js";
import { ExportCommand } from "./export-notes.js";
import { NotesFormatter, TypesFormatter } from "./format.js";
import { InsertIdCommand, insertIdOnSave } from "./note-id.js";
import { PreviewManager } from "./preview.js";
import { TypeManager } from "./types.js";

export function activate(context: vscode.ExtensionContext) {
  const types = new TypeManager(context);
  const errors = new ErrorChecker(context, types);
  new Completer(context, new Completions(types));
  new NotesFormatter(context);
  new TypesFormatter(context);
  new PreviewManager(context, types);
  new ExportCommand(errors).attach(context);
  new InsertIdCommand().attach(context);
  context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(insertIdOnSave));
}

export function deactivate() {}
