/*

Title: Atcoder Login System
Description: Login to the atocder.jp by sending post request to their server.
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
const superagent = require('superagent').agent();
const client = require('../db_controllers/atcoder_client');

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
async function atcoderLogin() {
    try {
        const loginUrl = 'https://atcoder.jp/login?continue=https%3A%2F%2Fatcoder.jp%2F';
        const csrf = await getCsrfToken(loginUrl);
        const loginData = {
            username: process.env.BOT_USERNAME,
            password: process.env.BOT_PASSWORD,
            csrf_token: csrf,
        };

        const res = await superagent
            .post(loginUrl)
            .send(loginData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
            throw new Error(`Atcoder login failed, status code ${res.status}`);
        }

        // replace by db
        client.setCsrf(csrf);
        client.setSuperAgent(superagent);

        return res;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { atcoderLogin };
