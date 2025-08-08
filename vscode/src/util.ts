import vscode from "vscode";

export async function revealEditor(uri: string): Promise<vscode.TextEditor> {
  return await vscode.window.showTextDocument(await vscode.workspace.openTextDocument(vscode.Uri.parse(uri)), {
    preview: false,
    preserveFocus: false,
  });
}
