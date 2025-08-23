import { exportNotes, NoteParser } from "@anotes/core";
import vscode from "vscode";
import { Command } from "./command.js";
import { allSearchPath, cmdExportNotes, excludeSearchPath, noteExt, typeExt } from "./constants.js";
import { type ErrorChecker } from "./errors.js";

export class ExportCommand extends Command {
  readonly #errors: ErrorChecker;

  constructor(errors: ErrorChecker) {
    super(cmdExportNotes);
    this.#errors = errors;
  }

  override async execute() {
    const [ws] = vscode.workspace.workspaceFolders ?? [];
    if (ws) {
      await this.#executeInWorkspace(ws);
    }
  }

  async #executeInWorkspace(ws: vscode.WorkspaceFolder) {
    const parser = new NoteParser();
    const { notePaths, typePaths } = await findNoteFiles();
    for (const path of typePaths) {
      const data = await vscode.workspace.fs.readFile(path);
      const text = Buffer.from(data).toString("utf-8");
      parser.parseTypes(path.fsPath, text);
    }
    for (const path of notePaths) {
      const data = await vscode.workspace.fs.readFile(path);
      const text = Buffer.from(data).toString("utf-8");
      parser.parseNotes(path.fsPath, text);
    }
    parser.checkDuplicates();
    const { notes, errors } = parser;
    if (errors.length > 0) {
      this.#errors.showAllErrors(errors);
      vscode.window.showErrorMessage(`Error parsing notes in "${ws.uri.fsPath}".`);
    } else {
      this.#errors.clearAllErrors();
      if (notes.length > 0) {
        const out = vscode.Uri.joinPath(ws.uri, "notes.txt");
        await vscode.workspace.fs.writeFile(out, Buffer.from(exportNotes(notes)));
        vscode.window.showInformationMessage(`Exported ${notes.length} note(s) to "${out.fsPath}".`);
      } else {
        vscode.window.showWarningMessage(`No notes found in "${ws.uri.fsPath}".`);
      }
    }
  }
}

async function findNoteFiles() {
  const notePaths: vscode.Uri[] = [];
  const typePaths: vscode.Uri[] = [];
  for (const uri of await vscode.workspace.findFiles(allSearchPath, excludeSearchPath)) {
    switch (true) {
      case uri.fsPath.endsWith(noteExt):
        notePaths.push(uri);
        break;
      case uri.fsPath.endsWith(typeExt):
        typePaths.push(uri);
        break;
    }
  }
  notePaths.sort(sortPaths);
  typePaths.sort(sortPaths);
  return { notePaths, typePaths };
}

function sortPaths(a: vscode.Uri, b: vscode.Uri): number {
  if (a.fsPath > b.fsPath) {
    return +1;
  }
  if (a.fsPath < b.fsPath) {
    return -1;
  }
  return 0;
}
