"use strict";

class Plan {
    constructor(path) {
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

    over() {
        return this.index >= this.actions.length;
    }

    next() {
        if (this.index >= 0)
            this.actions[this.index].exit();

        ++this.index;

        if (this.index < this.actions.length) {
            console.log('Entering ' + this.actions[this.index].toString());
            this.actions[this.index].enter();
        }
    }

    current() {
        if (this.index < 0 || this.current >= this.actions.length)
            return null;

        return this.actions[this.index];
    }

}
