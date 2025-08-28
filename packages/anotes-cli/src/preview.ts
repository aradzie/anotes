import { escapeHtml, interpolateTemplate, type Note } from "@anotes/core";

export function generatePreview(notes: Iterable<Note>) {
  const html = [];
  html.push(`<!doctype html>`);
  html.push(`<html>`);
  html.push(`<head>`);
  html.push(`<meta charset="UTF-8">`);
  html.push(`<title>Cards Preview</title>`);
  html.push(
    `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css" crossOrigin="anonymous">`,
  );
  html.push(`<style>`);
  html.push(`main { min-width: 40rem; width: min-content; margin: 1rem auto; }`);
  html.push(`.note { margin: 1rem 0; }`);
  html.push(`</style>`);
  html.push(`</head>`);
  html.push(`<body>`);
  html.push(`<main>`);
  for (const note of notes) {
    const { type, deck, tags } = note;
    html.push(`<div class="note" data-id="${escapeHtml(note.id)}">`);
    html.push(`<p><strong>Deck:</strong> ${escapeHtml(deck)}</p>`);
    html.push(`<p><strong>Tags:</strong> ${escapeHtml(tags)}</p>`);
    for (const card of type.cards) {
      html.push(`<p><strong>Card:</strong> ${escapeHtml(card.name)}</p>`);
      html.push(`<div class="card">${interpolateTemplate(card.back, note)}</div>`);
    }
    html.push(`</div>`);
  }
  html.push(`</main>`);
  html.push(`</body>`);
  html.push(`</html>`);
  return html.join("\n");
}
