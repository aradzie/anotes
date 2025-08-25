import vscode from "vscode";
import { Completer, Completions } from "./completions.js";
import { ErrorChecker } from "./errors.js";
import { ExportCommand } from "./export-notes.js";
import { NotesFormatter, ModelsFormatter } from "./format.js";
import { InsertIdCommand, insertIdOnSave } from "./note-id.js";
import { PreviewManager } from "./preview.js";
import { ModelManager } from "./models.js";

export function activate(context: vscode.ExtensionContext) {
  const log = vscode.window.createOutputChannel("Anki Notes", { log: true });
  context.subscriptions.push(log);
  const models = new ModelManager(context, log);
  const errors = new ErrorChecker(context, models);
  new Completer(context, new Completions(models));
  new NotesFormatter(context);
  new ModelsFormatter(context);
  new PreviewManager(context, models);
  new ExportCommand(errors, log).attach(context);
  new InsertIdCommand().attach(context);
  context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(insertIdOnSave));
}

export function deactivate() {}
