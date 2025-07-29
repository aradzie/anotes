const blockLatex = {
  name: "blockLatex",
  level: "block",
  // Block LaTeX: \[ ... \]
  tokenizer(src) {
    const match = /^\s*\\\[(.+?)\\\]\s*/s.exec(src);
    if (match) {
      return {
        type: "blockLatex",
        raw: match[0],
        text: match[1],
        escaped: true,
      };
    }
    return false;
  },
  renderer({raw}) {
    return `${raw}`;
  },
};

const inlineLatex = {
  name: "inlineLatex",
  level: "inline",
  // Inline LaTeX: \( ... \)
  tokenizer(src) {
    const match = /^\\\((.+?)\\\)/.exec(src);
    if (match) {
      return {
        type: "inlineLatex",
        raw: match[0],
        text: match[1],
        escaped: true,
      };
    }
    return false;
  },
  renderer({raw}) {
    return `${raw}`;
  },
};

export const latexOptions = {
  extensions: [blockLatex, inlineLatex],
};
