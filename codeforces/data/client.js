// this file will be replace by mongodb atlas in future
const client = {
    superagent: {},
    csrf: '',
    ftaa: '',
    bfaa: '',
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
    setFtaa(ftaa) {
        this.ftaa = ftaa;
    },
    getFtaa() {
        return this.ftaa;
    },
    setBfaa(bfaa) {
        this.bfaa = bfaa;
    },
    getBfaa() {
        return this.bfaa;
    },
};

module.exports = client;
