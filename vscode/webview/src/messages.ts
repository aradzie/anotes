import { type ToWebviewMessage } from "@notatki/vscode-protocol";

type Callback = (message: ToWebviewMessage) => void;

/**
 * The global message handler is ready to receive messages right away,
 * before the React app is mounted. It will relay the accumulated messages
 * to the React app once it is mounted.
 */
class MessageQueue {
  readonly #queue: ToWebviewMessage[] = [];
  #callback: Callback | null = null;

  constructor() {
    addEventListener("message", this.#handleMessage);
  }

  #handleMessage = ({ data }: MessageEvent<ToWebviewMessage>) => {
    if (this.#callback != null) {
      this.#callback(data);
    } else {
      this.#queue.push(data);
    }
  };

  subscribe(callback: Callback) {
    this.#callback = callback;
    for (const message of this.#queue) {
      callback(message);
    }
    this.#queue.length = 0;
    return () => {
      removeEventListener("message", this.#handleMessage);
    };
  }
}

export const queue = new MessageQueue();
