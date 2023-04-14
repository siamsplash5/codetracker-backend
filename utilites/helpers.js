const https = require('https');

function getBody(url) {
    return new Promise((resolve, reject) => {
        https
            .get(url, (resp) => {
                let body = '';
                resp.on('data', (chunk) => {
                    body += chunk;
                });
                resp.on('end', () => {
                    resolve(body);
                });
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

function getCsrf(body) {
    const reg = /csrf='(.+?)'/;
    const tmp = reg.exec(body);
    if (tmp.length < 2) {
        throw new Error('Cannot find csrf');
    }
    return tmp[1];
}

module.exports = {
    getBody,
    getCsrf,
};
