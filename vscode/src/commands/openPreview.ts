import { ViewColumn, WebviewPanel, window, workspace } from "vscode";
import { renderNotesToHtml } from "../preview/render.js";
import { debounce } from "../util.js";

const previewPanels = new Map<string, WebviewPanel>();

export function openPreview() {
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
      "notesPreview",
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
      panel.webview.html = renderNotesToHtml(docUri, document.getText());
    }
  };

  update();
  const debouncedUpdate = debounce(update, 300);
  const changeSub = workspace.onDidChangeTextDocument((ev) => {
    if (ev.document.uri.toString() === docUri) {
      debouncedUpdate();
    }
  });

  panel.onDidDispose(() => {
    changeSub.dispose();
  });
}
