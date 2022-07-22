import { Backend } from "../config.type.js";
export default function (options: Backend["options"]): {
    getOutput: () => void;
    getMetadata: () => void;
    defaultExtension: string;
    getLinks: () => void;
};
