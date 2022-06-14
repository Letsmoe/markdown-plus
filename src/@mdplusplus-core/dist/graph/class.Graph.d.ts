import { Node } from "./class.Node.js";
declare class Graph {
    private nodes;
    private listeners;
    constructor();
    on(event: string, callback: (...args: any[]) => any): void;
    addNode(key: string, payload?: any): Node;
    private emit;
    hasNode(node: Node): boolean;
}
export { Graph };
