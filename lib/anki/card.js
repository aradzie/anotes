import { ankiTime } from "./utils.js";

export class Card {
  id;
  noteId;
  deckId;
  ord; // Ordinal (which template)
  mod; // Modified time
  usn; // Update sequence number
  type; // Card type (0=new, 1=learning, 2=due)
  queue; // Queue (0=new, 1=learning, 2=due, -1=suspended)
  due; // Due date
  ivl; // Interval
  factor; // Ease factor
  reps; // Number of repetitions
  lapses; // Number of lapses
  left; // Learning left
  odue; // Original due (when in filtered deck)
  odid; // Original deck id (when in filtered deck)
  flags; // Flags
  data; // User data

  constructor(noteId, deckId, ord = 0, due = 1) {
    // Generate proper card ID - should be unique integer
    this.id = Date.now() + Math.floor(Math.random() * 1000000);
    this.noteId = noteId;
    this.deckId = deckId;
    this.ord = ord;
    this.mod = ankiTime();
    this.usn = -1;
    this.type = 0; // New card
    this.queue = 0; // New queue
    this.due = due; // The due position for new cards (should be incremental)
    this.ivl = 0; // No interval yet
    this.factor = 0; // No factor yet
    this.reps = 0; // No repetitions yet
    this.lapses = 0; // No lapses yet
    this.left = 0; // No learning steps left
    this.odue = 0; // Not in a filtered deck
    this.odid = 0; // Not in a filtered deck
    this.flags = 0; // No flags
    this.data = ""; // No user data
  }

  /**
   * Generate SQL values for inserting into the cards table.
   */
  toSqlValues() {
    return {
      id: this.id,
      nid: this.noteId,
      did: this.deckId,
      ord: this.ord,
      mod: this.mod,
      usn: this.usn,
      type: this.type,
      queue: this.queue,
      due: this.due,
      ivl: this.ivl,
      factor: this.factor,
      reps: this.reps,
      lapses: this.lapses,
      left: this.left,
      odue: this.odue,
      odid: this.odid,
      flags: this.flags,
      data: this.data,
    };
  }
}
