/*

Title: Codeforces Login System
Description: Login to the codeforces.com by sending post request to their server.
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
const superagent = require('superagent').agent();
const getRandomString = require('../../helpers/randomStringGenerator');
const client = require('../db_controllers/codeforces_client');

// get csrf, bfaa, ftaa tokens for getting authenticate
async function getCsrfToken(url) {
    const res = await superagent.get(url);
    client.setSuperAgent(superagent);
    if (!res.status === 200) {
        throw new Error('Codeforces server side error');
    }
    const html = res.text;
    const regex = /csrf='(.+?)'/;
    const tmp = regex.exec(html);
    if (tmp === null || tmp.length < 2) {
        throw new Error('Cannot find csrf token');
    }
    return tmp[1];
}

function createFtaaToken() {
    return getRandomString({
        lowerCase: true,
        upperCase: false,
        numbers: true,
        specialChar: false,
        stringLen: 18,
    });
}

function createBfaaToken() {
    return getRandomString({
        lowerCase: true,
        upperCase: false,
        numbers: true,
        specialChar: false,
        stringLen: 32,
    });
}

// login to codeforces.com by sending necessary data
async function codeforcesLogin() {
    try {
        const loginUrl = 'https://codeforces.com/enter?back=%2F';
        const csrf = await getCsrfToken(loginUrl);
        const ftaa = createFtaaToken();
        const bfaa = createBfaaToken();
        const loginData = {
            csrf_token: csrf,
            action: 'enter',
            ftaa,
            bfaa,
            handleOrEmail: process.env.BOT_USERNAME,
            password: process.env.BOT_PASSWORD,
            remember: 'on',
            _tta: 104,
        };

        const res = await superagent
            .post(loginUrl)
            .send(loginData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
            throw new Error(`Codeforces login failed, status code ${res.status}`);
        }

        // replace by db
        client.setSuperAgent(superagent);
        client.setCsrf(csrf);
        client.setFtaa(ftaa);
        client.setBfaa(bfaa);

        return res;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { codeforcesLogin };
