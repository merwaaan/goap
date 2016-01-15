"use strict";

let textStyle = {
    fill: 'white',
    font: '15px arial',
    align: 'center'
};

let gains = {
    fatigue: 0.0002,
    hunger: 0.001
}

class Agent {
    constructor(world) {
        this.world = world;

        this.state = new State(); // Local state of the agent
        this.actions = [];
    }
}

class Guy extends Agent {
    constructor(world, spriteId, graphId) {
        super(world);

        this.graphId = graphId;
        this.computing = false;

        // Common action set
        this.actions.push(
            new EatFood(this),
            new GoHome(this),
            new Sleep(this),
            new TakeAWalk(this));

        this.position = {
            x: Math.floor(Math.random() * size),
            y: Math.floor(Math.random() * size)
        };

        this.fatigue = Math.floor(Math.random() * 100);
        this.hunger = Math.floor(Math.random() * 100);

        // TODO procedural states to check position
        this.state['hasFood'] = false;
        this.state['hasMinerals'] = false;
        this.state['hasMoney'] = false;
        this.state['isHungry'] = false;
        this.state['isTired'] = false;
        this.state['isHome'] = false;
        this.state['atRestaurant'] = false;
        this.state['isBored'] = false;

        this.plan = null;

        this.sprite = this.world.game.add.sprite(
            this.position.x * tileSize,
            this.position.y * tileSize,
            'sheet',
            spriteId);

        this.text = this.world.game.add.text(16, -20, '', textStyle);
        this.text.anchor.setTo(0.5, 0.5);
        this.sprite.addChild(this.text);

        this.text2 = this.world.game.add.text(16, 32+20, '', textStyle);
        this.text2.anchor.setTo(0.5, 0.5);
        this.sprite.addChild(this.text2);
    }

    update(dt) {

        // Execute the current plan
        if (this.plan !== null) {

            if (!this.plan.started())
                this.plan.start();

            if (this.plan.over()) {
                this.plan.exit();
                this.plan = null;
            }
            else
                this.plan.update();
        }

        // Update vitals
        this.fatigue = Math.min(100, this.fatigue + dt * gains.fatigue);
        this.hunger = Math.min(100, this.hunger + dt * gains.hunger);
        this.text.setText(`hunger=${Math.round(this.hunger)}\nfatigue=${Math.round(this.fatigue)}`);

        // Change the goal depending on the vitals
        // (We wait for the current plan to be completed but ideally
        // it should be interrupted depending on the priority)
        if (this.plan === null && this.computing === false) {
            if (this.hunger >= 100 && this.plan === null) {
                this.state['isHungry'] = true;
                this.setGoal('isHungry', false);
            }
            else if (this.fatigue >= 100 && this.plan === null) {
                this.state['isTired'] = true;
                this.setGoal('isTired', false);
            }
            else {
                this.state['isBored'] = true;
                this.setGoal('isBored', false);
            }
        }
    }

    setGoal(name, value) {
        let goal = new State();
        goal[name] = value;

        this.plan = Planner.compute(this, goal);

        if (this.plan === null)
            console.log(`[${this.toString()}] Impossible to formulate a plan to state ${goal}`);
    }

    toString() {
        return this.constructor.name;
    }
}

class Miner extends Guy {
    constructor(world, graphId) {
        super(world, 0, graphId);

        this.actions.push(
            new GetMinerals(this),
            new SellMinerals(this),
            new BuyFood(this));
    }
}

class Chef extends Guy {
    constructor(world, graphId) {
        super(world, 1, graphId);

        this.actions.push(
            new GetIngredients(this),
            new GoToRestaurant(this),
            new CookFood(this));
    }
}

class GourmetMiner extends Guy {
    constructor(world, graphId) {
        super(world, 2, graphId);

        this.actions.push(
            new GetMinerals(this),
            new SellMinerals(this),
            new BuyFood(this),
            new GetIngredients(this),
            new GoToRestaurant(this),
            new CookFood(this));
    }
}
