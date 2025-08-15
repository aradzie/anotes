import { type LocationRange } from "@anotes/parser";

export type Selection = { start: number; end: number };

export const isVisible = (location: LocationRange | null, selection: Selection) => {
  return location != null && location.start.offset <= selection.start && selection.start <= location.end.offset;
};
