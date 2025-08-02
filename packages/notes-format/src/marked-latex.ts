import { type KatexOptions } from "katex";
import { type MarkedExtension, type TokenizerAndRendererExtension, type Tokens } from "marked";
import { katexBlock, katexInline } from "./katex.js";

type Renderer = {
  blockLatex: (latex: string) => string;
  inlineLatex: (latex: string) => string;
};

const toLatex = (): Renderer => {
  return {
    blockLatex: (code: string): string => {
      return `\\[ ${code.trim()} \\]\n`;
    },
    inlineLatex: (code: string): string => {
      return `\\( ${code.trim()} \\)`;
    },
  };
};

const toHtml = (options: KatexOptions = {}): Renderer => {
  return {
    blockLatex: (code: string): string => {
      return katexBlock(code, options);
    },
    inlineLatex: (code: string): string => {
      return katexInline(code, options);
    },
  };
};

const renderer = { toLatex, toHtml } as const;

const latexExtension = (renderer: Renderer = toLatex()): MarkedExtension => {
  // Common syntax.

  type LatexToken = Tokens.Generic & {
    type: "blockLatex" | "inlineLatex";
    code: string;
  };

  // Block LaTeX: $$ ... $$
  const blockLatex: TokenizerAndRendererExtension = {
    name: "blockLatex",
    level: "block",
    start(src) {
      return src.indexOf("$$");
    },
    tokenizer(src) {
      const match = /^\$\$(.+?)\$\$/s.exec(src);
      if (match) {
        return {
          type: "blockLatex",
          raw: match[0],
          code: match[1]!,
        } as LatexToken;
      }
      return undefined;
    },
    renderer(token) {
      return renderer.blockLatex((token as LatexToken).code);
    },
  };

  // Inline LaTeX: $ ... $
  const inlineLatex: TokenizerAndRendererExtension = {
    name: "inlineLatex",
    level: "inline",
    start(src) {
      return src.indexOf("$");
    },
    tokenizer(src) {
      const match = /^\$(.+?)\$/.exec(src);
      if (match) {
        return {
          type: "inlineLatex",
          raw: match[0],
          code: match[1]!,
        } as LatexToken;
      }
      return undefined;
    },
    renderer(token) {
      return renderer.inlineLatex((token as LatexToken).code);
    },
  };

  // Alternative syntax.

  type LatexAltToken = Tokens.Generic & {
    type: "blockLatexAlt" | "inlineLatexAlt";
    code: string;
  };

  // Block LaTeX: \[ ... \]
  const blockLatexAlt: TokenizerAndRendererExtension = {
    name: "blockLatexAlt",
    level: "block",
    start(src) {
      return src.indexOf("\\[");
    },
    tokenizer(src) {
      const match = /^\\\[(.+?)\\\]/s.exec(src);
      if (match) {
        return {
          type: "blockLatexAlt",
          raw: match[0],
          code: match[1]!,
        } as LatexAltToken;
      }
      return undefined;
    },
    renderer(token) {
      return renderer.blockLatex((token as LatexAltToken).code);
    },
  };

  // Inline LaTeX: \( ... \)
  const inlineLatexAlt: TokenizerAndRendererExtension = {
    name: "inlineLatexAlt",
    level: "inline",
    start(src) {
      return src.indexOf("\\(");
    },
    tokenizer(src) {
      const match = /^\\\((.+?)\\\)/.exec(src);
      if (match) {
        return {
          type: "inlineLatexAlt",
          raw: match[0],
          code: match[1]!,
        } as LatexAltToken;
      }
      return undefined;
    },
    renderer(token) {
      return renderer.inlineLatex((token as LatexAltToken).code);
    },
  };

  return {
    extensions: [
      blockLatex, //
      inlineLatex,
      blockLatexAlt,
      inlineLatexAlt,
    ],
  };
};

export { type Renderer, latexExtension, renderer };
