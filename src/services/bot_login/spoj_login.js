/* eslint-disable no-underscore-dangle */
/**
 * Title: SPOJ Login System
 * Description: Login to spoj.com by sending a POST request to their server.
 * Author: Siam Ahmed
 * Date: 24-04-2023
 */

// dependencies
const superagent = require('superagent').agent();
const { decryptPassword } = require('../../lib/encryption');
const bot = require('../../database/queries/bot_auth_query');

/**
 * Logs in to spoj.com by sending a POST request to the login URL.
 * @param {string} username - The username for the login.
 * @param {string} encryptedPassword - The encrypted password for the login.
 * @returns {Promise<object>} The response object from the login request.
 * @throws {Error} If the login fails.
 */
async function spojLogin(username, encryptedPassword) {
    try {
        console.log('SPOJ login called');
        const loginUrl = 'https://www.spoj.com/login/';
        const decryptedPassword = decryptPassword(encryptedPassword, process.env.SECRET_KEY);

        const loginData = {
            next_raw: '/',
            autologin: 1,
            login_user: username,
            password: decryptedPassword,
        };

        const res = await superagent
            .post(loginUrl)
            .send(loginData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        if (![200, 301, 302].includes(res.status)) {
            throw new Error(`SPOJ login failed, status code ${res.status}`);
        }

        const cookieHeader = res.req._header
            .split('\r\n')
            .find((header) => header.startsWith('Cookie: '));
        const newCookie = cookieHeader.split(': ')[1];

        await bot.updateInfo(username, 'spoj', {
            cookie: newCookie,
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = spojLogin;
