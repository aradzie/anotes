import { randomBytes } from "crypto";

/**
 * Generates a random GUID for Anki objects.
 */
export function generateGuid() {
  // Generate 8 random bytes and convert to signed 64-bit integer
  return Buffer.from(randomBytes(8)).readBigInt64BE(0);
}

/**
 * Generates a unique GUID with timestamp to avoid duplicates.
 */
export function generateUniqueGuid() {
  const timestamp = BigInt(Date.now());
  const random = BigInt(Math.floor(Math.random() * 1000000));
  return timestamp * 1000000n + random;
}

/**
 * Converts timestamp to Anki time format.
 */
export function ankiTime() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Generates a checksum for the collection.
 */
export function generateChecksum() {
  return Math.floor(Math.random() * 1000000);
}

/**
 * Escapes special characters for SQL.
 */
export function sqlEscape(text) {
  return text.replace(/'/g, "''");
}

/**
 * Joins array elements with Anki field separator.
 */
export function joinFields(fields) {
  return fields.join("\x1f");
}

/**
 * Formats tags for Anki.
 */
export function formatTags(tags) {
  if (tags.length === 0) return "";
  return " " + tags.join(" ") + " ";
}

/**
 * Generates a random deck ID.
 */
export function generateDeckId() {
  return Math.floor(Math.random() * 1000000000) + 1000000000;
}

/**
 * Generates a random model ID.
 */
export function generateModelId() {
  return Math.floor(Date.now() / 1000) * 1000 + Math.floor(Math.random() * 1000);
}
