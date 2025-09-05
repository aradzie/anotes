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
    out.push(
      `.card-list { display: flex; flex-flow: row wrap; justify-content: center; align-items: center; gap: 1rem; }`,
    );
    out.push(`.card-list-item { flex: 0 1 auto; min-width: 20rem; padding: 0 1rem; border: 1px dotted #666; }`);
    out.push(`.prop { font-size: 0.75em; color: #666; }`);
    out.push(`.prop-name { font-weight: bold; font-style: normal; }`);
    out.push(`.prop-value { font-weight: normal; font-style: normal; }`);
    out.push(`img { max-width: 100%; }`);
    out.push(`li { text-align: start; }`);
    out.push(`pre { text-align: left; }`);
    out.push(`hr { height: 1px; margin: 1em 0; border: none; background-color: #666; }`);
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
    for (const card of note.type.cards) {
      if (frontCard) {
        out.push(`<div class="card-list-item">`);
        if (details) {
          renderProp("Type", escapeHtml(`${note.type.name}::${card.name}::Front`));
          renderProp("Deck", escapeHtml(note.deck));
          renderProp("Tags", escapeHtml(note.tags));
        }
        out.push(`<div data-type="${escapeHtml(note.type.name)}">`);
        out.push(`<div class="card">`);
        out.push(models.renderCard(note, card.name, "front"));
        out.push(`</div>`);
        out.push(`</div>`);
        out.push(`</div>`);
      }
      if (backCard) {
        out.push(`<div class="card-list-item">`);
        if (details) {
          renderProp("Type", escapeHtml(`${note.type.name}::${card.name}::Back`));
          renderProp("Deck", escapeHtml(note.deck));
          renderProp("Tags", escapeHtml(note.tags));
        }
        out.push(`<div data-type="${escapeHtml(note.type.name)}">`);
        out.push(`<div class="card">`);
        out.push(models.renderCard(note, card.name, "back"));
        out.push(`</div>`);
        out.push(`</div>`);
        out.push(`</div>`);
      }
    }
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
