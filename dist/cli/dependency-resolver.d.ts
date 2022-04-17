declare type Dependency = {
    path: string;
    imports: any[];
    type: string;
};
declare const objectFromDependencies: (entry: string) => any;
export { objectFromDependencies, Dependency };
