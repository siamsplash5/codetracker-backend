/*

Title: Atcoder Login System
Description: Login to the atocder.jp by sending post request to their server.
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
const superagent = require('superagent').agent();
const { decryptPassword } = require('../../lib/encryption');
const bot = require('../db_controllers/atcoder_bot');

// get csrf token from the website to authenticate login process
async function getCsrfToken(url) {
    const res = await superagent.get(url);
    if (!res.status === 200) {
        return new Error('Atcoder Connection Error');
    }
    const html = res.text;
    const regex = /var csrfToken = "(.*?)"/;
    const tmp = regex.exec(html);
    if (tmp === null || tmp.length < 2) {
        throw new Error('Cannot find csrf token');
    }
    return tmp[1];
}

// login to the website sending post request to their server
async function atcoderLogin(username, encryptedPassword) {
    try {
        const loginUrl = 'https://atcoder.jp/login?continue=https%3A%2F%2Fatcoder.jp%2F';
        const newCsrf = await getCsrfToken(loginUrl);
        const decryptedPassword = decryptPassword(encryptedPassword, process.env.SECRET_KEY);

        const loginData = {
            username,
            password: decryptedPassword,
            csrf_token: newCsrf,
        };

        const res = await superagent
            .post(loginUrl)
            .send(loginData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
            throw new Error(`Atcoder login failed, status code ${res.status}`);
        }

        const newCookie = res.headers['set-cookie'];
        bot.updateBot({
            username,
            newCsrf,
            newCookie,
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { atcoderLogin };
