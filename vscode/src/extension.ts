import { NoteList, parseNotes, SyntaxError } from "@anotes/core";
import vscode from "vscode";
import { exportNotesCommand } from "./export-notes.js";
import { insertIdCommand, insertIdOnSave } from "./note-id.js";
import { PreviewManager } from "./preview.js";

let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext) {
  diagnosticCollection = vscode.languages.createDiagnosticCollection("anki-notes");
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

  vscode.workspace.onDidOpenTextDocument(checkForErrors, null, context.subscriptions);
  vscode.workspace.onDidSaveTextDocument(checkForErrors, null, context.subscriptions);
}

export function deactivate() {}

function checkForErrors(doc: vscode.TextDocument) {
  if (doc.languageId === "anki-notes") {
    const diagnostics: vscode.Diagnostic[] = [];
    const uri = String(doc.uri);
    const text = doc.getText();
    try {
      parseNotes(uri, text, new NoteList());
    } catch (err) {
      if (err instanceof SyntaxError) {
        const {
          location: { start, end },
        } = err;
        const range = new vscode.Range(doc.positionAt(start.offset), doc.positionAt(end.offset));
        const diagnostic = new vscode.Diagnostic(range, err.message, vscode.DiagnosticSeverity.Error);
        diagnostics.push(diagnostic);
      }
    }
    diagnosticCollection.set(doc.uri, diagnostics);
  }
}
