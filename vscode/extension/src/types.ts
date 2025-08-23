import { type NoteError, NoteList, NoteParser, NoteTypeMap } from "@anotes/core";
import vscode, { type TextDocument } from "vscode";
import { ankiTypes, excludeSearchPath, typesSearchPath } from "./constants.js";
import { reportError } from "./util.js";

export class TypeManager {
  readonly #context: vscode.ExtensionContext;
  readonly #onDidChange = new vscode.EventEmitter<null>();
  readonly #documentState = new Map<string, DocumentState>();
  #combinedState: CombinedState | null = null;

  constructor(context: vscode.ExtensionContext) {
    this.#context = context;
    this.#context.subscriptions.push(this);
    this.#context.subscriptions.push(this.#onDidChange);
    this.#context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(this.#handleDidOpenTextDocument));
    this.#context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(this.#handleDidSaveTextDocument));
    this.#context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(this.#handleDidCloseTextDocument));
    const watcher = vscode.workspace.createFileSystemWatcher(typesSearchPath);
    this.#context.subscriptions.push(watcher);
    this.#context.subscriptions.push(watcher.onDidChange(this.#handleDidChange));
    this.#context.subscriptions.push(watcher.onDidCreate(this.#handleDidCreate));
    this.#context.subscriptions.push(watcher.onDidDelete(this.#handleDidDelete));
    this.#reset();
  }

  #reset() {
    (async () => {
      this.#documentState.clear();
      this.#combinedState = null;
      for (const uri of await vscode.workspace.findFiles(typesSearchPath, excludeSearchPath)) {
        this.#addDocument(await vscode.workspace.openTextDocument(uri));
      }
    })().catch(reportError);
  }

  #handleDidOpenTextDocument = (document: vscode.TextDocument) => {
    this.#addDocument(document);
  };

  #handleDidSaveTextDocument = (document: vscode.TextDocument) => {
    this.#addDocument(document);
  };

  #handleDidCloseTextDocument = (document: vscode.TextDocument) => {};

  #handleDidChange = (uri: vscode.Uri) => {
    vscode.workspace.openTextDocument(uri).then(this.#addDocument, reportError);
  };

  #handleDidCreate = (uri: vscode.Uri) => {
    vscode.workspace.openTextDocument(uri).then(this.#addDocument, reportError);
  };

  #handleDidDelete = (uri: vscode.Uri) => {
    this.#documentState.delete(uri.fsPath);
    this.#combinedState = null;
    this.#onDidChange.fire(null);
  };

  #addDocument = (document: TextDocument) => {
    if (document.languageId === ankiTypes) {
      const data = this.#documentState.get(pathOf(document));
      if (data == null || data.version !== document.version) {
        this.#documentState.set(pathOf(document), this.#parseDocument(document));
        this.#onDidChange.fire(null);
      }
      this.#combinedState = null;
    }
  };

  #parseDocument(document: vscode.TextDocument): DocumentState {
    const { version } = document;
    const types = new NoteTypeMap([]);
    const notes = new NoteList(types);
    const parser = new NoteParser(notes);
    parser.parseTypes(pathOf(document), document.getText());
    const { errors } = parser;
    return { document, version, types, errors };
  }

  get onDidChange(): vscode.Event<null> {
    return this.#onDidChange.event;
  }

  build(): CombinedState {
    let state = this.#combinedState;
    if (state == null) {
      const types = new NoteTypeMap();
      const errors = [] as NoteError[];
      for (const state of this.#documentState.values()) {
        for (const type of state.types) {
          types.add(type);
        }
        for (const error of state.errors) {
          errors.push(error);
        }
      }
      this.#combinedState = state = { types, errors };
    }
    return state;
  }

  dispose() {
    this.#documentState.clear();
    this.#combinedState = null;
  }
}

function pathOf(document: vscode.TextDocument): string {
  return document.uri.fsPath;
}

type DocumentState = {
  readonly document: vscode.TextDocument;
  readonly version: number;
  readonly types: NoteTypeMap;
  readonly errors: readonly NoteError[];
};

type CombinedState = {
  readonly types: NoteTypeMap;
  readonly errors: readonly NoteError[];
};
