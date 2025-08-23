import vscode from "vscode";

export async function revealRange(uri: vscode.Uri, column: vscode.ViewColumn, start: number, end: number) {
  const document = await vscode.workspace.openTextDocument(uri);
  const editor = await vscode.window.showTextDocument(document, column);
  const range = new vscode.Range(editor.document.positionAt(start), editor.document.positionAt(end));
  editor.selection = new vscode.Selection(range.start, range.start);
  editor.revealRange(range);
}

export function replaceDocument(document: vscode.TextDocument, newText: string): vscode.TextEdit[] {
  const { length } = document.getText();
  const start = document.positionAt(0);
  const end = document.positionAt(length);
  const range = new vscode.Range(start, end);
  return [vscode.TextEdit.replace(range, newText)];
}

export function reportError(err: unknown) {
  console.error(err);
}
