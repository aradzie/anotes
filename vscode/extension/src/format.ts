import { NoteParser, printNoteNodes, printTypeNodes } from "@anotes/core";
import vscode from "vscode";

export class AnkiNotesFormatter implements vscode.DocumentFormattingEditProvider {
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
      return [vscode.TextEdit.replace(range, printNoteNodes(nodes))];
    }
  }
}

export class AnkiTypesFormatter implements vscode.DocumentFormattingEditProvider {
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
      return [vscode.TextEdit.replace(range, printTypeNodes(nodes))];
    }
  }
}
