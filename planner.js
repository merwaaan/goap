"use strict";

class Planner {
    static compute(agent, goal) {

        // Build a graph containing the different paths of action
        var graph = Planner.buildGraph(agent, goal);

        // Look for the shortest path from current state to goal
        let aStar = graph.elements().aStar({
            root: '.start',
            goal: '.goal',
            directed: true
        });

        if (!aStar.found)
            return null;

        aStar.path.select();
        aStar.path.unselectify();
        return new Plan(agent, goal, aStar.path);
    }

    static buildGraph(agent, goal) {

        let nodes = [];
        let edges = [];

        // Add the starting state
        let start = new State(agent.state, agent.world.state);
        nodes.push({
            data: {
                id: start.toString(),
                name: 'START',
                state: start
            },
            classes: 'start'
        });

        // Recursive function that will compute the graph
        let build = (state, actions) => {

            // From the current state, try all available actions
            actions.forEach(action => {

                // Check that the current state match the
                // preconditions of the action
                if (action.matches(state)) {

                    // Compute the next state and put the state/action
                    // in the graph as a node/edge pair
                    let next = new State(state).apply(action);

                    nodes.push({data: {
                        id: next.toString(),
                        state: next
                    }});

                    edges.push({data: {
                        id: `${state.toString()} -> ${next.toString()}`,
                        name: action.toString(),
                        source: state.toString(),
                        target: next.toString(),
                        directed: true,
                        action: action
                    }});

                    // Remove the applied action to avoid infinite cycles
                    actions = actions.slice();
                    actions.splice(actions.indexOf(action), 1)

                    // Stop if the goal is reached...
                    if (next.contains(goal))
                        return;

                    // ... or continue building paths towards the goal
                    build(next, actions);
                }
            });
        }

        build(start, agent.actions);

        // Add the goal state and connect it to the nodes
        // that satisfy it.
        nodes.forEach(node => {
            if (node.data.state.contains(goal))
                edges.push({
                    data: {
                        source: node.data.state.toString(),
                        target: 'goal',
                        directed: true
                    }
                });
        });

        nodes.push({
            data: {
                id: 'goal',
                name: 'GOAL',
                state: goal
            },
            classes: 'goal'
        });

        // Setup the graph
        let graph = cytoscape({
            container: document.querySelector('#' + agent.graphId),
            layout: {
                name: 'dagre',
                rankSep: 90
            },
            userZoomingEnabled: false,
            style: [{
                selector: '.start, .goal',
                style: {
                    'label': 'data(name)',
                    'background-color': 'chartreuse',
                    'font-size': 15
                }
            },
            {
                selector: 'edge',
                style: {
                    'label': edge => edge.data('action') !== undefined ? edge.data('action').toString() : '',
                    'font-size': 15,
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'edge-text-rotation': 'autorotate',
                    'color': 'grey',
                    'target-arrow-shape': 'triangle'
                }
            },
            {
                selector: ':selected',
                style: {
                    'line-color': 'gold',
                    'target-arrow-color': 'gold',
                    'background-color': 'gold'
                }
            }],
            elements: {
                nodes: nodes,
                edges: edges
            }
        });

        graph.nodes().qtip({
            content: function() { return this.data('state').toString() },
            show: {event: 'mouseover'},
            hide: {event: 'mouseout'}
        });

        return graph;
    }
}
