class DependencyGraph {
    constructor() {
        this.nodes = {};
        this.adjacent = {};
        this.edges = {};
    }
    follow(from, depth = Infinity, curr = 0) {
        if (!this.hasNode(from)) {
            throw new Error("Node does not exist: " + from);
        }
        const deps = [];
        if (depth > curr) {
            for (const edge of this.adjacent[from]) {
                let neighbor = this.getEdge(edge).to;
                let result = this.follow(neighbor, depth, curr + 1);
                deps.push(this.getNode(neighbor));
                deps.push(...result);
            }
        }
        return deps;
    }
    getEdge(name) {
        return this.edges[name];
    }
    getNode(name) {
        return this.hasNode(name) && this.nodes[name];
    }
    hasNode(name) {
        return this.nodes.hasOwnProperty(name);
    }
    addNode(name, data = {}) {
        if (!this.hasNode(name)) {
            this.adjacent[name] = [];
            this.nodes[name] = { name, data };
        }
    }
    addEdge(from, to, data = {}) {
        let keys = Object.keys(this.edges).length.toString();
        if (!this.hasNode(from)) {
            this.addNode(from);
        }
        if (!this.hasNode(to)) {
            this.addNode(to);
        }
        this.edges[keys] = { from, to, data };
        this.adjacent[from].push(keys);
    }
}
export { DependencyGraph };
