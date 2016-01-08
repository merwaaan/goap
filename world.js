"use strict";

class World {
    constructor() {
        this.agents = [];
        this.state = new State(); // Global state of the world
    }

    agent(Agent) {
        let agent = new Agent(this);
        this.agents.push(agent);
        return agent;
    }
}
