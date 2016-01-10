"use strict";

const size = 15;
const tileSize = 32;

const targets = {
    minerals: {x: 5, y: 5},
    shop: {x: 13, y: 3},
    restaurant: {x: 12, y: 12},
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
            5);

        this.createFunc.call(null, this);
    }

    update() {
        this.agents.forEach(agent => agent.update());
    }

    agent(Agent) {
        let agent = new Agent(this);
        this.agents.push(agent);
        return agent;
    }
}
