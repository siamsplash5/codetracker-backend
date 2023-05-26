import superagent from 'superagent';
import { updateInfo } from '../../database/queries/bot_auth_query.js';
import { decryptPassword } from '../../lib/encryption.js';
import getRandomString from '../../lib/randomStringGenerator.js';


/**
 * Retrieves the CSRF token from the Codeforces website.
 * @param {string} url - The URL of the login page.
 * @returns {Promise<string>} The CSRF token.
 * @throws {Error} If the connection to Codeforces fails or the CSRF token cannot be found.
 */
async function getCsrfToken(url) {
    try {
        const res = await superagent.get(url);
        if (!res.status === 200) {
            throw new Error('Codeforces server side error');
        }
        const html = res.text;
        const regex = /csrf='(.+?)'/;
        const tmp = regex.exec(html);
        if (tmp === null || tmp.length < 2) {
            throw new Error('Cannot find CSRF token');
        }
        return tmp[1];
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Creates a random ftaa token.
 * @returns {string} The ftaa token.
 */
function createFtaaToken() {
    return getRandomString({
        lowerCase: true,
        upperCase: false,
        numbers: true,
        specialChar: false,
        stringLen: 18,
    });
}

/**
 * Creates a random bfaa token.
 * @returns {string} The bfaa token.
 */
function createBfaaToken() {
    return getRandomString({
        lowerCase: true,
        upperCase: false,
        numbers: true,
        specialChar: false,
        stringLen: 32,
    });
}

/**
 * Extracts the cookie from the response string.
 * @param {string} str - The response string.
 * @returns {string} The extracted cookie.
 */
function extractCookie(str) {
    const regex = /"cookie":\s*"([^"]+)"/;
    const match = str.match(regex);
    return match ? match[1] : '';
}

/**
 * Logs in to the Codeforces website by sending a POST request to their server.
 * @param {string} username - The username for the login.
 * @param {string} encryptedPassword - The encrypted password for the login.
 * @returns {Promise<object>} The response object from the login request.
 * @throws {Error} If the login fails.
 */
async function codeforcesLogin(username, encryptedPassword) {
    try {
        console.log('Codeforces Login called');
        const loginUrl = 'https://codeforces.com/enter?back=%2F';
        const csrf = await getCsrfToken(loginUrl);
        const ftaa = createFtaaToken();
        const bfaa = createBfaaToken();
        const decryptedPassword = decryptPassword(encryptedPassword, process.env.SECRET_KEY);
        const loginData = {
            csrf_token: csrf,
            action: 'enter',
            ftaa,
            bfaa,
            handleOrEmail: username,
            password: decryptedPassword,
            remember: 'on',
            _tta: 104,
        };

        const res = await superagent
            .post(loginUrl)
            .send(loginData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        if (![200, 301, 302].includes(res.status)) {
            throw new Error(`Codeforces login failed, status code ${res.status}`);
        }

        const resString = JSON.stringify(res).substring(0, 200);
        const cookie = extractCookie(resString);

        await updateInfo(username, 'codeforces', {
            csrf,
            ftaa,
            bfaa,
            cookie,
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
}

export default codeforcesLogin;
