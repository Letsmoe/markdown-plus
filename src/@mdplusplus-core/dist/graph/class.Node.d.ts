declare class Node {
    private key;
    private payload;
    private edges;
    constructor(key: string, payload: any);
    getKey(): string;
    getPayload(): any;
    setPayload(payload: any): void;
}
export { Node };
