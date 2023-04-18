/* eslint-disable prettier/prettier */
const superagent = require('superagent').agent();
const getRandomString = require('../../helpers/randomStringGenerator');
const client = require('../data/client');

const helper = {};

helper.getBody = async (url) => {
    const res = await superagent.get(url);
    client.setSuperAgent(superagent);
    if (!res.status === 200) {
        return new Error('Unable to fetch CSRF token');
    }
    return res.text;
};

helper.getCsrf = async (url) => {
    const body = await helper.getBody(url);
    const regex = /csrf='(.+?)'/;
    const tmp = regex.exec(body);
    if (tmp && tmp.length < 2) {
        throw new Error('Cannot find csrf');
    }
    return tmp[1];
};

helper.genFtaa = () => getRandomString({
        lowerCase: true,
        upperCase: false,
        numbers: true,
        specialChar: false,
        stringLen: 18,
    });

helper.genBfaa = () => getRandomString({
        lowerCase: true,
        upperCase: false,
        numbers: true,
        specialChar: false,
        stringLen: 32,
    });

helper.getHandle = (body) => {
    const regex = /handle = "([\s\S]+?)"/;
    const tmp = regex.exec(body);
    if (tmp && tmp.length < 2) {
        throw new Error('Cannot find handle');
    }
    return tmp[1];
};

module.exports = helper;
