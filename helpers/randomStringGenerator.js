const getRandomString = (info) => {
    let characters = '';
    if (info.lowerCase) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (info.upperCase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (info.numbers) characters += '0123456789';
    if (info.specialChar) characters += ')(!"#$%&*+,-./:;<=>?@[]^_{|}~';

    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < info.stringLen; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

module.exports = getRandomString;
