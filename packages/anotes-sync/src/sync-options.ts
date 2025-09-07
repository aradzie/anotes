import { Reporter } from "./report.js";

export type SyncOptions = {
  reporter: Reporter;
  deleteNotes: boolean;
  signal: AbortSignal;
};

export function expandSyncOptions(options: Partial<Readonly<SyncOptions>>): SyncOptions {
  const {
    reporter = new Reporter(), //
    deleteNotes = false,
    signal = new AbortController().signal,
  } = options;
  return {
    reporter, //
    deleteNotes,
    signal,
  };
}
