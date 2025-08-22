export class Output {
  readonly #lines: string[] = [];
  #separate = false;

  separate(): void {
    if (this.#lines.length > 0) {
      this.#separate = true;
    }
  }

  push(line: string): void {
    if (line.length > 0) {
      if (this.#separate) {
        this.#lines.push("");
        this.#separate = false;
      }
      this.#lines.push(line);
    }
  }

  print(): string {
    const text = this.#lines.join("\n") + "\n";
    this.#lines.length = 0;
    this.#separate = false;
    return text;
  }
}
