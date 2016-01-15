"use strict";

const size = 15;
const tileSize = 32;

const targets = {
    minerals: {x: 1, y: 2},
    shop: {x: 13, y: 3},
    restaurant: {x: 12, y: 12},
    ingredients: {x: 3, y: 13},
    home: {x: 7, y: 7}
};

class World {
    constructor(createFunc) {
        this.createFunc = createFunc;

        this.agents = [];
        this.state = new State(); // Global state of the world

        this.game = new Phaser.Game(
          size*tileSize,
          size*tileSize,
          Phaser.AUTO,
          'game',
          {
            preload: this.preload,
            create: this.create.bind(this),
            update: this.update.bind(this)
        });
    }

    preload() {
        this.game.load.spritesheet('sheet', 'spritesheet.png', tileSize, tileSize);
    }

    create() {
        this.game.add.sprite(
            targets.minerals.x * tileSize,
            targets.minerals.y * tileSize,
            'sheet',
            3);
        this.game.add.sprite(
            targets.shop.x * tileSize,
            targets.shop.y * tileSize,
            'sheet',
            4);
        this.game.add.sprite(
            targets.restaurant.x * tileSize,
            targets.restaurant.y * tileSize,
            'sheet',
            7);
        this.game.add.sprite(
            targets.ingredients.x * tileSize,
            targets.ingredients.y * tileSize,
            'sheet',
            5);
        this.game.add.sprite(
            targets.home.x * tileSize,
            targets.home.y * tileSize,
            'sheet',
            6);

        this.createFunc.call(null, this);
    }

    update() {
        this.agents.forEach(agent => agent.update(1000/this.game.time.elapsed));
    }

    agent(Agent, graphId) {
        let agent = new Agent(this, graphId);
        this.agents.push(agent);
        return agent;
    }
}
