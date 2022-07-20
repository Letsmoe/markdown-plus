export default function (options: any): {
    getOutput: (lexed: any) => string;
    getMetadata: () => void;
    defaultExtension: string;
    getLinks: () => void;
};
