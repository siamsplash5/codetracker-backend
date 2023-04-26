// dependencies
const crypto = require('crypto');

// moduel scaffolding
const helper = {};
const iv = Buffer.from(process.env.IV_KEY, 'hex');

// Encryption function
helper.encryptPassword = (password, key) => {
    try {
        const cipher = crypto.createCipheriv('aes192', key, iv);
        let encrypted = cipher.update(password, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (error) {
        console.log(error.message);
        throw new Error('Error occured while encrypting');
    }
};

// Decryption function
helper.decryptPassword = (encryptedPassword, key) => {
    try {
        const decipher = crypto.createDecipheriv('aes192', key, iv);
        let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.log(error.message);
        throw new Error('Error occured while decrypting');
    }
};

module.exports = helper;
