import { NoteParser } from "@anotes/core";
import vscode from "vscode";

const diagnosticCollection = vscode.languages.createDiagnosticCollection("anki-notes");

function checkErrors(document: vscode.TextDocument) {
  if (document.languageId === "anki-notes") {
    const uri = String(document.uri);
    const text = document.getText();
    const parser = new NoteParser();
    parser.parse(uri, text);
    const diagnostics: vscode.Diagnostic[] = [];
    for (const {
      message,
      location: { start, end },
    } of parser.errors) {
      const range = new vscode.Range(document.positionAt(start.offset), document.positionAt(end.offset));
      const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
      diagnostics.push(diagnostic);
    }
    diagnosticCollection.set(document.uri, diagnostics);
  }
}

export { checkErrors, diagnosticCollection };
