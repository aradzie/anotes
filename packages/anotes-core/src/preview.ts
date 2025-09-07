import type { ModelCard } from "./model.js";
import { type Note, type NoteList } from "./note.js";
import { Output } from "./output.js";
import { CompiledModels, escapeHtml } from "./templates.js";

export type PreviewOptions = {
  title: string;
  details: boolean;
  frontCard: boolean;
  backCard: boolean;
};

export function generatePreview(
  notes: NoteList,
  options: Partial<Readonly<PreviewOptions>> = {},
  renderer: Renderer = new Renderer(new CompiledModels(notes.types)),
): string {
  const {
    title = "Cards Preview", //
    details = true,
    frontCard = false,
    backCard = true,
  } = options;
  const out = new Output();
  renderer.renderDocument({
    options: {
      title,
      details,
      frontCard,
      backCard,
    },
    notes,
    out,
  });
  return String(out);
}

export type RendererContext = Readonly<{
  options: Readonly<PreviewOptions>;
  notes: NoteList;
  out: Output;
}>;

export class Renderer {
  static readonly defaultStylesheets: readonly string[] = [
    `https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css`, //
  ];

  static readonly defaultStyles: readonly string[] = [
    `:root { color-scheme: light dark; }`,
    `.card-list { display: flex; flex-flow: row wrap; justify-content: center; align-items: center; gap: 1rem; }`,
    `.card-list-item { flex: 0 1 auto; min-width: 20rem; padding: 0 1rem; border: 1px dotted #666; }`,
    `.prop { font-size: 0.75em; color: #666; }`,
    `.prop-name { font-weight: bold; font-style: normal; }`,
    `.prop-value { font-weight: normal; font-style: normal; }`,
    `img { max-width: 100%; }`,
    `li { text-align: start; }`,
    `pre { text-align: left; }`,
    `hr { height: 1px; margin: 1em 0; border: none; background-color: #666; }`,
  ];

  readonly #models: CompiledModels;

  #stylesheets: string[] = [...Renderer.defaultStylesheets];
  #styles: string[] = [...Renderer.defaultStyles];

  constructor(models: CompiledModels) {
    this.#models = models;
  }

  get models(): CompiledModels {
    return this.#models;
  }

  get stylesheets(): string[] {
    return [...this.#stylesheets];
  }

  set stylesheets(value: string[]) {
    this.#stylesheets = [...value];
  }

  get styles(): string[] {
    return [...this.#styles];
  }

  set styles(value: string[]) {
    this.#styles = [...value];
  }

  renderDocument(ctx: RendererContext) {
    ctx.out.print(`<!doctype html>`);
    ctx.out.print(`<html>`);
    this.renderHead(ctx);
    this.renderBody(ctx);
    ctx.out.print(`</html>`);
  }

  renderHead(ctx: RendererContext) {
    ctx.out.print(`<head>`);
    ctx.out.print(`<meta charset="UTF-8">`);
    ctx.out.print(`<title>${escapeHtml(ctx.options.title)}</title>`);
    this.renderStylesheets(ctx);
    this.renderCommonStyles(ctx);
    this.renderModelStyles(ctx);
    ctx.out.print(`</head>`);
  }

  renderStylesheets(ctx: RendererContext) {
    for (const stylesheet of this.#stylesheets) {
      ctx.out.print(`<link rel="stylesheet" href="${encodeURI(stylesheet)}" crossOrigin="anonymous">`);
    }
  }

  renderCommonStyles(ctx: RendererContext) {
    ctx.out.print(`<style>`);
    for (const style of this.#styles) {
      ctx.out.print(style);
    }
    ctx.out.print(`</style>`);
  }

  renderModelStyles(ctx: RendererContext) {
    for (const type of ctx.notes.types) {
      if (type.styling) {
        ctx.out.print(`<style>`);
        ctx.out.print(`[data-type="${type.name}"] {`);
        ctx.out.print(type.styling);
        ctx.out.print(`}`);
        ctx.out.print(`</style>`);
      }
    }
  }

  renderBody(ctx: RendererContext) {
    ctx.out.print(`<body>`);
    this.renderCardList(ctx);
    ctx.out.print(`</body>`);
  }

  renderCardList(ctx: RendererContext) {
    ctx.out.print(`<main class="card-list">`);
    for (const note of ctx.notes) {
      this.renderNoteCardList(ctx, note);
    }
    ctx.out.print(`</main>`);
  }

  renderNoteCardList(ctx: RendererContext, note: Note) {
    for (const card of note.type.cards) {
      if (ctx.options.frontCard) {
        this.renderNoteFrontCard(ctx, note, card);
      }
      if (ctx.options.backCard) {
        this.renderNoteBackCard(ctx, note, card);
      }
    }
  }

  renderNoteFrontCard(ctx: RendererContext, note: Note, card: ModelCard) {
    ctx.out.print(`<div class="card-list-item">`);
    if (ctx.options.details) {
      this.renderProp(ctx, "Type", escapeHtml(`${note.type.name}::${card.name}::Front`));
      this.renderProp(ctx, "Deck", escapeHtml(note.deck));
      this.renderProp(ctx, "Tags", escapeHtml(note.tags));
    }
    ctx.out.print(`<div data-type="${escapeHtml(note.type.name)}">`);
    ctx.out.print(`<div class="card">`);
    ctx.out.print(this.#models.renderCard(note, card.name, "front"));
    ctx.out.print(`</div>`);
    ctx.out.print(`</div>`);
    ctx.out.print(`</div>`);
  }

  renderNoteBackCard(ctx: RendererContext, note: Note, card: ModelCard) {
    ctx.out.print(`<div class="card-list-item">`);
    if (ctx.options.details) {
      this.renderProp(ctx, "Type", escapeHtml(`${note.type.name}::${card.name}::Back`));
      this.renderProp(ctx, "Deck", escapeHtml(note.deck));
      this.renderProp(ctx, "Tags", escapeHtml(note.tags));
    }
    ctx.out.print(`<div data-type="${escapeHtml(note.type.name)}">`);
    ctx.out.print(`<div class="card">`);
    ctx.out.print(this.#models.renderCard(note, card.name, "back"));
    ctx.out.print(`</div>`);
    ctx.out.print(`</div>`);
    ctx.out.print(`</div>`);
  }

  renderProp(ctx: RendererContext, name: string, value: string) {
    ctx.out.print(
      `<p class="prop">` +
        `<span class="prop-name">${escapeHtml(name)}:</span> ` +
        `<span class="prop-value">${escapeHtml(value)}</span>` +
        `</p>`,
    );
  }
}
