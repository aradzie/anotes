import { NoteParser } from "@anotes/core";
import vscode from "vscode";

const checkOnChange = false;

class CheckErrors {
  readonly #diagnosticCollection: vscode.DiagnosticCollection;

  constructor(context: vscode.ExtensionContext) {
    this.#diagnosticCollection = vscode.languages.createDiagnosticCollection("anki-notes");
    context.subscriptions.push(this.#diagnosticCollection);
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(this.#checkErrors));
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(this.#checkErrors));
    if (checkOnChange) {
      context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(({ document }) => {
          this.#checkErrors(document);
        }),
      );
    }
  }

  #checkErrors = (document: vscode.TextDocument) => {
    if (document.languageId === "anki-notes") {
      const uri = String(document.uri);
      const text = document.getText();
      const parser = new NoteParser();
      parser.parseNotes(uri, text);
      const diagnostics: vscode.Diagnostic[] = [];
      for (const {
        message,
        location: { start, end },
      } of parser.errors) {
        const range = new vscode.Range(document.positionAt(start.offset), document.positionAt(end.offset));
        const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
        diagnostics.push(diagnostic);
      }
      this.#diagnosticCollection.set(document.uri, diagnostics);
    }
  };

  dispose() {}
}

export { CheckErrors };
