"use strict";

class State {
    constructor(...states) {
        states.forEach(state => this.merge(state));
    }

    has(name) {
        return name in this;
    }

    same(name, value) {
        return this[name] == value;
    }

    contains(other) {
        for (let name in other)
            if (!this.has(name) || !this.same(name, other[name]))
                return false;

        return true;
    }

    merge(other) {
        for (let name in other)
            this[name] = other[name];
        return this;
    }

    apply(action) {
        return this.merge(action.effects);
    }

    toString() {
        return Object.getOwnPropertyNames(this)
                     .map(name => `${name}=${+this[name]}`)
                     .join(' ');
    }
}
