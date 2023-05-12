const crypto = require('crypto');

// Module scaffolding
const helper = {};
const iv = Buffer.from(process.env.IV_KEY, 'hex');

/**
 * Encrypt the password using AES-192 encryption
 *
 * @param {string} password - Password to encrypt
 * @param {string} key - Encryption key
 * @returns {string} - Encrypted password
 * @throws {Error} - If an error occurs
 */
helper.encryptPassword = (password, key) => {
    try {
        const cipher = crypto.createCipheriv('aes192', key, iv);
        let encrypted = cipher.update(password, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (error) {
        console.error(error.message);
        throw new Error('Error occurred while encrypting password');
    }
};

/**
 * Decrypt the encrypted password using AES-192 decryption
 *
 * @param {string} encryptedPassword - Encrypted password
 * @param {string} key - Encryption key
 * @returns {string} - Decrypted password
 * @throws {Error} - If an error occurs
 */
helper.decryptPassword = (encryptedPassword, key) => {
    try {
        const decipher = crypto.createDecipheriv('aes192', key, iv);
        let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error(error.message);
        throw new Error('Error occurred while decrypting password');
    }
};

module.exports = helper;
