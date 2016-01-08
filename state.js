"use strict";

class State {

    on(name) {
        this[name] = true;
    }

    off(name) {
        this[name] = false;
    }

    has(name) {
        return name in this;
    }

    value(name) {
        return this[name];
    }

    same(name, value) {
        return this[name] == value;
    }

    merge(other) {
        for (let name in other)
            this[name] = other[name];
    }
}
