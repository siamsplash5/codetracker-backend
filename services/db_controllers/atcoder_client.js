// this file will be replace by mongodb atlas in future
const client = {
    superagent: {},
    csrf: '',
    setSuperAgent(agent) {
        this.superagent = agent;
    },
    getSuperAgent() {
        return this.superagent;
    },
    setCsrf(csrf) {
        this.csrf = csrf;
    },
    getCsrf() {
        return this.csrf;
    },
};

module.exports = client;
