import { Config } from "../config";

interface Node {
	data: any;
	name: string;
}

interface Edge {
	from: string;
	to: string;
	data: any;
}

class DependencyGraph {
	private nodes: { [key: string]: Node } = {};
	private adjacent: { [key: string]: string[]} = {};
	private edges: { [key: string]: Edge } = {};
	constructor() {}

	public follow(from: string, depth: number = Infinity, curr: number = 0) {
		if (!this.hasNode(from)) {
			throw new Error("Node does not exist: " + from);
		}

		const deps = [];
		if (depth > curr) {
			for (const edge of this.adjacent[from]) {
				let neighbor = this.getEdge(edge).to
				let result = this.follow(neighbor, depth, curr + 1);
				deps.push(this.getNode(neighbor))
				deps.push(...result)
			}
		}
		return deps
	}

	public getEdge(name: string) {
		return this.edges[name]
	}

	public getNode(name: string): Node {
		return this.hasNode(name) && this.nodes[name];
	}

	public hasNode(name: string) {
		return this.nodes.hasOwnProperty(name);
	}

	public addNode(name: string, data: any = {}) {
		if (!this.hasNode(name)) {
			this.adjacent[name] = [];
			this.nodes[name] = {name, data};
		}
	}

	public addEdge(from: string, to: string, data: any = {}) {
		let keys = Object.keys(this.edges).length.toString();
		if (!this.hasNode(from)) {
			this.addNode(from)
		}
		if (!this.hasNode(to)) {
			this.addNode(to)
		}
		this.edges[keys] = { from, to, data };
		this.adjacent[from].push(keys)
	}
}

export { DependencyGraph };
