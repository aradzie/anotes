import { type NoteError, NoteList, NoteParser } from "@anotes/core";
import vscode from "vscode";
import { type TypeManager } from "./types.js";

export class ErrorChecker {
  readonly #context: vscode.ExtensionContext;
  readonly #types: TypeManager;
  readonly #diagnostics: vscode.DiagnosticCollection;

  constructor(context: vscode.ExtensionContext, types: TypeManager) {
    this.#context = context;
    this.#types = types;
    this.#diagnostics = vscode.languages.createDiagnosticCollection("anki-notes");
    this.#context.subscriptions.push(this);
    this.#context.subscriptions.push(this.#diagnostics);
    this.#context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(this.#checkErrors));
    this.#context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(this.#checkErrors));
    const checkOnChange = false;
    this.#context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument(({ document }) => {
        if (checkOnChange) {
          this.#checkErrors(document);
        }
      }),
    );
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
    const parser = new NoteParser(new NoteList(this.#types.build().types));
    parser.parseNotes(uri, text);
    parser.checkDuplicates();
    this.#showErrors(document, parser.errors);
  }

  #checkTypes(document: vscode.TextDocument) {
    const uri = String(document.uri);
    const text = document.getText();
    const parser = new NoteParser();
    parser.parseTypes(uri, text);
    this.#showErrors(document, parser.errors);
  }

  #showErrors(document: vscode.TextDocument, errors: NoteError[]) {
    this.#diagnostics.set(
      document.uri,
      errors.map(
        ({ message, location: { start, end } }) =>
          new vscode.Diagnostic(
            new vscode.Range(document.positionAt(start.offset), document.positionAt(end.offset)),
            message,
            vscode.DiagnosticSeverity.Error,
          ),
      ),
    );
  }

  dispose() {}
}
