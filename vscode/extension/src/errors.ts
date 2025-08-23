import { NoteParser } from "@anotes/core";
import vscode from "vscode";

const checkOnChange = false;

export class ErrorChecker {
  readonly #context: vscode.ExtensionContext;
  readonly #diagnostics: vscode.DiagnosticCollection;

  constructor(context: vscode.ExtensionContext) {
    this.#context = context;
    this.#diagnostics = vscode.languages.createDiagnosticCollection("anki-notes");
    this.#context.subscriptions.push(this);
    this.#context.subscriptions.push(this.#diagnostics);
    this.#context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(this.#checkErrors));
    this.#context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(this.#checkErrors));
    if (checkOnChange) {
      this.#context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(({ document }) => {
          this.#checkErrors(document);
        }),
      );
    }
  }

  #checkErrors = (document: vscode.TextDocument) => {
    if (document.languageId === "anki-notes") {
      this.#checkNotes(document);
    }
    if (document.languageId === "anki-types") {
      this.#checkTypes(document);
    }
  };

  #checkNotes(document: vscode.TextDocument) {
    const uri = String(document.uri);
    const text = document.getText();
    const parser = new NoteParser();
    parser.parseNotes(uri, text);
    parser.checkDuplicates();
    const diagnostics: vscode.Diagnostic[] = [];
    for (const {
      message,
      location: { start, end },
    } of parser.errors) {
      const range = new vscode.Range(document.positionAt(start.offset), document.positionAt(end.offset));
      const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
      diagnostics.push(diagnostic);
    }
    this.#diagnostics.set(document.uri, diagnostics);
  }

  #checkTypes(document: vscode.TextDocument) {
    const uri = String(document.uri);
    const text = document.getText();
    const parser = new NoteParser();
    parser.parseTypes(uri, text);
    const diagnostics: vscode.Diagnostic[] = [];
    for (const {
      message,
      location: { start, end },
    } of parser.errors) {
      const range = new vscode.Range(document.positionAt(start.offset), document.positionAt(end.offset));
      const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
      diagnostics.push(diagnostic);
    }
    this.#diagnostics.set(document.uri, diagnostics);
  }

  dispose() {}
}
