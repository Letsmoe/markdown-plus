interface Node {
    data: any;
    name: string;
}
interface Edge {
    from: string;
    to: string;
    data: any;
}
declare class DependencyGraph {
    private nodes;
    private adjacent;
    private edges;
    constructor();
    follow(from: string, depth?: number, curr?: number): any[];
    getEdge(name: string): Edge;
    getNode(name: string): Node;
    hasNode(name: string): boolean;
    addNode(name: string, data?: any): void;
    addEdge(from: string, to: string, data?: any): void;
}
export { DependencyGraph };
