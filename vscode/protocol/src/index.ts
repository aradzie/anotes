// These messages flow from the extension to the webview.

export type ToWebviewMessage = UpdateMessage | SelectMessage;

export type UpdateMessage = {
  type: "update";
  uri: string;
  locked: boolean;
  text: string;
};

export type SelectMessage = {
  type: "select";
  start: number;
  end: number;
};

// These messages flow from the webview to the extension.

export type ToExtensionMessage = RevealRangeMessage;

export type RevealRangeMessage = {
  type: "reveal-range";
  uri: string;
  start: number;
  end: number;
};

/**
 * The shared preview state which allows reviving of the preview by the extension.
 */
export type ReviveState = {
  readonly type: "revive";
  readonly uri: string;
  readonly locked: boolean;
};
