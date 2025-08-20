import { formatNotes, NoteParser } from "@anotes/core";
import vscode from "vscode";

export async function insertIdCommand() {
  const editor = vscode.window.activeTextEditor;
  if (editor != null && editor.document.languageId === "anki-notes") {
    const { document } = editor;
    const edit = new vscode.WorkspaceEdit();
    for (const { range, newText } of editDocument(document)) {
      edit.replace(document.uri, range, newText);
    }
    if (await vscode.workspace.applyEdit(edit)) {
      if (document.isDirty) {
        await document.save();
      }
    }
  }
}

export function insertIdOnSave(event: vscode.TextDocumentWillSaveEvent) {
  const { document } = event;
  if (document.languageId === "anki-notes") {
    if (vscode.workspace.getConfiguration("anki-notes").get("insertIdOnSave", true)) {
      event.waitUntil(Promise.resolve(editDocument(document)));
    }
  }
}

function editDocument(document: vscode.TextDocument): vscode.TextEdit[] {
  const uri = String(document.uri);
  const text = document.getText();
  const parser = new NoteParser();
  parser.parseNotes(uri, text);
  const { notes, errors } = parser;
  if (errors.length > 0) {
    return [];
  } else {
    notes.insertId();
    const start = document.positionAt(0);
    const end = document.positionAt(text.length);
    const range = new vscode.Range(start, end);
    return [vscode.TextEdit.replace(range, formatNotes(notes))];
  }
}
