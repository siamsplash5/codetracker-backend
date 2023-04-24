// this file will be replace by mongodb atlas in future
const client = {
    superagent: {},
    setSuperAgent(agent) {
        this.superagent = agent;
    },
    getSuperAgent() {
        return this.superagent;
    },
};

module.exports = client;
