import { ankiTime, generateModelId } from "./utils.js";

export class Model {
  modelId;
  name;
  fields;
  templates;
  css;
  latexPre;
  latexPost;
  type;
  tags;

  constructor(config) {
    this.modelId = config.modelId ?? generateModelId();
    this.name = config.name;
    this.fields = processFields(config.fields);
    this.templates = processTemplates(config.templates);
    this.css = config.css ?? kDefaultCss;
    this.latexPre = config.latexPre ?? kDefaultLatexPre;
    this.latexPost = config.latexPost ?? kDefaultLatexPost;
    this.type = config.type ?? 0; // 0 = standard, 1 = cloze
    this.tags = config.tags ?? [];
  }

  /**
   * Generates the JSON representation for the Anki collection.
   */
  toJSON() {
    return {
      css: this.css,
      did: 1, // Default deck ID
      flds: this.fields.map((field) => ({
        font: field.font,
        media: [],
        name: field.name,
        ord: field.ord,
        rtl: field.rtl,
        size: field.size,
        sticky: field.sticky,
      })),
      id: this.modelId,
      latexPost: this.latexPost,
      latexPre: this.latexPre,
      mod: ankiTime(),
      name: this.name,
      req: [[0, "any", [0]]], // Required fields
      sortf: 0, // Sort field
      tags: this.tags,
      tmpls: this.templates.map((template) => ({
        afmt: template.afmt,
        bafmt: template.bafmt,
        bfont: template.bfont,
        bqfmt: template.bqfmt,
        bsize: template.bsize,
        did: template.did,
        name: template.name,
        ord: template.ord,
        qfmt: template.qfmt,
      })),
      type: this.type,
      usn: -1, // Update sequence number
      vers: [], // Version
    };
  }
}

function processFields(fields) {
  return fields.map((field, index) => ({
    name: field.name,
    font: field.font ?? "Arial",
    size: field.size ?? 20,
    sticky: field.sticky ?? false,
    rtl: field.rtl ?? false,
    ord: field.ord ?? index,
  }));
}

function processTemplates(templates) {
  return templates.map((template, index) => ({
    name: template.name,
    qfmt: template.qfmt,
    afmt: template.afmt,
    bqfmt: template.bqfmt ?? "",
    bafmt: template.bafmt ?? "",
    did: template.did ?? undefined,
    bfont: template.bfont ?? "",
    bsize: template.bsize ?? 0,
    ord: template.ord ?? index,
  }));
}

const kDefaultCss = `
.card {
  font-family: Arial, sans-serif;
  font-size: 20px;
  text-align: center;
}`;

const kDefaultLatexPre = `
\\documentclass[12pt]{article}
\\special{papersize=3in,5in}
\\usepackage[utf8]{inputenc}
\\usepackage{amssymb,amsmath}
\\pagestyle{empty}
\\setlength{\\parindent}{0in}
\\begin{document}`;

const kDefaultLatexPost = `
\\end{document}`;
