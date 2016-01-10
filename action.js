"use strict";

class Action {
    constructor(agent, cost) {
        this.agent = agent;
        this.cost = cost;

        this.preconditions = {};
        this.effects = {};
    }

    enter() {}
    exit() {}
    update() {}
    over() { return false; }

    matches(state) {
        state = state || this.agent.fullState();

        return Object.keys(this.preconditions).every(name => {
            let value = this.preconditions[name];
            return state.has(name) && state.same(name, value);
        });
    }

    toString() {
        return this.constructor.name;
    }
}

class MoveAction extends Action {
    constructor(agent, position) {
        super(agent);

        this.target = null;
    }

    enter() {
        this.targetPos = new Phaser.Point(this.target.x * tileSize, this.target.y * tileSize);
        this.speed = Phaser.Point.distance(this.agent.sprite.position, this.targetPos) * 10;

        this.agent.world.game.add.tween(this.agent.sprite)
            .to({
                x: this.target.x * tileSize,
                y: this.target.y * tileSize
            },
            this.speed,
            Phaser.Easing.Linear.None,
            true);
    }

    over() {
        return Phaser.Point.distance(this.agent.sprite.position, this.targetPos) < 10;
    }
}

class GetMinerals extends MoveAction {
    constructor(agent) {
        super(agent);

        this.target = targets.minerals;

        this.effects['hasMinerals'] = true;
    }
}

class SellMinerals extends MoveAction {
    constructor(agent) {
        super(agent);

        this.target = targets.shop;

        this.preconditions['hasMinerals'] = true;
        this.effects['hasMinerals'] = false;
        this.effects['hasMoney'] = true;
    }
}

class BuyFood extends MoveAction {
    constructor(agent) {
        super(agent);

        this.target = targets.restaurant;

        this.preconditions['hasMoney'] = true;
        this.effects['hasMoney'] = false;
        this.effects['hasFood'] = true;
    }
}

class GetIngredients extends Action {
    constructor(agent) {
        super(agent);

        this.effects['hasIngredients'] = true;
    }
}

class CookFood extends Action {
    constructor(cost) {
        super(cost);

        this.preconditions['hasIngredients'] = true;
        this.effects['hasIngredients'] = false;
        this.effects['hasFood'] = true;
    }
}

class SellFood extends Action {
    constructor(cost) {
        super(cost);

        this.preconditions['hasFood'] = true;
        this.effects['hasFood'] = false;
        this.effects['hasMoney'] = true;
    }
}

class GoHome extends MoveAction {
    constructor(agent) {
        super(agent);

        this.target = targets.home;

        this.effects['isHome'] = true;
    }
}

class EatFood extends Action {
    constructor(cost) {
        super(cost);

        this.preconditions['hasFood'] = true;
        this.effects['hasFood'] = false;
        this.effects['isHungry'] = false;
    }
}

class Sleep extends Action {
    constructor(cost) {
        super(cost);

        this.preconditions['isHome'] = true;
        this.effects['isTired'] = false;
    }
}
