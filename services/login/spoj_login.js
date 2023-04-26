/*

Title: SPOJ Login System
Description: Login to the spoj.com by sending post request to their server.
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
const superagent = require('superagent').agent();
const client = require('../db_controllers/spoj_client');

// login to spoj.com by sending required data
async function spojLogin() {
    try {
        const loginUrl = 'https://www.spoj.com/login/';
        const loginData = {
            next_raw: '/',
            autologin: 1,
            login_user: process.env.BOT_USERNAME,
            password: process.env.BOT_PASSWORD,
        };
        const res = await superagent
            .post(loginUrl)
            .send(loginData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
            throw new Error(`SphereOJ login failed, status code ${res.status}`);
        }
        client.setSuperAgent(superagent);

        console.log(superagent.jar.getCookies(loginUrl).toString());
        return res;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { spojLogin };
