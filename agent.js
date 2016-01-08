"use strict";

class Agent {
    constructor(world) {
        this.world = world;

        this.state = new State(); // Local state of the agent
        this.planner = new Planner();
        this.actions = [];
    }
}

class Miner extends Agent {
    constructor(world) {
        super(world);

        this.state['hasMinerals'] = false;
        this.state['hasMoney'] = false;
        this.state['hasFood'] = false;

        this.actions.push(
            new GetMinerals(this),
            new SellMinerals(this),
            new BuyFood(this));
    }

    fullState() {
        return new State()
            .merge(this.state)
            .merge(this.world.state);
    }
}
