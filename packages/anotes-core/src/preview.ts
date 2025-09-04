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
  {
    title = "Cards Preview",
    details = true,
    frontCard = false,
    backCard = true,
  }: Partial<Readonly<PreviewOptions>> = {},
): string {
  const models = new CompiledModels(notes.types);

  const out = new Output();

  function renderDocument() {
    out.push(`<!doctype html>`);
    out.push(`<html>`);
    renderHead();
    renderBody();
    out.push(`</html>`);
  }

  function renderHead() {
    out.push(`<head>`);
    out.push(`<meta charset="UTF-8">`);
    out.push(`<title>${escapeHtml(title)}</title>`);
    out.push(
      `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css" crossOrigin="anonymous">`,
    );
    renderStyles();
    renderModelStyles();
    out.push(`</head>`);
  }

  function renderStyles() {
    out.push(`<style>`);
    out.push(`:root { color-scheme: light dark; }`);
    out.push(`.card-list { min-width: 40rem; width: min-content; margin: 1rem auto; }`);
    out.push(`.card-list-item { margin: 1rem; border-bottom: 1px solid #666; }`);
    out.push(`.prop { font-size: 0.75rem; color: #666; }`);
    out.push(`.prop-name { font-weight: bold; }`);
    out.push(`.prop-value { font-weight: normal; }`);
    out.push(`</style>`);
  }

  function renderModelStyles() {
    for (const type of notes.types) {
      if (type.styling) {
        out.push(`<style>`);
        out.push(`[data-type="${type.name}"] {`);
        out.push(type.styling);
        out.push(`}`);
        out.push(`</style>`);
      }
    }
  }

  function renderBody() {
    out.push(`<body>`);
    renderCardList();
    out.push(`</body>`);
  }

  function renderCardList() {
    out.push(`<main class="card-list">`);
    for (const note of notes) {
      renderNoteCardList(note);
    }
    out.push(`</main>`);
  }

  function renderNoteCardList(note: Note) {
    const { type, deck, tags } = note;
    out.push(`<div class="card-list-item">`);
    if (details) {
      renderProp("Deck", escapeHtml(deck));
      renderProp("Tags", escapeHtml(tags));
    }
    for (const card of type.cards) {
      if (frontCard) {
        out.push(`<div data-type="${escapeHtml(type.name)}">`);
        out.push(`<div class="card">`);
        out.push(models.renderCard(note, card.name, "front"));
        out.push(`</div>`);
        out.push(`</div>`);
      }
      if (backCard) {
        out.push(`<div data-type="${escapeHtml(type.name)}">`);
        out.push(`<div class="card">`);
        out.push(models.renderCard(note, card.name, "back"));
        out.push(`</div>`);
        out.push(`</div>`);
      }
    }
    out.push(`</div>`);
  }

  function renderProp(name: string, value: string) {
    out.push(
      `<p class="prop">` +
        `<span class="prop-name">${escapeHtml(name)}:</span> ` +
        `<span class="prop-value">${escapeHtml(value)}</span>` +
        `</p>`,
    );
  }

  renderDocument();

  return out.print();
}
