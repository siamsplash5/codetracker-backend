/**
 * Generate a random string based on the provided options
 *
 * @param {Object} options - Options for generating the random string
 * @param {boolean} options.lowerCase - Include lowercase characters
 * @param {boolean} options.upperCase - Include uppercase characters
 * @param {boolean} options.numbers - Include numbers
 * @param {boolean} options.specialChar - Include special characters
 * @param {number} options.stringLen - Length of the generated string
 * @returns {string} - Generated random string
 */
const getRandomString = (options) => {
    let characters = '';

    if (options.lowerCase) characters += 'abcdefghijkmnpqrstuvwxyz';
    if (options.upperCase) characters += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (options.numbers) characters += '123456789';
    if (options.specialChar) characters += ')(!"#$%&*+,-./:;<=>?@[]^_{|}~';

    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < options.stringLen; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

module.exports = getRandomString;
