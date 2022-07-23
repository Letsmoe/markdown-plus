import { DependencyType } from "./types/dependencies.type.js";
function getDependencies(content) {
    const deps = [];
    let links = Array.from(content.matchAll(/(!)?\[(.*?)\]\((.*?)\)/g));
    links.forEach(([link, isImage, name, path]) => {
        deps.push({
            name,
            data: {
                type: isImage ? DependencyType.IMAGE : DependencyType.LINK,
                text: name,
                path: path.split(" ")[0]
            }
        });
    });
    return deps;
}
export { getDependencies };
