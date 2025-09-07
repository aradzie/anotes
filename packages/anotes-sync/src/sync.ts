import { type NoteList } from "@anotes/core";
import { expandSyncOptions, type SyncOptions } from "./sync-options.js";

export async function synchronizeNotes(notes: NoteList, options: Partial<Readonly<SyncOptions>> = {}): Promise<void> {
  await new Synchronizer().sync(notes, expandSyncOptions(options));
}

class Synchronizer {
  async sync(notes: NoteList, options: SyncOptions): Promise<void> {
    const { reporter } = options;

    reporter.start();

    reporter.end();
  }
}
