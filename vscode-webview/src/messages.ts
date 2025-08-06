export type UpdateMessage = { type: "update"; uri: string; text: string };

export type FocusMessage = { type: "focus"; id: string; field: string | null };

export type Message = UpdateMessage | FocusMessage;
