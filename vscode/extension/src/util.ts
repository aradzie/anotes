import vscode from "vscode";

export async function revealRange(uri: vscode.Uri, column: vscode.ViewColumn, start: number, end: number) {
  const document = await vscode.workspace.openTextDocument(uri);
  const editor = await vscode.window.showTextDocument(document, column);
  const range = new vscode.Range(editor.document.positionAt(start), editor.document.positionAt(end));
  editor.selection = new vscode.Selection(range.start, range.start);
  editor.revealRange(range);
}

export function reportError(err: unknown) {
  console.error(err);
}
