/**
 * For increased data privacy, we store only a hashed version of the user's email.
 * We use a sha256 hash of the user's email encoded in hex.
 */

const crypto = require('crypto');

/**
 * @param {string} email user's email address
 * @returns {string} hashed email address
 */
module.exports = (email) =>
  crypto.createHash('sha256').update(email).digest('hex');