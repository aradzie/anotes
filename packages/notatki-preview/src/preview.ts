import { type NoteList, Output } from "@notatki/core";
import { CardTemplates } from "./card-templates.js";
import { expandPreviewOptions, type PreviewOptions } from "./preview-options.js";
import { PreviewRenderer } from "./preview-renderer.js";

export function generatePreview(
  notes: NoteList,
  options: Partial<Readonly<PreviewOptions>> = {},
  renderer: PreviewRenderer = new PreviewRenderer(),
  templates: CardTemplates = new CardTemplates(notes.types),
): string {
  const out = new Output();
  renderer.render({ options: expandPreviewOptions(options), templates, notes, out });
  return String(out);
}
