"use strict";

class Plan {
    constructor(agent, goal, path) {

        this.agent = agent;
        this.final = goal;

        this.actions = path
            .map(element => element.data('action'))
            .filter(element => element !== undefined);

        this.index = -1;
    }

    update() {
        // Start the plan if it has not been done yet
        if (this.index == -1)
            this.next();

        // Continue executing the current action
        let action = this.actions[this.index];
        action.update();

        // Switch to the next action if the current one is over
        if (action.over())
            this.next();
    }

    started() {
        return this.index >= 0;
    }

    over() {
        return this.index >= this.actions.length;
    }

    start() {
        console.log(`[${this.agent.toString()}] Starting plan: ${this.actions.map(a => a.toString()).join(' -> ')}`);
    }

    exit() {
        console.log(`[${this.agent.toString()}] Plan completed`);
    }

    next() {
        if (this.index >= 0)
            this.actions[this.index].exit();

        ++this.index;

        if (this.index < this.actions.length) {
            console.log(`[${this.agent.toString()}] Entering ${this.actions[this.index].toString()}`);
            this.actions[this.index].enter();
        }
    }

    current() {
        if (this.index < 0 || this.current >= this.actions.length)
            return null;

        return this.actions[this.index];
    }

}
