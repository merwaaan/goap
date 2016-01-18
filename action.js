"use strict";

class Action {
    constructor(agent) {
        this.agent = agent;

        this.preconditions = {};
        this.effects = {};
    }

    enter() {
        this.agent.text2.setText(`(${this.toString()})`);
    }

    exit() {
        this.agent.text2.setText('');
    }

    over() { return false; }

    update() {}

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
    constructor(agent) {
        super(agent);

        this.target = null;
        this.speed = 10;
    }

    enter() {
        super.enter();

        this.targetPos = new Phaser.Point(this.target.x * tileSize, this.target.y * tileSize);

        let duration = Phaser.Point.distance(this.agent.sprite.position, this.targetPos) * this.speed * (1 + Math.random() * 0.3);

        let target = {
            x: this.target.x * tileSize,
            y: this.target.y * tileSize
        };
        let pos = {
            x: this.agent.sprite.x + (target.x - this.agent.sprite.x) * 0.95,
            y: this.agent.sprite.y + (target.y - this.agent.sprite.y) * 0.95
        };

        this.agent.world.game.add.tween(this.agent.sprite)
            .to(pos,
                duration,
                Phaser.Easing.Linear.None,
                true);
    }

    over() {
        return Phaser.Point.distance(this.agent.sprite.position, this.targetPos) < 40;
    }
}

class Mine extends MoveAction {
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

class GoToRestaurant extends MoveAction {
    constructor(agent) {
        super(agent);

        this.target = targets.restaurant;

        this.preconditions['atRestaurant'] = false;
        this.effects['atRestaurant'] = true;
    }
}

class GetIngredients extends MoveAction {
    constructor(agent) {
        super(agent);

        this.target = targets.ingredients;

        this.effects['hasIngredients'] = true;
    }
}

class GoHome extends MoveAction {
    constructor(agent) {
        super(agent);

        this.target = targets.home;

        this.preconditions['isHome'] = false;
        this.effects['isHome'] = true;
    }
}

class TakeAWalk extends MoveAction {
    constructor(agent) {
        super(agent);

        this.speed = 25;

        this.effects['isBored'] = false;
    }

    enter() {
        this.target = {
            x: Math.floor(Math.random() * size),
            y: Math.floor(Math.random() * size)
        }

        super.enter();
    }
}

class WaitAction extends Action {
    constructor(agent) {
        super(agent);

        this.baseDuration = 2000;
    }

    enter() {
        super.enter();

        this.duration = this.baseDuration * (1 + Math.random() * 0.3);
        this.start = new Date().getTime();
    }

    over() {
        return new Date().getTime() - this.start >= this.duration;
    }
}

class EatFood extends WaitAction {
    constructor(agent) {
        super(agent);

        this.preconditions['hasFood'] = true;
        this.effects['hasFood'] = false;
        this.effects['isHungry'] = false;
    }

    exit() {
        this.agent.hunger = 0;
    }
}

class Sleep extends WaitAction {
    constructor(agent) {
        super(agent);

        this.preconditions['isHome'] = true;
        this.effects['isTired'] = false;
    }

    exit() {
        this.agent.fatigue = 0;
    }
}

class CookFood extends WaitAction {
    constructor(agent) {
        super(agent);

        this.preconditions['hasIngredients'] = true;
        this.preconditions['atRestaurant'] = true;
        this.effects['hasIngredients'] = false;
        this.effects['hasFood'] = true;
    }
}
