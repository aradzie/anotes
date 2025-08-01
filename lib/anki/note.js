import { ankiTime, formatTags, generateUniqueGuid, joinFields } from "./utils.js";

export class Note {
  modelId;
  fields;
  tags;
  guid;
  sort;

  constructor(config) {
    this.modelId = config.modelId ?? 0;
    this.fields = [...config.fields];
    this.tags = [...(config.tags ?? "")];
    this.guid = config.guid ? BigInt(config.guid) : generateUniqueGuid();
    this.sort = 0;
  }

  /**
   * Generates checksum for the note.
   */
  #checksum() {
    const fieldsStr = joinFields(this.fields);
    let sum = 0;
    for (let i = 0; i < fieldsStr.length; i++) {
      sum += fieldsStr.charCodeAt(i);
    }
    return sum;
  }

  /**
   * Generates SQL values for inserting into the notes table.
   */
  toSqlValues() {
    return {
      // Generate a proper integer ID for the note.
      id: Date.now() + Math.floor(Math.random() * 1000000),
      guid: this.guid.toString(),
      mid: this.modelId,
      mod: ankiTime(),
      usn: -1,
      tags: formatTags(this.tags),
      flds: joinFields(this.fields),
      sfld: this.fields[0] || "",
      csum: this.#checksum(),
      flags: 0,
      data: "",
    };
  }
}
