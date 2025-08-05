import { type KatexOptions, renderToString } from "katex";

const defaultOptions = {
  output: "html",
  strict: true,
  throwOnError: true,
} as const satisfies KatexOptions;

function katexBlock(value: string, options: KatexOptions): string {
  return renderToString(value, { ...defaultOptions, ...options, displayMode: true }) + "\n";
}

function katexInline(value: string, options: KatexOptions): string {
  return renderToString(value, { ...defaultOptions, ...options, displayMode: false });
}

export { katexBlock, katexInline };
