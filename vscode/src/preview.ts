import vscode from "vscode";
import { reportError, revealRange } from "./util.js";

type UpdateMessage = { type: "update"; uri: string; text: string };
type FocusMessage = { type: "focus"; noteIndex: number; fieldIndex: number };
type OutgoingMessage = UpdateMessage | FocusMessage;
type RevealRangeMessage = { type: "reveal-range"; uri: string; start: number; end: number };
type IncomingMessage = RevealRangeMessage;

class Preview {
  static viewType = "anki-notes.preview";
  static title = "Anki Notes Preview";

  readonly #panel: vscode.WebviewPanel;
  readonly #column: vscode.ViewColumn;
  /**
   * If this is a locked preview, then the uri of the linked document.
   * If this is a dynamic preview, then null.
   */
  readonly #uri: string | null;

  constructor(manager: PreviewManager, column: vscode.ViewColumn, uri: string | null) {
    this.#panel = vscode.window.createWebviewPanel(Preview.viewType, Preview.title, {
      viewColumn: column,
      preserveFocus: true,
    });
    this.#column = column;
    this.#uri = uri;
    manager.setWebviewContent(this.#panel.webview);
    this.#panel.webview.onDidReceiveMessage(this.#onIncomingMessage); // TODO Dispose.
  }

  get panel(): vscode.WebviewPanel {
    return this.#panel;
  }

  get column(): vscode.ViewColumn {
    return this.#column;
  }

  get uri(): string | null {
    return this.#uri;
  }

  reveal() {
    this.#panel.reveal();
  }

  render(uri: string, text: string) {
    this.#panel.title = `${Preview.title}: ${uri.split("/").pop()}`;
    this.#panel.webview.postMessage({ type: "update", uri, text }).then(() => {});
  }

  #onIncomingMessage = (message: IncomingMessage): void => {
    switch (message.type) {
      case "reveal-range": {
        const { uri, start, end } = message;
        revealRange(vscode.Uri.parse(uri), vscode.ViewColumn.One, start, end).catch(reportError);
        break;
      }
    }
  };

  dispose() {
    this.#panel.dispose();
  }
}

class PreviewManager implements vscode.WebviewPanelSerializer {
  readonly #context: vscode.ExtensionContext;
  readonly #previews = new Set<Preview>();

  constructor(context: vscode.ExtensionContext) {
    this.#context = context;
    this.#context.subscriptions.push(this);
    this.#context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument(({ document }) => {
        if (document.languageId === "anki-notes") {
          this.#update(document);
        }
      }),
    );
    this.#context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor?.document.languageId === "anki-notes") {
          this.#update(editor.document);
        }
      }),
    );
    vscode.window.registerWebviewPanelSerializer(Preview.viewType, this);
  }

  showPreview(sideBySide: boolean, locked: boolean) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const documentColumn = editor.viewColumn ?? vscode.ViewColumn.One;
      if (document.languageId === "anki-notes") {
        const column = sideBySide ? vscode.ViewColumn.Beside : documentColumn;
        const uri = locked ? String(document.uri) : null;
        for (const preview of this.#previews) {
          if (preview.column === column && preview.uri === uri) {
            preview.reveal();
            return;
          }
        }
        this.#createPanel(column, uri);
        this.#update(document);
      }
    }
  }

  async deserializeWebviewPanel(panel: vscode.WebviewPanel, state: UpdateMessage) {
    this.setWebviewContent(panel.webview);
    if (state.type === "update") {
      panel.webview.postMessage(state).then(() => {});
    }
  }

  #createPanel(column: vscode.ViewColumn, uri: string | null) {
    const preview = new Preview(this, column, uri);
    this.#previews.add(preview);
    preview.panel.onDidDispose(() => {
      this.#previews.delete(preview);
    });
  }

  #update(document: vscode.TextDocument) {
    if (document.languageId === "anki-notes") {
      const uri = String(document.uri);
      for (const preview of this.#previews) {
        if (preview.uri == null || preview.uri === uri) {
          preview.render(uri, document.getText());
        }
      }
    }
  }

  setWebviewContent(webview: vscode.Webview) {
    webview.options = {
      enableScripts: true,
      enableForms: true,
      localResourceRoots: [this.#getAssetsPath("assets")],
    };
    webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Anki Cards Preview</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css" crossOrigin="anonymous">
  <link rel="stylesheet" href="${webview.asWebviewUri(this.#getAssetsPath("assets", "preview.css"))}">
  <script src="${webview.asWebviewUri(this.#getAssetsPath("assets", "preview.js"))}" type="module"></script>
</head>
<body>
  <div id="main"></div>
</body>
</html>`;
  }

  #getAssetsPath(...segments: string[]): vscode.Uri {
    return vscode.Uri.joinPath(this.#context.extensionUri, ...segments);
  }

  dispose() {
    for (const preview of this.#previews) {
      preview.dispose();
    }
    this.#previews.clear();
  }
}

export { PreviewManager };
