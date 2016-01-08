"use strict";

class Planner {
    static compute(agent, goalName, goalValue) {

        let actions = agent.actions.slice();

        let state = new State();
        state.merge(agent.state);
        state.merge(agent.world.state);

        return Planner.search(actions, state, goalName, goalValue);
    }

    static search(actions, state, goalName, goalValue) {

        if (state[goalName] === goalValue)
            return;

        for (let i = actions.length - 1; i >= 0; --i) {
            let action = actions[i];

            if (action.possible(state)) {
                /*let next = new State(state);
                action.applyEffects(next);
                search(actions, next, goalName, goalValue)*/
            }
        }
    }
}
