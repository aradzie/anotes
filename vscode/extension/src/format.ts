import { NoteParser, printNoteNodes, printTypeNodes, reformatNoteNodes, reformatTypeNodes } from "@anotes/core";
import vscode from "vscode";

export class NotesFormatter implements vscode.DocumentFormattingEditProvider {
  constructor(context: vscode.ExtensionContext) {
    context.subscriptions.push(this);
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider("anki-notes", this));
  }

  provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
    const uri = String(document.uri);
    const text = document.getText();
    const parser = new NoteParser();
    const nodes = parser.parseNoteNodes(uri, text);
    if (parser.errors.length > 0) {
      return [];
    } else {
      const start = document.positionAt(0);
      const end = document.positionAt(text.length);
      const range = new vscode.Range(start, end);
      return [vscode.TextEdit.replace(range, printNoteNodes(reformatNoteNodes(nodes)))];
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
    const uri = String(document.uri);
    const text = document.getText();
    const parser = new NoteParser();
    const nodes = parser.parseTypeNodes(uri, text);
    if (parser.errors.length > 0) {
      return [];
    } else {
      const start = document.positionAt(0);
      const end = document.positionAt(text.length);
      const range = new vscode.Range(start, end);
      return [vscode.TextEdit.replace(range, printTypeNodes(reformatTypeNodes(nodes)))];
    }
  }

  dispose() {}
}
