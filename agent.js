"use strict";

class Agent {
    constructor(world) {
        this.world = world;

        this.state = new State(); // Local state of the agent
        this.actions = [];
    }
}

class Worker extends Agent {
    constructor(world, spriteId) {
        super(world);

        this.position = {x: 0, y: 0};
        this.fatigue = 0;
        this.hunger = 0;
        this.money = 0;

        this.state['hasFood'] = false;
        this.state['hasMinerals'] = false;
        this.state['hasMoney'] = false;

        this.plan = null;

        this.sprite = this.world.game.add.sprite(
            this.position.x * tileSize,
            this.position.y * tileSize,
            'sheet',
            spriteId);
    }

    update() {
        if (this.plan === null)
            return;

        if (this.plan.over())
            this.plan = null;
        else
            this.plan.update();
    }
}

class Test extends Worker {
    constructor(world) {
        super(world);

        this.actions.push(
            new GetMinerals(this),
            new SellMinerals(this),
            new BuyFood(this),
            new EatFood(this),
            new GoHome(this),
            new Sleep(this));
    }
}

class Miner extends Worker {
    constructor(world) {
        super(world);

        this.actions.push(
            new GetMinerals(this),
            new SellMinerals(this),
            new BuyFood(this),
            new GoHome(this),
            new EatFood(this),
            new Sleep(this));
    }
}

class Chef extends Worker {
    constructor(world) {
        super(world);

        this.actions.push(
            new GetIngredients(this),
            new CookFood(this),
            new SellFood(this),
            new BuyFood(this),
            new EatFood(this),
            new GoHome(this),
            new Sleep(this));
    }
}

class GourmetMiner extends Worker {
    constructor(world) {
        super(world);

        this.actions.push(
            new GetMinerals(this),
            new SellMinerals(this),
            new BuyFood(this),
            new GetIngredients(this),
            new CookFood(this),
            new SellFood(this),
            new GoHome(this),
            new EatFood(this),
            new Sleep(this));
    }
}
