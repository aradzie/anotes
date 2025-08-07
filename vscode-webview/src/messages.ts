export type UpdateMessage = { type: "update"; uri: string; text: string };

export type FocusMessage = { type: "focus"; id: string; field: string | null };

export type Message = UpdateMessage | FocusMessage;

type Callback = (message: Message) => void;

/**
 * The global message handler is ready to receive messages right away,
 * before the React app is mounted. It will relay the accumulated messages
 * to the React app once it is mounted.
 */
class MessageQueue {
  readonly #queue: Message[] = [];
  #callback: Callback | null = null;

  constructor() {
    addEventListener("message", this.#handleMessage);
  }

  #handleMessage = ({ data }: MessageEvent<Message>) => {
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
