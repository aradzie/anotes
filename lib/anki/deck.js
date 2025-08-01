import { Card } from "./card.js";
import { ankiTime, generateDeckId } from "./utils.js";

export class Deck {
  deckId;
  name;
  description;
  notes;
  cards;

  constructor(config) {
    this.deckId = config.deckId ?? generateDeckId();
    this.name = config.name;
    this.description = config.description ?? "";
    this.notes = [];
    this.cards = [];
  }

  /**
   * Adds a note to the deck.
   *
   * @param {Note} note A note object.
   * @param {Model} model A model object.
   * @return {void}
   */
  addNote(note, model = null) {
    this.notes.push(note);
    // Get the note ID that will be used in the database.
    const noteValues = note.toSqlValues();
    // Calculate the due position for the new cards (incremental).
    const duePosition = this.cards.length + 1;
    // Generate cards for each template in the model.
    if (model) {
      for (let i = 0; i < model.templates.length; i++) {
        this.cards.push(new Card(noteValues.id, this.deckId, i, duePosition + i));
      }
    } else {
      // If no model provided, create one card with ordinal 0.
      this.cards.push(new Card(noteValues.id, this.deckId, 0, duePosition));
    }
  }

  /**
   * Adds multiple notes to the deck.
   *
   * @param {Note[]} notes An array of note objects.
   * @param {Model} model A model object.
   * @return {void}
   */
  addNotes(notes, model) {
    for (const note of notes) {
      this.addNote(note, model);
    }
  }

  /**
   * Generates the JSON representation for the Anki collection.
   */
  toJSON() {
    return {
      id: this.deckId,
      name: this.name,
      desc: this.description,
      mod: ankiTime(),
      usn: -1,
      collapsed: false,
      newToday: [0, 0],
      revToday: [0, 0],
      lrnToday: [0, 0],
      timeToday: [0, 0],
      dyn: 0, // 0 = regular deck, 1 = filtered deck
      extendNew: 10,
      extendRev: 50,
      conf: 1, // Deck config ID
    };
  }
}
