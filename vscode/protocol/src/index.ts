export type UpdateMessage = { type: "update"; uri: string; text: string };

export type FocusMessage = { type: "focus"; noteIndex: number; fieldIndex: number };

export type ToWebviewMessage = UpdateMessage | FocusMessage;

export type ReviveMessage = { type: "revive"; uri: string; locked: boolean };

export type RevealRangeMessage = { type: "reveal-range"; uri: string; start: number; end: number };

export type ToExtensionMessage = ReviveMessage | RevealRangeMessage;
