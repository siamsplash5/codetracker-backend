/* eslint-disable no-underscore-dangle */
/*

Title: SPOJ Login System
Description: Login to the spoj.com by sending post request to their server.
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
const superagent = require('superagent').agent();
const { decryptPassword } = require('../../lib/encryption');
const bot = require('../../database/queries/auth_data_query');

// login to spoj.com by sending required data
async function spojLogin(username, encryptedPassword) {
    try {
        console.log('spoj login called');
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

        if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
            throw new Error(`SphereOJ login failed, status code ${res.status}`);
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
