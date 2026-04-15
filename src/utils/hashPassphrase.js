/**
 * SHA-256 hashing utility for passphrase verification.
 * Uses the Web Crypto API (crypto.subtle).
 */

/** SHA-256 hex digest of the admin passphrase */
export const ADMIN_PASSPHRASE_HASH =
  'd342aee94e1f8903a5ae23638a68dfc8c17b234f08c028dcd3696adf51da3ad5';

/**
 * Hashes an arbitrary string with SHA-256 and returns the hex digest.
 * @param {string} input
 * @returns {Promise<string>} lowercase hex string
 */
export async function hashString(input) {
  const encoded = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
