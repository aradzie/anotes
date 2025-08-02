import { type MarkedExtension, type TokenizerAndRendererExtension, type Tokens } from "marked";

type LatexToken = Tokens.Generic & { text: string };

const blockLatex: TokenizerAndRendererExtension = {
  name: "blockLatex",
  level: "block",
  // Block LaTeX: \[ ... \]
  tokenizer(src: string): LatexToken | undefined {
    const match = /^\s*\\\[(.+?)\\\]\s*/s.exec(src);
    if (match) {
      return {
        type: "blockLatex",
        raw: match[0],
        text: match[1]!,
      };
    }
    return;
  },
  renderer({ raw }: Tokens.Generic): string {
    return `${raw}`;
  },
};

const inlineLatex: TokenizerAndRendererExtension = {
  name: "inlineLatex",
  level: "inline",
  // Inline LaTeX: \( ... \)
  tokenizer(src: string): LatexToken | undefined {
    const match = /^\\\((.+?)\\\)/.exec(src);
    if (match) {
      return {
        type: "inlineLatex",
        raw: match[0],
        text: match[1]!,
      };
    }
    return;
  },
  renderer({ raw }: Tokens.Generic): string {
    return `${raw}`;
  },
};

export const latexExtension: MarkedExtension = {
  extensions: [blockLatex, inlineLatex],
};
