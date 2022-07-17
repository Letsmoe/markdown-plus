declare enum DependencyType {
    IMAGE = 0,
    LINK = 1,
    AUTO = 2
}
interface Dependency {
    name: string;
    data: {
        type: DependencyType;
        text: string;
        path: string;
    };
}
export { DependencyType, Dependency };
