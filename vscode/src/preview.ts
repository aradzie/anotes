import vscode, { ViewColumn, WebviewPanel, window } from "vscode";
import { renderNotesToHtml } from "./preview/render.js";
import { debounce } from "./util.js";

class Preview {
  static #viewType = "anki-notes.preview";
  static #title = "Anki Notes Preview";

  readonly #panel: vscode.WebviewPanel;
  readonly #column: vscode.ViewColumn;
  /**
   * If this is a locked preview, then the uri of the linked document.
   * If this is a dynamic preview, then null.
   */
  readonly #uri: string | null;

  constructor(column: vscode.ViewColumn, uri: string | null) {
    this.#panel = window.createWebviewPanel(Preview.#viewType, Preview.#title, column);
    this.#column = column;
    this.#uri = uri;
  }

  get panel(): WebviewPanel {
    return this.#panel;
  }

  get column(): ViewColumn {
    return this.#column;
  }

  get uri(): string | null {
    return this.#uri;
  }

  reveal() {
    this.#panel.reveal();
  }

  render(uri: string, text: string) {
    this.#panel.title = `${Preview.#title}: ${uri.split("/").pop()}`;
    this.#panel.webview.html = renderNotesToHtml(uri, text);
  }

  dispose() {
    this.#panel.dispose();
  }
}

class PreviewManager {
  #subscriptions: { dispose(): void }[] = [];
  #previews = new Set<Preview>();

  constructor() {
    this.#subscriptions.push(
      vscode.workspace.onDidChangeTextDocument(({ document }) => {
        if (document.languageId === "anki-notes") {
          this.#updateDebounced(document);
        }
      }),
    );
    this.#subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor?.document.languageId === "anki-notes") {
          this.#updateDebounced(editor.document);
        }
      }),
    );
  }

  showPreview(sideBySide: boolean, locked: boolean) {
    const document = vscode.window.activeTextEditor?.document;
    if (document?.languageId === "anki-notes") {
      const column = sideBySide ? ViewColumn.Beside : ViewColumn.Active;
      const uri = locked ? String(document.uri) : null;
      for (const preview of this.#previews) {
        if (preview.column === column && preview.uri === uri) {
          preview.reveal();
          return;
        }
      }
      this.#createPanel(document, column, uri);
      this.#update(document);
    }
  }

  #createPanel(document: vscode.TextDocument, column: vscode.ViewColumn, uri: string | null) {
    const preview = new Preview(column, uri);
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

  #updateDebounced = debounce((document: vscode.TextDocument) => {
    this.#update(document);
  }, 300);

  dispose() {
    for (const subscription of this.#subscriptions) {
      subscription.dispose();
    }
    for (const preview of this.#previews) {
      preview.dispose();
    }
    this.#previews.clear();
  }
}

export { PreviewManager };
