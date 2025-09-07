export class Output {
  readonly #lines: string[] = [];
  #separate = false;
  #text: string | null = null;

  separate(): void {
    if (this.#lines.length > 0) {
      this.#separate = true;
      this.#text = null;
    }
  }

  print(line: string): void {
    if (line.length > 0) {
      if (this.#separate) {
        this.#lines.push("");
        this.#separate = false;
      }
      this.#lines.push(line);
      this.#text = null;
    }
  }

  toString(): string {
    return (this.#text ??= this.#lines.join("\n") + "\n");
  }
}
