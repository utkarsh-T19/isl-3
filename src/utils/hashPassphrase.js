/**
 * SHA-256 hashing utility for passphrase verification.
 * Uses the Web Crypto API (crypto.subtle).
 */

/** SHA-256 hex digest of the admin passphrase */
export const ADMIN_PASSPHRASE_HASH =
  '11076ec479b46793be9826086e0764d957e19f9db24b0cdc4cea8b44586b525a';

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
