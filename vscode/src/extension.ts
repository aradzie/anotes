import { commands, ExtensionContext, ViewColumn, WebviewPanel, window, workspace } from "vscode";
import { renderFooToHtml } from "./render.js";
import { debounce } from "./util.js";

export function activate(context: ExtensionContext) {
  const previewPanels = new Map<string, WebviewPanel>();

  const callback = () => {
    const editor = window.activeTextEditor;
    if (!editor) {
      window.showErrorMessage("No active editor to preview from.");
      return;
    }

    const document = editor.document;
    if (document.languageId !== "anki-notes") {
      window.showWarningMessage("Active document is not a .note file.");
    }

    const docUri = document.uri.toString();
    let panel = previewPanels.get(docUri);

    if (panel) {
      panel.reveal();
    } else {
      panel = window.createWebviewPanel(
        "fooPreview",
        `Preview: ${document.fileName.split("/").pop()}`,
        ViewColumn.Beside,
        {
          enableScripts: false,
          retainContextWhenHidden: true,
        },
      );

      panel.onDidDispose(() => {
        previewPanels.delete(docUri);
      });

      previewPanels.set(docUri, panel);
    }

    const update = () => {
      if (panel) {
        panel.webview.html = renderFooToHtml(document.getText());
      }
    };

    update(); // Initial render.

    const debounced = debounce(update, 300);
    const changeSub = workspace.onDidChangeTextDocument((ev) => {
      if (ev.document.uri.toString() === docUri) {
        debounced();
      }
    });

    panel.onDidDispose(() => {
      changeSub.dispose();
    });
  };

  context.subscriptions.push(commands.registerCommand("anki-notes.showPreview", callback));
}

export function deactivate() {}
