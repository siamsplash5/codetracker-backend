/*
Title: Atcoder Login System
Description: Login to the atcoder.jp by sending post request to their server.
Author: Siam Ahmed
Date: 24-04-2023
*/

const superagent = require('superagent').agent();
const { decryptPassword } = require('../../lib/encryption');
const bot = require('../../database/queries/bot_auth_query');

/**
 * Retrieves the CSRF token from the Atcoder website.
 * @param {string} url - The URL of the login page.
 * @returns {Promise<string>} The CSRF token.
 * @throws {Error} If the connection to Atcoder fails or the CSRF token cannot be found.
 */
async function getCsrfToken(url) {
    try {
        const res = await superagent.get(url);
        if (!res.status === 200) {
            throw new Error('Atcoder Connection Error');
        }
        const html = res.text;
        const regex = /var csrfToken = "(.*?)"/;
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
 * Logs in to the Atcoder website by sending a POST request to their server.
 * @param {string} username - The username for the login.
 * @param {string} encryptedPassword - The encrypted password for the login.
 * @returns {Promise<object>} The response object from the login request.
 * @throws {Error} If the login fails.
 */
async function atcoderLogin(username, encryptedPassword) {
    try {
        console.log('Atcoder Login called');
        const loginUrl = 'https://atcoder.jp/login?continue=https%3A%2F%2Fatcoder.jp%2F';
        const csrf = await getCsrfToken(loginUrl);
        const decryptedPassword = decryptPassword(encryptedPassword, process.env.SECRET_KEY);

        const loginData = {
            username,
            password: decryptedPassword,
            csrf_token: csrf,
        };

        const res = await superagent
            .post(loginUrl)
            .send(loginData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        if (![200, 301, 302].includes(res.status)) {
            throw new Error(`Atcoder login failed, status code ${res.status}`);
        }

        const cookie = res.headers['set-cookie'];
        await bot.updateInfo(username, 'atcoder', {
            csrf,
            cookie,
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = atcoderLogin;
