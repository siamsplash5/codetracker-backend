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
