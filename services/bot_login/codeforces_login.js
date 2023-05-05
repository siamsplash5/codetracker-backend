/*

Title: Codeforces Login System
Description: Login to the codeforces.com by sending post request to their server.
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
const superagent = require('superagent').agent();
const getRandomString = require('../../lib/randomStringGenerator');
const { decryptPassword } = require('../../lib/encryption');
const bot = require('../../database/queries/bot_auth_query');

// get csrf, bfaa, ftaa tokens for getting authenticate
async function getCsrfToken(url) {
    const res = await superagent.get(url);
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

function extractCookie(str) {
    const regex = /"cookie":\s*"([^"]+)"/;
    const match = str.match(regex);
    return match ? match[1] : '';
}

// login to codeforces.com by sending necessary data
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

        if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
            throw new Error(`Codeforces login failed, status code ${res.status}`);
        }

        // replace by db

        const resString = JSON.stringify(res).substring(0, 200);
        const cookie = extractCookie(resString);

        await bot.updateInfo(username, 'codeforces', {
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

module.exports = codeforcesLogin;
