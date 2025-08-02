import Database from "better-sqlite3";
import JSZip from "jszip";
import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ankiTime } from "./utils.js";

/**
 * @typedef {Object} MediaFile
 * @property {string} name
 * @property {Buffer} data
 */

export class Package {
  /** @type {Deck[]} */
  #decks;
  /** @type {Model[]} */
  #models;
  /** @type {MediaFile[]} */
  #media;

  constructor() {
    this.#decks = [];
    this.#models = [];
    this.#media = [];
  }

  /**
   * Adds a deck to the package.
   *
   * @param {Deck} deck
   */
  addDeck(deck) {
    this.#decks.push(deck);
  }

  /**
   * Adds a model to the package.
   *
   * @param {Model} model
   */
  addModel(model) {
    this.#models.push(model);
  }

  /**
   * Adds a media file to the package.
   *
   * @param {MediaFile} mediaFile
   */
  addMedia(mediaFile) {
    this.#media.push(mediaFile);
  }

  /**
   * Writes the package to a file.
   */
  async writeToFile(filename) {
    writeFileSync(filename, await this.writeToBuffer());
  }

  /**
   * Generates the .apkg file as a buffer.
   */
  async writeToBuffer() {
    const zip = new JSZip();
    // Add the database.
    zip.file("collection.anki2", this.#createDatabase());
    // Add the media files.
    const mediaMap = {};
    this.#media.forEach((file, index) => {
      const key = String(index);
      mediaMap[key] = file.name;
      zip.file(key, file.data);
    });
    // Add media.json.
    zip.file("media", JSON.stringify(mediaMap));
    // Generate the zip.
    return await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });
  }

  /**
   * Creates the SQLite database.
   */
  #createDatabase() {
    const tmp = join(tmpdir(), `anki_${Date.now()}.db`);
    const db = new Database(tmp);
    try {
      this.#createTables(db);
      this.#insertCollectionData(db);
      this.#insertCards(db, this.#insertNotes(db));
      db.close();
      const buffer = readFileSync(tmp);
      unlinkSync(tmp);
      return buffer;
    } catch (err) {
      db.close();
      try {
        unlinkSync(tmp);
      } catch {}
      throw err;
    }
  }

  /**
   * Creates the Anki database schema.
   */
  #createTables(db) {
    // Create the collection table.
    db.exec(`
      CREATE TABLE col
      (
        id     INTEGER PRIMARY KEY,
        crt    INTEGER NOT NULL,
        mod    INTEGER NOT NULL,
        scm    INTEGER NOT NULL,
        ver    INTEGER NOT NULL,
        dty    INTEGER NOT NULL,
        usn    INTEGER NOT NULL,
        ls     INTEGER NOT NULL,
        conf   TEXT    NOT NULL,
        models TEXT    NOT NULL,
        decks  TEXT    NOT NULL,
        dconf  TEXT    NOT NULL,
        tags   TEXT    NOT NULL
      )
    `);
    // Create the notes table.
    db.exec(`
      CREATE TABLE notes
      (
        id    INTEGER PRIMARY KEY,
        guid  TEXT    NOT NULL,
        mid   INTEGER NOT NULL,
        mod   INTEGER NOT NULL,
        usn   INTEGER NOT NULL,
        tags  TEXT    NOT NULL,
        flds  TEXT    NOT NULL,
        sfld  TEXT    NOT NULL,
        csum  INTEGER NOT NULL,
        flags INTEGER NOT NULL,
        data  TEXT    NOT NULL
      )
    `);
    // Create the cards table.
    db.exec(`
      CREATE TABLE cards
      (
        id     INTEGER PRIMARY KEY,
        nid    INTEGER NOT NULL,
        did    INTEGER NOT NULL,
        ord    INTEGER NOT NULL,
        mod    INTEGER NOT NULL,
        usn    INTEGER NOT NULL,
        type   INTEGER NOT NULL,
        queue  INTEGER NOT NULL,
        due    INTEGER NOT NULL,
        ivl    INTEGER NOT NULL,
        factor INTEGER NOT NULL,
        reps   INTEGER NOT NULL,
        lapses INTEGER NOT NULL,
        left   INTEGER NOT NULL,
        odue   INTEGER NOT NULL,
        odid   INTEGER NOT NULL,
        flags  INTEGER NOT NULL,
        data   TEXT    NOT NULL
      )
    `);
    // Create the reviews table (empty but required).
    db.exec(`
      CREATE TABLE revlog
      (
        id      INTEGER PRIMARY KEY,
        cid     INTEGER NOT NULL,
        usn     INTEGER NOT NULL,
        ease    INTEGER NOT NULL,
        ivl     INTEGER NOT NULL,
        lastIvl INTEGER NOT NULL,
        factor  INTEGER NOT NULL,
        time    INTEGER NOT NULL,
        type    INTEGER NOT NULL
      )
    `);
    // Create the graves table (for deleted objects).
    db.exec(`
      CREATE TABLE graves
      (
        usn  INTEGER NOT NULL,
        oid  INTEGER NOT NULL,
        type INTEGER NOT NULL
      )
    `);
    // Create indices.
    db.exec("CREATE INDEX ix_notes_usn ON notes (usn)");
    db.exec("CREATE INDEX ix_cards_usn ON cards (usn)");
    db.exec("CREATE INDEX ix_cards_nid ON cards (nid)");
    db.exec("CREATE INDEX ix_cards_sched ON cards (did, queue, due)");
    db.exec("CREATE INDEX ix_revlog_usn ON revlog (usn)");
    db.exec("CREATE INDEX ix_revlog_cid ON revlog (cid)");
  }

  /**
   * Inserts collection metadata.
   */
  #insertCollectionData(db) {
    const now = ankiTime();
    const models = this.#models.reduce((acc, model) => {
      acc[model.modelId] = model.toJSON();
      return acc;
    }, {});
    const decks = this.#decks.reduce((acc, deck) => {
      acc[deck.deckId] = deck.toJSON();
      return acc;
    }, {});
    // Add the default deck if no decks exist.
    if (Object.keys(decks).length === 0) {
      decks[1] = {
        id: 1,
        name: "Default",
        desc: "",
        mod: now,
        usn: -1,
        collapsed: false,
        newToday: [0, 0],
        revToday: [0, 0],
        lrnToday: [0, 0],
        timeToday: [0, 0],
        dyn: 0,
        extendNew: 10,
        extendRev: 50,
        conf: 1,
      };
    }
    const conf = {
      nextPos: 1,
      estTimes: true,
      activeDecks: Object.keys(decks).map((id) => parseInt(id)),
      sortType: "noteFld",
      timeLim: 0,
      sortBackwards: false,
      addToCur: true,
      curDeck: Object.keys(decks)[0] ? parseInt(Object.keys(decks)[0] ?? "") : 1,
      newBury: true,
      newSpread: 0,
      dueCounts: true,
      curModel: Object.keys(models)[0] || "1607392319",
      collapseTime: 1200,
    };
    const dconf = {
      1: {
        id: 1,
        name: "Default",
        new: {
          bury: true,
          delays: [1, 10],
          initialFactor: 2500,
          ints: [1, 4, 7],
          order: 1,
          perDay: 20,
          separate: true,
        },
        lapse: {
          delays: [10],
          leechAction: 0,
          leechFails: 8,
          minInt: 1,
          mult: 0,
        },
        rev: {
          bury: true,
          ease4: 1.3,
          fuzz: 0.05,
          ivlFct: 1,
          maxIvl: 36500,
          minSpace: 1,
          perDay: 100,
        },
        timer: 0,
        maxTaken: 60,
        usn: 0,
        mod: 0,
        autoplay: true,
        replayq: true,
      },
    };
    const stmt = db.prepare(`
      INSERT INTO col (id, crt, mod, scm, ver, dty, usn, ls, conf, models, decks, dconf, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      1,
      now,
      now,
      now,
      11,
      0,
      0,
      0,
      JSON.stringify(conf),
      JSON.stringify(models),
      JSON.stringify(decks),
      JSON.stringify(dconf),
      "{}",
    );
  }

  /**
   * Inserts notes into the database.
   */
  #insertNotes(db) {
    if (this.#decks.length === 0) {
      return new Map();
    }
    const stmt = db.prepare(`
      INSERT INTO notes (id, guid, mid, mod, usn, tags, flds, sfld, csum, flags, data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const noteIdMap = new Map(); // Map note GUID to database ID.
    for (const deck of this.#decks) {
      for (const note of deck.notes) {
        const values = note.toSqlValues();
        stmt.run(
          values.id,
          values.guid,
          values.mid,
          values.mod,
          values.usn,
          values.tags,
          values.flds,
          values.sfld,
          values.csum,
          values.flags,
          values.data,
        );
        // Store the mapping for card creation.
        noteIdMap.set(values.guid, values.id);
      }
    }
    return noteIdMap;
  }

  /**
   * Inserts cards into the database.
   */
  #insertCards(db, noteIdMap) {
    if (this.#decks.length === 0) return;
    const stmt = db.prepare(`
      INSERT INTO cards (id, nid, did, ord, mod, usn, type, queue, due, ivl, factor, reps, lapses, left, odue, odid,
                         flags, data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    let cardIdCounter = 1;
    let dueCounter = 1;
    for (const deck of this.#decks) {
      for (let noteIndex = 0; noteIndex < deck.notes.length; noteIndex++) {
        const note = deck.notes[noteIndex];
        const noteGuid = note.guid.toString();
        const noteDbId = noteIdMap.get(noteGuid);
        if (!noteDbId) {
          console.error(`Could not find database ID for note GUID: ${noteGuid}`);
          continue;
        }
        // Find the model for this note to determine the number of cards.
        const model = this.#models.find((m) => m.modelId === note.modelId);
        const templateCount = model ? model.templates.length : 1;
        // Create cards for each template.
        for (let templateIndex = 0; templateIndex < templateCount; templateIndex++) {
          const cardId = cardIdCounter++;
          stmt.run(
            cardId, // id
            noteDbId, // nid (note database ID)
            deck.deckId, // did
            templateIndex, // ord
            ankiTime(), // mod
            -1, // usn
            0, // type (new)
            0, // queue (new)
            dueCounter++, // due (incremental position)
            0, // ivl
            0, // factor
            0, // reps
            0, // lapses
            0, // left
            0, // odue
            0, // odid
            0, // flags
            "",
          );
        }
      }
    }
  }
}
