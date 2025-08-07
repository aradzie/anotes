import vscode from "vscode";

export type UpdateMessage = { type: "update"; uri: string; text: string };

export type FocusMessage = { type: "focus"; id: string; field: string | null };

export type Message = UpdateMessage | FocusMessage;

class Assets {
  readonly #context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.#context = context;
  }

  setWebviewContent(webview: vscode.Webview) {
    webview.options = {
      enableScripts: true,
      enableForms: true,
      localResourceRoots: [this.#getPath("assets")],
    };
    webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Anki Cards Preview</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css" crossOrigin="anonymous">
  <link rel="stylesheet" href="${webview.asWebviewUri(this.#getPath("assets", "preview.css"))}">
  <script src="${webview.asWebviewUri(this.#getPath("assets", "preview.js"))}" type="module"></script>
</head>
<body>
  <div id="main"></div>
</body>
</html>`;
  }

  #getPath(...segments: string[]) {
    return vscode.Uri.joinPath(this.#context.extensionUri, ...segments);
  }
}

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

  constructor(assets: Assets, column: vscode.ViewColumn, uri: string | null) {
    this.#panel = vscode.window.createWebviewPanel(Preview.viewType, Preview.title, {
      viewColumn: column,
      preserveFocus: true,
    });
    this.#column = column;
    this.#uri = uri;
    assets.setWebviewContent(this.#panel.webview);
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

  dispose() {
    this.#panel.dispose();
  }
}

class PreviewSerializer implements vscode.WebviewPanelSerializer {
  readonly #assets: Assets;

  constructor(assets: Assets) {
    this.#assets = assets;
  }

  async deserializeWebviewPanel(panel: vscode.WebviewPanel, state: UpdateMessage) {
    this.#assets.setWebviewContent(panel.webview);
    if (state.type === "update") {
      panel.webview.postMessage(state).then(() => {});
    }
  }
}

class PreviewManager {
  readonly #context: vscode.ExtensionContext;
  readonly #assets: Assets;
  readonly #previews = new Set<Preview>();

  constructor(context: vscode.ExtensionContext) {
    this.#context = context;
    this.#assets = new Assets(context);
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
    vscode.window.registerWebviewPanelSerializer(Preview.viewType, new PreviewSerializer(this.#assets));
  }

  showPreview(sideBySide: boolean, locked: boolean) {
    const document = vscode.window.activeTextEditor?.document;
    if (document?.languageId === "anki-notes") {
      const column = sideBySide ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active;
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

  #createPanel(column: vscode.ViewColumn, uri: string | null) {
    const preview = new Preview(this.#assets, column, uri);
    this.#previews.add(preview);
    preview.panel.onDidDispose(() => {
      this.#previews.delete(preview);
    });
  }

  #update(document: vscode.TextDocument) {
    if (document.languageId === "anki-notes") {
      const uri = String(document.uri);
      for (const preview of this.#previews) {
        if (preview.uri === null || preview.uri === uri) {
          preview.render(uri, document.getText());
        }
      }
    }
  }

  dispose() {
    for (const preview of this.#previews) {
      preview.dispose();
    }
    this.#previews.clear();
  }
}

export { PreviewManager };
