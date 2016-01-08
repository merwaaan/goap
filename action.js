"use strict";

class Action {
    constructor(agent, cost) {
        this.agent = agent;
        this.cost = cost;

        this.preconditions = {};
        this.effects = {};
    }

    satisfied(state) {
        state = state || this.agent.fullState();

        return Object.keys(this.preconditions).every(name => {
            let value = this.preconditions[name];
            return state.has(name) && state.same(value);
        });
    }
/*
    applyEffects(state) {
        foreach (let effect of effects)
    }*/
}

class GetMinerals extends Action {
    constructor(cost) {
        super(cost);

        this.effects['hasMinerals'] = true;
    }
}

class SellMinerals extends Action {
    constructor(cost) {
        super(cost);

        this.preconditions['hasMinerals'] = true;
        this.effects['hasMinerals'] = false;
        this.effects['hasMoney'] = true;
    }
}

class BuyFood extends Action {
    constructor(cost) {
        super(cost);

        this.preconditions['hasMoney'] = true;
        this.effects['hasMoney'] = false;
        this.effects['hasFood'] = true;
    }
}
