import { NoteParser, printNoteNodes, printTypeNodes, reformatNoteNodes, reformatTypeNodes } from "@anotes/core";
import vscode from "vscode";
import { replaceDocument } from "./util.js";

export class NotesFormatter implements vscode.DocumentFormattingEditProvider {
  constructor(context: vscode.ExtensionContext) {
    context.subscriptions.push(this);
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider("anki-notes", this));
  }

  provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
    const parser = new NoteParser();
    const nodes = parser.parseNoteNodes(document.uri.fsPath, document.getText());
    if (parser.errors.length > 0) {
      return [];
    } else {
      return replaceDocument(document, printNoteNodes(reformatNoteNodes(nodes)));
    }
  }

  dispose() {}
}

export class TypesFormatter implements vscode.DocumentFormattingEditProvider {
  constructor(context: vscode.ExtensionContext) {
    context.subscriptions.push(this);
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider("anki-types", this));
  }

  provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
    const parser = new NoteParser();
    const nodes = parser.parseTypeNodes(document.uri.fsPath, document.getText());
    if (parser.errors.length > 0) {
      return [];
    } else {
      return replaceDocument(document, printTypeNodes(reformatTypeNodes(nodes)));
    }
  }

  dispose() {}
}
