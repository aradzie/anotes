import { type NoteError, NoteList, NoteParser } from "@anotes/core";
import vscode from "vscode";
import { ankiNotes, ankiTypes } from "./constants.js";
import { type TypeManager } from "./types.js";

export class ErrorChecker {
  readonly #context: vscode.ExtensionContext;
  readonly #types: TypeManager;
  readonly #diagnostics: vscode.DiagnosticCollection;

  constructor(context: vscode.ExtensionContext, types: TypeManager) {
    this.#context = context;
    this.#types = types;
    this.#diagnostics = vscode.languages.createDiagnosticCollection(ankiNotes);
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
    if (document.languageId === ankiNotes) {
      this.#checkNotes(document);
    }
    if (document.languageId === ankiTypes) {
      this.#checkTypes(document);
    }
  };

  #checkNotes(document: vscode.TextDocument) {
    const parser = new NoteParser(new NoteList(this.#types.build().types));
    parser.parseNotes(document.uri.fsPath, document.getText());
    parser.checkDuplicates();
    this.#diagnostics.set(document.uri, parser.errors.map(asDiagnostic));
  }

  #checkTypes(document: vscode.TextDocument) {
    const parser = new NoteParser();
    parser.parseTypes(document.uri.fsPath, document.getText());
    this.#diagnostics.set(document.uri, parser.errors.map(asDiagnostic));
  }

  showAllErrors(errors: Iterable<NoteError>) {
    const map = new Map<string, vscode.Diagnostic[]>();
    for (const error of errors) {
      const path = String(error.location.source);
      let diagnostics = map.get(path);
      if (diagnostics == null) {
        map.set(path, (diagnostics = []));
      }
      diagnostics.push(asDiagnostic(error));
    }
    for (const [path, diagnostics] of map) {
      this.#diagnostics.set(vscode.Uri.file(path), diagnostics);
    }
  }

  dispose() {}
}

function asDiagnostic({ message, location: { start, end } }: NoteError) {
  return new vscode.Diagnostic(
    new vscode.Range(start.line - 1, start.column - 1, end.line - 1, end.column - 1),
    message,
    vscode.DiagnosticSeverity.Error,
  );
}
