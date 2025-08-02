import { type KatexOptions, renderToString } from "katex";

const defaultOptions: KatexOptions = {
  output: "html",
  strict: true,
  throwOnError: true,
};

export const katexBlock = (value: string, options: KatexOptions) => {
  return renderToString(value, { ...defaultOptions, ...options, displayMode: true }) + "\n";
};

export const katexInline = (value: string, options: KatexOptions) => {
  return renderToString(value, { ...defaultOptions, ...options, displayMode: false });
};
