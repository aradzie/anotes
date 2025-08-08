import { exportNotes, NoteParser } from "@anotes/core";
import vscode from "vscode";

export async function exportNotesCommand() {
  const [dir] = vscode.workspace.workspaceFolders ?? [];
  if (dir) {
    const parser = new NoteParser();
    const files = await vscode.workspace.findFiles("**/*.note", "**/node_modules/**");
    for (const file of files.sort(sortFiles)) {
      const data = await vscode.workspace.fs.readFile(file);
      const text = Buffer.from(data).toString("utf-8");
      parser.parse(file.fsPath, text);
      if (parser.errors.length > 0) {
        vscode.window.showErrorMessage(`Error parsing note file "${file.fsPath}".`);
        return;
      }
    }
    const { notes } = parser;
    if (notes.length > 0) {
      const out = vscode.Uri.joinPath(dir.uri, "notes.txt");
      await vscode.workspace.fs.writeFile(out, Buffer.from(exportNotes(notes)));
      vscode.window.showInformationMessage(`Exported ${notes.length} note(s) to "${out.fsPath}".`);
    } else {
      vscode.window.showWarningMessage(`No notes found in "${dir.uri.fsPath}".`);
    }
  }
}

function sortFiles(a: vscode.Uri, b: vscode.Uri): number {
  if (a.fsPath > b.fsPath) {
    return +1;
  }
  if (a.fsPath < b.fsPath) {
    return -1;
  }
  return 0;
}
